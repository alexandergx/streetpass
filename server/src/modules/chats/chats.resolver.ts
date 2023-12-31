import { Resolver, Query, Mutation, Args, Context, Subscription } from '@nestjs/graphql'
import { ChatsService, ChatsSubscriptionsService, } from './chats.service'
import { ChatsPagination, MessagesPagination, UserChat, UserMessage, } from './chats.entities'
import { GetChatsDto, GetMessagesDto, ReadChatDto, SearchChatsDto, ChatNotificationsDto, SubscribeChatsDto, } from './chats.dto'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.service'
import { Errors, InputLimits, Subscriptions, Time } from 'src/utils/constants'
import { JwtService } from '@nestjs/jwt'
import { GraphQLError } from 'graphql'
import { PrivacyGuard, } from '../users/users.service'
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

  @Query(() => [UserChat])
  @UseGuards(AuthGuard)
  async searchChats(@Args('input') input: SearchChatsDto, @Context() context: any) {
    return this.chatsService.searchChats(input, context)
  }

  @Mutation(() => [UserChat])
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

  @Subscription(() => UserMessage, {
    name: Subscriptions.Messages,
    filter: (payload, variables) => {
      if (variables.input?.chatId && payload.messageSent.chatId !== variables.input?.chatId) return false
      if (payload.participants.includes(variables.input.userId)) return true
      return false
    },
    resolve: (payload) => { return payload.messageSent }
  })
  async subscribeMessages(@Args('input') input: SubscribeChatsDto, @Context() context: any) {
    return this.chatsSubscriptionsService.instance.asyncIterator(Subscriptions.Messages)
  }

  // @Mutation(() => UserMessage)
  // @UseGuards(AuthGuard)
  // @UseGuards(PrivacyGuard)
  // @UseGuards(SelfGuard)
  // @Throttle(30, Time.Minute)
  // async sendMessage(@Args('input') input: SendMessageDto, @Context() context: any) {
  //   return this.chatsService.send(input, context)
  // }

  // @Mutation(() => Boolean)
  // @UseGuards(AuthGuard)
  // async deleteMessage(@Args('input') input: DeleteMessageDto, @Context() context: any) {
  //   return this.chatsService.deleteMessage(input, context)
  // }

  // @Mutation(() => Boolean)
  // @UseGuards(AuthGuard)
  // async reactMessage(@Args('input') input: ReactMessageDto, @Context() context: any) {
  //   return this.chatsService.reactMessage(input, context)
  // }
}
