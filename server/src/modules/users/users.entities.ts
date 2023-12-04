import { ObjectType, Field, } from '@nestjs/graphql'

@ObjectType()
export class UserProfile {
  @Field(() => String)
  userId: string

  @Field(() => String)
  name: string

  @Field(() => String, { nullable: true, })
  bio?: string
}

@ObjectType()
export class Coordinates {
  @Field(() => Number)
  lat: number

  @Field(() => Number)
  lon: number
}

@ObjectType()
export class StreetPass {
  @Field(() => String)
  userId: string

  @Field(() => String)
  name: string

  @Field(() => Number)
  age: number

  @Field(() => Boolean, { nullable: true, })
  sex?: boolean

  @Field(() => Coordinates, { nullable: true, })
  coordinates?: Coordinates

  @Field(() => Date)
  date: Date
}

@ObjectType()
export class StreetPassesPagination {
  @Field(() => Number)
  count: number

  @Field(() => [StreetPass])
  streetPasses: StreetPass[]

  @Field(() => Number)
  page: number
}
