import * as PackageJson from '../../package.json'

export const AppVersion = PackageJson.version
export const Domain = 'https://streetpass.app'

export const InputLimits = {
  NameMin: 3,
  NameMax: 32,
  DescriptionMin: 0,
  DescriptionMax: 256,
  EmailMin: 0,
  EmailMax: 64,
  VideoLengthMax: 15,
  UploadBytesMax: 134217728,
  StreetpassAgeMin: 18,
  StreetpassAgeMax: 99,
  PhoneNumberMax: 16,
}

export const Time = {
  Minute: 60,
  Hour: 3600,
  Day: 86400,
  Week: 604800,
  Month: 2.628e+6,
}

export const CameraZoom = {
  ZoomInLess: 11,
  ZoomInMore: 13,
  ZoomOutLess: 2.5,
  ZoomOutMore: 1.5,
}

export const CameraPan = {
  Instant: 100,
  Fast: 200,
  Slow: 300,
}

export const EmojisConfig: Object = {
  Heart: '❤',
  Like: '👍',
  Laugh: '😂',
  Smile: '😄',
  Love: '🥰',
  Fire: '🔥',
  Adore: '😍',
  Surprise: '😮',
  Anger: '😡',
  Teary: '🥹',
  Wink: '😜',
  Cry: '🥲',
  Praise: '🙏',
  Celebrate: '🎉',
}

export const Emojis = Object.values(EmojisConfig)

let ages: Array<number> = []
for (let i = InputLimits.StreetpassAgeMin; i <= 40; i++) ages.push(i)
for (let i = 45; i <= InputLimits.StreetpassAgeMax; i += 5) ages.push(i)
ages.push(InputLimits.StreetpassAgeMax)
export const streetpassAges = ages

export enum Errors {
  JwtExpired = 'jwt expired',
  JwtMalformed = 'jwt malformed',
  AuthError = 'auth error',
  InputError = 'input error',
  UploadError = 'upload error',
  NotFound = 'not found',
  GeneralError = 'error',
  ForceRefresh = 'force refresh',
  InvalidSignature = 'invalid signature',
  NetworkFailure = 'Network request failed',
}

export enum ISignInErrors {
  VerifyPhoneNumber = 'verify phone number',
  IncompleteAccount = 'incomplete account',
  IncompletePreferences = 'incomplete preferences',
  IncompleteProfile = 'incomplete profile',
}

export enum LocalStorage {
  SystemStore = 'systemStore',
  AuthStore = 'authStore',
  CameraStore = 'cameraStore',
}

export enum AuthStore {
  AccessToken = 'accessToken',
  RefreshToken = 'refreshToken',
}

export enum CameraStore {
  DefaultFrontCamera = 'defaultFrontCamera',
  SaveMedia = 'saveMedia',
  HDR = 'hdr',
  Stabilization = 'stabilization',
  Audio = 'audio',
  Grid = 'grid',
  Timer = 'timer',
  TimerValue = 'timerValue',
}

export enum SystemStore {
  Theme = 'Theme',
  Locale = 'locale',
  Audio = 'audio',
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
