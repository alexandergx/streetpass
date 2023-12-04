import { Field, InputType, } from '@nestjs/graphql'

@InputType()
export class Auth0Dto {
  @Field(() => String, { nullable: true, })
  phoneNumber?: string

  @Field(() => String, { nullable: true, })
  countryCode?: string

  @Field(() => String, { nullable: true, })
  securityPin?: string

  @Field(() => String, { nullable: true, })
  appleAuth?: string

  @Field(() => String, { nullable: true, })
  googleAuth?: string

  @Field(() => String, { nullable: true, })
  locale?: string

  @Field(() => Number, { nullable: true, })
  lat?: number

  @Field(() => Number, { nullable: true, })
  lon?: number

  @Field(() => String, { nullable: true, })
  appVersion?: string

  @Field(() => String, { nullable: true, })
  IP?: string

  @Field(() => String, { nullable: true, })
  deviceId?: string

  @Field(() => String, { nullable: true, })
  carrier?: string
}

@InputType()
export class AuthPhoneDto {
  @Field(() => String)
  phoneNumber: string

  @Field(() => String)
  countryCode: string

  @Field(() => String, { nullable: true, })
  locale?: string

  @Field(() => Number, { nullable: true, })
  lat?: number

  @Field(() => Number, { nullable: true, })
  lon?: number

  @Field(() => String, { nullable: true, })
  appVersion?: string

  @Field(() => String, { nullable: true, })
  IP?: string

  @Field(() => String, { nullable: true, })
  deviceId?: string

  @Field(() => String, { nullable: true, })
  carrier?: string
}

@InputType()
export class VerifyPhoneDto {
  @Field(() => String)
  phoneNumber: string

  @Field(() => String)
  countryCode: string

  @Field(() => String)
  securityPin: string
}

@InputType()
export class RegisterDeviceDto {
  @Field(() => String)
  manufacturer: string

  @Field(() => String)
  deviceToken: string

  @Field(() => Boolean, { nullable: true, })
  unregister?: boolean
}

@InputType()
export class RefreshAuthDto {
  @Field(() => String, { nullable: true, })
  locale?: string

  @Field(() => Number, { nullable: true, })
  lat?: number

  @Field(() => Number, { nullable: true, })
  lon?: number

  @Field(() => String, { nullable: true, })
  appVersion?: string

  @Field(() => String, { nullable: true, })
  IP?: string

  @Field(() => String, { nullable: true, })
  deviceId?: string

  @Field(() => String, { nullable: true, })
  carrier?: string
}
