import en from './locales/en'
import fr from './locales/fr'
import es from './locales/es'
import de from './locales/de'
import ru from './locales/ru'

export enum Locales {
  'English' = 'en',
  'Français' = 'fr',
  'Español' = 'es',
  'Deutsch' = 'de',
  'Русский' = 'ru',
}

export const Lit: ILit = {
  en: {...en},
  fr: {...fr},
  es: {...es},
  de: {...de},
  ru: {...ru},
}

export type ILit = { [K in Locales]: ILocale }
export type ILocale = {
  Title: {
    NotConnected: string,
  },
  Time: {
    Year: string,
    Years: string,
    Month: string,
    Months: string,
    Week: string,
    Weeks: string,
    Day: string,
    Days: string,
    Hour: string,
    Hours: string,
    Minute: string,
    Minutes: string,
    Ago: string,
    Now: string,
  },
  PushNotification: {
    messages: string,
    matches: string,
    streetPasses: string,
  },
}
