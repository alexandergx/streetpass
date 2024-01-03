import { Lit, Locales } from './locale'

export const validateUsername = (text: string) => !/[^A-Za-z0-9_]/g.test(text)
export const validatePassword = (text: string) => !/^(?=.*[0-9])(?=.*[a-zA-Z])(?=\S+$).{8,64}$/i.test(text)
export const validateEmail = (text: string) => text.toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
export const validatePhoneNumber = (text: string) => /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(text)

export const truncateString = (str: string, length: number, subLength: number) => {
  if (str.length > length) return str.substring(0, subLength) + '...'
  else return str
}

// export const formatMultiline = (text: string) => (text.replace(/(\r?\n|\r){2,}/g, '\n').replace(/^\n+|\n+$/g, '').match(/(?:[^\n]*\n?){0,5}[^\n]*/) ?? [''])[0].replace(/\r?\n|\r/g, '\\n')
// export const formatMultiline = (text: string) => {
//   let result = text.replace(/(\r?\n|\r){3,}/g, '\n').replace(/^\n+|\n+$/g, '')
//   let firstPart = (result.match(/(?:[^\n]*\n?){0,5}[^\n]*/) ?? [''])[0]
//   let restPart = result.substring(firstPart.length)
//   firstPart = firstPart.replace(/\r?\n|\r/g, '\\n')
//   restPart = restPart.replace(/\r?\n|\r/g, ' ')
//   return firstPart + restPart
// }
export const formatMultiline = (text: string) => {
  let lines = text.replace(/\r\n?/g, '\n').split('\n')
  lines = lines.map(line => line.trim().replace(/\\/g, '\\\\').replace(/"/g, '\\"'))
  let result
  if (lines.length > 6) {
    const firstSixLines = lines.slice(0, 6).join('\\n')
    const remainingLines = lines.slice(6).join(' ').trim()
    result = firstSixLines + (remainingLines ? ' ' + remainingLines : '')
  } else result = lines.join('\\n')
  return result
}

export const formatDate = (dateString: Date | string, time = false) => {
  const date = new Date(dateString)
  const month = date.getMonth() + 1
  const day = date.getDate()
  const year = date.getFullYear()
  if (time) {
    let hour = date.getHours()
    const minute = date.getMinutes().toString().padStart(2, '0')
    const meridiem = hour >= 12 ? 'pm' : 'am'
    hour = hour % 12
    hour = hour === 0 ? 12 : hour
    if (new Date().toDateString() !== date.toDateString()) return `${month}/${day}/${year} ${hour}:${minute}${meridiem}`
    return `${hour}:${minute}${meridiem}`
  }
  return `${month}/${day}/${year}`
}

export const timePassedSince = (dateString: Date | string | null, locale: Locales) => {
  if (!dateString) return null
  const date: any = new Date(dateString)
  const now: any = new Date()
  const milliseconds = now - date
  const minutes = milliseconds / 60000
  const hours = minutes / 60
  const days = hours / 24
  const weeks = days / 7
  const months = days / 30.44
  const years = days / 365.25
  if (years >= 1) {
    return `${Math.floor(years)} ${Math.floor(years) === 1 ? Lit[locale].Time.Year : Lit[locale].Time.Years} ${Lit[locale].Time.Ago}`
  } else if (months >= 1) {
    return `${Math.floor(months)} ${Math.floor(months) === 1 ? Lit[locale].Time.Month : Lit[locale].Time.Months} ${Lit[locale].Time.Ago}`
  } else if (weeks >= 1) {
    return `${Math.floor(weeks)} ${Math.floor(weeks) === 1 ? Lit[locale].Time.Week : Lit[locale].Time.Weeks} ${Lit[locale].Time.Ago}`
  } else if (days >= 1) {
    return `${Math.floor(days)} ${Math.floor(days) === 1 ? Lit[locale].Time.Day : Lit[locale].Time.Days} ${Lit[locale].Time.Ago}`
  } else if (hours >= 1) {
    return `${Math.floor(hours)} ${Math.floor(hours) === 1 ? Lit[locale].Time.Hour : Lit[locale].Time.Hours} ${Lit[locale].Time.Ago}`
  } else if (minutes >= 1) {
    return `${Math.floor(minutes)} ${Math.floor(minutes) === 1 ? Lit[locale].Time.Minute : Lit[locale].Time.Minutes} ${Lit[locale].Time.Ago}`
  } else {
    return Lit[locale].Time.Now
  }
}

export const getAge = (inputDate: Date | string | null) => {
  if (!inputDate) return null
  const dob = new Date(inputDate)
  const currentDate = new Date()
  const currentYear = currentDate.getFullYear()
  const currentMonth = currentDate.getMonth()
  const currentDay = currentDate.getDate()
  const birthYear = dob.getFullYear()
  const birthMonth = dob.getMonth()
  const birthDay = dob.getDate()
  let age = currentYear - birthYear
  if (currentMonth < birthMonth || (currentMonth === birthMonth && currentDay < birthDay)) age--
  return age
}

export const withinTime = (inputDate1: Date | string, inputDate2: Date | string, timeFrame: number) => {
  const date1 = new Date(inputDate1)
  const date2 = new Date(inputDate2)
  const diffInMilliseconds = Math.abs(date1.getTime() - date2.getTime())
  return diffInMilliseconds <= timeFrame
}

export const getModulus = (contentLength: number, mod: number) => {
  let modulus = 0
  for (let i = 0; i <= contentLength - 1; i++) if (i % mod === 0) modulus = i
  return modulus
}

export const formatNumber = (num: number) => {
  if (num < 1000) {
    return num.toString()
  } else if (num >= 1000 && num < 1000000) {
    return (Math.floor(num / 100) / 10).toFixed(1) + 'k'
  } else if (num >= 1000000 && num < 1000000000) {
    return (Math.floor(num / 100000) / 10).toFixed(1) + 'm'
  } else {
    return '∞'
  }
}

export function filterDuplicates(arr1: Array<any>, arr2: Array<any>, key: string) {
  const arr2Keys = new Set(arr2.map(item => item[key]))
  return [...arr1.filter(item => !arr2Keys.has(item[key])), ...arr2]
}


export function debounce<F extends (...args: any[]) => any>(func: F, wait: number): (...args: Parameters<F>) => void {
  let timeout: ReturnType<typeof setTimeout> | null
  return function (this: ThisType<F>, ...args: Parameters<F>) {
    const context = this
    const later = () => {
      timeout = null
      func.apply(context, args)
    }
    if (timeout !== null) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

export const throttle = <F extends (...args: any[]) => any>(func: F, wait: number): ((...args: Parameters<F>) => void) => {
  let lastCallTime: number | null = null
  return function(this: ThisParameterType<F>, ...args: Parameters<F>) {
    const now = new Date().getTime()
    if (!lastCallTime || (now - lastCallTime) >= wait) {
      lastCallTime = now
      return func.apply(this, args)
    }
  }
}
