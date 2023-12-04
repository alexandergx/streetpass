import { InputType, Field, } from '@nestjs/graphql'

@InputType()
export class GetChatsDto {
  @Field(() => String, { nullable: true, })
  index?: string

  @Field(() => Number, { nullable: true, })
  page?: number
}

@InputType()
export class SearchChatsDto {
  @Field(() => String, { nullable: true, })
  username: string
}

@InputType()
export class DeleteChatDto {
  @Field(() => String)
  chatId: string

  @Field(() => String)
  userId: string
}

@InputType()
export class SetNotificationsChatDto {
  @Field(() => String)
  chatId: string

  @Field(() => Boolean)
  notifications: boolean
}

@InputType()
export class SetReadChatDto {
  @Field(() => String)
  chatId: string
}

@InputType()
export class GetMessagesDto {
  @Field(() => String, { nullable: true, })
  chatId?: string

  @Field(() => String, { nullable: true, })
  userId?: string

  @Field(() => String, { nullable: true, })
  index?: string

  @Field(() => Number, { nullable: true, })
  page?: number
}

@InputType()
export class SubscribeChatsDto {
  @Field(() => String, { nullable: true, })
  chatId?: string

  @Field(() => String)
  userId: string
}

@InputType()
export class SendMessageDto {
  @Field(() => String, { nullable: true, })
  chatId?: string

  @Field(() => String)
  userId: string

  @Field(() => String)
  message: string
}

@InputType()
export class DeleteMessageDto {
  @Field(() => String)
  chatId: string

  @Field(() => String)
  messageId: string
}

@InputType()
export class ReactMessageDto {
  @Field(() => String)
  chatId: string

  @Field(() => String)
  messageId: string

  @Field(() => String)
  userId: string

  @Field(() => String, { nullable: true, })
  reaction?: string
}
