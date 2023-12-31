import { MMKVLoader } from 'react-native-mmkv-storage'
import { IGetUserReq, IGetUserRes, ISendPinReq, ISignInReq, IUpdateUserReq, getUser, sendPin, signIn, sortMedia, updateUser, } from '../../api/user'
import { AuthStore, ISignInErrors, LocalStorage } from '../../utils/constants'
import { IUser, UserActions } from '../reducers/UserReducer'
import { IUploadMedia } from '../../components/editProfileModal'

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
        payload: { user: user as IUser, code: code as ISignInErrors, },
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
      await sendPin(input)
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

export function setUser() {
  return async (dispatch: any) => {
    try {
      const result = await getUser({})
      return dispatch({
        type: UserActions.SetUser,
        payload: result as IGetUserRes,
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
      await updateUser(input)
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

export type ISetSortMedia = Array<IUploadMedia>
export function setSortMedia(input: ISetSortMedia) {
  return async (dispatch: any) => {
    try {
      await sortMedia({ mediaIds: input.map(media => media.mediaId), })
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
