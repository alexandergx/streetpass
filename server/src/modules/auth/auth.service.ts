import { CanActivate, ExecutionContext, Injectable, } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { Auth, AuthDecodedToken, AuthTokens, } from './auth.entities'
import { SignInDto, VerifyPhoneNumberDto, SendPinDto, RegisterDeviceDto, } from './auth.dto'
import * as bcrypt from 'bcrypt'
import { Context, GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { GraphQLError } from 'graphql'
import { Errors, InputLimits, s3, accessConfig, refreshConfig, Time, SignInErrors, } from 'src/utils/constants'
import { sendSMS, verifyAppleAuth, verifyGoogleAuth, } from 'src/utils/services'
import { UserRecords, UserRecordsDocument } from 'src/schemas/userRecords.schema'
import { validatePhoneNumber } from 'src/utils/functions'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserRecords.name) private userRecordsModel: Model<UserRecordsDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(input: SignInDto, @Context() context: any): Promise<Auth> {
    let user: UserDocument
    if (input.appleAuth) {
      const appleAuth = await verifyAppleAuth(input.appleAuth)
      user = await this.userModel.findOneAndUpdate(
        { appleAuth: appleAuth, deleted: false, },
        { $setOnInsert: { appleAuth: appleAuth, }, },
        { upsert: true, new: true, returnDocument: 'after', }
      ).lean()
    }
    if (!user && !input.appleAuth && context.req.headers['access-token'] && context.req.headers['access-token'] !== 'null') {
      const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
      user = await this.userModel.findOne(
        { _id: new mongoose.mongo.ObjectId(userId), },
      ).lean()
    }
    if (user) {
      let code = null
      if (!code && !user.phoneAuth.verified) code = SignInErrors.VerifyPhoneNumber
      if (!code && (!user.name || !user.dob)) code = SignInErrors.IncompleteAccount
      if (!code && (user.sex === undefined || user.streetPassPreferences.sex === undefined)) code = SignInErrors.IncompletePreferences
      if (!code && !user.media.length) code = SignInErrors.IncompleteProfile
      const accessToken = this.jwtService.sign({ userId: user._id.toString(), }, accessConfig)
      const refreshToken = this.jwtService.sign({ userId: user._id.toString(), }, refreshConfig)
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
        user: {
          userId: user._id.toString(),
          countryCode: user.countryCode,
          phoneNumber: user.phoneNumber,
          email: user.email,
          name: user.name,
          dob: user.dob,
          sex: user.sex,
          bio: user.bio,
          work: user.work,
          school: user.school,
          streetPass: user.streetPass,
          streetPassPreferences: user.streetPassPreferences,
          notificationPreferences: user.notificationPreferences,
          media: user.media.map(media => { return { mediaId: media.mediaId, image: media.image, video: media.video, thumbnail: media.thumbnail, }}),
          joinDate: new Date(parseInt(user._id.toString().substring(0, 8), 16) * 1000),
        },
        code: code,
      }
    }
    throw new GraphQLError(Errors.GeneralError)
  }

  async sendPin(input: SendPinDto, @Context() context: any): Promise<boolean> {
    if (!validatePhoneNumber(input.phoneNumber)) throw new GraphQLError(Errors.InputError)
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
    if (user) {
      const securityPin = Math.floor(100000 + Math.random() * 900000).toString()
      console.log(securityPin) // TODO - send pin SMS below
      const securityPinHash = await bcrypt.hash(securityPin, 10)
      if (!user.identicalNumber || user.identicalNumber !== `${input.countryCode}${input.phoneNumber}`.replace(/\s/g, '')) {
        await this.userModel.updateOne(
          { _id: new mongoose.mongo.ObjectId(userId) },
          { $set: {
              phoneAuth: { verified: false, securityPin: securityPinHash, expiresAt: new Date(Date.now() + Time.Hour * 1000), },
              identicalNumber: `${input.countryCode}${input.phoneNumber}`.replace(/\s/g, ''),
              phoneNumber: input.phoneNumber,
              countryCode: input.countryCode,
          }, },
        )
      }
      // sendSMS({
      //   phonenumber: `${user.countryCode}${user.phoneNumber}`,
      //   sms: `Use this pin to verify your phone number: ${securityPin}.\n- StreetPass`,
      // })
      return true
    }
    throw new GraphQLError(Errors.GeneralError)
  }

  async verifyPhoneNumber(input: VerifyPhoneNumberDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
    if (user) {
      const pinMatch = await bcrypt.compare(input.securityPin, user.phoneAuth.securityPin)
      if (pinMatch && user.phoneAuth.expiresAt > new Date()) {
        await this.userModel.findOneAndUpdate(
          { _id: new mongoose.mongo.ObjectId(userId), },
          { $set: { phoneAuth: { verified: true, securityPin: user.phoneAuth.securityPin, expiresAt: new Date(Date.now() + Time.Minute * 7 * 1000), }, }, }).lean()
        return true
      }
    }
    return false
  }

  async registerDevice(input: RegisterDeviceDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    if (input.unregister) {
      this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $pull: { [`deviceTokens.${input.manufacturer}`]: input.deviceToken, }, }).then(() => {})
      return false
    } else {
      this.userModel.updateOne({ _id: new mongoose.mongo.ObjectId(userId), }, { $addToSet: { [`deviceTokens.${input.manufacturer}`]: input.deviceToken, }, }).then(() => {})
      return true
    }
  }

  async deleteAccount(@Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
    if (user) {
      for (const medium of user.media) {
        if (medium.image) await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.image.split('/')[medium.image.split('/').length - 1], }).promise() // TODO - revise
        if (medium.video) await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.video.split('/')[medium.video.split('/').length - 1], }).promise() // TODO - revise
        if (medium.thumbnail) await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.thumbnail.split('/')[medium.thumbnail.split('/').length - 1], }).promise() // TODO - revise
        if (medium.compact) await s3.deleteObject({ Bucket: process.env.S3_MEDIA_BUCKET as string, Key: medium.compact.split('/')[medium.compact.split('/').length - 1], }).promise() // TODO - revise
      }

      // const { chats, } = await this.userChatsModel.findOne({ userId: userId, })
      // chats.forEach(async chat => {
      //   await this.userChatsModel.findOneAndUpdate(
      //     { userId: chat.userId, },
      //     { $pull: { chats: { userId: userId, }, }, },
      //   )
      //   // TODO - pubsub delete chat
      //   await this.chatModel.deleteOne({ _id: new mongoose.mongo.ObjectId(chat.chatId), })
      // })
      // await this.userChatsModel.deleteOne({ userId: userId, })

      // await this.interactionModel.deleteMany({ userId: userId, })
      // const interactions = await this.interactionModel.find({ targetUserId: userId, })
      // interactions.forEach(async interaction => {
      //   await this.interactionsModel.updateOne(
      //     { userId: interaction.userId, },
      //     { $pull: { interactions: userId, }, },
      //   )
      // })
      // await this.interactionsModel.deleteOne({ userId: userId, })

      // await this.streetPassesModel.deleteOne({ userId: userId, })

      await this.userModel.updateOne(
        { _id: new mongoose.mongo.ObjectId(userId), },
        { $set: { deleted: true, identicalNumber: userId, media: [], }, },
      )
      return true
    }
    throw new GraphQLError(Errors.NotFound)
  }

  async refresh(@Context() context: any): Promise<AuthTokens> {
    const jwtVerified = this.jwtService.verify(context.req.headers['refresh-token'])
    if (jwtVerified) {
      const accessToken = this.jwtService.sign({ userId: jwtVerified.userId, }, accessConfig)
      const refreshToken = this.jwtService.sign({ userId: jwtVerified.userId, }, refreshConfig)
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    }
    throw new GraphQLError(Errors.AuthError)
  }
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = GqlExecutionContext.create(context).getContext()
    if (request?.req?.headers['access-token'] || request?.connectionParams?.headers['access-token']) {
      const jwtVerified = this.jwtService.verify(request?.req?.headers['access-token'] || request?.connectionParams?.headers['access-token'])
      const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(jwtVerified?.userId), }).lean()
      if (user.banned === true) return false
      if (jwtVerified) return true
    }
    throw new GraphQLError(Errors.AuthError)
  }
}
