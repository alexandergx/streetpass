import { CanActivate, ExecutionContext, Injectable, } from '@nestjs/common'
import { Context, GqlExecutionContext, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, PushNotificationMessage, NotificationType, InputLimits, Time, streetpassLimit, } from 'src/utils/constants'
import { s3, } from '../../utils/constants'
import { BlockUserDto, GetUserDto, RemoveMediaDto, UpdateUserDto, UploadMediaDto, } from './users.dto'
import { generateHash, getAge, streamToBuffer, validateEmail, } from 'src/utils/functions'
import { compressImage, compressVideo, } from 'src/utils/services'
import { UserProfile, } from './users.entities'
import { Streetpasses, StreetpassesDocument, } from 'src/schemas/streetpasses.schema'
import { Matches, MatchesDocument, } from 'src/schemas/matches.schema'
import { Matched, MatchedDocument, } from 'src/schemas/matched.schema'
import { Blocked, BlockedDocument, } from 'src/schemas/blocked.schema'
import { UserRecords, UserRecordsDocument, } from 'src/schemas/userRecords.schema'
import { UserChats, UserChatsDocument, } from 'src/schemas/userChats.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserRecords.name) private userRecordsModel: Model<UserRecordsDocument>,
    @InjectModel(Streetpasses.name) private streetpassesModel: Model<StreetpassesDocument>,
    @InjectModel(Matches.name) private matchesModel: Model<MatchesDocument>,
    @InjectModel(Matched.name) private matchedModel: Model<MatchedDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    @InjectModel(Blocked.name) private blockedModel: Model<BlockedDocument>,
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
      streetpassPreferences: input.streetpassPreferences ? { ...user.streetpassPreferences, ...{ ...JSON.parse(input.streetpassPreferences), }, } : undefined,
      notificationPreferences: input.notificationPreferences ? { ...user.notificationPreferences, ...{ ...JSON.parse(input.notificationPreferences), }, } : undefined,
    }
    const updatedUser = await this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $set: { ...update, }, })
    if (updatedUser.modifiedCount) return true
    return false
  }

  async blockUser(input: BlockUserDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    await this.streetpassesModel.updateOne({ userId: userId, }, { $pull: { streetpasses: { userId: input.userId, }, }, })
    await this.streetpassesModel.updateOne({ userId: input.userId, }, { $pull: { streetpasses: { userId: userId, }, }, })
    await this.matchesModel.updateOne({ userId: userId, }, { $pull: { matches: { userId: input.userId, }, }, })
    await this.matchesModel.updateOne({ userId: input.userId, }, { $pull: { matches: { userId: userId, }, }, })
    await this.matchedModel.updateOne({ userId: userId, }, { $pull: { matched: { userId: input.userId, }, }, })
    await this.matchedModel.updateOne({ userId: input.userId, }, { $pull: { matched: { userId: userId, }, }, })
    await this.userChatsModel.updateOne({ userId: userId, }, { $pull: { chats: { userId: input.userId, }, }, })
    await this.userChatsModel.updateOne({ userId: input.userId, }, { $pull: { chats: { userId: userId, }, }, })
    await this.blockedModel.updateOne({ userId: userId, }, { $addToSet: { blocking: input.userId, }, })
    await this.blockedModel.updateOne({ userId: input.userId, }, { $addToSet: { blockers: userId, }, })
    return true
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
    @InjectModel(Blocked.name) private blockedModel: Model<BlockedDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = GqlExecutionContext.create(context).getContext()
    if (request.req.headers['access-token'] && request.req.headers['access-token'] !== 'null') {
      const { userId, } = this.jwtService.decode(request.req.headers['access-token']) as AuthDecodedToken
      const input = request.req.body?.query ? request.req.body.query.match(/userId:\s+"([^"]+)"/) : request.req.body.mutation.match(/userId:\s+"([^"]+)"/)
      if (input && input.length) {
        const inputUserId = input[1]
        if (userId === inputUserId) return true
        const { blocking, blockers, } = await this.blockedModel.findOne({ userId: userId, }).lean() ?? {}
        if (blocking?.includes(inputUserId) || blockers?.includes(inputUserId)) return false
        return true
      }
      return true
    }
    throw new GraphQLError(Errors.AuthError)
  }
}
