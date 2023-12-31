import { InputType, Field, } from '@nestjs/graphql'

@InputType()
export class MatchDto {
  @Field(() => String)
  userId: string

  @Field(() => Boolean)
  match: boolean
}

@InputType()
export class SeenMatchDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class GetMatchesDto {
  @Field(() => Number, { nullable: true, })
  index?: number
}

@InputType()
export class UnmatchDto {
  @Field(() => String)
  userId: string
}

@InputType()
export class SubscribeMatchesDto {
  @Field(() => String)
  userId: string
}
