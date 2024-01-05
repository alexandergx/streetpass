import { IGetStreetPassesRes } from '../../api/streetpass'
import { IMedia } from './UserReducer'

export interface IStreetpass {
  userId: string
  name: string
  bio: string
  work: string
  school: string
  age: number
  sex?: boolean
  media: Array<IMedia>
  streetpassDate: Date
}

export interface IStreetpassStore {
  streetpasses: Array<IStreetpass> | null,
  count: number,
  error: boolean,
}

const INITIAL_STATE: IStreetpassStore = {
  streetpasses: null,
  count: 0,
  error: false,
}


export enum StreetpassActions {
  Init = 'INIT_STREETPASS',
  SetStreetpasses = 'SET_STREETPASSES',
  SetStreetpass = 'SET_STREETPASS',
  StreetpassError = 'STREETPASS_ERROR',
}

type StreetpassAction =
  | { type: StreetpassActions.Init, }
  | { type: StreetpassActions.SetStreetpasses, payload: IGetStreetPassesRes, }
  | { type: StreetpassActions.SetStreetpass, }
  | { type: StreetpassActions.StreetpassError, }

const streetpassStore = (state = INITIAL_STATE as IStreetpassStore, action: StreetpassAction) => {
  switch (action.type) {
    case StreetpassActions.Init:
      return INITIAL_STATE
    case StreetpassActions.SetStreetpasses:
      return {
        ...state,
        streetpasses: action.payload.length ? action.payload : null,
        count: 0,
      }
    case StreetpassActions.SetStreetpass:
      return {
        ...state,
        count: state.count + 1,
      }
    case StreetpassActions.StreetpassError:
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}

export default streetpassStore
