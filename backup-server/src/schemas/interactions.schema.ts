import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type InteractionsDocument = HydratedDocument<Interactions>
@Schema()
export class Interactions {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  interactions: string[]
}

export const InteractionSchema = SchemaFactory.createForClass(Interactions)
