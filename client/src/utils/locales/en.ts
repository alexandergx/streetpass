import * as PackageJson from '../../../package.json'
import { InputLimits } from '../constants'
import { ILocale } from '../locale'

const Locale: ILocale = {
  Title: {
    NotConnected: 'Not connected...',
  },
  Time: {
    Year: 'year',
    Years: 'years',
    Month: 'month',
    Months: 'months',
    Week: 'week',
    Weeks: 'weeks',
    Day: 'day',
    Days: 'days',
    Hour: 'hour',
    Hours: 'hours',
    Minute: 'minute',
    Minutes: 'mins',
    Ago: 'ago',
    Now: 'just now',
  },
  PushNotification: {
    messages: '',
    matches: '',
    streetPasses: '',
  },
}

export default Locale
