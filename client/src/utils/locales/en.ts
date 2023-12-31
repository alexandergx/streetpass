import * as PackageJson from '../../../package.json'
import { InputLimits } from '../constants'
import { ILocale } from '../locale'

const Locale: ILocale = {
  ScreenTitle: {
    AppStyleScreen: 'App style',
    NotificationsScreen: 'Notifications',
    BlockingScreen: 'Blocked',
    EmailScreen: 'Email',
    PhoneNumberScreen: 'Phone number',
    DeleteAccountScreen: 'Delete account',
    VerifyPhoneScreen: 'Verify phone',
    ChangePhoneScreen: 'Change phone',
    PersonalInfoScreen: 'Personal info',
    SexScreen: '',
  },
  Title: {
    App: 'App',
    Account: 'Account',
    Support: 'Support',
    About: 'About',
    Help: 'Help',
    ToS: 'Terms of Service & Privacy',
    Alerts: 'Alerts',
    Messages: 'Messages',
    Matches: 'Matches',
    NoMatches: 'No matches',
    Streetpasses: 'Streetpasses',
    Email: 'Email',
    EmailNotifications: 'Notifications',
    Newsletters: 'Newsletters',
    SignOut: 'Sign out',
    DeleteAccount: 'Delete account',
    NotConnected: 'Not connected...',
    ConnectWithOthers: 'Connect with others',
    Streetpass: 'Streetpass',
    ShowMeOthers: 'Show me profiles of',
    ShowOthersMe: 'Let others see me',
    Discoverable: 'Discoverable',
    AgePreference: 'Age preference',
    Sex: 'Sex',
    Male: 'Male',
    Female: 'Female',
    RatherNotSay: 'Rather not say',
    Men: 'Men',
    Women: 'Women',
    Everybody: 'Everybody',
    IAm: 'I am',
    DOB: 'Date of birth',
    Deleted: 'Deleted',
    VisibleOnMap: 'Visible on map',
    StreetpassLocation: 'Streetpass Location',
    EnterName: 'Enter your name',
    Bio: 'Bio',
    Work: 'Work',
    School: 'School',
    Settings: 'Settings',

    DefaultCamera: 'Default front camera',
    SaveCapturedMedia: 'Save to camera roll',
    Hdr: 'HDR',
    Stabilization: 'Stabilization',
    SoundOff: 'Sound off',
    GridLines: 'Gridlines',
    Timer: 'Timer',
    DefaultCameraDescription: 'Open front camera on launch',
    SaveCapturedMediaDescription: 'Media saves to gallery on capture',
    HdrDescription: 'Increase dynamic range of image',
    StabilizationDescription: 'Reduce shaking in video',
    SoundOffDescription: 'Disable mic when recording video',
    GridLinesDescription: 'Display grid guidelines',
    TimerDescription: 'second timer before capture',
  },
  Copywrite: {
    NotFound: 'Nothing to see...',
    StreetpassDescription: 'See profiles of people nearby and everyone you pass throughout the day.',
    DiscoverableDescription: 'When Discoverable is off, you can still Streetpass others but they will not see you.',
    StreetpassLocationDescription: 'When Streetpass Location is turned on, you and your matches will be able to see the location where you Streetpassed on the map.',
    Bio: 'Say something about yourself',
    Work: 'What you do for work',
    School: 'Where did you graduate',

    DiscardMedia: ['Discard media?', 'You will lose any changes made.'],
    CameraRequired: ['Camera required', 'Please allow access to your Camera in app settings.'],
    MicrophoneRequired: ['Microphone required', 'Please allow access to your Microphone in app settings.'],
    PhotosRequired: ['Photos required', 'Please allow access to Photos in app settings.'],
    EmailRequired: ['Email required', 'Please add your email.'],
    NotificationsRequired: ['Notifications required', 'Please enable Notifications in app settings.'],
    AlwaysLocationRequired: ['Always On Location Required', 'Please enable Always On Location in app settings to use Streetpass.'],
    DeleteAccount: ['Delete account?', 'This cannot be undone.'],
    VideoLength: ['Video length too long', `Video uploads cannot exceed ${InputLimits.VideoLengthMax}s.`],
  },
  Button: {
    Save: 'Save',
    Remove: 'Remove',
    Block: 'Block',
    Unblock: 'Unblock',
    Report: 'Report',
    Delete: 'Delete',
    Next: 'Next',
    Continue: 'Continue',
    Verify: 'Verify',
    SendPin: 'Send pin',
    PinSent: 'Pin sent',
    DeleteAccount: 'Delete account',
    Mute: 'Mute',
    Unmute: 'Unmute',
    Done: 'Done',
    Cancel: 'Cancel',
    Discard: 'Discard',
    Ok: 'Ok',
    No: 'Not now',
    Enable: 'Enable',
    Unmatch: 'Unmatch',
  },
  Time: {
    Year: 'year',
    Years: 'years',
    Month: 'month',
    Months: 'months',
    Week: 'week',
    Weeks: 'weeks',
    Day: 'day',
    Days: 'days',
    Hour: 'hour',
    Hours: 'hours',
    Minute: 'minute',
    Minutes: 'mins',
    Ago: 'ago',
    Now: 'just now',
  },
  PushNotification: {
    messages: '',
    matches: '',
    streetpasses: '',
  },
}

export default Locale
