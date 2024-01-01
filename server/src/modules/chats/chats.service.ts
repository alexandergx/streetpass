import { Injectable, Inject, } from '@nestjs/common'
import { Context, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { GetChatsDto, GetMessagesDto, ReadChatDto, SearchChatsDto, ChatNotificationsDto, SendMessageDto, } from './chats.dto'
import { ChatsPagination, MessageMetadata, MessagesPagination, UserChat, UserMessage } from './chats.entities'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, NotificationType, PushNotificationMessage, Subscriptions, } from 'src/utils/constants'
// import { NotificationsService } from '../notifications/notifications.service'
import { Chat, ChatDocument, } from 'src/schemas/chat.schema'
import { UserChatDocument, UserChats, UserChatsDocument, } from 'src/schemas/userChats.schema'
import { RedisPubSub, } from 'graphql-redis-subscriptions'
import { getAge } from 'src/utils/functions'
import { MatchSubscriptionsService } from '../matches/matches.service'
import { Matches, MatchesDocument } from 'src/schemas/matches.schema'

@Injectable()
export class ChatsSubscriptionsService {
  constructor(@Inject(Subscriptions.PubSub) public instance: RedisPubSub) {}
  publish({ participants, message, metadata, chat, }: { participants: string[], message: UserMessage, metadata: MessageMetadata, chat?: UserChat, }) { this.instance.publish(Subscriptions.Messages, { participants, message, metadata, chat, }) }
}

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    @InjectModel(Matches.name) private matchesModel: Model<MatchesDocument>,
    private readonly jwtService: JwtService,
    private readonly chatsSubscriptionsService: ChatsSubscriptionsService,
    private readonly matchSubscriptionsService: MatchSubscriptionsService,
    // private readonly notificationsService: NotificationsService,
  ) {}

  async getChats(input: GetChatsDto, @Context() context: any): Promise<ChatsPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const result = await this.userChatsModel.aggregate([
      { $match: { userId: userId, }, },
      { $project: { chats: { $slice: ['$chats', input.index || 0, 20], }, total: { $size: '$chats', }, }, },
    ])
    if (result && result.length) {
      const chats: UserChatDocument[] = result[0].chats
      const users = await this.userModel.find({ _id: { $in: chats.map(chat => new mongoose.mongo.ObjectId(chat.userId)), }, }).lean()
      const returnList = users.map(user => {
        const userId = user._id.toString()
        const chat = chats.find(match => match.userId === userId)
        return {
          chatId: chat.chatId,
          userId: userId,
          name: user.name,
          bio: user.bio,
          work: user.work,
          school: user.school,
          age: getAge(user.dob),
          sex: user.sex,
          date: chat.date.toISOString(),
          media: user.media,
          lastMessage: chat.lastMessage,
          unread: chat.unread,
          notifications: chat.notifications,
        }
      })
      return { chats: returnList, continue: input.index + 20 < result[0].total, }
    }
    return { chats: [], continue: false, }
  }

  async searchChats(input: SearchChatsDto, @Context() context: any): Promise<UserChat[]> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const result = await this.userChatsModel.aggregate([
      { $match: { userId: userId, }, }, { $limit: 20, },
      { $project: { chats: { $slice: [{ $filter: { input: '$chats', as: 'chat', cond: { $regexMatch: { input: '$$chat.name', regex: input.name, options: 'i', }, }, }, }, 20], }, }, },
    ])
    if (result && result.length) {
      const chats: UserChatDocument[] = result[0].chats
      const users = await this.userModel.find({ _id: { $in: chats.map(chat => new mongoose.mongo.ObjectId(chat.userId)), }, }).lean()
      const returnList = users.map(user => {
        const userId = user._id.toString()
        const chat = chats.find(match => match.userId === userId)
        return {
          chatId: chat.chatId,
          userId: userId,
          name: user.name,
          bio: user.bio,
          work: user.work,
          school: user.school,
          age: getAge(user.dob),
          sex: user.sex,
          date: chat.date.toISOString(),
          media: user.media,
          lastMessage: chat.lastMessage,
          unread: chat.unread,
          notifications: chat.notifications,
        }
      })
      return returnList
    }
    return []
  }

  async readChat(input: ReadChatDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    await this.userChatsModel.updateOne(
      { userId: userId, 'chats.chatId': input.chatId, },
      { $set: { 'chats.$.unread': false, }, },
    )
    return true
  }

  async chatNotifications(input: ChatNotificationsDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    await this.userChatsModel.updateOne(
      { userId: userId, 'chats.chatId': input.chatId, },
      { $set: { 'chats.$.notifications': input.notifications, }, },
    )
    return true
  }

  async getMessages(input: GetMessagesDto, @Context() context: any): Promise<MessagesPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const result = await this.chatModel.aggregate([
      { $match: { _id: input.chatId, }, },
      { $project: { participants: true, messages: { $slice: ['$messages', input.index || 0, 30], }, total: { $size: '$messages', }, }, },
    ])
    if (result && result.length && result[0].participants.includes(userId)) {
      const messages: UserMessage[] = result[0].messages
      return { messages: messages, continue: input.index + 30 < result[0].total, }
    }
    return { messages: [], continue: false, }
  }

  async sendMessage(input: SendMessageDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const date = new Date()
    const messageId = new mongoose.Types.ObjectId().toString()
    const authChats = await this.userChatsModel.findOne({ userId: userId, }, { chats: { $elemMatch: { userId: input.userId, }, }, }).lean()
    const chats = await this.userChatsModel.findOne({ userId: input.userId, }, { chats: { $elemMatch: { userId: userId, }, }, }).lean()
    if (authChats.chats && chats.chats) {
      const [authChat] = authChats.chats
      const [chat] = chats.chats
      await this.userChatsModel.updateOne(
        { userId: userId, },
        { $pull: { chats: { chatId: authChat.chatId, }, }, },
      )
      await this.userChatsModel.updateOne(
        { userId: userId, },
        { $push: { chats: { $each:[{ ...authChat, lastMessage: input.message, unread: false, date: date, }], $position: 0, }, }, },
      )
      await this.userChatsModel.updateOne(
        { userId: input.userId, },
        { $pull: { chats: { chatId: chat.chatId, }, }, },
      )
      await this.userChatsModel.updateOne(
        { userId: input.userId, },
        { $push: { chats: { $each:[{ ...chat, lastMessage: input.message, unread: true, date: date, }], $position: 0, }, }, },
      )
      await this.chatModel.updateOne(
        { _id: new mongoose.mongo.ObjectId(chat.chatId), },
        { $push: { messages: { messageId: messageId, userId: userId, message: input.message, date: date, }, }, },
      )
      this.chatsSubscriptionsService.publish({
        participants: [userId, input.userId],
        message: { chatId: authChat.chatId, messageId: messageId, userId: userId, message: input.message, date: date.toISOString(), },
        metadata: { sender: userId, recipient: input.userId, },
      })
    } else {
      // TODO - remove match
      await this.matchesModel.updateOne({ userId: userId, }, { $pull: { matches: { userId: input.userId, }, }, })
      await this.matchesModel.updateOne({ userId: input.userId, }, { $pull: { matches: { userId: userId, }, }, })
      const authUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
      const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), }).lean()
      const chat = await new this.chatModel({
        participants: [userId, input.userId],
        messages: [{ messageId: messageId, userId: userId, message: input.message, date: date, }],
      }).save()
      const chatId = chat._id.toString()
      await this.userChatsModel.updateOne(
        { userId: userId, },
        { $push: { chats: { $each:[{ chatId: chatId, userId: input.userId, name: authUser.name, lastMessage: input.message, unread: false, notifications: true, date: date, }], $position: 0, }, }, },
      )
      await this.userChatsModel.updateOne(
        { userId: input.userId, },
        { $push: { chats: { $each:[{ chatId: chatId, userId: userId, name: user.name, lastMessage: input.message, unread: true, notifications: true, date: date, }], $position: 0, }, }, },
      )
      this.matchSubscriptionsService.publish({ userId: userId, match: {
        userId: input.userId,
        name: '',
        bio: '',
        work: '',
        school: '',
        age: 0,
        sex: null,
        date: null,
        media: [],
        seen: false,
        unmatch: true,
      }, })
      this.matchSubscriptionsService.publish({ userId: input.userId, match: {
        userId: userId,
        name: '',
        bio: '',
        work: '',
        school: '',
        age: 0,
        sex: null,
        date: null,
        media: [],
        seen: false,
        unmatch: true,
      }, })
      this.chatsSubscriptionsService.publish({
        participants: [userId],
        chat: {
          chatId: chatId,
          userId: input.userId,
          name: user.name,
          bio: user.bio,
          work: user.work,
          school: user.school,
          age: getAge(user.dob),
          sex: user.sex,
          date: date.toISOString(),
          media: user.media,
          lastMessage: input.message,
          unread: false,
          notifications: true,
        },
        message: { chatId: chatId, messageId: messageId, userId: userId, message: input.message, date: date.toISOString(), },
        metadata: { sender: userId, recipient: input.userId, },
      })
      this.chatsSubscriptionsService.publish({
        participants: [input.userId],
        chat: {
          chatId: chatId,
          userId: userId,
          name: authUser.name,
          bio: authUser.bio,
          work: authUser.work,
          school: authUser.school,
          age: getAge(authUser.dob),
          sex: authUser.sex,
          date: date.toISOString(),
          media: authUser.media,
          lastMessage: input.message,
          unread: true,
          notifications: true,
        },
        message: { chatId: chatId, messageId: messageId, userId: userId, message: input.message, date: date.toISOString(), },
        metadata: { sender: userId, recipient: input.userId, },
      })
    }
    return true
  }

  // async reactMessage(input: ReactMessageDto, @Context() context: any): Promise<boolean> {
  //   const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
  //   const chat = await this.chatModel.findOneAndUpdate(
  //     { _id: new mongoose.mongo.ObjectId(input.chatId), },
  //     { $set: input.userId === userId
  //       ? { 'messages.$[elem].authUserReaction': input?.reaction || null, }
  //       : { 'messages.$[elem].userReaction': input?.reaction || null, }
  //     },
  //     { arrayFilters: [{ 'elem.messageId': input.messageId, 'elem.userId': input.userId, }], },
  //   ).lean()
  //   this.chatsSubscriptionsService.publish({
  //     messageSent: {
  //       chatId: input.chatId,
  //       messageId: input.messageId,
  //       userId: userId,
  //       reaction: input.reaction,
  //       date: new Date().toISOString(),
  //     },
  //     participants: chat.participants,
  //   })
  //   if (chat) return true
  //   return false
  // }
}
