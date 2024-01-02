import { Inject, Injectable, } from '@nestjs/common'
import { Context, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { GetMatchesDto, MatchDto, SeenMatchDto, UnmatchDto, } from './matches.dto'
import { Errors, Subscriptions, } from 'src/utils/constants'
import { Streetpasses, StreetpassesDocument, } from 'src/schemas/streetpasses.schema'
import { Streetpassed, StreetpassedDocument, } from 'src/schemas/streetpassed.schema'
import { MatchDocument, Matches, MatchesDocument, } from 'src/schemas/matches.schema'
import { Matched, MatchedDocument, } from 'src/schemas/matched.schema'
import { Match, MatchesPagination, } from './matches.entities'
import { getAge, } from 'src/utils/functions'
import { RedisPubSub, } from 'graphql-redis-subscriptions'
import { UserChats, UserChatsDocument } from 'src/schemas/userChats.schema'

@Injectable()
export class MatchSubscriptionsService {
  constructor(@Inject(Subscriptions.PubSub) public instance: RedisPubSub) {}
  publish({ userId, match, }: { userId: string, match: Match, }) { this.instance.publish(Subscriptions.Matches, { userId, match, }) }
}

@Injectable()
export class MatchesService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Streetpassed.name) private streetpassedModel: Model<StreetpassedDocument>,
    @InjectModel(Streetpasses.name) private streetpassesModel: Model<StreetpassesDocument>,
    @InjectModel(Matched.name) private matchedModel: Model<MatchedDocument>,
    @InjectModel(Matches.name) private matchesModel: Model<MatchesDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    private readonly jwtService: JwtService,
    private readonly matchSubscriptionsService: MatchSubscriptionsService,
  ) {}

  async match(input: MatchDto, @Context() context: any): Promise<Boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const { streetpasses, } = await this.streetpassesModel.findOne({ userId: userId, }, { streetpasses: { $elemMatch: { userId: input.userId, }, }, }).lean()
    if (streetpasses) {
      const [streetpass] = streetpasses
      if (input.match) {
        const { matched, } = await this.matchedModel.findOne({ userId: input.userId, }, { matched: { $elemMatch: { userId: userId, }, }, }).lean()
        if (matched) {
          const [match] = matched
          const date = new Date()
          await this.matchesModel.updateOne({ userId: userId, }, { $push: { matches: { $each: [{ ...streetpass, seen: false, matchDate: date, }], $position: 0, }, }, })
          await this.matchesModel.updateOne({ userId: input.userId, }, { $push: { matches: { $each: [{ ...streetpass, userId: userId, seen: false, matchDate: date, }], $position: 0, }, }, })
          await this.matchedModel.updateOne({ userId: input.userId, }, { $pull: { matched: { userId: userId, }, }, })
          await this.streetpassesModel.updateOne({ userId: userId, }, { $pull: { streetpasses: { userId: input.userId, }, }, })
          const authUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
          const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), }).lean()
          this.matchSubscriptionsService.publish({ userId: userId, match: {
            userId: input.userId,
            name: user.name,
            bio: user.bio,
            work: user.work,
            school: user.school,
            age: getAge(user.dob),
            sex: user.sex,
            media: user.media,
            seen: false,
            streetpassDate: match.streetpassDate.toISOString(),
            matchDate: date.toISOString(),
            unmatch: false,
          }, })
          this.matchSubscriptionsService.publish({ userId: input.userId, match: {
            userId: userId,
            name: authUser.name,
            bio: authUser.bio,
            work: authUser.work,
            school: authUser.school,
            age: getAge(authUser.dob),
            sex: authUser.sex,
            media: authUser.media,
            seen: false,
            streetpassDate: match.streetpassDate.toISOString(),
            matchDate: date.toISOString(),
            unmatch: false,
          }, })
          // TODO - push notification new match
        } else {
          const streetpassed = await this.streetpassedModel.findOne({ userId: input.userId, streetpassed: userId, }, { streetpassed: false, }).lean()
          if (!streetpassed) {
            await this.matchedModel.updateOne({ userId: userId, }, { $push: { matched: streetpass, }, })
            await this.streetpassesModel.updateOne({ userId: userId, }, { $pull: { streetpasses: { userId: input.userId, }, }, })
            await this.streetpassesModel.updateOne({ userId: input.userId, }, { $push: { streetpasses: { ...streetpass, userId: userId, }, }, })
          } else await this.streetpassesModel.updateOne({ userId: userId, }, { $pull: { streetpasses: { userId: input.userId, }, }, })
        }
      } else await this.streetpassesModel.updateOne({ userId: userId, }, { $pull: { streetpasses: { userId: input.userId, }, }, })
      return true
    }
    throw new GraphQLError(Errors.NotFound)
  }

  async getMatches(input: GetMatchesDto, @Context() context: any): Promise<MatchesPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const result = await this.matchesModel.aggregate([
      { $match: { userId: userId, }, },
      { $project: { matches: { $slice: ['$matches', input.index || 0, 20], }, totalMatches: { $size: '$matches', }, }, },
    ])
    if (result.length) {
      const matches: MatchDocument[] = result[0].matches
      const users = await this.userModel.find({ _id: { $in: matches.map(match => new mongoose.mongo.ObjectId(match.userId)), } }).lean()
      const usersMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user
        return acc
      }, {})
      const returnList = matches.map(match => {
        const user = usersMap[match.userId]
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
          seen: match.seen,
          unmatch: false,
          streetpassDate: match.streetpassDate.toISOString(),
          matchDate: match.matchDate.toISOString(),
        }
      }).filter(item => item !== null)
      return { matches: returnList, continue: input.index + 20 < result[0].totalMatches, }
    }
    return { matches: [], continue: false, }
  }

  async unmatch(input: UnmatchDto, @Context() context: any): Promise<Boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    await this.matchesModel.updateOne({ userId: userId, }, { $pull: { matches: { userId: input.userId, }, }, })
    await this.matchesModel.updateOne({ userId: input.userId, }, { $pull: { matches: { userId: userId, }, }, })
    await this.userChatsModel.updateOne({ userId: userId, }, { $pull: { chats: { userId: input.userId, }, }, })
    await this.userChatsModel.updateOne({ userId: input.userId, }, { $pull: { chats: { userId: userId, }, }, })
    this.matchSubscriptionsService.publish({ userId: input.userId, match: {
      userId: userId,
      name: '',
      bio: '',
      work: '',
      school: '',
      age: 0,
      sex: null,
      media: [],
      seen: false,
      streetpassDate: null,
      matchDate: null,
      unmatch: true,
    }, })
    return true
  }

  async seenMatch(input: SeenMatchDto, @Context() context: any): Promise<Boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    await this.matchesModel.updateOne({ userId: userId, 'matches.userId': input.userId, }, { $set: { 'matches.$.seen': true, }, })
    return true
  }
}
