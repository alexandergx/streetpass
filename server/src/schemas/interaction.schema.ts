import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type InteractionDocument = HydratedDocument<Interaction>
@Schema()
export class Interaction {
  @Prop({ required: true, index: true, })
  userIds: string // userId-targetUserId

  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, index: true, })
  targetUserId: string

  @Prop({ required: true, })
  action: boolean // like/true, dislike/false

  @Prop({ required: true, })
  createdAt: Date
}

export const InteractionSchema = SchemaFactory.createForClass(Interaction)
