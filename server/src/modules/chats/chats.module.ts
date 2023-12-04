import { Module } from '@nestjs/common'
import { ChatsService, ChatsSubscriptionsService } from './chats.service'
import { ChatsResolver } from './chats.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/schemas/user.schema'
import { AuthModule } from '../auth/auth.module'
import { JwtModule, } from '@nestjs/jwt'
import { Chat, ChatSchema } from 'src/schemas/chat.schema'
import { UserChats, UserChatsSchema } from 'src/schemas/userChats.schema'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'
import { PubSubOptions, Subscriptions } from 'src/utils/constants'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Chat.name, collection: Chat.name, schema: ChatSchema, },
      { name: UserChats.name, collection: UserChats.name, schema: UserChatsSchema, },
      { name: User.name, collection: User.name, schema: UserSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    AuthModule,
  ],
  exports: [ChatsService],
  providers: [
    {
      provide: Subscriptions.PubSub,
      useFactory: () =>  new RedisPubSub({ publisher: new Redis(PubSubOptions), subscriber: new Redis(PubSubOptions), }),
    },
    ChatsResolver,
    ChatsService,
    ChatsSubscriptionsService,
  ],
})
export class ChatsModule {}
