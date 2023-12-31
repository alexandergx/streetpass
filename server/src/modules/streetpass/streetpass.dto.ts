import { InputType, Field, } from '@nestjs/graphql'

@InputType()
export class StreetpassDto {
  @Field(() => Number)
  lat: number

  @Field(() => Number)
  lon: number
}

@InputType()
export class SubscribeStreetpassesDto {
  @Field(() => String)
  userId: string
}
