// import { InputLimits, } from '../../utils/constants'

export interface IMatch {
  userId: string,
  matchId: string,
  name: string,
  age: number,
  sex: boolean,
  bio: string,
  date: Date,
  seen: boolean,
  media: Array<{
    image?: string,
    video?: string,
  }>
}

export interface IMatchesStore {
  matches: Array<IMatch> | null,
}

export enum MatchesActions {
  Init = 'INIT',
}

type MatchesAction =
  | { type: MatchesActions.Init, }

const INITIAL_STATE: IMatchesStore = {
  matches: null,
}

const matchesStore = (state = INITIAL_STATE as IMatchesStore, action: MatchesAction) => {
  switch (action.type) {
    case MatchesActions.Init:
      return INITIAL_STATE
    default:
      return state
  }
}

export default matchesStore
