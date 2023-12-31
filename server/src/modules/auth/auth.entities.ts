import { ObjectType, Field, } from '@nestjs/graphql'
import { UserMedia } from '../users/users.entities'

@ObjectType()
export class StreetpassPreferences {
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
  streetpasses: boolean

  @Field(() => Boolean)
  emails: boolean

  @Field(() => Boolean)
  newsletters: boolean
}

@ObjectType()
export class AuthUser {
  @Field(() => String)
  userId: string
  
  @Field(() => String, { nullable: true, })
  phoneNumber?: string

  @Field(() => String, { nullable: true, })
  countryCode?: string

  @Field(() => String, { nullable: true, })
  email?: string

  @Field(() => String, { nullable: true, })
  name?: string

  @Field(() => Date, { nullable: true, })
  dob?: Date

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean

  @Field(() => String, { nullable: true, })
  bio?: string

  @Field(() => String, { nullable: true, })
  work?: string

  @Field(() => String, { nullable: true, })
  school?: string

  @Field(() => Boolean, { nullable: true, })
  streetpass?: boolean

  @Field(() => StreetpassPreferences)
  streetpassPreferences: StreetpassPreferences

  @Field(() => NotificationPreferences)
  notificationPreferences: NotificationPreferences

  @Field(() => [UserMedia])
  media: UserMedia[]

  @Field(() => Date)
  joinDate?: Date
}

@ObjectType()
export class Auth {
  @Field(() => String)
  accessToken: string

  @Field(() => String)
  refreshToken: string

  @Field(() => AuthUser)
  user: AuthUser

  @Field(() => String, { nullable: true, })
  code?: string
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

  @Field(() => Number, { description: 'Issued At', })
  iat: number

  @Field(() => Number, { description: 'Expires Date', })
  exp: number
}
