import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { Streetpass } from './streetpasses.schema'

export type MatchedDocument = HydratedDocument<Matched>
@Schema()
export class Matched {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  matched: Streetpass[]
}

export const MatchedSchema = SchemaFactory.createForClass(Matched)
