import { Args, Context, Mutation, Query, Resolver, } from '@nestjs/graphql'
import { VerifyPhoneNumberDto, SignInDto, SendPinDto, RegisterDeviceDto, } from './auth.dto'
import { AuthGuard, AuthService, } from './auth.service'
import { UseGuards, } from '@nestjs/common'
import { Throttle, } from '@nestjs/throttler'
import { Time, } from 'src/utils/constants'
import { Auth, AuthTokens, } from './auth.entities'

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => Auth)
  @Throttle(7, Time.Hour)
  async signIn(@Args('input') input: SignInDto, @Context() context: any) {
    return this.authService.signIn(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  @Throttle(3, Time.Day)
  async sendPin(@Args('input') input: SendPinDto, @Context() context: any) {
    return this.authService.sendPin(input, context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  @Throttle(3, Time.Day)
  async verifyPhoneNumber(@Args('input') input: VerifyPhoneNumberDto, @Context() context: any) {
  return this.authService.verifyPhoneNumber(input, context)
  }

  @Mutation(() => Boolean)
  async registerDevice(@Args('input') input: RegisterDeviceDto, @Context() context: any) {
    return this.authService.registerDevice(input, context)
  }

  @Query(() => AuthTokens)
  async refreshTokens(@Context() context: any) {
    return this.authService.refresh(context)
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  @Throttle(3, Time.Day)
  async deleteAccount(@Context() context: any) {
    return this.authService.deleteAccount(context)
  }
}
