import { Injectable, Inject, } from '@nestjs/common'
import { Context, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { GetChatsDto, GetMessagesDto, ReadChatDto, SearchChatsDto, ChatNotificationsDto, } from './chats.dto'
import { ChatsPagination, MessagesPagination, UserChat, UserMessage } from './chats.entities'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, NotificationType, PushNotificationMessage, Subscriptions, } from 'src/utils/constants'
// import { NotificationsService } from '../notifications/notifications.service'
import { Chat, ChatDocument, } from 'src/schemas/chat.schema'
import { UserChats, UserChatsDocument, } from 'src/schemas/userChats.schema'
import { RedisPubSub, } from 'graphql-redis-subscriptions'
import { getAge } from 'src/utils/functions'

@Injectable()
export class ChatsSubscriptionsService {
  constructor(@Inject(Subscriptions.PubSub) public instance: RedisPubSub) {}
  publish({ userIds, message, }: any) { this.instance.publish(Subscriptions.Messages, { userIds, message, }) }
}

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    private readonly jwtService: JwtService,
    private readonly chatsSubscriptionsService: ChatsSubscriptionsService,
    // private readonly notificationsService: NotificationsService,
  ) {}

  async getChats(input: GetChatsDto, @Context() context: any): Promise<ChatsPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const result = await this.userChatsModel.aggregate([
      { $match: { userId: userId, }, },
      { $project: { chats: { $slice: ['$chats', input.index, 20], }, total: { $size: '$chats', }, }, },
    ])
    if (result && result.length) {
      const chats: UserChat[] = result[0].chats
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
          date: chat.date,
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
      const chats: UserChat[] = result[0].chats
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
          date: chat.date,
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
  

  // async getMessages(input: GetMessagesDto, @Context() context: any): Promise<MessagesPagination> {
  //   const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
  //   const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), }).lean()
  //   let chatId: string = input?.chatId
  //   if (!chatId && input.userId) {
  //     const authUserChats = await this.userChatsModel.findOne({ userId: userId, }).lean()
  //     // TODO - archive here
  //     const authUserChat = authUserChats?.chats?.find(chat => chat.userId === input.userId)
  //     chatId = authUserChat?.chatId
  //     if (!chatId) {
  //       const userChats = await this.userChatsModel.findOne({ userId: input.userId, }).lean()
  //       // TODO - archive here
  //       const userChat = userChats?.chats?.find(chat => chat.userId === userId)
  //       chatId = userChat?.chatId
  //     }
  //   }
  //   const { blocking: authBlocking, } = await this.blockingModel.findOne({ userId: userId, }).lean() ?? {}
  //   const { blocking, } = await this.blockingModel.findOne({ userId: input.userId, }).lean() ?? {}
  //   const { following, } = await this.followingModel.findOne({ userId: input.userId, }).lean() ?? {}
  //   if (chatId) {
  //     const chat = await this.chatModel.findOne({ _id: new mongoose.mongo.ObjectId(chatId), }).lean()
  //     if (chat) {
  //       const { chats: [authUserChat] = [], } = await this.userChatsModel.findOne({ userId: userId, chats: { $elemMatch: { chatId: chatId, }, }, }).lean() ?? {}
  //       // TODO - archive here
  //       if (!chat.participants.includes(userId)) throw new GraphQLError(Errors.AuthError)
  //       const messageList = chat.messages.reverse()
  //       const index = input.index ? messageList.findIndex(message => message.messageId === input.index) + 1 : input.page !== undefined ? (input.page > 0 ? input.page * 40 : 40) : 0
  //       const filteredList = messageList.slice(index, index + 40)
  //       const returnListReduced: Array<UserMessage> = await Promise.all(
  //         filteredList.map(async message => {
  //           let post: UserPost = undefined
  //           if (message.postUserId && message.postId) {
  //             post = await this.postsService.findOne({ userId: message.postUserId, postId: message.postId, }, context)
  //           }
  //           let sharedUser: UserDocument = undefined
  //           if (message.profileUserId) sharedUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(message.profileUserId), }).lean()
  //           return {
  //             messageId: message.messageId,
  //             chatId,
  //             userId: message.userId,
  //             message: message.deleted ? 'deleted' : message.message,
  //             authUserReaction: message.authUserReaction,
  //             userReaction: message.userReaction,
  //             media: post ? post : undefined,
  //             profileUserId: message.profileUserId,
  //             profile: !sharedUser ? undefined : {
  //               userId: sharedUser._id.toString(),
  //               username: sharedUser.username,
  //               name: sharedUser.name,
  //               profilePicture: sharedUser.profilePicture,
  //             },
  //             date: message.date,
  //             deleted: message.deleted,
  //           }
  //         })
  //       )
  //       let canMessage = true
  //       if (user?.privacyPreferences?.messages && !(following?.includes(userId)) && !messageList?.length) canMessage = false
  //       return {
  //         messages: returnListReduced,
  //         chat: {
  //           chatId,
  //           userId: input?.userId || '',
  //           username: user?.username || '',
  //           name: user?.name || '',
  //           profilePicture: user?.profilePicture || '',
  //           unread: authUserChat?.unread,
  //           notifications: authUserChat?.notifications,
  //           updated: authUserChat?.updated,
  //           isBlocking: authBlocking?.includes(input.userId) || false,
  //           isBlocker: blocking?.includes(userId) || false,
  //           private: !canMessage,
  //         },
  //         page: messageList[messageList.length - 1]?.messageId === filteredList[filteredList.length - 1]?.messageId ? -1 : input.page !== undefined ? input.page + 1 : 0,
  //       }
  //     }
  //   } else {
  //     let canMessage = true
  //     if (user?.privacyPreferences?.messages && !(following?.includes(userId))) canMessage = false
  //     return {
  //       messages: [],
  //       chat: {
  //         isBlocking: authBlocking?.includes(input.userId) || false,
  //         isBlocker: blocking?.includes(userId) || false,
  //         private: !canMessage,
  //       },
  //       page: -1,
  //     }
  //   }
  // }

  // async send(input: SendMessageDto, @Context() context: any): Promise<UserMessage> {
  //   const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
  //   if (userId === input.userId) throw new GraphQLError(Errors.InputError)
  //   const { chats: authChats, } = await this.userChatsModel.findOne({ userId: userId, }).lean() ?? {}
  //   let authUserChat = authChats?.find(chat => chat.userId === input.userId || chat.chatId === input?.chatId)
  //   const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), })
  //   const { chats, } = await this.userChatsModel.findOne({ userId: input.userId, }).lean() ?? {}
  //   let userChat = chats?.find(chat => chat.userId === userId || chat.chatId === input?.chatId)
  //   const { following, } = await this.followingModel.findOne({ userId: input.userId, }).lean() ?? {}
  //   if (user.privacyPreferences.messages && !following?.includes(userId) && !(authUserChat || userChat)) throw new GraphQLError(Errors.AuthError)
  //   const authUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
  //   const newMessage = {
  //     messageId: new mongoose.Types.ObjectId().toString(),
  //     userId: userId,
  //     message: input.message,
  //     authUserReaction: null,
  //     userReaction: null,
  //     postUserId: input.postUserId,
  //     postId: input.postId,
  //     profileUserId: input.profileUserId,
  //     date: new Date().toISOString(),
  //     deleted: false,
  //   }
  //   let chat: ChatDocument = undefined
  //   let chatId: string = authUserChat?.chatId || userChat?.chatId
  //   if (!chatId) {
  //     chat = await this.chatModel.findOneAndUpdate(
  //       { participants: { $all: [userId, input.userId], }, },
  //       { $push: { messages: newMessage, }, },
  //     ).lean()
  //     if (!chat) chat = await new this.chatModel({ participants: [userId, input.userId], messages: [newMessage], }).save()
  //     chatId = chat._id.toString()
  //   } else {
  //     chat = await this.chatModel.findOneAndUpdate({ _id: new mongoose.mongo.ObjectId(chatId), }, { $push: { messages: newMessage, }, }, { returnDocument: 'after', }).lean()
  //     authUserChat && await this.userChatsModel.updateOne({ userId: userId, }, { $pull: { chats: { chatId: chatId, }, }, })
  //     userChat && await this.userChatsModel.updateOne({ userId: input.userId, }, { $pull: { chats: { chatId: chatId, }, }, })
  //   }
  //   this.userChatsModel.updateOne(
  //     { userId: userId, },
  //     { $push: { chats: { $each:[{
  //       chatId: chatId,
  //       userId: input.userId,
  //       lastMessage: input.postId ? 'Shared a post' : input.profileUserId ? 'Shared a profile' : newMessage.message,
  //       lastMessageId: newMessage.messageId,
  //       unread: false,
  //       notifications: authUserChat?.notifications !== undefined ? authUserChat.notifications : true,
  //       updated: newMessage.date,
  //     }], $position: 0, }, }, },
  //   ).then(() => {})
  //   this.userChatsModel.updateOne(
  //     { userId: input.userId, },
  //     { $push: { chats: { $each: [{
  //       chatId: chatId,
  //       userId: userId,
  //       lastMessage: input.postId ? 'Shared a post' : input.profileUserId ? 'Shared a profile' : newMessage.message,
  //       lastMessageId: newMessage.messageId,
  //       unread: true,
  //       notifications: userChat?.notifications !== undefined ? userChat.notifications : true,
  //       updated: newMessage.date,
  //     }], $position: 0, }, }, },
  //   ).then(() => {})
  //   let post: UserPost = undefined
  //   if (input.postUserId && input.postId) post = await this.postsService.findOne({ userId: input.postUserId, postId: input.postId, }, context)
  //   let sharedUser: UserDocument = undefined
  //   if (input.profileUserId) sharedUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.profileUserId), }).lean()
  //   this.chatsSubscriptionsService.publish({
  //     messageSent: {
  //       ...newMessage,
  //       message: (input.postId && !input.message) ? 'Shared a post' : (input.profileUserId && !input.message) ? 'Shared a profile' : newMessage.message,
  //       chatId,
  //       authUserId: input.userId,
  //       authUsername: user.username,
  //       authProfilePicture: user.profilePicture,
  //       username: authUser.username,
  //       profilePicture: authUser.profilePicture,
  //       media: post ? post : undefined,
  //       profile: !sharedUser ? undefined : {
  //         userId: sharedUser._id.toString(),
  //         username: sharedUser.username,
  //         name: sharedUser.name,
  //         profilePicture: sharedUser.profilePicture,
  //       },
  //     },
  //     participants: chat.participants,
  //   })
  //   if (userChat?.notifications !== false) {
  //     this.notificationsService.createNotification(
  //       {
  //         deviceTokens: user.deviceTokens,
  //         message: `${authUser.username} ${PushNotificationMessage[NotificationType.Message]}`,
  //         payload: {
  //           notificationID: new mongoose.Types.ObjectId().toString(),
  //           userId: userId,
  //           chatId,
  //           type: NotificationType.Message,
  //           username: authUser.username,
  //           name: authUser.name,
  //           profilePicture: authUser.profilePicture,
  //         },
  //       },
  //       user,
  //     )
  //   }
  //   return {
  //     ...newMessage,
  //     chatId: chatId,
  //   }
  // }

  // async deleteMessage(input: DeleteMessageDto, @Context() context: any): Promise<boolean> {
  //   const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
  //   const lastMessage = await this.chatModel.findOne({ _id: new mongoose.mongo.ObjectId(input.chatId), }, { messages: { $slice: -1, }, }).lean()
  //   if (lastMessage && lastMessage.messages[0].messageId === input.messageId) {
  //     await this.userChatsModel.updateOne({ userId: lastMessage.participants[0], 'chats.chatId': input.chatId, }, { $set: { 'chats.$.lastMessage': '', }, })
  //     await this.userChatsModel.updateOne({ userId: lastMessage.participants[1], 'chats.chatId': input.chatId, }, { $set: { 'chats.$.lastMessage': '', }, })
  //   }
  //   const chat = await this.chatModel.findOneAndUpdate(
  //     { _id: new mongoose.mongo.ObjectId(input.chatId), },
  //     { $set: { 'messages.$[elem].deleted': true, }, },
  //     { arrayFilters: [{ 'elem.messageId': input.messageId, 'elem.userId': userId, }], },
  //   ).lean()
  //   this.chatsSubscriptionsService.publish({
  //     messageSent: {
  //       messageId: input.messageId,
  //       chatId: input.chatId,
  //       userId,
  //       username: '',
  //       profilePicture: '',
  //       message: 'deleted',
  //       date: new Date().toISOString(),
  //       deleted: true,
  //     },
  //     participants: chat.participants,
  //   })
  //   if (chat) return true
  //   return false
  // }

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
  //       messageId: input.messageId,
  //       chatId: input.chatId,
  //       userId: userId,
  //       authUserReaction: input.userId === userId ? input.reaction : 'null',
  //       userReaction: input.userId !== userId ? input.reaction : 'null',
  //       date: new Date().toISOString(),
  //       deleted: false,
  //     },
  //     participants: chat.participants,
  //   })
  //   if (chat) return true
  //   return false
  // }
}
