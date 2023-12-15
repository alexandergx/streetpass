import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql'
// import { Auth, AuthTokens, } from './/auth.entities'
import { RegisterDeviceDto, Auth0Dto, AuthPhoneDto, VerifyPhoneDto, RefreshAuthDto, } from './auth.dto'
import { AuthGuard, AuthService } from './auth.service'
import { UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { Time } from 'src/utils/constants'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Boolean)
  @Throttle(30, Time.Month)
  async auth0(
    // @Args('input') input: Auth0Dto
  ) {
    return true
  }
}
