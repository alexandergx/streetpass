import { InputType, Field, } from '@nestjs/graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { FileUpload } from 'src/utils/constants'

@InputType()
export class FindUserDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class FollowUserDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class SubscribeUserDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class RemoveFollowerDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class BlockUserDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class FollowRequestDto {
  @Field(() => String)
  userId: string

  @Field(() => Boolean)
  accept: boolean
}

@InputType()
export class UpdateStreetPassPreferencesDto {
  @Field(() => Boolean, { nullable: true, })
  discoverable?: boolean

  @Field(() => Boolean, { nullable: true, })
  location?: boolean

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean

  @Field(() => [Number], { nullable: true, })
  age?: [number, number]
}

@InputType()
export class UpdateNotificationPreferencesDto {
  @Field(() => Boolean, { nullable: true, })
  follows?: boolean

  @Field(() => Boolean, { nullable: true, })
  followRequests?: boolean

  @Field(() => Boolean, { nullable: true, })
  likes?: boolean

  @Field(() => Boolean, { nullable: true, })
  comments?: boolean

  @Field(() => Boolean, { nullable: true, })
  replies?: boolean

  @Field(() => Boolean, { nullable: true, })
  subscribedPosts?: boolean

  @Field(() => Boolean, { nullable: true, })
  messages?: boolean

  @Field(() => Boolean, { nullable: true, })
  streetPasses?: boolean

  @Field(() => Boolean, { nullable: true, })
  emails?: boolean

  @Field(() => Boolean, { nullable: true, })
  newsletters?: boolean
}

@InputType()
export class UpdatePrivacyPreferencesDto {
  @Field(() => Boolean, { nullable: true, })
  likes?: boolean

  @Field(() => Boolean, { nullable: true, })
  comments?: boolean

  @Field(() => Boolean, { nullable: true, })
  messages?: boolean
}

@InputType()
export class UpdateUserDto {
  @Field(() => String, { nullable: true, })
  username?: string

  @Field(() => String, { nullable: true, })
  name?: string

  @Field(() => Date, { nullable: true, })
  dob?: Date

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean

  @Field(() => String, { nullable: true, })
  bio?: string

  @Field(() => String, { nullable: true, })
  email?: string

  @Field(() => String, { nullable: true, })
  countryCode?: string

  @Field(() => String, { nullable: true, })
  phonenumber?: string

  @Field(() => GraphQLUpload, { nullable: true, })
  profilePicture?: Promise<FileUpload>

  @Field(() => Boolean, { nullable: true, })
  removeProfilePicture?: boolean

  @Field(() => Boolean, { nullable: true, })
  streetPass?: boolean

  @Field(() => UpdateStreetPassPreferencesDto, { nullable: true, })
  streetPassPreferences?: UpdateStreetPassPreferencesDto

  @Field(() => UpdateNotificationPreferencesDto, { nullable: true, })
  notificationPreferences?: UpdateNotificationPreferencesDto

  @Field(() => UpdatePrivacyPreferencesDto, { nullable: true, })
  privacyPreferences?: UpdatePrivacyPreferencesDto

  @Field(() => Boolean, { nullable: true, })
  privateProfile?: boolean
}

@InputType()
export class SearchUsersDto {
  @Field(() => String, { nullable: true, })
  userId?: string

  @Field(() => String)
  username: string

  @Field(() => Boolean, { nullable: true, })
  following?: boolean

  @Field(() => Boolean, { nullable: true, })
  available?: boolean
}

@InputType()
export class RemoveRecentSearchDto {
  @Field(() => String, { nullable: true, })
  userId?: string
}

@InputType()
export class GetBlockingDto {
  @Field(() => String, { nullable: true, })
  index?: string

  @Field(() => Number, { nullable: true, })
  page?: number
}

@InputType()
export class GetFollowingFollowersDto {
  @Field(() => String, { nullable: true, })
  userId?: string

  @Field(() => String, { nullable: true, })
  index?: string

  @Field(() => Number, { nullable: true, })
  page?: number

  @Field(() => Boolean, { nullable: true, })
  following?: boolean
}

@InputType()
export class StreetPassDto {
  @Field(() => Number)
  lat: number

  @Field(() => Number)
  lon: number
}

@InputType()
export class GetStreetPassesDto {
  @Field(() => Number, { nullable: true, })
  lat?: number

  @Field(() => Number, { nullable: true, })
  lon?: number

  @Field(() => String, { nullable: true, })
  index?: string

  @Field(() => Number, { nullable: true, })
  page?: number
}
