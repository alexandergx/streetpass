import { Prop, Schema, SchemaFactory, } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserRecordsDocument = HydratedDocument<UserRecords>
@Schema()
export class UserRecords {
  @Prop({ required: true, index: true, })
  userId: string

  @Prop({ required: true, })
  appVersion: string

  @Prop({ required: true, default: [], })
  logins: Array<string>

  @Prop({ required: true, default: [], })
  IPs: Array<string>

  @Prop({ required: true, default: [], })
  deviceIds: Array<string>

  @Prop({ required: true, default: [], })
  carriers: Array<string>
}

export const UserRecordsSchema = SchemaFactory.createForClass(UserRecords)
