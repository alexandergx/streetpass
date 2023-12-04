import { InputType, Field, } from '@nestjs/graphql'

@InputType()
export class GetNotificationsDto {
  @Field(() => String, { nullable: true, })
  index?: string

  @Field(() => Number, { nullable: true, })
  page?: number

  @Field(() => String, { nullable: true, })
  updateIndex?: string
}

@InputType()
export class RemoveNotificationDto {
  @Field(() => String)
  notificationID: string
}

@InputType()
export class SetLastSeenNotificationDto {
  @Field(() => String)
  notificationID: string
}
