import { MMKVLoader } from 'react-native-mmkv-storage'
import { LocalStorage, SystemStore } from '../../utils/constants'
import { Themes } from '../../utils/themes'
import { SystemActions } from '../reducers/SystemReducer'
import { Locales } from '../../utils/locale'

const MMKV = new MMKVLoader().withInstanceID(LocalStorage.SystemStore).initialize()

export type ISetLanguage = Locales
export function setLanguage(locale: ISetLanguage) {
  return {
    // type: SystemActions.SetLanguage,
    payload: locale,
  }
}

export type ISetColors = keyof typeof Themes
export function setColors(type: ISetColors) {
  return {
    type: SystemActions.SetColors,
    payload: type,
  }
}

export type ISaveColors = keyof typeof Themes
export function saveColors(type: ISaveColors) {
  MMKV.setString(SystemStore.Theme, type)
  return {
    type: SystemActions.SaveColors,
    payload: type,
  }
}
