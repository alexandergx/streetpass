import en from './locales/en'
// import fr from './locales/fr'
// import es from './locales/es'
// import de from './locales/de'
// import ru from './locales/ru'

export enum Locales {
  'English' = 'en',
  // 'Français' = 'fr',
  // 'Español' = 'es',
  // 'Deutsch' = 'de',
  // 'Русский' = 'ru',
}

export const Lit: ILit = {
  en: {...en},
  // fr: {...fr},
  // es: {...es},
  // de: {...de},
  // ru: {...ru},
}

export type ILit = { [K in Locales]: ILocale }
export type ILocale = {
  ScreenTitle: {
    AppStyleScreen: string,
    NotificationsScreen: string,
    EmailScreen: string,
    BlockingScreen: string,
    PhoneNumberScreen: string,
    DeleteAccountScreen: string,
    VerifyPhoneScreen: string,
    ChangePhoneScreen: string,
    PersonalInfoScreen: string,
    SexScreen: string,
  },
  Title: {
    App: string,
    Account: string,
    Support: string,
    About: string,
    Help: string,
    ToS: string,
    Alerts: string,
    Messages: string,
    Matches: string,
    StreetPasses: string,
    Email: string,
    EmailNotifications: string,
    Newsletters: string,
    SignOut: string,
    DeleteAccount: string,
    NotConnected: string,
    ConnectWithOthers: string,
    StreetPass: string,
    ShowMeOthers: string,
    ShowOthersMe: string,
    Discoverable: string,
    AgePreference: string,
    Sex: string,
    Male: string,
    Female: string,
    RatherNotSay: string,
    Men: string,
    Women: string,
    Everybody: string,
    IAm: string,
    DOB: string,
    Deleted: string,
    VisibleOnMap: string,
    StreetPassLocation: string,
    EnterName: string,
    Bio: string,
    Work: string,
    School: string,
    Settings: string,

    DefaultCamera: string,
    SaveCapturedMedia: string,
    Hdr: string,
    Stabilization: string,
    SoundOff: string,
    GridLines: string,
    Timer: string,
    DefaultCameraDescription: string,
    SaveCapturedMediaDescription: string,
    HdrDescription: string,
    StabilizationDescription: string,
    SoundOffDescription: string,
    GridLinesDescription: string,
    TimerDescription: string,
  },
  Copywrite: {
    NotFound: string,
    StreetPassDescription: string,
    DiscoverableDescription: string,
    StreetPassLocationDescription: string,
    Bio: string,
    Work: string,
    School: string,

    DiscardMedia: [string, string],
    CameraRequired: [string, string],
    MicrophoneRequired: [string, string],
    PhotosRequired: [string, string],
    EmailRequired: [string, string],
    NotificationsRequired: [string, string],
    AlwaysLocationRequired: [string, string],
    DeleteAccount: [string, string],
    VideoLength: [string, string],
  },
  Button: {
    Save: string,
    Remove: string,
    Block: string,
    Unblock: string,
    Report: string,
    Delete: string,
    Next: string,
    Continue: string,
    Verify: string,
    SendPin: string,
    PinSent: string,
    DeleteAccount: string,
    Mute: string,
    Unmute: string,
    Done: string,
    Cancel: string,
    Discard: string,
    Ok: string,
    No: string,
    Enable: string,
  },
  Time: {
    Year: string,
    Years: string,
    Month: string,
    Months: string,
    Week: string,
    Weeks: string,
    Day: string,
    Days: string,
    Hour: string,
    Hours: string,
    Minute: string,
    Minutes: string,
    Ago: string,
    Now: string,
  },
  PushNotification: {
    messages: string,
    matches: string,
    streetPasses: string,
  },
}
