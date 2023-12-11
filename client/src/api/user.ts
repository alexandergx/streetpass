import { apiRequest, ISendPinMutation, ISignInMutation, IUpdateUserMutation, IVerifyPhoneNumberMutation, SEND_PIN, SIGN_IN, UPDATE_USER, VERIFY_PHONE_NUMBER, } from '.'
import { IUser, } from '../state/reducers/UserReducer'
import { ISignInErrors } from '../utils/constants'
import { Locales } from '../utils/locale'

export type ISignInReq = ISignInMutation
export interface ISignInRes {
  user: IUser,
  code: ISignInErrors | null,
}
export const signIn = async (input: ISignInReq): Promise<ISignInRes> => {
  try {
    const { data, } = await apiRequest(SIGN_IN(input))
    if (!data.signIn) throw new Error
    return data.signIn
  } catch(e) {
    throw new Error
  }
}

export type ISendPinReq = ISendPinMutation
export type ISendPinRes = boolean
export const sendPin = async (input: ISendPinReq): Promise<ISendPinRes> => {
  try {
    const { data, } = await apiRequest(SEND_PIN(input))
    return data.sendPin
  } catch(e) {
    throw new Error
  }
}

export type IVerifyPhoneNumberReq = IVerifyPhoneNumberMutation
export type IVerifyPhoneNumberRes = boolean
export const verifyPhoneNumber = async (input: IVerifyPhoneNumberReq): Promise<IVerifyPhoneNumberRes> => {
  try {
    const { data, } = await apiRequest(VERIFY_PHONE_NUMBER(input))
    return data.verifyPhoneNumber
  } catch(e) {
    throw new Error
  }
}

export type IUpdateUserReq = IUpdateUserMutation
export type IUpdateUserRes = boolean
export const updateUser = async (input: IUpdateUserReq): Promise<IUpdateUserRes> => {
  try {
    const { data, } = await apiRequest(UPDATE_USER(input))
    return data.updateUser
  } catch(e) {
    throw new Error
  }
}
