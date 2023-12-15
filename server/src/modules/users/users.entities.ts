import { ObjectType, Field, } from '@nestjs/graphql'

@ObjectType()
export class UserMedia {
  @Field(() => String)
  mediaId: string

  @Field(() => String, { nullable: true, })
  image?: string

  @Field(() => String, { nullable: true, })
  video?: string

  @Field(() => String)
  thumbnail: string
}

@ObjectType()
export class UserProfile {
  @Field(() => String)
  userId: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true, })
  bio?: string

  @Field(() => String, { nullable: true, })
  work?: string

  @Field(() => String, { nullable: true, })
  school?: string

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean

  @Field(() => Number)
  age: number

  @Field(() => [UserMedia])
  media: UserMedia[]
}
