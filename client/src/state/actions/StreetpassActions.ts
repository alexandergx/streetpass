import { StreetpassActions } from '../reducers/StreetpassReducer'
import { IGetStreetPassesRes, getStreetpasses, } from '../../api/streetpass'

export function initStreetpass() {
  return {
    type: StreetpassActions.Init,
  }
}

export function setStreetpasses() {
  return async (dispatch: any) => {
    try {
      const result = await getStreetpasses()
      return dispatch({
        type: StreetpassActions.SetStreetpasses,
        payload: result as IGetStreetPassesRes,
      })
    } catch (e) {
      return dispatch({
        type: StreetpassActions.StreetpassError,
      })
    }
  }
}

export function setStreetpass() {
  return {
    type: StreetpassActions.SetStreetpass,
  }
}
