import * as dotenv from 'dotenv'; dotenv.config()
import { ConsoleLogger, LoggerService, } from '@nestjs/common'
import { Errors, OS, Time, s3, } from './constants'
import apn from 'apn'
import { DeviceTokens, } from 'src/schemas/user.schema'
import { Worker, } from 'worker_threads'
import { getS3Key, } from './functions'
import verifyAppleIdToken from 'verify-apple-id-token'
import { OAuth2Client, } from 'google-auth-library'

export class Logger extends ConsoleLogger implements LoggerService {
  log(message: any, context?: string) { super.log(message, context) }
  warn(message: any, context?: string) { super.warn(message, context) }
  debug(message: any, context?: string) { super.debug(message, context) }
  verbose(message: any, context?: string) { super.verbose(message, context) }
  error(message: any, trace?: string, context?: string) {
    if (typeof message === 'string' && (
      message.includes(Errors.JwtExpired)
      || message.includes(Errors.NotFound)
      || message.includes(Errors.AuthError)
    )) return
    super.error(message, trace, context)
  }
}

export async function verifyAppleAuth(appleAuth: string): Promise<string | null> {
  try {
    const payload = await verifyAppleIdToken({
      idToken: appleAuth,
      clientId: process.env.APPLE_DEVELOPER_CLIENT_ID,
    })
    return payload.sub
  } catch (e) {
    return Errors.AuthError
  }
}

export async function verifyGoogleAuth(googleAuth: string): Promise<string | null> {
  const client = new OAuth2Client(process.env.GOOGLE_DEVELOPER_CLIENT_ID)
  try {
    const response = await client.verifyIdToken({
        idToken: googleAuth,
        audience: process.env.GOOGLE_DEVELOPER_CLIENT_ID,
    })
    const payload = response.getPayload()
    return payload ? payload.sub : null
  } catch (e) {
    return Errors.AuthError
  }
}

const providerAPNs = new apn.Provider({
  token: {
    key: `./credentials/AuthKey_${process.env.APPLE_DEVELOPER_KEY_ID}.p8`,
    keyId: process.env.APPLE_DEVELOPER_KEY_ID,
    teamId: process.env.APPLE_DEVELOPER_TEAM_ID,
  },
  production: process.env.APP_ENV === 'production' ? true : false,
})
export interface SendPushNotification {
  deviceTokens: DeviceTokens,
  message: string,
  unread?: number,
  payload: {
    //
  },
}
export async function sendPushNotification({ deviceTokens, message, unread, payload, }: SendPushNotification) {
  const notification   = new apn.Notification()
  notification.expiry  = Math.floor(Date.now() / 1000) + 3600
  notification.sound   = 'ping.aiff'
  notification.alert   = message
  notification.payload = payload
  notification.topic   = process.env.APPLE_APP_BUNDLE_IDENTIFIER
  notification.badge   = unread || undefined
  // notification.aps     = { 'content-available': 1, } // silent

  const removeTokens = {
    [OS.ios]: [],
    [OS.android]: [],
  }
  for (const deviceToken of deviceTokens[OS.ios]) {
    try {
      const response = await providerAPNs.send(notification, deviceToken)
    } catch (error) {
      removeTokens[OS.ios].push(deviceToken)
      console.error('[APNs ERROR]', error)
    }
  }
  for (const deviceToken of deviceTokens[OS.android]) {
    // TODO
  }
  return removeTokens
}

// const notification   = new apn.Notification()
// notification.expiry  = Math.floor(Date.now() / 1000) + 3600
// notification.sound   = 'ping.aiff'
// notification.alert   = `${PushNotificationMessage[NotificationType.StreetPass]}`
// notification.payload = { type: NotificationType.StreetPass, streetPassId: 'testing', }
// notification.topic   = process.env.APPLE_APP_BUNDLE_IDENTIFIER
// notification.badge   = undefined
// providerAPNs.send(notification, '5325ca54cd16f2bf2e336f5d2bfa2dcc1decb07be3bac4f3857ad8bb41ac7e24')

export interface SendSMS {
  phonenumber: string,
  sms: string,
}
export async function sendSMS({ phonenumber, sms, }: SendSMS) {
  const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
  client.messages.create({ from: process.env.TWILIO_PHONE_NUMBER, to: phonenumber, body: sms, })
}

export function getPresignedUrl(path: string | null) {
  if (!path) return null
  return s3.getSignedUrl('getObject', { Bucket: process.env.S3_POSTS_MEDIA_BUCKET as string, Key: getS3Key(path), Expires: Time.Day, })
}

export interface CompressImage {
  imageBuffer: Buffer,
  imageSize?: number,
  imageQuality: number,
  thumbnail?: boolean,
  thumbnailSize?: number,
  thumbnailQuality?: number,
  compact?: boolean,
  compactSize?: number,
  compactQuality?: number,
}
export async function compressImage({ imageBuffer, imageSize, imageQuality, thumbnail, thumbnailSize, thumbnailQuality, compact, compactSize, compactQuality, }: CompressImage): Promise<Buffer | [Buffer, Buffer] | [Buffer, Buffer, Buffer]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/utils/workers/compress-image.worker.js')
    let compressedImageBuffer: Buffer, thumbnailBuffer: Buffer, compactBuffer: Buffer
    worker.on('message', async (message) => {
      if (message.type === 'error') reject(new Error(message.error.message))
      if (message.type === 'compressedImage') {
        compressedImageBuffer = Buffer.from(message.data)
        if (thumbnail) worker.postMessage({ type: 'createThumbnail', size: thumbnailSize, quality: thumbnailQuality, })
        else if (compact) worker.postMessage({ type: 'createCompact', size: compactSize, quality: compactQuality, })
        else resolve(compressedImageBuffer)
      }
      if (message.type === 'thumbnailImage') {
        thumbnailBuffer = Buffer.from(message.data)
        if (compact) worker.postMessage({ type: 'createCompact', size: compactSize, quality: compactQuality, })
        else resolve(compact ? [compressedImageBuffer, thumbnailBuffer, compactBuffer] : [compressedImageBuffer, thumbnailBuffer])
      }
      if (message.type === 'compactImage') {
        compactBuffer = Buffer.from(message.data)
        resolve(thumbnail ? [compressedImageBuffer, thumbnailBuffer, compactBuffer] : [compressedImageBuffer, compactBuffer])
      }
    })
    worker.postMessage({ type: 'processImage', imageBuffer, size: imageSize, quality: imageQuality })
  })
}

export interface CompressVideo {
  videoBuffer: Buffer,
  videoMute?: boolean,
  videoSize: number,
  videoLength: number,
  thumbnail?: boolean,
  thumbnailSize?: number,
}
export async function compressVideo({ videoBuffer, videoMute, thumbnail, videoSize, videoLength, thumbnailSize, }: CompressVideo): Promise<Buffer | [Buffer, Buffer]> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./src/utils/workers/compress-video.worker.js')
    worker.on('message', async (message) => {
      if (message.type === 'error') reject(new Error(message.error.message))
      if (message.type === 'videoAndThumbnail') {
        const compressedVideoBuffer = Buffer.from(message.data.compressedVideo)
        const thumbnailBuffer = Buffer.from(message.data.thumbnail)
        resolve([compressedVideoBuffer, thumbnailBuffer])
      } else if (message.type === 'compressedVideo') {
        const compressedVideoBuffer = Buffer.from(message.data.compressedVideo)
        resolve(compressedVideoBuffer)
      }
    })
    worker.postMessage({ type: 'processVideo', videoBuffer, videoMute, thumbnail, videoSize, videoLength, thumbnailSize, })
  })
}
