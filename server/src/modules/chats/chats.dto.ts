import { InputType, Field, } from '@nestjs/graphql'

@InputType()
export class GetChatsDto {
  @Field(() => String, { nullable: true, })
  index?: string
}

@InputType()
export class SearchChatsDto {
  @Field(() => String)
  name: string
}

@InputType()
export class ReadChatDto {
  @Field(() => String)
  chatId: string
}

@InputType()
export class ChatNotificationsDto {
  @Field(() => String)
  chatId: string

  @Field(() => Boolean)
  notifications: boolean
}

@InputType()
export class GetMessagesDto {
  @Field(() => String)
  chatId: string

  @Field(() => String, { nullable: true, })
  index?: string
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

// @InputType()
// export class DeleteMessageDto {
//   @Field(() => String)
//   chatId: string

//   @Field(() => String)
//   messageId: string
// }

// @InputType()
// export class ReactMessageDto {
//   @Field(() => String)
//   chatId: string

//   @Field(() => String)
//   messageId: string

//   @Field(() => String)
//   userId: string

//   @Field(() => String, { nullable: true, })
//   reaction?: string
// }
