import { Resolver, Query, Mutation, Args, Context, Subscription } from '@nestjs/graphql'
import { ChatsService, ChatsSubscriptionsService, } from './chats.service'
import { ChatsPagination, MessagesPagination, MessagesSubscription, UpdateChats, UpdateMessages, UserChat, UserMessage, } from './chats.entities'
import { GetChatsDto, GetMessagesDto, ReadChatDto, SearchChatsDto, ChatNotificationsDto, SubscribeChatsDto, SendMessageDto, ReactMessageDto, UpdateMessagesDto, UpdateChatsDto, AlertTypingDto, } from './chats.dto'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.service'
import { Errors, InputLimits, Subscriptions, Time } from 'src/utils/constants'
import { JwtService } from '@nestjs/jwt'
import { GraphQLError } from 'graphql'
import { PrivacyGuard, SelfGuard, } from '../users/users.service'
import { Throttle } from '@nestjs/throttler'

@Resolver()
export class ChatsResolver {
  constructor(
    private chatsService: ChatsService,
    private chatsSubscriptionsService: ChatsSubscriptionsService,
    private readonly jwtService: JwtService,
  ) {}

  @Query(() => ChatsPagination)
  @UseGuards(AuthGuard)
  async getChats(@Args('input') input: GetChatsDto, @Context() context: any) {
    return this.chatsService.getChats(input, context)
  }

  @Query(() => UpdateChats)
  @UseGuards(AuthGuard)
  async updateChats(@Args('input') input: UpdateChatsDto, @Context() context: any) {
    return this.chatsService.updateChats(input, context)
  }

  @Query(() => [UserChat])
  @UseGuards(AuthGuard)
  async searchChats(@Args('input') input: SearchChatsDto, @Context() context: any) {
    return this.chatsService.searchChats(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async readChat(@Args('input') input: ReadChatDto, @Context() context: any) {
    return this.chatsService.readChat(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async chatNotifications(@Args('input') input: ChatNotificationsDto, @Context() context: any) {
    return this.chatsService.chatNotifications(input, context)
  }

  @Query(() => MessagesPagination)
  @UseGuards(AuthGuard)
  async getMessages(@Args('input') input: GetMessagesDto, @Context() context: any) {
    return this.chatsService.getMessages(input, context)
  }

  @Query(() => UpdateMessages)
  @UseGuards(AuthGuard)
  async updateMessages(@Args('input') input: UpdateMessagesDto, @Context() context: any) {
    return this.chatsService.updateMessages(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  @UseGuards(PrivacyGuard)
  @UseGuards(SelfGuard)
  @Throttle(30, Time.Minute)
  async sendMessage(@Args('input') input: SendMessageDto, @Context() context: any) {
    return this.chatsService.sendMessage(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  @Throttle(20, Time.Minute)
  async reactMessage(@Args('input') input: ReactMessageDto, @Context() context: any) {
    return this.chatsService.reactMessage(input, context)
  }

  @Query(() => Boolean)
  @UseGuards(AuthGuard)
  @Throttle(12, Time.Minute)
  async alertTyping(@Args('input') input: AlertTypingDto, @Context() context: any) {
    return this.chatsService.alertTyping(input, context)
  }

  @Subscription(() => MessagesSubscription, {
    name: Subscriptions.Messages,
    filter: (payload, variables) => {
      if (variables.input?.chatId && payload.message.chatId !== variables.input?.chatId) return false
      if (payload.participants.includes(variables.input.userId)) return true
      return false
    },
    resolve: (payload) => { return { chat: payload.chat, message: payload.message, metadata: payload.metadata, } }
  })
  async subscribeMessages(@Args('input') input: SubscribeChatsDto, @Context() context: any) {
    return this.chatsSubscriptionsService.instance.asyncIterator(Subscriptions.Messages)
  }
}
