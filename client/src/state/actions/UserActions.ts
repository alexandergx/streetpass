import { MMKVLoader } from 'react-native-mmkv-storage'
import { ISendPinReq, ISignInReq, IUpdateUserReq, sendPin, signIn, updateUser, } from '../../api/user'
import { AuthStore, ISignInErrors, LocalStorage } from '../../utils/constants'
import { IUser, UserActions } from '../reducers/UserReducer'

const MMKV = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()

export function setSignOut() {
  MMKV.removeItem(AuthStore.AccessToken)
  MMKV.removeItem(AuthStore.RefreshToken)
  return {
    type: UserActions.Init,
  }
}

export interface ISetSignIn {
  input: ISignInReq,
  callback: (params: ISignInErrors | null) => void,
}
export function setSignIn({ input, callback, }: ISetSignIn) {
  return async (dispatch: any) => {
    try {
      const { user, code, } = await signIn({ ...input, })
      callback(code)
      return dispatch({
        type: UserActions.SignIn,
        payload: user as IUser,
      })
    } catch (e) {
      return dispatch({
        type: UserActions.UserError,
      })
    }
  }
}

export type ISetPhoneNumber = ISendPinReq
export function setPhoneNumber(input: ISetPhoneNumber) {
  return async (dispatch: any) => {
    try {
      const sendPinResult = await sendPin(input)
      return dispatch({
        type: UserActions.SetPhoneNumber,
        payload: input,
      })
    } catch (e) {
      return dispatch({
        type: UserActions.UserError,
      })
    }
  }
}

export type ISetUpdateUser = IUpdateUserReq
export function setUpdateUser(input: ISetUpdateUser) {
  return async (dispatch: any) => {
    try {
      const updateUserReults = await updateUser(input)
      return dispatch({
        type: UserActions.SetUpdateUser,
        payload: input,
      })
    } catch (e) {
      return dispatch({
        type: UserActions.UserError,
      })
    }
  }
}
