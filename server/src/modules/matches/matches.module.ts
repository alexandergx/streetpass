import { Module, } from '@nestjs/common'
import { MatchSubscriptionsService, MatchesService, } from './matches.service'
import { MatchesResolver, } from './matches.resolver'
import { MongooseModule, } from '@nestjs/mongoose'
import { User, UserSchema, } from 'src/schemas/user.schema'
import { JwtModule, } from '@nestjs/jwt'
import { AuthModule, } from '../auth/auth.module'
import { Streetpasses, StreetpassesSchema, } from 'src/schemas/streetpasses.schema'
import { Streetpassed, StreetpassedSchema, } from 'src/schemas/streetpassed.schema'
import { Matches, MatchesSchema } from 'src/schemas/matches.schema'
import { Matched, MatchedSchema } from 'src/schemas/matched.schema'
import { PubSubOptions, Subscriptions } from 'src/utils/constants'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'
import { UserChats, UserChatsSchema } from 'src/schemas/userChats.schema'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: Streetpassed.name, collection: Streetpassed.name, schema: StreetpassedSchema, },
      { name: Streetpasses.name, collection: Streetpasses.name, schema: StreetpassesSchema, },
      { name: Matched.name, collection: Matched.name, schema: MatchedSchema, },
      { name: Matches.name, collection: Matches.name, schema: MatchesSchema, },
      { name: UserChats.name, collection: UserChats.name, schema: UserChatsSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    AuthModule,
  ],
  exports: [MatchesService, MatchSubscriptionsService],
  providers: [
    {
      provide: Subscriptions.PubSub,
      useFactory: () =>  new RedisPubSub({ publisher: new Redis(PubSubOptions), subscriber: new Redis(PubSubOptions), }),
    },
    MatchesResolver,
    MatchesService,
    MatchSubscriptionsService,
  ]
})
export class MatchesModule {}
