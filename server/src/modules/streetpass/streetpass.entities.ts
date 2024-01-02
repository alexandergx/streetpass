import { ObjectType, Field, } from '@nestjs/graphql'
import { UserMedia } from '../users/users.entities'

@ObjectType()
export class Streetpass {
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

  @Field(() => Number)
  age: number

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean
  
  @Field(() => [UserMedia])
  media: UserMedia[]
  
  @Field(() => Date)
  streetpassDate: Date
}
