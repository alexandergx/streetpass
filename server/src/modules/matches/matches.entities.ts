import { ObjectType, Field, } from '@nestjs/graphql'
import { UserMedia } from '../users/users.entities'

@ObjectType()
export class Match {
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
  
  @Field(() => String, { nullable: true, })
  date?: string

  @Field(() => [UserMedia])
  media: UserMedia[]

  @Field(() => Boolean)
  seen: boolean

  @Field(() => Boolean, { nullable: true, })
  unmatch?: boolean
}

@ObjectType()
export class MatchesPagination {
  @Field(() => [Match])
  matches: Match[]

  @Field(() => Boolean)
  continue: boolean
}
