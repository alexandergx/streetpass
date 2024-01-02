import { CanActivate, ExecutionContext, Inject, Injectable, } from '@nestjs/common'
import { Context, GqlExecutionContext, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { StreetpassDto, } from './streetpass.dto'
import { Errors, Subscriptions, Time, streetpassLimit, } from 'src/utils/constants'
import { Blocked, BlockedDocument, } from 'src/schemas/blocked.schema'
import { Streetpasses, StreetpassesDocument, } from 'src/schemas/streetpasses.schema'
import { Streetpassed, StreetpassedDocument, } from 'src/schemas/streetpassed.schema'
import { Streetpass, } from './streetpass.entities'
import { getAge, } from 'src/utils/functions'
import { RedisPubSub, } from 'graphql-redis-subscriptions'

@Injectable()
export class StreetpassSubscriptionsService {
  constructor(@Inject(Subscriptions.PubSub) public instance: RedisPubSub) {}
  publish({ userId, }: { userId: string, }) { this.instance.publish(Subscriptions.Streetpasses, { userId, }) }
}

@Injectable()
export class StreetpassService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Streetpassed.name) private streetpassedModel: Model<StreetpassedDocument>,
    @InjectModel(Streetpasses.name) private streetpassesModel: Model<StreetpassesDocument>,
    @InjectModel(Blocked.name) private blockedModel: Model<BlockedDocument>,
    private readonly jwtService: JwtService,
    private readonly streetpassSubscriptionsService: StreetpassSubscriptionsService,
  ) {}

  async streetpass(input: StreetpassDto, @Context() context: any): Promise<Boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const date = new Date()
    const user = await this.userModel.findOneAndUpdate(
      { _id: new mongoose.mongo.ObjectId(userId), },
      { $set: { lastSeen: date.toISOString(), lastCoordinates: [input.lon, input.lat], }, }
    ).lean()
    if (user) {
      const date = new Date()
      const latestDate = new Date(date);
      latestDate.setFullYear(date.getFullYear() - user.streetpassPreferences.age[1])
      latestDate.setHours(0, 0, 0, 0)
      const earliestDate = new Date(date)
      earliestDate.setFullYear(date.getFullYear() - user.streetpassPreferences.age[0])
      earliestDate.setHours(23, 59, 59, 999)
      const matchSex = user.streetpassPreferences.sex !== null ? { sex: { $ne: !user.streetpassPreferences.sex, }, } : { 'streetpassPreferences.sex': null, }
      // const lastSeenDate = new Date(new Date().getTime() - (Time.Minute * 30 * 1000))
      const { blocking, blockers, } = await this.blockedModel.findOne({ userId: userId, })
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
            _id: { $ne: new mongoose.mongo.ObjectId(userId), $nin: blocking.concat(blockers).map(userId => new mongoose.mongo.ObjectId(userId)), },
            dob: { $gte: latestDate, $lte: earliestDate, },
            streetpass: true,
            'streetpassPreferences.discoverable': true,
            ...matchSex,
            // lastSeen: { $gte: lastSeenDate, },
          },
        },
      ])
      // console.log(input, users)
      let streetpasses = []
      for (const user of users) {
        const streetpassed = await this.streetpassedModel.updateOne({ userId: userId, }, { $addToSet: { streetpassed: user._id.toString(), }, })
        if (streetpassed.modifiedCount) streetpasses.push({ userId: user._id.toString(), coordinates: { lat: input.lat, lon: input.lon, }, streetpassDate: date, })
      }
      if (streetpasses.length) {
        await this.streetpassesModel.updateOne({ userId: userId, }, { $push: { streetpasses: { $each: streetpasses, }, }, })
        this.streetpassSubscriptionsService.publish({ userId: userId, })
        // TODO - push notification new streetpasses
      }
      return true
    }
    throw new GraphQLError(Errors.NotFound)
  }

  async getStreetpasses(@Context() context: any): Promise<Streetpass[]> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const { streetpasses, } = await this.streetpassesModel.findOne({ userId: userId, }).limit(32).lean()
    if (streetpasses.length) {
      const userIds = streetpasses.map(streetpass => streetpass.userId)
      const users = await this.userModel.find({ userId: { $in: userIds, }}).lean()
      const usersMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user
        return acc
      }, {})
      return streetpasses.map(streetpass => {
        const user = usersMap[streetpass.userId]
        if (!user) return null
        return {
          userId: user._id.toString(),
          name: user.name,
          bio: user.bio,
          work: user.work,
          school: user.school,
          age: getAge(user.dob),
          sex: user.sex,
          media: user.media,
          streetpassDate: streetpass.streetpassDate,
        }
      }).filter(item => item !== null)
    }
    return []
  }
}
