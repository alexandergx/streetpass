import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersResolver } from './users.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/schemas/user.schema'
import { AuthModule } from '../auth/auth.module'
import { JwtModule, } from '@nestjs/jwt'
import { NotificationsModule } from '../notifications/notifications.module'
import { Following, FollowingSchema } from 'src/schemas/following.schema'
import { Followers, FollowersSchema } from 'src/schemas/followers.schema'
import { Subscribing, SubscribingSchema } from 'src/schemas/subscribing.schema'
import { Subscribers, SubscribersSchema } from 'src/schemas/subscribers.schema'
import { Blocking, BlockingSchema } from 'src/schemas/blocking.schema'
import { Blockers, BlockersSchema } from 'src/schemas/blockers.schema'
import { FollowersRequests, FollowersRequestsSchema } from 'src/schemas/followersRequests.schema'
import { UserPosts, UserPostsSchema } from 'src/schemas/userPosts.schema'
import { FollowingRequests, FollowingRequestsSchema } from 'src/schemas/followingRequests.schema'
import { ChatsModule } from '../chats/chats.module'
import Chat from 'twilio/lib/rest/Chat'
import { ChatSchema } from 'src/schemas/chat.schema'
import { UserChats, UserChatsSchema } from 'src/schemas/userChats.schema'
import { StreetPasses, StreetPassesSchema } from 'src/schemas/streetPasses.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: UserPosts.name, collection: UserPosts.name, schema: UserPostsSchema, },
      { name: Following.name, collection: Following.name, schema: FollowingSchema, },
      { name: Followers.name, collection: Followers.name, schema: FollowersSchema, },
      { name: FollowingRequests.name, collection: FollowingRequests.name, schema: FollowingRequestsSchema, },
      { name: FollowersRequests.name, collection: FollowersRequests.name, schema: FollowersRequestsSchema, },
      { name: Blocking.name, collection: Blocking.name, schema: BlockingSchema, },
      { name: Blockers.name, collection: Blockers.name, schema: BlockersSchema, },
      { name: Subscribing.name, collection: Subscribing.name, schema: SubscribingSchema, },
      { name: Subscribers.name, collection: Subscribers.name, schema: SubscribersSchema, },
      { name: Chat.name, collection: Chat.name, schema: ChatSchema, },
      { name: UserChats.name, collection: UserChats.name, schema: UserChatsSchema, },
      { name: StreetPasses.name, collection: StreetPasses.name, schema: StreetPassesSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    AuthModule,
    NotificationsModule,
  ],
  exports: [UsersService],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
