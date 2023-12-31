import { InputType, Field, } from '@nestjs/graphql'
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js'
import { FileUpload } from 'src/utils/constants'

@InputType()
export class GetUserDto {
  @Field(() => String, { nullable: true, })
  userId?: string
}

@InputType()
export class UpdateStreetpassPreferencesDto {
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
  messages?: boolean

  @Field(() => Boolean, { nullable: true, })
  matches?: boolean

  @Field(() => Boolean, { nullable: true, })
  streetpasses?: boolean

  @Field(() => Boolean, { nullable: true, })
  emails?: boolean

  @Field(() => Boolean, { nullable: true, })
  newsletters?: boolean
}

@InputType()
export class UpdateUserDto {
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

  @Field(() => String, { nullable: true, }) // UpdateStreetpassPreferencesDto stringified
  streetpassPreferences?: string

  @Field(() => String, { nullable: true, }) // UpdateNotificationPreferencesDto stringified
  notificationPreferences?: string
}

@InputType()
export class BlockUserDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class UploadMediaDto {
  @Field(() => GraphQLUpload, { nullable: true, })
  image: Promise<FileUpload>

  @Field(() => GraphQLUpload, { nullable: true, })
  video: Promise<FileUpload>
}

@InputType()
export class RemoveMediaDto {
  @Field(() => [String])
  mediaIds?: string[]
}

@InputType()
export class SortMediaDto {
  @Field(() => [String])
  mediaIds?: string[]
}
