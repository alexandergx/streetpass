import { Themes } from '../../utils/themes'
import { MMKVLoader, } from 'react-native-mmkv-storage'
import { LocalStorage, SystemStore } from '../../utils/constants'
import { Platform, NativeModules } from 'react-native'
import { Locales } from '../../utils/locale'

export interface ISystemStore {
  Theme: string,
  Locale: Locales,
  Colors: any,
  Fonts: any,
  Spacing: any,
}

const MMKVSystem = new MMKVLoader().withInstanceID(LocalStorage.SystemStore).initialize()
const savedTheme = MMKVSystem.getString(SystemStore.Theme) as keyof typeof Themes
const theme = savedTheme && Object.keys(Themes).includes(savedTheme) ? savedTheme : Object.keys(Themes)[0] as keyof typeof Themes
const locale = (Platform.OS === 'ios'
  ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0]
  : NativeModules.I18nManager.localeIdentifier).split('_')[0]

const INITIAL_STATE: ISystemStore = {
  Theme: theme,
  Locale: Object.values(Locales).includes(locale) ? locale : Locales.English,
  Colors: {
    ...Themes[theme],
    safeLight: 'rgba(255,255,255,0.4)',
    safeLighter: 'rgba(255,255,255,0.85)',
    safeLightest: 'rgba(255,255,255,1)',
    safeDark: 'rgba(0,0,0,0.3)',
    safeDarker: 'rgba(0,0,0,0.5)',
    safeDarkest: 'rgba(0,0,0,0.8)',
    safeLightBlur: 'light',
    safeLighterBlur: 'xlight',
    safeLightestBlur: 'chromeMaterialLight',
    safeDarkBlur: 'dark',
    safeDarkerBlur: 'thickMaterialDark',
    safeDarkestBlur: 'materialDark',
    neutralBlur: 'ultraThinMaterial',
    safeLightBackground: 'rgba(255,255,255,0.2)',
    safeLighterBackground: 'rgba(255,255,255,0.5)',
    safeLightestBackground: 'rgba(255,255,255,0.8)',
    safeDarkBackground: 'rgba(0,0,0,0.4)',
    safeDarkerBackground: 'rgba(0,0,0,0.5)',
    safeDarkestBackground: 'rgba(0,0,0,0.7)',
    lightGrey: 'rgba(99,99,102,0.5)',
    middleGrey: 'rgba(128,128,128,0.7)',
    lightRed: 'rgba(255,80,80,1)',
    red: 'rgba(245,10,10,0.8)',
    lightBlue: 'rgba(10,132,255,1)',
    blue: 'rgba(0,64,221,0.9)',
    darkBlue: 'rgba(0,0,256,1)',
    green: 'rgba(40,240,40,0.9)',
    darkGreen: 'rgba(75,181,67,0.9)',
    black: 'rgba(0,0,0,0.9)',
    gold: 'rgba(255,165,0,1)',
    transparent: '(0,0,0,0)',
    activeOpacity: 0.6,
  },
  Fonts: {
    xs: 8,
    sm: 12,
    md: 15,
    lg: 18,
    xl: 24,
    xxl: 28,
    featherWeight: '200',
    lightWeight: '300',
    welterWeight: '400',
    middleWeight: '500',
    cruiserWeight: '600',
    heavyWeight: '700',
  },
  Spacing: {
    screenPadding: 16,
  },
}

export enum SystemActions {
  SetColors = 'SET_COLORS',
  SaveColors =  'SAVE_COLORS',
}

type ThemeAction =
  | { type: SystemActions.SetColors, payload: keyof typeof Themes, }
  | { type: SystemActions.SaveColors, payload: keyof typeof Themes, }

const systemStore = (state = INITIAL_STATE, action: ThemeAction) => {
  switch (action.type) {
    case SystemActions.SetColors:
      return {
        ...state,
        Colors: {
          ...state.Colors,
          ...Themes[action.payload],
        }
      }
    case SystemActions.SaveColors:
      return {
        ...state,
        Theme: action.payload,
      }
    default:
      return state
  }
}

export default systemStore
