import { ObjectType, Field, } from '@nestjs/graphql'

@ObjectType()
export class UserMessage {
  @Field(() => String)
  messageId: string

  @Field(() => String)
  chatId: string

  @Field(() => String)
  userId: string

  @Field(() => String, { nullable: true, })
  authUserId?: string

  @Field(() => String, { nullable: true, })
  message?: string

  @Field(() => String, { nullable: true, })
  authUserReaction?: string

  @Field(() => String, { nullable: true, })
  userReaction?: string

  @Field(() => String)
  date: string

  @Field(() => Boolean, { nullable: true, })
  deletedMessage?: boolean

  @Field(() => Boolean, { nullable: true, })
  deletedChat?: boolean
}

@ObjectType()
export class UserChat {
  @Field(() => String, { nullable: true, })
  chatId?: string

  @Field(() => String, { nullable: true, })
  userId?: string

  @Field(() => String, { nullable: true, })
  name?: string

  @Field(() => String, { nullable: true, })
  lastMessage?: string

  @Field(() => String, { nullable: true, })
  lastMessageId?: string

  @Field(() => Boolean, { nullable: true, })
  unread?: boolean

  @Field(() => Boolean, { nullable: true, })
  notifications?: boolean

  @Field(() => String, { nullable: true, })
  updated?: string
}

@ObjectType()
export class MessagesPagination {
  @Field(() => [UserMessage])
  messages: UserMessage[]

  @Field(() => UserChat, { nullable: true, })
  chat?: UserChat

  @Field(() => Number)
  page: number
}

@ObjectType()
export class ChatsPagination {
  @Field(() => [UserChat])
  chats: UserChat[]

  @Field(() => Number)
  unread: number

  @Field(() => Number)
  page: number
}
