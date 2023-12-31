import { GET_STREETPASSES, IStreetpassMutation, STREETPASS, apiRequest, } from '.'
import { IStreetpass, } from '../state/reducers/StreetpassReducer'

export type IStreetpassReq = IStreetpassMutation
export type IStreetpassRes = boolean
export const streetpass = async (input: IStreetpassReq): Promise<IStreetpassRes> => {
  try {
    const { data, } = await apiRequest(STREETPASS(input))
    return data.streetpass
  } catch(e) {
    throw new Error
  }
}

export type IGetStreetPassesRes = Array<IStreetpass>
export const getStreetpasses = async (): Promise<IGetStreetPassesRes> => {
  try {
    const { data, } = await apiRequest(GET_STREETPASSES())
    return data.getStreetpasses
  } catch(e) {
    throw new Error
  }
}
