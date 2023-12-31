import { Resolver, Query, Mutation, Args, Context, Subscription, } from '@nestjs/graphql'
import { StreetpassService, StreetpassSubscriptionsService, } from './streetpass.service'
import { UseGuards, } from '@nestjs/common'
import { AuthGuard, } from '../auth/auth.service'
import { StreetpassDto, SubscribeStreetpassesDto, } from './streetpass.dto'
import { Subscriptions, } from 'src/utils/constants'
import { Streetpass, } from './streetpass.entities'

@Resolver()
export class StreetpassResolver {
  constructor(
    private streetpassService: StreetpassService,
    private streetpassSubscriptionsService: StreetpassSubscriptionsService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async streetpass(@Args('input') input: StreetpassDto, @Context() context: any) {
    return this.streetpassService.streetpass(input, context)
  }

  @Query(() => [Streetpass])
  @UseGuards(AuthGuard)
  async getStreetpasses(@Context() context: any) {
    return this.streetpassService.getStreetpasses(context)
  }

  @Subscription(() => Boolean, {
    name: Subscriptions.Streetpasses,
    filter: (payload, variables) => {
      if (payload.userId === variables.input.userId) return true
      return false
    },
    resolve: (payload) => { return true }
  })
  async subscribeStreetpasses(@Args('input') input: SubscribeStreetpassesDto, @Context() context: any) {
    return this.streetpassSubscriptionsService.instance.asyncIterator(Subscriptions.Streetpasses)
  }
}
