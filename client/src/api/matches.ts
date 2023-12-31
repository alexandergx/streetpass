import { GET_MATCHES, IGetMatchesQuery, IMatchMutation, ISeenMatchMutation, IUnmatchMutation, MATCH, SEEN_MATCH, UNMATCH, apiRequest, } from '.'
import { IMatch } from '../state/reducers/MatchesReducer'

export type IMatchReq = IMatchMutation
export type IMatchRes = boolean
export const match = async (input: IMatchReq): Promise<IMatchRes> => {
  try {
    const { data, } = await apiRequest(MATCH(input))
    return data.match
  } catch(e) {
    throw new Error
  }
}

export type IGetMatchesReq = IGetMatchesQuery
export interface IGetMatchesRes {
  matches: Array<IMatch>,
  continue: boolean,
}
export const getMatches = async (input: IGetMatchesReq): Promise<IGetMatchesRes> => {
  try {
    const { data, } = await apiRequest(GET_MATCHES(input))
    return data.getMatches
  } catch(e) {
    throw new Error
  }
}

export type IUnmatchReq = IUnmatchMutation
export type IUnmatchRes = boolean
export const unmatch = async (input: IUnmatchReq): Promise<IUnmatchRes> => {
  try {
    const { data, } = await apiRequest(UNMATCH(input))
    return data.unmatch
  } catch(e) {
    throw new Error
  }
}

export type ISeenMatchReq = ISeenMatchMutation
export type ISeenMatchRes = boolean
export const seenMatch = async (input: ISeenMatchReq): Promise<ISeenMatchRes> => {
  try {
    const { data, } = await apiRequest(SEEN_MATCH(input))
    return data.seenMatch
  } catch(e) {
    throw new Error
  }
}
