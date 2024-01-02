import { Module, } from '@nestjs/common'
import { UsersService, } from './users.service'
import { UsersResolver, } from './users.resolver'
import { MongooseModule, } from '@nestjs/mongoose'
import { User, UserSchema, } from 'src/schemas/user.schema'
import { JwtModule, } from '@nestjs/jwt'
import { AuthModule, } from '../auth/auth.module'
import { Matches, MatchesSchema, } from 'src/schemas/matches.schema'
import { Matched, MatchedSchema, } from 'src/schemas/matched.schema'
import { Blocked, BlockedSchema, } from 'src/schemas/blocked.schema'
import { Streetpasses, StreetpassesSchema, } from 'src/schemas/streetpasses.schema'
import { UserChats, UserChatsSchema, } from 'src/schemas/userChats.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: Streetpasses.name, collection: Streetpasses.name, schema: StreetpassesSchema, },
      { name: Matches.name, collection: Matches.name, schema: MatchesSchema, },
      { name: Matched.name, collection: Matched.name, schema: MatchedSchema, },
      { name: UserChats.name, collection: UserChats.name, schema: UserChatsSchema, },
      { name: Blocked.name, collection: Blocked.name, schema: BlockedSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    AuthModule,
  ],
  exports: [UsersService],
  providers: [UsersResolver, UsersService]
})
export class UsersModule {}
