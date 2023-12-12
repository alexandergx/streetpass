import { apiRequest, GET_USER, IGetUserQuery, ISendPinMutation, ISignInMutation, ISortMediaMutation, IUpdateUserMutation, IVerifyPhoneNumberMutation, SEND_PIN, SIGN_IN, SORT_MEDIA, UPDATE_USER, VERIFY_PHONE_NUMBER, } from '.'
import { IUser, IUserProfile, } from '../state/reducers/UserReducer'
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

export type IGetUserReq = IGetUserQuery
export type IGetUserRes = IUserProfile
export const getUser = async (input: IGetUserReq): Promise<IGetUserRes> => {
  try {
    const { data, } = await apiRequest(GET_USER(input))
    return data.getUser
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

export type IUSortMediaReq = ISortMediaMutation
export type ISortMediaRes = boolean
export const sortMedia = async (input: IUSortMediaReq): Promise<ISortMediaRes> => {
  try {
    const { data, } = await apiRequest(SORT_MEDIA(input))
    return data.sortMedia
  } catch(e) {
    throw new Error
  }
}
