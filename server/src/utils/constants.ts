import { Stream, } from 'stream'
import { S3, } from 'aws-sdk'
import { registerEnumType } from '@nestjs/graphql'

export const accessConfig = { expiresIn: '420s', }
export const refreshConfig = { expiresIn: '30d', }
export const postLimit = 256
export const streetpassLimit = 512

export const Time = {
  Minute: 60,
  Hour: 3600,
  Day: 86400,
  Week: 604800,
  Month: 2.628e+6,
}

export const s3 = new S3({
  signatureVersion: 'v4',
  region: 'us-east-2',
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRECT_ACCESS_KEY,
})

export enum Errors {
  JwtExpired = 'jwt expired',
  AuthError = 'auth error',
  InputError = 'input error',
  UploadError = 'upload error',
  NotFound = 'not found',
  GeneralError = 'general error',
}

export enum SignInErrors {
  VerifyPhoneNumber = 'verify phone number',
  IncompleteAccount = 'incomplete account',
  IncompletePreferences = 'incomplete preferences',
  IncompleteProfile = 'incomplete profile',
}

export const InputLimits = {
  UsernameMin: 3,
  UsernameMax: 16,
  PasswordMin: 8,
  PasswordMax: 64,
  NameMin: 0,
  NameMax: 32,
  DescriptionMin: 0,
  DescriptionMax: 512,
  EmailMin: 0,
  EmailMax: 64,
  ShareMax: 50,
  VideoLengthMax: 15,
  UploadBytesMax: 134217728,
  StreetpassAgeMin: 18,
  StreetpassAgeMax: 99,
  MediaUploadsMax: 9,
}

export const PubSubOptions = { host: process.env.REDIS_HOST, port: Number(process.env.REDIS_PORT), }

export enum Subscriptions {
  PubSub = 'PUB_SUB', // redis pubsub key
  Streetpasses = 'streetpasses',
  Matches = 'matches',
  Messages = 'messages',
}

export interface FileUpload {
  filename: string
  mimetype: string
  encoding: string
  createReadStream: () => Stream
}

export enum OS {
  ios = 'Apple',
  android = 'Google',
  windows = 'Microsoft',
  macos = 'Apple',
  web = 'None',
}

export enum NotificationType { // NotificationPreferences property names
  Message = 'messages',
  Match = 'matches',
  Streetpass = 'streetpass',
}

// TODO - replace with localization
export enum PushNotificationMessage {
  messages = 'messaged you',
  matches = 'You got a new match',
  streetpass = 'New Streetpasses',
}

export enum Locales {
  'English' = 'en',
  'Français' = 'fr',
  'Español' = 'es',
  'Русский' = 'ru',
}

export const TOS = ``
