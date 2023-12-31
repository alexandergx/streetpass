import { StreetpassActions } from '../reducers/StreetpassReducer'
import { IMatch, MatchesActions } from '../reducers/MatchesReducer'
import { IGetMatchesReq, IGetMatchesRes, ISeenMatchReq, IUnmatchReq, getMatches, seenMatch, unmatch } from '../../api/matches'

export function initMatches() { return { type: MatchesActions.Init, } }

export type ISetMatches = IGetMatchesReq
export function setMatches(input: ISetMatches) {
  return async (dispatch: any) => {
    try {
      const result = await getMatches(input)
      return dispatch({
        type: MatchesActions.SetMatches,
        payload: result as IGetMatchesRes,
      })
    } catch (e) {
      return dispatch({
        type: MatchesActions.MatchesError,
      })
    }
  }
}

export type ISetMatch = IMatch
export function setMatch(input: ISetMatch) {
  return {
    type: MatchesActions.SetMatch,
    payload: input,
  }
}

export type IUnsetMatch = IUnmatchReq
export function unsetMatch(input: IUnsetMatch) {
  return async (dispatch: any) => {
    try {
      unmatch(input)
      return dispatch({
        type: MatchesActions.UnsetMatch,
        payload: input,
      })
    } catch (e) {
      return dispatch({
        type: MatchesActions.MatchesError,
      })
    }
  }
}

export type ISetSeenMatch = ISeenMatchReq
export function setSeenMatch(input: ISetSeenMatch) {
  return async (dispatch: any) => {
    try {
      seenMatch(input)
      return dispatch({
        type: MatchesActions.SetSeenMatch,
        payload: input,
      })
    } catch (e) {
      return dispatch({
        type: MatchesActions.MatchesError,
      })
    }
  }
}
