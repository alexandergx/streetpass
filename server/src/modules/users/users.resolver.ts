import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql'
import { UsersService, PrivacyGuard, } from './users.service'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from '../auth/auth.service'
import { GetUserDto, RemoveMediaDto, SortMediaDto, UpdateUserDto, UploadMediaDto } from './users.dto'
import { UserProfile } from './users.entities'

@Resolver()
@UseGuards(AuthGuard)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => UserProfile)
  async getUser(@Args('input') input: GetUserDto, @Context() context: any) {
    return this.usersService.getUser(input, context)
  }

  @Mutation(() => Boolean)
  async updateUser(@Args('input') input: UpdateUserDto, @Context() context: any) {
    return this.usersService.updateUser(input, context)
  }

  @Mutation(() => String)
  async uploadMedia(@Args('input') input: UploadMediaDto, @Context() context: any) {
    return this.usersService.uploadMedia(input, context)
  }

  @Mutation(() => Boolean)
  async sortMedia(@Args('input') input: SortMediaDto, @Context() context: any) {
    return this.usersService.sortMedia(input, context)
  }

  @Mutation(() => Boolean)
  async removeMedia(@Args('input') input: RemoveMediaDto, @Context() context: any) {
    return this.usersService.removeMedia(input, context)
  }
}
