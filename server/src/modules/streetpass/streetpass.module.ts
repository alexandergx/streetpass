import { Module, } from '@nestjs/common'
import { StreetpassService, StreetpassSubscriptionsService, } from './streetpass.service'
import { StreetpassResolver, } from './streetpass.resolver'
import { MongooseModule, } from '@nestjs/mongoose'
import { User, UserSchema, } from 'src/schemas/user.schema'
import { JwtModule, } from '@nestjs/jwt'
import { AuthModule, } from '../auth/auth.module'
import { Blocked, BlockedSchema, } from 'src/schemas/blocked.schema'
import { Streetpasses, StreetpassesSchema, } from 'src/schemas/streetpasses.schema'
import { Streetpassed, StreetpassedSchema, } from 'src/schemas/streetpassed.schema'
import { Matches, MatchesSchema } from 'src/schemas/matches.schema'
import { PubSubOptions, Subscriptions } from 'src/utils/constants'
import { RedisPubSub } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'
import { NotificationsService } from '../app/app.service'

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
      { name: Streetpassed.name, collection: Streetpassed.name, schema: StreetpassedSchema, },
      { name: Streetpasses.name, collection: Streetpasses.name, schema: StreetpassesSchema, },
      { name: Matches.name, collection: Matches.name, schema: MatchesSchema, },
      { name: Blocked.name, collection: Blocked.name, schema: BlockedSchema, },
    ]),
    JwtModule.register({ secret: process.env.JWT_SECRET, }),
    AuthModule,
  ],
  exports: [StreetpassService],
  providers: [
    {
      provide: Subscriptions.PubSub,
      useFactory: () =>  new RedisPubSub({ publisher: new Redis(PubSubOptions), subscriber: new Redis(PubSubOptions), }),
    },
    StreetpassResolver,
    StreetpassService,
    StreetpassSubscriptionsService,
    NotificationsService,
  ]
})
export class StreetpassModule {}
