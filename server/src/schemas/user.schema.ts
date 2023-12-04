import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { InputLimits } from 'src/utils/constants'

export type PhoneAuthDocument = HydratedDocument<PhoneAuth>
@Schema()
export class PhoneAuth {
  @Prop({ required: true, default: false, })
  verified: boolean

  @Prop({ required: false, })
  securityPin: string

  @Prop({ required: false, })
  expiresAt: Date
}

export type StreetPassPreferencesDocument = HydratedDocument<StreetPassPreferences>
@Schema()
export class StreetPassPreferences {
  @Prop({ required: true, default: true, })
  discoverable: boolean

  @Prop({ required: true, default: true, })
  location: boolean

  @Prop({ required: false, default: null, })
  sex: boolean | null // true/male, false/female, null/any

  @Prop({ required: true, default: [InputLimits.StreetPassAgeMin, InputLimits.StreetPassAgeMax], })
  age: [number, number] // min, max
}

export type NotificationPreferencesDocument = HydratedDocument<NotificationPreferences>
@Schema()
export class NotificationPreferences {
  @Prop({ required: true, default: true, })
  messages: boolean

  @Prop({ required: true, default: true, })
  matches: boolean

  @Prop({ required: true, default: true, })
  streetPasses: boolean

  @Prop({ required: true, default: true, })
  alerts: boolean

  @Prop({ required: true, default: true, })
  emails: boolean

  @Prop({ required: true, default: true, })
  newsletters: boolean
}

export type PrivacyPreferencesDocument = HydratedDocument<PrivacyPreferences>
@Schema()
export class PrivacyPreferences {
  //
}

export type DeviceTokensDocument = HydratedDocument<DeviceTokens>
@Schema()
export class DeviceTokens {
  @Prop({ required: true, default: [], })
  Apple: string[]

  @Prop({ required: true, default: [], })
  Google: string[]
}

export type UserDocument = HydratedDocument<User>
@Schema()
export class User {
  @Prop({ required: true, default: () => new PhoneAuth(), })
  phoneAuth: PhoneAuth

  @Prop({ required: true, index: true, })
  appleAuth: string

  @Prop({ required: true, index: true, })
  googleAuth: string
  
  @Prop({ required: true, unique: true, index: true, })
  phoneNumber: string

  @Prop({ required: false, })
  countryCode: string

  @Prop({ required: false, index: true, })
  email: string

  @Prop({ required: false, })
  name: string

  @Prop({ required: false, })
  dob: Date

  @Prop({ required: true, default: false, })
  sex: boolean | null // true/male, false/female, null/any

  @Prop({ required: false, })
  locale: string

  @Prop({ required: false, })
  bio: string

  @Prop({ required: true, default: false, })
  deleted: boolean

  @Prop({ required: false, default: false, })
  banned: boolean

  @Prop({ required: false, index: '2dsphere', })
  lastCoordinates: [number, number] // !lon, lat

  @Prop({ required: false, })
  lastSeen: Date

  @Prop({ required: true, default: () => new StreetPassPreferences(), })
  streetPassPreferences: StreetPassPreferences

  @Prop({ required: true, default: () => new NotificationPreferences(), })
  notificationPreferences: NotificationPreferences

  @Prop({ required: true, default: () => new PrivacyPreferences(), })
  privacyPreferences: PrivacyPreferences

  @Prop({ required: true, default: () => new DeviceTokens(), })
  deviceTokens: DeviceTokens
}

export const UserSchema = SchemaFactory.createForClass(User)
