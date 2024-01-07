import * as dotenv from 'dotenv'; dotenv.config()
import { MiddlewareConsumer, Module, RequestMethod, } from '@nestjs/common'
import { GraphQLModule, } from '@nestjs/graphql'
import { join, } from 'path'
import { ApolloDriver, ApolloDriverConfig, } from '@nestjs/apollo'
import { AppController, } from './app.controller'
import { AppService, createBlacklistGuard, GqlRateLimitGuard, } from './app.service'
import { MongooseModule, } from '@nestjs/mongoose'
import { AuthModule, } from '../auth/auth.module'
import { ThrottlerModule, } from '@nestjs/throttler'
import { APP_GUARD, } from '@nestjs/core'
import { Errors, PubSubOptions, Subscriptions, Time, } from 'src/utils/constants'
import { JwtService, } from '@nestjs/jwt'
import { GraphQLError, } from 'graphql'
import { RedisPubSub, } from 'graphql-redis-subscriptions'
import Redis from 'ioredis'
import { UsersModule, } from '../users/users.module'
import { StreetpassModule, } from '../streetpass/streetpass.module'
import { MatchesModule } from '../matches/matches.module'
import { ChatsModule } from '../chats/chats.module'
import { User, UserSchema } from 'src/schemas/user.schema'

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      installSubscriptionHandlers: true,
      subscriptions: {
        'graphql-ws': {
          path: '/graphql',
          onSubscribe: (context, params) => {
            try {
              const jwtService = new JwtService({ secret: process.env.JWT_SECRET, })
              const accessToken = context.connectionParams['access-token']
              if (accessToken) {
                const { userId, } = jwtService.verify(accessToken as string)
                const [_, inputUserId] = params.payload.query.match(/input: {userId: "([a-zA-Z0-9]+)", accessToken: /) ?? []
                if (userId === inputUserId) return
              }
              throw new GraphQLError(Errors.AuthError)
            } catch(e) {
              // console.log('[SUBSCRIPTION REGISTER ERROR]', e)
            }
          },
        },
      },
      playground: process.env.APP_ENV !== 'production',
      context: (context) => { return context },
      formatResponse: response => { return response },
      formatError: error => { return error },
    }),
    MongooseModule.forRoot(process.env.DB_HOST),
    MongooseModule.forFeature([
      { name: User.name, collection: User.name, schema: UserSchema, },
    ]),
    ThrottlerModule.forRoot({ ttl: Time.Minute * 6, limit: 1000, }),
    AuthModule,
    UsersModule,
    StreetpassModule,
    MatchesModule,
    ChatsModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: Subscriptions.PubSub,
      useFactory: () =>  new RedisPubSub({ publisher: new Redis(PubSubOptions), subscriber: new Redis(PubSubOptions), }),
    },
    { provide: APP_GUARD, useClass: GqlRateLimitGuard, },
    AppService,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(createBlacklistGuard(Time.Minute * 1000, 500)).forRoutes({ path: '*', method: RequestMethod.ALL, })
    consumer.apply(createBlacklistGuard(Time.Minute * 3 * 1000, 1000)).forRoutes({ path: '*', method: RequestMethod.ALL, })
  }
}
