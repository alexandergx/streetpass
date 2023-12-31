import { Injectable, Inject, } from '@nestjs/common'
import { Context, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { GetChatsDto, GetMessagesDto, ReadChatDto, SearchChatsDto, ChatNotificationsDto, SendMessageDto, ReactMessageDto, UpdateChatsDto, UpdateMessagesDto, AlertTypingDto, } from './chats.dto'
import { ChatsPagination, MessageMetadata, MessagesPagination, UpdateChats, UpdateMessages, UserChat, UserMessage } from './chats.entities'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, NotificationType, PushNotificationMessage, Subscriptions, } from 'src/utils/constants'
import { Chat, ChatDocument, MessageDocument, } from 'src/schemas/chat.schema'
import { UserChatDocument, UserChats, UserChatsDocument, } from 'src/schemas/userChats.schema'
import { RedisPubSub, } from 'graphql-redis-subscriptions'
import { getAge } from 'src/utils/functions'
import { MatchSubscriptionsService } from '../matches/matches.service'
import { Matches, MatchesDocument } from 'src/schemas/matches.schema'
import { NotificationsService } from '../app/app.service'

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
    private readonly notificationsService: NotificationsService,
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
      const usersMap = users.reduce((acc, user) => {
        acc[user._id.toString()] = user
        return acc
      }, {})
      const returnList = chats.map(chat => {
        const user = usersMap[chat.userId]
        if (!user) return null
        return {
          chatId: chat.chatId,
          userId: chat.userId,
          name: user.name,
          bio: user.bio,
          work: user.work,
          school: user.school,
          age: getAge(user.dob),
          sex: user.sex,
          media: user.media,
          lastMessage: chat.lastMessage,
          lastMessageId: chat.lastMessageId,
          lastMessageUserId: chat.lastMessageUserId,
          unread: chat.unread,
          notifications: chat.notifications,
          streetpassDate: chat.streetpassDate.toISOString(),
          matchDate: chat.matchDate.toISOString(),
          chatDate: chat.chatDate.toISOString(),
        }
      }).filter(item => item !== null)
      return { chats: returnList, continue: input.index + 20 < result[0].total, lastUpdated: result[0].lastUpdated, }
    }
    return { chats: [], continue: false, lastUpdated: null, }
  }

  async updateChats(input: UpdateChatsDto, @Context() context: any): Promise<UpdateChats> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const userChat = await this.userChatsModel.findOne({ userId: userId, }).select('lastUpdated')
    if (userChat.lastUpdated && userChat.lastUpdated > input.lastUpdated) {
      const result = await this.userChatsModel.aggregate([
        { $match: { userId: userId, }, },
        { $project: { chats: { $slice: ['$chats', 0, input.index >= 20 ? input.index : 20], }, total: { $size: '$chats', }, }, },
      ])
      if (result && result.length) {
        const chats: UserChatDocument[] = result[0].chats
        const users = await this.userModel.find({ _id: { $in: chats.map(chat => new mongoose.mongo.ObjectId(chat.userId)), }, }).lean()
        const usersMap = users.reduce((acc, user) => {
          acc[user._id.toString()] = user
          return acc
        }, {})
        const returnList = chats.map(chat => {
          const user = usersMap[chat.userId]
          if (!user) return null
          return {
            chatId: chat.chatId,
            userId: chat.userId,
            name: user.name,
            bio: user.bio,
            work: user.work,
            school: user.school,
            age: getAge(user.dob),
            sex: user.sex,
            media: user.media,
            lastMessage: chat.lastMessage,
            lastMessageId: chat.lastMessageId,
            lastMessageUserId: chat.lastMessageUserId,
            unread: chat.unread,
            notifications: chat.notifications,
            streetpassDate: chat.streetpassDate.toISOString(),
            matchDate: chat.matchDate.toISOString(),
            chatDate: chat.chatDate.toISOString(),
          }
        }).filter(item => item !== null)
        return { chats: returnList, lastUpdated: userChat.lastUpdated.toISOString(), }
      }
    }
    return { chats: null, lastUpdated: null, }
  }

  async searchChats(input: SearchChatsDto, @Context() context: any): Promise<UserChat[]> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const result = await this.userChatsModel.aggregate([
      { $match: { userId: userId, }, }, { $limit: 20, },
      { $project: { chats: { $slice: [{ $filter: { input: '$chats', as: 'chat', cond: { $regexMatch: { input: '$$chat.name', regex: `^${input.name}`, options: 'i', }, }, }, }, 20], }, }, },
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
          media: user.media,
          lastMessage: chat.lastMessage,
          lastMessageId: chat.lastMessageId,
          lastMessageUserId: chat.lastMessageUserId,
          unread: chat.unread,
          notifications: chat.notifications,
          streetpassDate: chat.streetpassDate.toISOString(),
          matchDate: chat.matchDate.toISOString(),
          chatDate: chat.chatDate.toISOString(),
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
      { $match: { _id: new mongoose.mongo.ObjectId(input.chatId), }, },
      { $project: { participants: true, messages: true, total: { $size: '$messages', }, }, },
      { $addFields: { startIndex: { $max: [{ $subtract: ['$total', (input.index || 0) + 30] }, 0], }, endIndex: { $min: [{ $subtract: ['$total', input.index || 0], }, '$total'], }, }, },
      { $addFields: { messageSliceLength: { $max: [{ $subtract: ['$endIndex', '$startIndex'], }, 0], }, }, },
      { $project: { participants: true, messages: { $cond: { if: { $gt: ['$messageSliceLength', 0], }, then: { $slice: ['$messages', '$startIndex', '$messageSliceLength'], }, else: [], }, }, total: true, }, },
    ])
    if (result && result.length && result[0].participants.includes(userId) && result[0].participants.includes(input.userId)) {
      const messages: MessageDocument[] = result[0].messages
      const returnList = messages.map(message => {
        return {
          chatId: input.chatId,
          messageId: message.messageId,
          userId: message.userId,
          message: message.message,
          reaction: message.reaction,
          date: message.date.toISOString(),
        }
      }).reverse()
      return { messages: returnList, continue: (input.index || 0) + 30 < result[0].total, }
    }
    return { messages: [], continue: false, }
  }

  async updateMessages(input: UpdateMessagesDto, @Context() context: any): Promise<UpdateMessages> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const result = await this.chatModel.aggregate([
      { $match: { _id: new mongoose.mongo.ObjectId(input.chatId), }, },
      { $project: { participants: true, messages: { $slice: [{ $map: {
        input: { $filter: { input: '$messages', as: 'message', cond: { $gte: ['$$message.messageId', input.messageId], }, }, }, as: 'message', in: '$$message',
      }, }, 0], }, }, },
    ])
    if (result && result.length && result[0].participants.includes(userId) && result[0].participants.includes(input.userId)) {
      const messages: MessageDocument[] = result[0].messages
      const returnList = messages.map(message => {
        return {
          chatId: input.chatId,
          messageId: message.messageId,
          userId: message.userId,
          message: message.message,
          reaction: message.reaction,
          date: message.date.toISOString(),
        }
      })
      return { messages: returnList, }
    }
    return { messages: [], }
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
        { userId: input.userId, },
        { $pull: { chats: { chatId: chat.chatId, }, }, },
      )
      await this.userChatsModel.updateOne(
        { userId: userId, },
        { $push: { chats: { $each:[{ ...authChat, lastMessage: input.message, lastMessageId: messageId, lastMessageUserId: userId, unread: false, chatDate: date, }], $position: 0, }, }, $set: { lastUpdated: date, }, },
      )
      await this.userChatsModel.updateOne(
        { userId: input.userId, },
        { $push: { chats: { $each:[{ ...chat, lastMessage: input.message, lastMessageId: messageId, lastMessageUserId: userId, unread: true, chatDate: date, }], $position: 0, }, }, $set: { lastUpdated: date, }, },
      )
      await this.chatModel.updateOne(
        { _id: new mongoose.mongo.ObjectId(chat.chatId), },
        { $push: { messages: { messageId: messageId, userId: userId, message: input.message, date: date, }, }, },
      )
      this.chatsSubscriptionsService.publish({
        participants: [userId, input.userId],
        message: { chatId: authChat.chatId, messageId: messageId, userId: userId, message: input.message, date: date.toISOString(), },
        metadata: { sender: userId, recipient: input.userId, lastUpdated: date.toISOString(), },
      })
      const authUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
      const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), }).lean()
      // TODO - get unread count
      this.notificationsService.createNotification(
        {
          userId: input.userId,
          notificationPreferences: user.notificationPreferences,
          deviceTokens: user.deviceTokens,
          message: `${authUser.name} messaged you`,
          unread: 0,
          payload: {
            type: NotificationType.Message,
            name: authUser.name,
            chatId: authChat.chatId,
            userId: userId,
          },
        },
      )
    } else {
      const { matches, } = await this.matchesModel.findOne({ userId: userId, }, { matches: { $elemMatch: { userId: input.userId, }, }, }).lean()
      const [match] = matches
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
        { $push: { chats: { $each:[{
          chatId: chatId,
          userId: input.userId,
          coordinates: match.coordinates,
          name: user.name,
          lastMessage: input.message,
          lastMessageId: messageId,
          lastMessageUserId: userId,
          unread: false,
          notifications: true,
          streetpassDate: match.streetpassDate,
          matchDate: match.matchDate,
          chatDate: date,
        }], $position: 0, }, }, $set: { lastUpdated: date, }, },
      )
      await this.userChatsModel.updateOne(
        { userId: input.userId, },
        { $push: { chats: { $each:[{
          chatId: chatId,
          userId: userId,
          coordinates: match.coordinates,
          name: authUser.name,
          lastMessage: input.message,
          lastMessageId: messageId,
          lastMessageUserId: userId,
          unread: true,
          notifications: true,
          streetpassDate: match.streetpassDate,
          matchDate: match.matchDate,
          chatDate: date,
        }], $position: 0, }, }, $set: { lastUpdated: date, }, },
      )
      this.matchSubscriptionsService.publish({ userId: userId, match: {
        userId: input.userId,
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
          media: user.media,
          lastMessage: input.message,
          lastMessageId: messageId,
          lastMessageUserId: userId,
          unread: false,
          notifications: true,
          streetpassDate: match.streetpassDate.toISOString(),
          matchDate: match.matchDate.toISOString(),
          chatDate: date.toISOString(),
        },
        message: { chatId: chatId, messageId: messageId, userId: userId, message: input.message, date: date.toISOString(), },
        metadata: { sender: userId, recipient: input.userId, lastUpdated: date.toISOString(), },
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
          media: authUser.media,
          lastMessage: input.message,
          lastMessageId: messageId,
          lastMessageUserId: userId,
          unread: true,
          notifications: true,
          streetpassDate: match.streetpassDate.toISOString(),
          matchDate: match.matchDate.toISOString(),
          chatDate: date.toISOString(),
        },
        message: { chatId: chatId, messageId: messageId, userId: userId, message: input.message, date: date.toISOString(), },
        metadata: { sender: userId, recipient: input.userId, lastUpdated: date.toISOString(), },
      })
      // TODO - get unread count
      this.notificationsService.createNotification(
        {
          userId: input.userId,
          notificationPreferences: user.notificationPreferences,
          deviceTokens: user.deviceTokens,
          message: `${authUser.name} messaged you`,
          unread: 0,
          payload: {
            type: NotificationType.Message,
            name: authUser.name,
            chatId: chatId,
            userId: userId,
          },
        },
      )
    }
    return true
  }

  async reactMessage(input: ReactMessageDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const chat = await this.chatModel.findOneAndUpdate(
      { _id: new mongoose.mongo.ObjectId(input.chatId), 'messages.messageId': input.messageId, },
      { $set: { 'messages.$.reaction': input.reaction || null, }, },
    ).select('participants')
    this.chatsSubscriptionsService.publish({
      participants: chat.participants,
      message: { chatId: input.chatId, messageId: input.messageId, userId: userId, message: '', date: new Date().toISOString(), reaction: input.reaction || 'null', },
      metadata: { sender: userId, recipient: chat.participants.filter(participant => participant !== userId)[0], lastUpdated: null, },
    })
    return true
  }

  async alertTyping(input: AlertTypingDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    this.chatsSubscriptionsService.publish({
      participants: [userId, input.userId],
      message: { chatId: input.chatId, messageId: '', userId: userId, message: '', date: new Date().toISOString(), },
      metadata: { sender: userId, recipient: input.userId, typing: true, lastUpdated: null, },
    })
    return true
  }
}
