import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type StreetPassDocumentDocument = HydratedDocument<StreetPassDocument>
@Schema()
export class StreetPassDocument {
  @Prop({ required: true, })
  userId: string

  @Prop({ required: true, type: Object, })
  coordinates: { lat: number, lon: number, }

  @Prop({ required: true, })
  date: Date
}

export type StreetPassesDocument = HydratedDocument<StreetPasses>
@Schema()
export class StreetPasses {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  streetPasses: StreetPassDocument[]
}

export const StreetPassesSchema = SchemaFactory.createForClass(StreetPasses)
