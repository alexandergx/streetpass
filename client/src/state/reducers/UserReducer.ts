import { ISignInErrors, InputLimits, } from '../../utils/constants'
import { ISetPhoneNumber, ISetUpdateUser, } from '../actions/UserActions'

export interface IStreetPassPreferences {
  discoverable?: boolean,
  location?: boolean,
  sex?: boolean | null,
  age?: [number, number],
}

export interface INotificationPreferences {
  messages?: boolean,
  matches?: boolean,
  streetPasses?: boolean,
  emails?: boolean,
  newsletters?: boolean,
}

export interface IMedia {
  image?: string,
  video?: string,
  thumbnail: string,
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
  media: Array<IMedia>,
}

export interface IUserStore {
  signedIn: boolean,
  user: IUser,
  error: boolean,
}

export enum UserActions {
  Init = 'INIT',
  SignIn = 'SIGN_IN',
  SetPhoneNumber = 'SET_PHONE_NUMBER',
  SetUpdateUser = 'SET_UPDATE_USER',
  UserError = 'USER_ERROR',
}

type UserAction =
  | { type: UserActions.Init, }
  | { type: UserActions.SignIn, payload: IUser, }
  | { type: UserActions.SetPhoneNumber, payload: ISetPhoneNumber, }
  | { type: UserActions.SetUpdateUser, payload: ISetUpdateUser, }
  | { type: UserActions.UserError, }

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
    media: [],
  },
  error: false,
}

const userStore = (state = INITIAL_STATE as IUserStore, action: UserAction) => {
  switch (action.type) {
    case UserActions.Init:
      return INITIAL_STATE
    case UserActions.SignIn:
      return {
        ...state,
        user: action.payload,
      }
    case UserActions.SetPhoneNumber:
      return {
        ...state,
        user: {
          ...state.user,
          phoneNumber: action.payload.phoneNumber,
          countryCode: action.payload.countryCode,
        },
      }
    case UserActions.SetUpdateUser:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          streetPassPreferences: {
            ...state.user.streetPassPreferences,
            ...action.payload.streetPassPreferences,
          },
          notificationPreferences: {
            ...state.user.notificationPreferences,
            ...action.payload.notificationPreferences,
          },
        }
      }
    case UserActions.UserError:
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}

export default userStore
