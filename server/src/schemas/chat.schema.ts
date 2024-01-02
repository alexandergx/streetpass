import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MessageDocument = HydratedDocument<Message>
@Schema()
export class Message {
  @Prop({ required: true, })
  messageId: string

  @Prop({ required: true, })
  userId: string

  @Prop({ required: true, })
  message: string

  @Prop({ required: true, default: null, })
  reaction: string | null

  @Prop({ required: true, })
  date: Date
}

export type ChatDocument = HydratedDocument<Chat>
@Schema()
export class Chat {
  @Prop({ required: true, default: [], })
  participants: string[]

  @Prop({ required: true, default: [], })
  messages: MessageDocument[]
}

export const ChatSchema = SchemaFactory.createForClass(Chat)
