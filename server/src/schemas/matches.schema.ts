import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type MatchDocument = HydratedDocument<Match>
@Schema()
export class Match {
  @Prop({ required: true, })
  userId: string

  @Prop({ required: true, type: Object, })
  coordinates: { lat: number, lon: number, }
  
  @Prop({ required: true, default: false, })
  seen: boolean

  @Prop({ required: true, })
  streetpassDate: Date

  @Prop({ required: true, })
  matchDate: Date
}

export type MatchesDocument = HydratedDocument<Matches>
@Schema()
export class Matches {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, default: [], })
  matches: Match[]
}

export const MatchesSchema = SchemaFactory.createForClass(Matches)
