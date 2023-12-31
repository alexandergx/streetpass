import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type BlockedDocument = HydratedDocument<Blocked>
@Schema()
export class Blocked {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  blocking: string[]

  @Prop({ required: true, default: [], })
  blockers: string[]
}

export const BlockedSchema = SchemaFactory.createForClass(Blocked)
