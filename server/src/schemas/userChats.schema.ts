import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserChatDocument = HydratedDocument<UserChat>
@Schema()
export class UserChat {
  @Prop({ required: true, })
  chatId: string

  @Prop({ required: true, })
  userId: string

  @Prop({ required: true, type: Object, })
  coordinates: { lat: number, lon: number, }

  @Prop({ required: true, })
  name: string

  @Prop({ required: false, })
  lastMessage: string

  @Prop({ required: false, })
  lastMessageId: string

  @Prop({ required: false, })
  lastMessageUserId: string

  @Prop({ required: true, default: true, })
  unread: boolean

  @Prop({ required: true, default: true, })
  notifications: boolean

  @Prop({ required: true, })
  streetpassDate: Date
  
  @Prop({ required: true, })
  matchDate: Date

  @Prop({ required: true, })
  chatDate: Date
}

export type UserChatsDocument = HydratedDocument<UserChats>
@Schema()
export class UserChats {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  chats: UserChatDocument[]

  @Prop({ required: true, })
  lastUpdated: Date
}

export const UserChatsSchema = SchemaFactory.createForClass(UserChats)
