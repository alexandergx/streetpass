import { ObjectType, Field, } from '@nestjs/graphql'

@ObjectType()
export class StreetPassPreferences {
  @Field(() => Boolean, { nullable: true, })
  discoverable?: boolean

  @Field(() => Boolean, { nullable: true, })
  location?: boolean

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean

  @Field(() => [Number], { nullable: true, })
  age?: [number, number]
}

@ObjectType()
export class NotificationPreferences {
  @Field(() => Boolean)
  messages: boolean

  @Field(() => Boolean)
  matches: boolean

  @Field(() => Boolean)
  streetPasses: boolean

  @Field(() => Boolean)
  alerts: boolean

  @Field(() => Boolean)
  emails: boolean

  @Field(() => Boolean)
  newsletters: boolean
}

@ObjectType()
export class PrivacyPreferences {
  //
}

@ObjectType()
export class AuthUser {
  @Field(() => String)
  userId: string
  
  @Field(() => String)
  phoneNumber: string

  @Field(() => String)
  countryCode: string

  @Field(() => String, { nullable: true, })
  email?: string

  @Field(() => String)
  name: string

  @Field(() => Date)
  dob: Date

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean

  @Field(() => String, { nullable: true, })
  bio?: string

  @Field(() => StreetPassPreferences)
  streetPassPreferences: StreetPassPreferences

  @Field(() => NotificationPreferences)
  notificationPreferences: NotificationPreferences

  @Field(() => PrivacyPreferences)
  privacyPreferences: PrivacyPreferences
}

@ObjectType()
export class Auth {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string

  @Field(() => AuthUser)
  user: AuthUser
}

@ObjectType()
export class AuthTokens {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string
}

@ObjectType()
export class AuthDecodedToken {
  @Field(() => String)
  userId: string

  @Field(() => Number, { description: 'Issues At', })
  iat: number

  @Field(() => Number, { description: 'Expiration Date', })
  exp: number
}
