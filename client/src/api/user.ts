import { apiRequest, DELETE_ACCOUNT, GET_USER, IGetUserQuery, IRemoveMediaMutation, ISendPinMutation, ISignInMutation, ISortMediaMutation, IUpdateUserMutation, IVerifyPhoneNumberMutation, REGISTER_DEVICE, REMOVE_MEDIA, SEND_PIN, SIGN_IN, SORT_MEDIA, UPDATE_USER, VERIFY_PHONE_NUMBER, } from '.'
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

export interface IRegisterDeviceReq {
  manufacturer: string,
  deviceToken: string,
  unregister?: boolean,
}
export type IRegisterDeviceRes = boolean
export const registerDevice = async ({ manufacturer, deviceToken, unregister, }: IRegisterDeviceReq): Promise<IRegisterDeviceRes> => {
  try {
    const { data, } = await apiRequest(REGISTER_DEVICE({ manufacturer, deviceToken, unregister, }))
    return data.registerDevice
  } catch(e) {
    throw new Error
  }
}

export type IDeleteAccountRes = boolean
export const deleteAccount = async (): Promise<IDeleteAccountRes> => {
  try {
    const { data, } = await apiRequest(DELETE_ACCOUNT())
    return data.deleteAccount
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

export type IRemoveMediaReq = IRemoveMediaMutation
export type IRemoveMediaRes = boolean
export const removeMedia = async (input: IRemoveMediaReq): Promise<IRemoveMediaRes> => {
  try {
    const { data, } = await apiRequest(REMOVE_MEDIA(input))
    return data.removeMedia
  } catch(e) {
    throw new Error
  }
}
