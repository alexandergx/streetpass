import { CanActivate, ExecutionContext, Injectable, } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import mongoose, { Model } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { Auth, AuthDecodedToken, AuthTokens, } from './auth.entities'
import { RegisterDeviceDto, RefreshAuthDto, Auth0Dto, AuthPhoneDto, VerifyPhoneDto, } from './auth.dto'
import * as bcrypt from 'bcrypt'
import { Context, GqlExecutionContext } from '@nestjs/graphql'
import { JwtService } from '@nestjs/jwt'
import { GraphQLError } from 'graphql'
import { Errors, InputLimits, s3, accessConfig, refreshConfig, Time, } from 'src/utils/constants'
import { sendSMS, verifyAppleAuth, verifyGoogleAuth, } from 'src/utils/services'
import { UserChats, UserChatsDocument } from 'src/schemas/userChats.schema'
import { UserRecords, UserRecordsDocument } from 'src/schemas/userRecords.schema'
import { StreetPasses, StreetPassesDocument } from 'src/schemas/streetPasses.schema'
import { validatePhonenumber } from 'src/utils/functions'
import { Chat, ChatDocument } from 'src/schemas/chat.schema'
import { Interaction, InteractionDocument } from 'src/schemas/interaction.schema'
import { Interactions, InteractionsDocument } from 'src/schemas/interactions.schema'

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(UserRecords.name) private userRecordsModel: Model<UserRecordsDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    @InjectModel(StreetPasses.name) private streetPassesModel: Model<StreetPassesDocument>,
    @InjectModel(Interaction.name) private interactionModel: Model<InteractionDocument>,
    @InjectModel(Interactions.name) private interactionsModel: Model<InteractionsDocument>,
    private readonly jwtService: JwtService,
  ) {}

  async auth0(input: Auth0Dto): Promise<Auth | boolean> {
    const date = new Date().toISOString()
    let user: UserDocument = undefined
    switch(true) {
      case (input.appleAuth !== null):
        const appleAuth = verifyAppleAuth(input.appleAuth)
        user = await this.userModel.findOneAndUpdate(
          { appleAuth: appleAuth, },
          input.lat !== undefined && input.lon !== undefined
            ? { $set: { locale: input.locale, lastSeen: date, lastCoordinates: [input.lon, input.lat], }, }
            : { $set: { locale: input.locale, lastSeen: date, }, },
          { upsert: true, },
        ).lean()
        break
      case (input.googleAuth !== null):
        const googleAuth = verifyGoogleAuth(input.googleAuth)
        user = await this.userModel.findOneAndUpdate(
          { googleAuth: googleAuth, },
          input.lat !== undefined && input.lon !== undefined
            ? { $set: { locale: input.locale, lastSeen: date, lastCoordinates: [input.lon, input.lat], }, }
            : { $set: { locale: input.locale, lastSeen: date, }, },
          { upsert: true, },
        ).lean()
      default:
        break
    }
    if (user) {
      if (!user.phoneAuth.verified) return false
      this.userRecordsModel.updateOne(
        { userId: user._id.toString(), },
        { $set: { appVersion: input?.appVersion, }, $addToSet: { logins: date.split('T')[0], IPs: input?.IP, deviceIds: input?.deviceId, carriers: input?.carrier, }, },
        { upsert: true, },
      ).then(() => {})
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
          streetPassPreferences: user.streetPassPreferences,
          notificationPreferences: user.notificationPreferences,
          privacyPreferences: user.privacyPreferences
        }
      }
    }
    throw new GraphQLError(Errors.GeneralError)
  }

  async authPhone(input: AuthPhoneDto): Promise<Auth | boolean> {
    if (!validatePhonenumber(input.phoneNumber)) throw new GraphQLError(Errors.InputError)
    const date = new Date()
    const user = await this.userModel.findOneAndUpdate(
      { phoneNumber: `${input.countryCode}${input.phoneNumber}`, },
      { $set: { locale: input.locale, lastSeen: date, lastCoordinates: [input.lon || 0, input.lat || 0], }, },
    ).lean()

    if (!user) {
      const securityPin = Math.floor(100000 + Math.random() * 900000).toString()
      const securityPinHash = await bcrypt.hash(securityPin, 10)
      const user = await new this.userModel({
        phoneAuth: { verified: false, securityPin: securityPinHash, expiresAt: new Date(Date.now() + Time.Hour * 1000), },
        phoneNumber: `${input.countryCode}${input.phoneNumber}`,
        countryCode: input.countryCode,
        locale: input.locale,
        lastSeen: date,
        lastCoordinates: [input.lon || 0, input.lat || 0],
      }).save()
      await new this.userRecordsModel(
        { userId: user._id.toString(), },
        { $set: { appVersion: input?.appVersion, }, $addToSet: { logins: date.toISOString().split('T')[0], IPs: input?.IP, deviceIds: input?.deviceId, carriers: input?.carrier, }, },
      ).save()
      sendSMS({
        phonenumber: `${user.countryCode}${user.phoneNumber}`,
        sms: `Verify your phone number with this pin - ${securityPin}\nStreetPass`,
      })
      return false
    }

    if (user && !user.phoneAuth.verified) {
      const securityPin = Math.floor(100000 + Math.random() * 900000).toString()
      const securityPinHash = await bcrypt.hash(securityPin, 10)
      await this.userModel.updateOne(
        { _id: new mongoose.mongo.ObjectId(user._id), },
        { $set: {
          phoneAuth: { verified: false, securityPin: securityPinHash, expiresAt: new Date(Date.now() + Time.Hour * 1000), },
          locale: input.locale,
          lastSeen: date,
          lastCoordinates: [input.lon || 0, input.lat || 0],
        }, },
      )
      this.userRecordsModel.updateOne(
        { userId: user._id.toString(), },
        { $set: { appVersion: input?.appVersion, }, $addToSet: { logins: date.toISOString().split('T')[0], IPs: input?.IP, deviceIds: input?.deviceId, carriers: input?.carrier, }, },
        { upsert: true, },
      ).then(() => {})
      sendSMS({
        phonenumber: `${user.countryCode}${user.phoneNumber}`,
        sms: `Verify your phone number with this pin - ${securityPin}\nStreetPass`,
      })
      return true
    }

    if (user && user.phoneAuth.verified) {
      this.userRecordsModel.updateOne(
        { userId: user._id.toString(), },
        { $set: { appVersion: input?.appVersion, }, $addToSet: { logins: date.toISOString().split('T')[0], IPs: input?.IP, deviceIds: input?.deviceId, carriers: input?.carrier, }, },
        { upsert: true, },
      ).then(() => {})
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
          streetPassPreferences: user.streetPassPreferences,
          notificationPreferences: user.notificationPreferences,
          privacyPreferences: user.privacyPreferences
        }
      }
    }
    throw new GraphQLError(Errors.GeneralError)
  }

  async verifyPhone(input: VerifyPhoneDto): Promise<boolean> {
    if (!validatePhonenumber(input.phoneNumber)) throw new GraphQLError(Errors.InputError)
    const user = await this.userModel.findOne({ phoneNumber: `${input.countryCode}${input.phoneNumber}`, }).lean()
    if (user) {
      const date = new Date()
      const pinMatch = await bcrypt.compare(input.securityPin, user.phoneAuth.securityPin)
      if (pinMatch && user.phoneAuth.expiresAt > new Date()) {
        await this.userModel.findOneAndUpdate(
          { phoneNumber: `${input.countryCode}${input.phoneNumber}`, },
          { $set: { phoneAuth: { verified: true, }, }, },
        ).lean()
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

  async refresh(input: RefreshAuthDto, @Context() context: any): Promise<AuthTokens> {
    const jwtVerified = this.jwtService.verify(context.req.headers['refresh-token'])
    if (jwtVerified) {
      const date = new Date().toISOString()
      this.userModel.findOneAndUpdate(
        { _id: new mongoose.mongo.ObjectId(jwtVerified.userId), },
        input.lat !== undefined && input.lon !== undefined
          ? { $set: { locale: input.locale || undefined, lastLogin: date, lastCoordinates: [input.lon, input.lat], }, }
          : { $set: { locale: input.locale || undefined, lastLogin: date, }, },
      ).then(() => {})
      this.userRecordsModel.updateOne(
        { userId: jwtVerified.userId, },
        { $set: { appVersion: input?.appVersion, }, $addToSet: { logins: date.split('T')[0], IPs: input?.IP, deviceIds: input?.deviceId, carriers: input?.carrier, }, },
      ).then(() => {})
      const accessToken = this.jwtService.sign({ userId: jwtVerified.userId, }, accessConfig)
      const refreshToken = this.jwtService.sign({ userId: jwtVerified.userId, }, refreshConfig)
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    }
    throw new GraphQLError(Errors.AuthError)
  }

  async remove(@Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.verify(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
    if (user) {
      // TODO - cleanup user media from S3
      // if (user.profilePictureThumbnail) await s3.deleteObject({ Bucket: process.env.S3_PROFILE_PICTURES_BUCKET as string, Key: user.profilePictureThumbnail.split('/')[user.profilePictureThumbnail.split('/').length - 1], }).promise() // TODO - revise
      // if (user.profilePicture) await s3.deleteObject({ Bucket: process.env.S3_PROFILE_PICTURES_BUCKET as string, Key: user.profilePicture.split('/')[user.profilePicture.split('/').length - 1], }).promise() // TODO - revise

      const { chats, } = await this.userChatsModel.findOne({ userId: userId, })
      chats.forEach(async chat => {
        await this.userChatsModel.findOneAndUpdate(
          { userId: chat.userId, },
          { $pull: { chats: { userId: userId, }, }, },
        )
        // TODO - pubsub delete chat
        await this.chatModel.deleteOne({ _id: new mongoose.mongo.ObjectId(chat.chatId), })
      })
      await this.userChatsModel.deleteOne({ userId: userId, })

      await this.interactionModel.deleteMany({ userId: userId, })
      const interactions = await this.interactionModel.find({ targetUserId: userId, })
      interactions.forEach(async interaction => {
        await this.interactionsModel.updateOne(
          { userId: interaction.userId, },
          { $pull: { interactions: userId, }, },
        )
      })
      await this.interactionsModel.deleteOne({ userId: userId, })

      await this.streetPassesModel.deleteOne({ userId: userId, })
      await this.userModel.updateOne(
        { _id: new mongoose.mongo.ObjectId(userId), },
        { $set: { deleted: true, }, }
      )
      return true
    }
    throw new GraphQLError(Errors.NotFound)
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
