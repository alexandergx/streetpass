import { ObjectType, Field, } from '@nestjs/graphql'
import { UserMedia } from '../users/users.entities'

@ObjectType()
export class UserChat {
  @Field(() => String)
  chatId: string

  @Field(() => String)
  userId: string

  @Field(() => String)
  name: string

  @Field(() => String)
  bio: string

  @Field(() => String)
  work: string

  @Field(() => String)
  school: string

  @Field(() => Number)
  age: number

  @Field(() => Boolean, { nullable: true, })
  sex: boolean

  @Field(() => [UserMedia])
  media: UserMedia[]

  @Field(() => String)
  lastMessage: string

  @Field(() => String)
  lastMessageId: string

  @Field(() => String)
  lastMessageUserId: string

  @Field(() => Boolean)
  unread: boolean

  @Field(() => Boolean)
  notifications: boolean

  @Field(() => String)
  streetpassDate: string

  @Field(() => String)
  matchDate: string

  @Field(() => String)
  chatDate: string
}

@ObjectType()
export class ChatsPagination {
  @Field(() => [UserChat])
  chats: UserChat[]

  @Field(() => Boolean)
  continue: boolean

  @Field(() => String, { nullable: true, })
  lastUpdated?: string
}

@ObjectType()
export class UpdateChats {
  @Field(() => [UserChat], { nullable: true, })
  chats?: UserChat[]

  @Field(() => String, { nullable: true, })
  lastUpdated?: string
}

@ObjectType()
export class UserMessage {
  @Field(() => String)
  chatId: string

  @Field(() => String)
  messageId: string

  @Field(() => String)
  userId: string

  @Field(() => String)
  message: string

  @Field(() => String, { nullable: true, })
  reaction?: string

  @Field(() => String)
  date: string
}

@ObjectType()
export class MessagesPagination {
  @Field(() => [UserMessage])
  messages: UserMessage[]

  @Field(() => Boolean)
  continue: boolean
}

@ObjectType()
export class UpdateMessages {
  @Field(() => [UserMessage])
  messages: UserMessage[]
}

@ObjectType()
export class MessageMetadata {
  @Field(() => String)
  sender: string

  @Field(() => String)
  recipient: string

  @Field(() => Boolean, { nullable: true, })
  typing?: boolean

  @Field(() => String, { nullable: true, })
  lastUpdated?: string
}

@ObjectType()
export class MessagesSubscription {
  @Field(() => UserChat, { nullable: true, })
  chat?: UserChat

  @Field(() => UserMessage)
  message: UserMessage

  @Field(() => MessageMetadata)
  metadata: MessageMetadata
}
