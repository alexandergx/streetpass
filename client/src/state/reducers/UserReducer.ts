import { InputLimits, } from '../../utils/constants'

export interface IStreetPassPreferences {
  discoverable: boolean,
  location: boolean,
  sex: boolean | null,
  age: [number, number],
}

export interface INotificationPreferences {
  messages: boolean,
  matches: boolean,
  streetPasses: boolean,
  emails: boolean,
  newsletters: boolean,
}

export interface IPrivacyPreferences {
  //
}

export interface IUser {
  userId: string,
  phoneNumber: string,
  countryCode: string,
  email: string,
  name: string,
  bio: string | null,
  dob: Date | null,
  sex: boolean | null,
  streetPass: boolean,
  streetPassPreferences: IStreetPassPreferences,
  notificationPreferences: INotificationPreferences,
  privacyPreferences: IPrivacyPreferences,
  media: Array<{
    image?: string,
    video?: string,
  }>,
}

export interface IUserStore {
  signedIn: boolean,
  user: IUser,
}

export enum UserActions {
  Init = 'INIT',
}

type UserAction =
  | { type: UserActions.Init, }

const INITIAL_STATE: IUserStore = {
  signedIn: false,
  user: {
    userId: '',
    phoneNumber: '',
    countryCode: '',
    email: '',
    name: '',
    bio: '',
    dob: null,
    sex: null,
    streetPass: true,
    streetPassPreferences: {
      discoverable: true,
      location: true,
      sex: null,
      age: [InputLimits.StreetPassAgeMin, InputLimits.StreetPassAgeMax],
    },
    notificationPreferences: {
      messages: true,
      matches: true,
      streetPasses: true,
      emails: true,
      newsletters: true,
    },
    privacyPreferences: {
      //
    },
    media: [],
  },
}

const userStore = (state = INITIAL_STATE as IUserStore, action: UserAction) => {
  switch (action.type) {
    case UserActions.Init:
      return INITIAL_STATE
    default:
      return state
  }
}

export default userStore
