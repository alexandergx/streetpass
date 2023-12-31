import { Resolver, Query, Mutation, Args, Context, Subscription, } from '@nestjs/graphql'
import { MatchSubscriptionsService, MatchesService, } from './matches.service'
import { UseGuards, } from '@nestjs/common'
import { AuthGuard, } from '../auth/auth.service'
import { GetMatchesDto, MatchDto, SeenMatchDto, SubscribeMatchesDto, UnmatchDto, } from './matches.dto'
import { Subscriptions, } from 'src/utils/constants'
import { Match, MatchesPagination, } from './matches.entities'

@Resolver()
export class MatchesResolver {
  constructor(
    private matchesService: MatchesService,
    private matchSubscriptionsService: MatchSubscriptionsService,
  ) {}

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async match(@Args('input') input: MatchDto, @Context() context: any) {
    return this.matchesService.match(input, context)
  }

  @Query(() => MatchesPagination)
  @UseGuards(AuthGuard)
  async getMatches(@Args('input') input: GetMatchesDto, @Context() context: any) {
    return this.matchesService.getMatches(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async unmatch(@Args('input') input: UnmatchDto, @Context() context: any) {
    return this.matchesService.unmatch(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async seenMatch(@Args('input') input: SeenMatchDto, @Context() context: any) {
    return this.matchesService.seenMatch(input, context)
  }

  @Subscription(() => Match, {
    name: Subscriptions.Matches,
    filter: (payload, variables) => {
      if (payload.userId === variables.input.userId) return true
      return false
    },
    resolve: (payload) => { return payload.match }
  })
  async matches(@Args('input') input: SubscribeMatchesDto, @Context() context: any) {
    return this.matchSubscriptionsService.instance.asyncIterator(Subscriptions.Matches)
  }
}
