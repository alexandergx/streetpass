import { Module } from '@nestjs/common'
import { NotificationsService, } from './notifications.service'
import { NotificationsResolver, } from './notifications.resolver'
import { MongooseModule } from '@nestjs/mongoose'
import { JwtModule, } from '@nestjs/jwt'
import { User, UserSchema } from 'src/schemas/user.schema'
import { AuthModule } from '../auth/auth.module'
import { UserChats, UserChatsSchema } from 'src/schemas/userChats.schema'
import { UserPosts, UserPostsSchema } from 'src/schemas/userPosts.schema'
import { Notifications, NotificationsSchema } from 'src/schemas/notifications.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Notifications.name, collection: Notifications.name, schema: NotificationsSchema, },
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: UserPosts.name, collection: UserPosts.name, schema: UserPostsSchema, },
      { name: UserChats.name, collection: UserChats.name, schema: UserChatsSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    AuthModule,
  ],
  exports: [NotificationsService],
  providers: [NotificationsResolver, NotificationsService,],
})
export class NotificationsModule {}
