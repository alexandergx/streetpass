import { Injectable, Inject, } from '@nestjs/common'
import { Context, } from '@nestjs/graphql'
import { InjectModel, } from '@nestjs/mongoose'
import mongoose, { Model, } from 'mongoose'
import { User, UserDocument, } from 'src/schemas/user.schema'
import { DeleteChatDto, DeleteMessageDto, GetChatsDto, GetMessagesDto, ReactMessageDto, SearchChatsDto, SendMessageDto, SetNotificationsChatDto, SetReadChatDto } from './chats.dto'
import { ChatsPagination, MessagesPagination, UserChat, UserMessage } from './chats.entities'
import { JwtService, } from '@nestjs/jwt'
import { AuthDecodedToken, } from '../auth/auth.entities'
import { GraphQLError, } from 'graphql'
import { Errors, NotificationType, PushNotificationMessage, Subscriptions, } from 'src/utils/constants'
import { Chat, ChatDocument } from 'src/schemas/chat.schema'
import { UserChats, UserChatsDocument } from 'src/schemas/userChats.schema'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import { NotificationsService } from '../notifications/notifications.service'

@Injectable()
export class ChatsSubscriptionsService {
  constructor(@Inject(Subscriptions.PubSub) public instance: RedisPubSub) {}
  publish({ messageSent, participants, }: any) { this.instance.publish(Subscriptions.MessageSent, { messageSent, participants, }) }
}

@Injectable()
export class ChatsService {
  constructor(
    @InjectModel(Chat.name) private chatModel: Model<ChatDocument>,
    @InjectModel(UserChats.name) private userChatsModel: Model<UserChatsDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly jwtService: JwtService,
    private readonly chatsSubscriptionsService: ChatsSubscriptionsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async getChats(input: GetChatsDto, @Context() context: any): Promise<ChatsPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const { chats, } = await this.userChatsModel.findOne({ userId: userId, }).lean() ?? {}
    const index = input.index ? chats.findIndex(chat => chat.chatId === input.index) + 1 : input.page !== undefined ? (input.page > 0 ? input.page * 20 : 20) : 0
    const filteredList = chats.slice(index, index + 20)
    let returnListReduced: Array<UserChat> = []
    for (const chat of filteredList) {
      const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(chat.userId), }).lean()
      returnListReduced.push({
        chatId: chat.chatId,
        userId: user?._id.toString() || '',
        name: user?.name || '',
        lastMessage: chat?.lastMessage?.length ? chat.lastMessage : 'deleted',
        lastMessageId: chat?.lastMessageId,
        unread: chat?.unread,
        notifications: chat.notifications,
        updated: chat.updated,
      })
    }
    return {
      chats: returnListReduced,
      unread: chats.reduce((count, chat) => chat.unread ? count + 1 : count, 0),
      page: chats[chats.length - 1] === filteredList[filteredList.length - 1] ? -1 : input.page !== undefined ? input.page + 1 : 0,
    }
  }

  async searchChats(input: SearchChatsDto, @Context() context: any): Promise<UserChat[]> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const { chats, } = await this.userChatsModel.findOne({ userId: userId, }).lean() ?? {}
    const userIds = chats.map(chat => chat.userId)
    const users = await this.userModel.find({
      _id: { $in: userIds, },
      $or: [{ username: { $regex: `^${input.username.trim()}`, $options: 'i', } }, { name: { $regex: `${input.username.trim()}`, $options: 'i', } }],
    }).lean()
    let chatList: UserChat[] = []
    for (const user of users) {
      const chat = chats.find(chat => chat.userId === user._id.toString())
      chatList.push({
        chatId: chat.chatId,
        userId: user?._id.toString() || '',
        name: user?.name || '',
        lastMessage: chat?.lastMessage?.length ? chat.lastMessage : 'deleted',
        lastMessageId: chat?.lastMessageId,
        unread: chat?.unread,
        notifications: chat.notifications,
        updated: chat.updated,
      })
    }
    return chatList.slice(0, 19)
  }

  async deleteChat(input: DeleteChatDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const authUserChat = await this.userChatsModel.updateOne({ userId: userId, }, { $pull: { chats: { chatId: input.chatId, }, }, })
    if (authUserChat?.modifiedCount) {
      this.chatsSubscriptionsService.publish({
        messageSent: {
          chatId: input.chatId,
          userId,
          message: 'deleted',
          date: new Date().toISOString(),
          deletedChat: true,
        } as UserMessage,
        participants: [userId, input.userId],
      })
      return true
    }
    throw new GraphQLError(Errors.NotFound)
  }

  async setNotificationsChat(input: SetNotificationsChatDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const chat = await this.userChatsModel.updateOne(
      { userId: userId, 'chats.chatId': input.chatId, },
      { $set: { 'chats.$.notifications': input.notifications, }, },
    )
    if (chat?.modifiedCount) return true
    throw new GraphQLError(Errors.NotFound)
  }

  async setReadChat(input: SetReadChatDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const chat = await this.userChatsModel.updateOne(
      { userId: userId, 'chats.chatId': input.chatId, },
      { $set: { 'chats.$.unread': false, }, },
    )
    if (chat) return true
    throw new GraphQLError(Errors.GeneralError)
  }

  async getMessages(input: GetMessagesDto, @Context() context: any): Promise<MessagesPagination> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), }).lean()
    let chatId: string = input?.chatId
    if (!chatId && input.userId) {
      const authUserChats = await this.userChatsModel.findOne({ userId: userId, }).lean()
      // TODO - archive here
      const authUserChat = authUserChats?.chats?.find(chat => chat.userId === input.userId)
      chatId = authUserChat?.chatId
      if (!chatId) {
        const userChats = await this.userChatsModel.findOne({ userId: input.userId, }).lean()
        // TODO - archive here
        const userChat = userChats?.chats?.find(chat => chat.userId === userId)
        chatId = userChat?.chatId
      }
    }
    if (chatId) {
      const chat = await this.chatModel.findOne({ _id: new mongoose.mongo.ObjectId(chatId), }).lean()
      if (chat) {
        const { chats: [authUserChat] = [], } = await this.userChatsModel.findOne({ userId: userId, chats: { $elemMatch: { chatId: chatId, }, }, }).lean() ?? {}
        // TODO - archive here
        if (!chat.participants.includes(userId)) throw new GraphQLError(Errors.AuthError)
        const messageList = chat.messages.reverse()
        const index = input.index ? messageList.findIndex(message => message.messageId === input.index) + 1 : input.page !== undefined ? (input.page > 0 ? input.page * 40 : 40) : 0
        const filteredList = messageList.slice(index, index + 40)
        const returnListReduced: Array<UserMessage> = await Promise.all(
          filteredList.map(async message => {
            return {
              messageId: message.messageId,
              chatId,
              userId: message.userId,
              message: message.deleted ? 'deleted' : message.message,
              authUserReaction: message.authUserReaction,
              userReaction: message.userReaction,
              date: message.date,
              deleted: message.deleted,
            }
          })
        )
        return {
          messages: returnListReduced,
          chat: {
            chatId,
            userId: input?.userId || '',
            name: user?.name || '',
            unread: authUserChat?.unread,
            notifications: authUserChat?.notifications,
            updated: authUserChat?.updated,
          },
          page: messageList[messageList.length - 1]?.messageId === filteredList[filteredList.length - 1]?.messageId ? -1 : input.page !== undefined ? input.page + 1 : 0,
        }
      }
    } else {
      return {
        messages: [],
        chat: null,
        page: -1,
      }
    }
  }

  async send(input: SendMessageDto, @Context() context: any): Promise<UserMessage> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    if (userId === input.userId) throw new GraphQLError(Errors.InputError)
    const { chats: authChats, } = await this.userChatsModel.findOne({ userId: userId, }).lean() ?? {}
    let authUserChat = authChats?.find(chat => chat.userId === input.userId || chat.chatId === input?.chatId)
    const user = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(input.userId), })
    const { chats, } = await this.userChatsModel.findOne({ userId: input.userId, }).lean() ?? {}
    let userChat = chats?.find(chat => chat.userId === userId || chat.chatId === input?.chatId)
    const authUser = await this.userModel.findOne({ _id: new mongoose.mongo.ObjectId(userId), }).lean()
    const newMessage = {
      messageId: new mongoose.Types.ObjectId().toString(),
      userId: userId,
      message: input.message,
      authUserReaction: null,
      userReaction: null,
      date: new Date().toISOString(),
    }
    let chat: ChatDocument = undefined
    let chatId: string = authUserChat?.chatId || userChat?.chatId
    if (!chatId) {
      chat = await this.chatModel.findOneAndUpdate(
        { participants: { $all: [userId, input.userId], }, },
        { $push: { messages: newMessage, }, },
      ).lean()
      if (!chat) chat = await new this.chatModel({ participants: [userId, input.userId], messages: [newMessage], }).save()
      chatId = chat._id.toString()
    } else {
      chat = await this.chatModel.findOneAndUpdate({ _id: new mongoose.mongo.ObjectId(chatId), }, { $push: { messages: newMessage, }, }, { returnDocument: 'after', }).lean()
      authUserChat && await this.userChatsModel.updateOne({ userId: userId, }, { $pull: { chats: { chatId: chatId, }, }, })
      userChat && await this.userChatsModel.updateOne({ userId: input.userId, }, { $pull: { chats: { chatId: chatId, }, }, })
    }
    this.userChatsModel.updateOne(
      { userId: userId, },
      { $push: { chats: { $each:[{
        chatId: chatId,
        userId: input.userId,
        lastMessage: newMessage.message,
        lastMessageId: newMessage.messageId,
        unread: false,
        notifications: authUserChat?.notifications !== undefined ? authUserChat.notifications : true,
        updated: newMessage.date,
      }], $position: 0, }, }, },
    ).then(() => {})
    this.userChatsModel.updateOne(
      { userId: input.userId, },
      { $push: { chats: { $each: [{
        chatId: chatId,
        userId: userId,
        lastMessage: newMessage.message,
        lastMessageId: newMessage.messageId,
        unread: true,
        notifications: userChat?.notifications !== undefined ? userChat.notifications : true,
        updated: newMessage.date,
      }], $position: 0, }, }, },
    ).then(() => {})
    this.chatsSubscriptionsService.publish({
      messageSent: {
        ...newMessage,
        message: newMessage.message,
        chatId,
        authUserId: input.userId,
      },
      participants: chat.participants,
    })
    if (userChat?.notifications !== false) {
      this.notificationsService.createNotification(
        {
          deviceTokens: user.deviceTokens,
          message: `${authUser.name} ${PushNotificationMessage[NotificationType.Message]}`,
          payload: {
            notificationID: new mongoose.Types.ObjectId().toString(),
            userId: userId,
            chatId,
            type: NotificationType.Message,
            name: authUser.name,
          },
        },
        user,
      )
    }
    return {
      ...newMessage,
      chatId: chatId,
    }
  }

  async deleteMessage(input: DeleteMessageDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const lastMessage = await this.chatModel.findOne({ _id: new mongoose.mongo.ObjectId(input.chatId), }, { messages: { $slice: -1, }, }).lean()
    if (lastMessage && lastMessage.messages[0].messageId === input.messageId) {
      await this.userChatsModel.updateOne({ userId: lastMessage.participants[0], 'chats.chatId': input.chatId, }, { $set: { 'chats.$.lastMessage': '', }, })
      await this.userChatsModel.updateOne({ userId: lastMessage.participants[1], 'chats.chatId': input.chatId, }, { $set: { 'chats.$.lastMessage': '', }, })
    }
    const chat = await this.chatModel.findOneAndUpdate(
      { _id: new mongoose.mongo.ObjectId(input.chatId), },
      { $set: { 'messages.$[elem].deleted': true, }, },
      { arrayFilters: [{ 'elem.messageId': input.messageId, 'elem.userId': userId, }], },
    ).lean()
    this.chatsSubscriptionsService.publish({
      messageSent: {
        messageId: input.messageId,
        chatId: input.chatId,
        userId,
        message: 'deleted',
        date: new Date().toISOString(),
        deletedMessage: true,
      } as UserMessage,
      participants: chat.participants,
    })
    if (chat) return true
    return false
  }

  async reactMessage(input: ReactMessageDto, @Context() context: any): Promise<boolean> {
    const { userId, } = this.jwtService.decode(context.req.headers['access-token']) as AuthDecodedToken
    const chat = await this.chatModel.findOneAndUpdate(
      { _id: new mongoose.mongo.ObjectId(input.chatId), },
      { $set: input.userId === userId
        ? { 'messages.$[elem].authUserReaction': input?.reaction || null, }
        : { 'messages.$[elem].userReaction': input?.reaction || null, }
      },
      { arrayFilters: [{ 'elem.messageId': input.messageId, 'elem.userId': input.userId, }], },
    ).lean()
    this.chatsSubscriptionsService.publish({
      messageSent: {
        messageId: input.messageId,
        chatId: input.chatId,
        userId: userId,
        authUserReaction: input.userId === userId ? input.reaction : 'null',
        userReaction: input.userId !== userId ? input.reaction : 'null',
        date: new Date().toISOString(),
      } as UserMessage,
      participants: chat.participants,
    })
    if (chat) return true
    return false
  }
}
