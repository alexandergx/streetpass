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

  @Field(() => Date)
  date: Date

  @Field(() => [UserMedia])
  media: UserMedia[]

  @Field(() => String)
  lastMessage: string

  @Field(() => Boolean)
  unread: boolean

  @Field(() => Boolean)
  notifications: boolean
}

@ObjectType()
export class ChatsPagination {
  @Field(() => [UserChat])
  chats: UserChat[]

  @Field(() => Boolean)
  continue: boolean
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

  @Field(() => String)
  date: string

  // @Field(() => String, { nullable: true, })
  // authUserReaction?: string

  // @Field(() => String, { nullable: true, })
  // userReaction?: string

  // @Field(() => Boolean)
  // deleted: boolean
}

@ObjectType()
export class MessagesPagination {
  @Field(() => [UserMessage])
  messages: UserMessage[]

  @Field(() => Boolean)
  continue: boolean
}
