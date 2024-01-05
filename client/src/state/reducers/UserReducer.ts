import { IGetUserRes } from '../../api/user'
import { ISignInErrors, InputLimits, } from '../../utils/constants'
import { ISetPhoneNumber, ISetSortMedia, ISetUpdateUser, } from '../actions/UserActions'

export interface IStreetpassPreferences {
  discoverable: boolean,
  location: boolean,
  sex: boolean | null,
  age: [number, number],
}

export interface INotificationPreferences {
  messages: boolean,
  matches: boolean,
  streetpasses: boolean,
  emails: boolean,
  newsletters: boolean,
}

export interface IMedia {
  mediaId: string | null,
  image?: string,
  video?: string,
  thumbnail?: string,
}

export interface IUserProfile {
  userId: string,
  name: string,
  bio: string,
  work: string,
  school: string,
  sex: boolean,
  age: number,
  media: Array<IMedia>,
}

export interface IUser {
  userId: string,
  phoneNumber: string,
  countryCode: string,
  email: string,
  name: string,
  bio: string | null,
  work: string | null,
  school: string | null,
  dob: Date | null,
  sex: boolean | null,
  streetpass: boolean,
  streetpassPreferences: IStreetpassPreferences,
  notificationPreferences: INotificationPreferences,
  media: Array<IMedia>,
  joinDate: Date | null,
}

export interface IUserStore {
  signedIn: boolean,
  user: IUser,
  error: boolean,
}

const INITIAL_STATE: IUserStore = {
  signedIn: false,
  user: {
    userId: '',
    phoneNumber: '',
    countryCode: '',
    email: '',
    name: '',
    bio: '',
    work: '',
    school: '',
    dob: null,
    sex: null,
    streetpass: true,
    streetpassPreferences: {
      discoverable: true,
      location: true,
      sex: null,
      age: [InputLimits.StreetpassAgeMin, InputLimits.StreetpassAgeMax],
    },
    notificationPreferences: {
      messages: true,
      matches: true,
      streetpasses: true,
      emails: true,
      newsletters: true,
    },
    media: [],
    joinDate: null,
  },
  error: false,
}

export enum UserActions {
  Init = 'INIT_USER',
  SignIn = 'SIGN_IN',
  SetPhoneNumber = 'SET_PHONE_NUMBER',
  SetUser = 'SET_USER',
  SetUpdateUser = 'SET_UPDATE_USER',
  SetSortMedia = 'SET_SORT_MEDIA',
  UserError = 'USER_ERROR',
}

type UserAction =
  | { type: UserActions.Init, }
  | { type: UserActions.SignIn, payload: { user: IUser, code: ISignInErrors | null, }, }
  | { type: UserActions.SetPhoneNumber, payload: ISetPhoneNumber, }
  | { type: UserActions.SetUser, payload: IGetUserRes, }
  | { type: UserActions.SetUpdateUser, payload: ISetUpdateUser, }
  | { type: UserActions.SetSortMedia, payload: ISetSortMedia, }
  | { type: UserActions.UserError, }

const userStore = (state = INITIAL_STATE as IUserStore, action: UserAction) => {
  switch (action.type) {
    case UserActions.Init:
      return INITIAL_STATE
    case UserActions.SignIn:
      return {
        ...state,
        signedIn: !action.payload.code ? true : state.signedIn,
        user: action.payload.user,
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
    case UserActions.SetUser:
      return {
        ...state,
        signedIn: true,
        user: {
          ...state.user,
          ...action.payload,
        }
      }
    case UserActions.SetUpdateUser:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
          streetpassPreferences: {
            ...state.user.streetpassPreferences,
            ...action.payload.streetpassPreferences,
          },
          notificationPreferences: {
            ...state.user.notificationPreferences,
            ...action.payload.notificationPreferences,
          },
        }
      }
    case UserActions.SetSortMedia:
      return {
        ...state,
        user: {
          ...state.user,
          media: action.payload,
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
