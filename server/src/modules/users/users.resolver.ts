import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { UsersService, } from './users.service'
import { UserProfile, StreetPassesPagination, } from './users.entities'
import { FindUserDto, StreetPassDto, GetStreetPassesDto, } from './users.dto'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.service'

@Resolver()
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserProfile)
  async getUser(@Args('input') input: FindUserDto, @Context() context: any) {
    return this.usersService.getUser(input)
  }

  // updateUser

  @Mutation(() => Boolean)
  async streetPass(@Args('input') input: StreetPassDto, @Context() context: any) {
    return this.usersService.streetPass(input, context)
  }

  @Query(() => StreetPassesPagination)
  async getStreetPasses(@Args('input') input: GetStreetPassesDto, @Context() context: any) {
    return this.usersService.getStreetPasses(input, context)
  }

}
