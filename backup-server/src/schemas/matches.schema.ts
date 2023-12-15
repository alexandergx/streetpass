import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MatchDocumentDocument = HydratedDocument<MatchDocument>
@Schema()
export class MatchDocument {
  @Prop({ required: true, })
  userId: string

  @Prop({ required: true, type: Object, })
  coordinates: { lat: number, lon: number, }

  @Prop({ required: true, })
  date: Date
}

export type MatchesDocument = HydratedDocument<Matches>
@Schema()
export class Matches {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  matches: MatchDocument[]
}

export const MatchesSchema = SchemaFactory.createForClass(Matches)
