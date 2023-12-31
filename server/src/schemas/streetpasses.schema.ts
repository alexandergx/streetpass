import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type StreetpassDocument = HydratedDocument<Streetpass>
@Schema()
export class Streetpass {
  @Prop({ required: true, })
  userId: string

  @Prop({ required: true, type: Object, })
  coordinates: { lat: number, lon: number, }

  @Prop({ required: true, })
  date: Date
}

export type StreetpassesDocument = HydratedDocument<Streetpasses>
@Schema()
export class Streetpasses {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  streetpasses: Streetpass[]
}

export const StreetpassesSchema = SchemaFactory.createForClass(Streetpasses)
