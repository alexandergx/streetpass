import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose'
import mongoose, { HydratedDocument, Types, } from 'mongoose'
import { InputLimits } from 'src/utils/constants'

export type MediaDocument = HydratedDocument<Media>
@Schema()
export class Media {
  @Prop({ required: true, })
  mediaId: string

  @Prop({ required: false, })
  image: string

  @Prop({ required: false, })
  video: string

  @Prop({ required: true, })
  thumbnail: string

  @Prop({ required: true, })
  compact: string

  @Prop({ required: true, })
  date: Date
}

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

export type StreetpassPreferencesDocument = HydratedDocument<StreetpassPreferences>
@Schema()
export class StreetpassPreferences {
  @Prop({ required: true, default: true, })
  discoverable: boolean

  @Prop({ required: true, default: true, })
  location: boolean

  @Prop({ required: false, default: undefined, })
  sex: boolean | null // true/male, false/female, null/any

  @Prop({ required: true, default: [InputLimits.StreetpassAgeMin, InputLimits.StreetpassAgeMax], })
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
  streetpasses: boolean

  @Prop({ required: true, default: true, })
  emails: boolean

  @Prop({ required: true, default: true, })
  newsletters: boolean
}

// export type PrivacyPreferencesDocument = HydratedDocument<PrivacyPreferences>
// @Schema()
// export class PrivacyPreferences {
//   //
// }

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
  @Prop({ required: false, index: true, })
  appleAuth: string

  @Prop({ required: false, index: true, })
  googleAuth: string

  @Prop({ required: false, unique: true, index: true, })
  identicalNumber: string
  
  @Prop({ required: false, })
  phoneNumber: string

  @Prop({ required: false, })
  countryCode: string

  @Prop({ required: true, default: () => new PhoneAuth(), })
  phoneAuth: PhoneAuth

  @Prop({ required: false, index: true, })
  email: string

  @Prop({ required: false, })
  name: string

  @Prop({ required: false, })
  dob: Date

  @Prop({ required: false, default: undefined, })
  sex: boolean | null // true/male, false/female, null/any

  @Prop({ required: false, })
  locale: string

  @Prop({ required: true, default: [], })
  media: Media[]

  @Prop({ required: false, })
  bio: string

  @Prop({ required: false, })
  work: string

  @Prop({ required: false, })
  school: string

  @Prop({ required: true, default: false, })
  deleted: boolean

  @Prop({ required: false, default: false, })
  banned: boolean

  @Prop({ required: false, index: '2dsphere', })
  lastCoordinates: [number, number] // lon, lat

  @Prop({ required: false, })
  lastSeen: Date

  @Prop({ required: true, default: false, })
  streetpass: boolean

  @Prop({ required: true, default: () => new StreetpassPreferences(), })
  streetpassPreferences: StreetpassPreferences

  @Prop({ required: true, default: () => new NotificationPreferences(), })
  notificationPreferences: NotificationPreferences

  // @Prop({ required: true, default: () => new PrivacyPreferences(), })
  // privacyPreferences: PrivacyPreferences

  @Prop({ required: true, default: () => new DeviceTokens(), })
  deviceTokens: DeviceTokens
}

export const UserSchema = SchemaFactory.createForClass(User)
