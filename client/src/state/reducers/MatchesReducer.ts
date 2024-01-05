import { IGetMatchesRes, } from '../../api/matches'
import { ISetMatch, ISetSeenMatch, IUnsetMatch } from '../actions/MatchesActions'
import { IMedia } from './UserReducer'

export interface IMatch {
  userId: string
  name: string
  bio: string
  work: string
  school: string
  age: number
  sex?: boolean
  media: Array<IMedia>
  seen: boolean
  streetpassDate: Date
  matchDate: Date
  unmatch: boolean
}

export interface IMatchesStore {
  matches: Array<IMatch> | null,
  continue: boolean,
  error: boolean,
}

const INITIAL_STATE: IMatchesStore = {
  matches: null,
  continue: true,
  error: false,
}


export enum MatchesActions {
  Init = 'INIT_MATCHES',
  SetMatches = 'SET_MATCHES',
  SetMatch = 'SET_MATCH',
  UnsetMatch = 'UNSET_MATCH',
  SetSeenMatch = 'SET_SEEN_MATCH',
  MatchesError = 'MATCHES_ERROR',
}

type MatchesAction =
  | { type: MatchesActions.Init, }
  | { type: MatchesActions.SetMatches, payload: IGetMatchesRes, }
  | { type: MatchesActions.SetMatch, payload: ISetMatch, }
  | { type: MatchesActions.UnsetMatch, payload: IUnsetMatch, }
  | { type: MatchesActions.SetSeenMatch, payload: ISetSeenMatch, }
  | { type: MatchesActions.MatchesError, }

const matchesStore = (state = INITIAL_STATE as IMatchesStore, action: MatchesAction) => {
  switch (action.type) {
    case MatchesActions.Init:
      return INITIAL_STATE
    case MatchesActions.SetMatches:
      return {
        ...state,
        matches: state.matches ? [...state.matches, ...action.payload.matches] : action.payload.matches,
        continue: action.payload.continue,
      }
    case MatchesActions.SetMatch:
      return {
        ...state,
        matches: state.matches
          ? action.payload.unmatch ? state.matches.filter(match => match.userId !== action.payload.userId) : [action.payload, ...state.matches]
          : state.matches,
      }
    case MatchesActions.UnsetMatch:
      return {
        ...state,
        matches: state.matches ? state.matches.filter(match => match.userId !== action.payload.userId) : state.matches,
      }
    case MatchesActions.SetSeenMatch:
      return {
        ...state,
        matches: state.matches
          ? state.matches.map(match => match.userId === action.payload.userId ? { ...match, seen: true, } : match)
          : state.matches,
      }
    case MatchesActions.MatchesError:
      return {
        ...state,
        error: true,
      }
    default:
      return state
  }
}

export default matchesStore
