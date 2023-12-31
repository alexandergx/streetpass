import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type StreetpassedDocument = HydratedDocument<Streetpassed>
@Schema()
export class Streetpassed {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  streetpassed: string[]
}

export const StreetpassedSchema = SchemaFactory.createForClass(Streetpassed)
