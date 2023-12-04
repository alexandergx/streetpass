import { CanActivate, ExecutionContext, Injectable, } from '@nestjs/common'
import { Context, GqlExecutionContext, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { FindUserDto, StreetPassDto, GetStreetPassesDto, } from './users.dto'
import { UserProfile, StreetPassesPagination, } from './users.entities'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, PushNotificationMessage, NotificationType, InputLimits, Time, streetPassLimit, } from 'src/utils/constants'
import { s3, } from '../../utils/constants'
import { NotificationsService } from '../notifications/notifications.service'
import { compressImage, } from 'src/utils/services'
import { generateHash, getAge, streamToBuffer, } from 'src/utils/functions'
import { Chat, ChatDocument } from 'src/schemas/chat.schema'
import { UserChats, UserChatsDocument } from 'src/schemas/userChats.schema'
import { StreetPasses, StreetPassesDocument } from 'src/schemas/streetPasses.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    @InjectModel(StreetPasses.name) private streetPassesModel: Model<StreetPassesDocument>,
    private readonly jwtService: JwtService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getUser(input: FindUserDto): Promise<UserProfile | boolean> {
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), }).lean()
    if (user) {
      return {
        userId: user._id.toString(),
        name: user.name,
        bio: user.bio,
      }
    }
    throw new GraphQLError(Errors.NotFound)
  }

  // async updateUser

  async streetPass(input: StreetPassDto, @Context() context: any): Promise<Boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const date = new Date()
    const user = await this.userModel.findOneAndUpdate(
      { _id: new mongoose.mongo.ObjectId(userId), },
      { $set: { lastSeen: date.toISOString(), lastCoordinates: [input.lon, input.lat], }, }
    ).lean()
    if (user) {
      const today = new Date()
      const latestDate = new Date(today);
      latestDate.setFullYear(today.getFullYear() - user.streetPassPreferences.age[1])
      latestDate.setHours(0, 0, 0, 0)
      const earliestDate = new Date(today)
      earliestDate.setFullYear(today.getFullYear() - user.streetPassPreferences.age[0])
      earliestDate.setHours(23, 59, 59, 999)
      const lastSeenDate = new Date(new Date().getTime() - (Time.Minute * 30 * 1000))
      const matchSex = user.streetPassPreferences.sex !== null ? { sex: { $ne: !user.streetPassPreferences.sex, }, } : {}
      const users = await this.userModel.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [input.lon, input.lat], },
            distanceField: 'dist.calculated',
            maxDistance: 30,
            spherical: true,
          },
        },
        {
          $match: {
            _id: { $ne: new mongoose.mongo.ObjectId(userId) },
            streetPass: true,
            'streetPassPreferences.discoverable': true,
            ...matchSex,
            dob: { $gte: latestDate, $lte: earliestDate, },
            lastSeen: { $gte: lastSeenDate, },
          },
        },
        { $limit: streetPassLimit, },
      ])
      const newStreetPasses = users.map(user => {
        return { userId: user._id.toString(), coordinates: { lat: input.lat, lon: input.lon, }, date: date, }
      })
      if (newStreetPasses.length) {
        const existingStreetPasses = await this.streetPassesModel.findOne({ userId: userId, })
        let notify = false
        const existingStreetPassesIds = existingStreetPasses.streetPasses.map(streetPass => streetPass.userId)
        // let matchStreetPasses = []
        newStreetPasses.forEach(streetPass => {
          // TODO - add this user to front of list of other user's streetpasses array
          if (!existingStreetPassesIds.includes(streetPass.userId)) {
            notify = true
            // matchStreetPasses.push(streetPass.userId)
          }
        })
        // matchStreetPasses.forEach(async streetPass => {
        //   // TODO insert auth user's streetpass into each user's streetpasses
        //   await this.streetPassesModel.updateOne(
        //     { userId: streetPass, },
        //     { $push: { 
        //         streetPasses: { 
        //           $each: [{ userId: userId, coordinates: { lat: input.lat, lon: input.lon, }, date: date, }],
        //           $position: 0,
        //         },
        //     }, },
        //   )
        // })
        const streetPasses = [...newStreetPasses, ...existingStreetPasses.streetPasses]
        const streetPassesMap = new Map()
        streetPasses.forEach(pass => streetPassesMap.set(pass.userId, pass))
        const uniqueStreetPasses = Array.from(streetPassesMap.values()).slice(0, 512)
        await this.streetPassesModel.updateOne({ userId: userId }, { $set: { streetPasses: uniqueStreetPasses, }, })
        if (notify) {
          this.notificationsService.createNotification(
            {
              deviceTokens: user.deviceTokens,
              message: `${PushNotificationMessage[NotificationType.StreetPass]}`,
              payload: { type: NotificationType.StreetPass, streetPassId: new mongoose.Types.ObjectId().toString(), },
            },
            user, false,
          )
        }
      }
      return true
    }
    throw new GraphQLError(Errors.NotFound)
  }

  async getStreetPasses(input: GetStreetPassesDto, @Context() context: any): Promise<StreetPassesPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const authUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), })
    if (input.page === undefined) {
      let lat: number = input.lat
      let lon: number = input.lon
      if (!lat || !lon) {
        lat = authUser.lastCoordinates[1]
        lon = authUser.lastCoordinates[0]
      }
      await this.streetPass({ lat, lon, }, context)
    }
    const { streetPasses = null, } = await this.streetPassesModel.findOne({ userId: userId, })
    if (streetPasses && streetPasses.length) {
      if (input.index === 'all') {
        const users = await this.userModel.find({ _id: { $in: streetPasses.map((streetPass) => new mongoose.mongo.ObjectId(streetPass.userId)), } })
        const returnListReduced = streetPasses.slice(0, streetPassLimit).map((streetPass) => {
          const user = users.find(user => user._id.toString() === streetPass.userId)
          return {
            userId: user._id.toString(),
            name: user.name,
            age: getAge(user.dob),
            sex: user.sex,
            coordinates: authUser.streetPassPreferences.location && user.streetPassPreferences.location ? streetPass.coordinates : null,
            date: streetPass.date,
          }
        }).filter(streetPass => streetPass.coordinates !== null)
        return {
          count: streetPasses.length,
          streetPasses: returnListReduced,
          page: -1,
        }
      }
      const index = input.index ? streetPasses?.findIndex(streetPass => streetPass.userId == input.index) + 1 : input.page !== undefined ? (input.page > 0 ? input.page * 30 : 30) : 0
      let filteredList = streetPasses?.slice(index, index + 30)
      const users = await this.userModel.find({ _id: { $in: filteredList.map((streetPass) => new mongoose.mongo.ObjectId(streetPass.userId)), } })
      const returnListReduced = filteredList.map((streetPass) => {
        const user = users.find(user => user._id.toString() === streetPass.userId)
        return {
          userId: user._id.toString(),
          name: user.name,
          age: getAge(user.dob),
          sex: user.sex,
          coordinates: authUser.streetPassPreferences.location && user.streetPassPreferences.location ? streetPass.coordinates : null,
          date: streetPass.date,
        }
      })
      return {
        count: streetPasses.length,
        streetPasses: returnListReduced || [],
        page: streetPasses[streetPasses.length - 1] === filteredList[filteredList.length - 1] ? -1 : input.page !== undefined ? input.page + 1 : 0,
      }
    }
    return {
      count: 0,
      streetPasses: [],
      page: -1,
    }
  }

  // async swipeStreetPass

  // async removeMatch
}

@Injectable()
export class PrivacyGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
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
        const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(inputUserId), }).lean()
        return true
      }
      return true
    }
    throw new GraphQLError(Errors.AuthError)
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
