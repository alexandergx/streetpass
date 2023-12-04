import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
import { Auth, AuthTokens, } from './/auth.entities'
import { RegisterDeviceDto, Auth0Dto, AuthPhoneDto, VerifyPhoneDto, RefreshAuthDto, } from './auth.dto'
import { AuthGuard, AuthService } from './auth.service'
import { UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Time } from 'src/utils/constants'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth || Boolean)
  @Throttle(30, Time.Month)
  async auth0(@Args('input') input: Auth0Dto) {
    return this.authService.auth0(input)
  }

  @Mutation(() => Auth || Boolean)
  @Throttle(30, Time.Month)
  async authPhone(@Args('input') input: AuthPhoneDto) {
    return this.authService.authPhone(input)
  }

  @Mutation(() => Boolean)
  @Throttle(30, Time.Month)
  async verifyPhone(@Args('input') input: VerifyPhoneDto) {
    return this.authService.verifyPhone(input)
  }

  @Mutation(() => Boolean)
  async registerDevice(@Args('input') input: RegisterDeviceDto, @Context() context: any) {
    return this.authService.registerDevice(input, context)
  }

  @Query(() => AuthTokens)
  async refreshTokens(@Args('input') input: RefreshAuthDto, @Context() context: any) {
    return this.authService.refresh(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async deleteAuth(@Context() context: any) {
    return this.authService.remove(context)
  }
}
