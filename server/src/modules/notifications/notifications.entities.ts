import { ObjectType, Field, } from '@nestjs/graphql'
import { Coordinates } from '../posts/posts.entities'

@ObjectType()
export class UserNotification {
  @Field(() => String)
  notificationID: string

  @Field(() => String)
  userId: string

  @Field(() => String, { nullable: true, })
  authUserId?: string

  @Field(() => String, { nullable: true, })
  postId?: string

  @Field(() => String)
  type: string

  @Field(() => String, { nullable: true, })
  username?: string

  @Field(() => String, { nullable: true, })
  name?: string

  @Field(() => String, { nullable: true, })
  profilePicture?: string

  @Field(() => String, { nullable: true, })
  image?: string

  @Field(() => String, { nullable: true, })
  video?: string

  @Field(() => String, { nullable: true, })
  compact?: string

  @Field(() => String, { nullable: true, })
  thumbnail?: string

  @Field(() => Coordinates, { nullable: true, })
  coordinates?: Coordinates

  @Field(() => String,)
  date: string
}

@ObjectType()
export class NotificationsPagination {
  @Field(() => [UserNotification])
  notifications: UserNotification[]

  @Field(() => Number)
  page: number
}
