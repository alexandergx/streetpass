import { CanActivate, ExecutionContext, Injectable, } from '@nestjs/common'
import { Context, GqlExecutionContext, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, PushNotificationMessage, NotificationType, InputLimits, Time, streetPassLimit, } from 'src/utils/constants'
import { s3 } from '../../utils/constants'
import { GetUserDto, RemoveMediaDto, UpdateUserDto, UploadMediaDto } from './users.dto'
import { generateHash, getAge, streamToBuffer, validateEmail } from 'src/utils/functions'
import { compressImage, compressVideo } from 'src/utils/services'
import { UserProfile } from './users.entities'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async getUser(input: GetUserDto, @Context() context: any): Promise<UserProfile> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: input.userId || new mongoose.mongo.ObjectId(userId), }).lean()
    if (user) {
      return {
        userId: userId,
        name: user.name,
        sex: user.sex,
        bio: user.bio,
        age: getAge(user.dob),
        work: user.work,
        school: user.school,
        media: user.media.map(medium => { return { mediaId: medium.mediaId, image: medium.image, video: medium.video, thumbnail: medium.thumbnail, }}),
      }
    }
    throw new GraphQLError(Errors.NotFound)
  }

  async updateUser(input: UpdateUserDto, @Context() context: any): Promise<boolean> {
    if (input.email && !validateEmail(input.email)) throw new GraphQLError(Errors.InputError)
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
    const update = {
      ...input,
      name: user.name || input.name,
      dob: user.dob || input.dob,
      sex: user.sex !== undefined ? user.sex : input.sex,
      streetPassPreferences: input.streetPassPreferences ? { ...user.streetPassPreferences, ...{ ...JSON.parse(input.streetPassPreferences), }, } : undefined,
      notificationPreferences: input.notificationPreferences ? { ...user.notificationPreferences, ...{ ...JSON.parse(input.notificationPreferences), }, } : undefined,
    }
    const updatedUser = await this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $set: { ...update, }, })
    if (updatedUser.modifiedCount) return true
    return false
  }

  async uploadMedia(input: UploadMediaDto, @Context() context: any): Promise<string> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
    if (user && user.media.length < InputLimits.MediaUploadsMax) {
      const mediaId = new mongoose.Types.ObjectId().toString()
      if (input.image) {
        const { createReadStream, } = await input.image
        const imageBuffer = await streamToBuffer(createReadStream())
        const [image, thumbnail, compact] = await compressImage({ imageBuffer, imageSize: 640, imageQuality: 75, thumbnail: true, thumbnailSize: 240, thumbnailQuality: 75, compact: true, compactSize: 60, compactQuality: 75, })
        const date = new Date().getTime()
        const uploadImage = await s3.upload({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: `${userId}-${generateHash()}-${date}.jpg`, Body: image, ACL: 'public-read', }).promise()
        const uploadThumbnail = await s3.upload({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: `${userId}-${generateHash()}-${date}-thumbnail.jpg`, Body: thumbnail, ACL: 'public-read', }).promise()
        const uploadCompact = await s3.upload({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: `${userId}-${generateHash()}-${date}-compact.jpg`, Body: compact, ACL: 'public-read', }).promise()
        const media = { mediaId: mediaId, image: uploadImage.Location, thumbnail: uploadThumbnail.Location, compact: uploadCompact.Location, date: new Date(), }
        await this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $push: { media: media, }, })
        return mediaId
      }
      if (input.video) {
        const { createReadStream, } = await input.video
        const videoBuffer = await streamToBuffer(createReadStream())
        const [video, thumbnail] = await compressVideo({ videoBuffer, videoMute: false, thumbnail: true, videoSize: 640, videoLength: InputLimits.VideoLengthMax + 1, thumbnailSize: 240, })
        const compact = await compressImage({ imageBuffer: thumbnail as Buffer, imageSize: 60, imageQuality: 75, })
        const date = new Date().getTime()
        const uploadVideo = await s3.upload({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: `${userId}-${generateHash()}-${date}.mp4`, Body: video, ACL: 'public-read', }).promise()
        const uploadThumbnail = await s3.upload({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: `${userId}-${generateHash()}-${date}-thumbnail.jpg`, Body: thumbnail, ACL: 'public-read', }).promise()
        const uploadCompact = await s3.upload({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: `${userId}-${generateHash()}-${date}-compact.jpg`, Body: compact, ACL: 'public-read', }).promise()
        const media = { mediaId: mediaId, video: uploadVideo.Location, thumbnail: uploadThumbnail.Location, compact: uploadCompact.Location, date: new Date(), }
        await this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $push: { media: media, }, })
        return mediaId
      }
    }
    throw new GraphQLError(Errors.GeneralError)
  }

  async sortMedia(input: RemoveMediaDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    if (input.mediaIds.length) {      
      const { media, } = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
      const sortedMedia = input.mediaIds.map(mediaId => media.find(medium => medium.mediaId === mediaId.toString())).filter(medium => medium)
      await this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $set: { media: sortedMedia, }, })
      return true
    }
    throw new GraphQLError(Errors.InputError)
  }

  async removeMedia(input: RemoveMediaDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    if (input.mediaIds.length) {      
      const { media, } = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
      for (const mediaId of input.mediaIds) {
        const medium = media.find(medium => medium.mediaId === mediaId)
        if (medium) {
          if (medium.image) await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.image.split('/')[medium.image.split('/').length - 1], }).promise() // TODO - revise
          if (medium.video) await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.video.split('/')[medium.video.split('/').length - 1], }).promise() // TODO - revise
          await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.thumbnail.split('/')[medium.thumbnail.split('/').length - 1], }).promise() // TODO - revise
          await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.compact.split('/')[medium.compact.split('/').length - 1], }).promise() // TODO - revise
        }
      }
      await this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $pull: { media: { _id: { $in: input.mediaIds, }, }, }, })
      return true
    }
    throw new GraphQLError(Errors.InputError)
  }
}

@Injectable()
export class PrivacyGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // const request = GqlExecutionContext.create(context).getContext()
    // if (request.req.headers['access-token'] && request.req.headers['access-token'] !== 'null') {
    //   const { userId, } = this.jwtService.decode(request.req.headers['access-token']) as AuthDecodedToken
    //   const input = request.req.body?.query ? request.req.body.query.match(/userId:\s+"([^"]+)"/) : request.req.body.mutation.match(/userId:\s+"([^"]+)"/)
    //   if (input && input.length) {
    //     const inputUserId = input[1]
    //     if (userId === inputUserId) return true
    //     const { blocking: authBlocking, } = await this.blockingModel.findOne({ userId: userId, }).lean() ?? {}
    //     const { blocking, } = await this.blockingModel.findOne({ userId: inputUserId, }).lean() ?? {}
    //     if (authBlocking?.includes(userId) || blocking?.includes(userId)) return false
    //     // const query = request.req.body.query.match(/query\s*{\s*(\w+)/)
    //     const mutation = request.req.body?.query?.match(/mutation\s*{\s*(\w+)/) || request.req.body?.mutation?.match(/mutation\s*{\s*(\w+)/)
    //     if (mutation && mutation.length && mutation[0].includes('share')) {
    //       const chat = await this.chatModel.findOne({ participants: { $all: [userId, inputUserId], }, }).lean()
    //       if (chat) return true
    //     }
    //     const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(inputUserId), }).lean()
    //     const { followers, } = await this.followersModel.findOne({ userId: inputUserId, }).lean() ?? {}
    //     if (user.privateProfile && !followers?.includes(userId)
    //       && !['followUser', 'followRequest', 'subscribeUser', 'sendMessage'].some(query => request.req.body?.query.includes(query))
    //     ) return false
    //     return true
    //   }
    //   return true
    // }
    // throw new GraphQLError(Errors.AuthError)
    return true
  }
}

@Injectable()
export class SelfGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = GqlExecutionContext.create(context).getContext()
    if (request.req.headers['access-token'] && request.req.headers['access-token'] !== 'null') {
      const { userId, } = this.jwtService.decode(request.req.headers['access-token']) as AuthDecodedToken
      const input = request.req.body?.query ? request.req.body.query.match(/userId:\s+"([^"]+)"/) : request.req.body.mutation.match(/userId:\s+"([^"]+)"/)
      if (input && input.length) {
        const inputUserId = input[1]
        if (userId == inputUserId) return false
      }
      return true
    }
    throw new GraphQLError(Errors.AuthError)
  }
}
