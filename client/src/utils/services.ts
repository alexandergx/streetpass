import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { check, request, PERMISSIONS, RESULTS, } from 'react-native-permissions'
import Contacts from 'react-native-contacts'
import { Alert, Linking, Share, Platform, } from 'react-native'
import SendSMS from 'react-native-sms'
import { AppName, Domain, INotification, NotificationType, PushNotificationMessage, } from './constants'
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'
// import Geolocation from '@react-native-community/geolocation'
import { NetworkInfo, } from 'react-native-network-info'
import { Lit, Locales, } from './locale'
import { ISignInErrors } from './constants'
import { Screens, getActiveScreen } from '../navigation'
import { IChatsStore } from '../state/reducers/ChatsReducer'

export const signInCallback = (navigation: any, code: ISignInErrors | null) => {
  if (!navigation.isReady()) return
  switch(code) {
    case ISignInErrors.VerifyPhoneNumber:
      navigation.navigate(Screens.VerifyPhone)
      break
    case ISignInErrors.IncompleteAccount:
      navigation.navigate(Screens.PersonalInfo)
      break
    case ISignInErrors.IncompletePreferences:
      navigation.navigate(Screens.Sex)
      break
    case ISignInErrors.IncompleteProfile:
      navigation.navigate(Screens.Sex, { editProfile: true, })
      break
    default:
      navigation.navigate(Screens.Streetpass)
  }
}

export const onNotification = async ({ navigation, chatsStore, notification, userInteraction, }: { navigation: any, chatsStore?: IChatsStore, notification: INotification, userInteraction: number, }) => {
  if (userInteraction) {
    switch (notification.type) {
      case NotificationType.Message:
        const chat = chatsStore?.chats ? chatsStore.chats.find(chat => chat.chatId === notification.chatId) : null
        if (chat) navigation.navigate(Screens.Chat, { chat: chat, })
        else navigation.navigate(Screens.Chats)
        break
      case NotificationType.Match:
        navigation.navigate(Screens.Chats)
        return
      case NotificationType.Streetpass:
        navigation.navigate(Screens.Streetpass)
        return
      default:
        break
    }
  } else {
    switch (notification.type) {
      case NotificationType.Message:
        if (chatsStore?.chatKey !== notification.userId && !notification.localNotification && getActiveScreen() !== Screens.Chats) {
          PushNotificationIOS.addNotificationRequest({
            id: AppName,
            title: AppName,
            body: `${PushNotificationMessage[NotificationType.Message]}`,
            userInfo: { data: { ...notification, localNotification: true, }, },
          })
        }
        break
      case NotificationType.Match:
        if (!notification.localNotification && getActiveScreen() !== Screens.Chats) {
          PushNotificationIOS.addNotificationRequest({
            id: AppName,
            title: AppName,
            body: `${PushNotificationMessage[NotificationType.Match]}`,
            userInfo: { data: { ...notification, localNotification: true, }, },
          })
        }
        break
      case NotificationType.Streetpass:
        if (!notification.localNotification && getActiveScreen() !== Screens.Streetpass) {
          PushNotificationIOS.addNotificationRequest({
            id: AppName,
            title: AppName,
            body: `${PushNotificationMessage[NotificationType.Streetpass]}`,
            userInfo: { data: { ...notification, localNotification: true, }, },
          })
        }
        return
      default:
        break
    }
    PushNotificationIOS.getApplicationIconBadgeNumber((badgeCount: number) => {
      // TODO - set badge count
    })
  }
}

export async function requestPushNotifications(onDeviceTokenReceived: (deviceToken: string) => void, callback: (result: boolean) => void = () => null) {
  try {
    PushNotificationIOS.addEventListener('register', (deviceToken) => {
      onDeviceTokenReceived(deviceToken)
      PushNotificationIOS.removeEventListener('register')
    })
    PushNotificationIOS.addEventListener('registrationError', (error) => {
      console.log('[DEVICE TOKEN ERROR]', error)
      PushNotificationIOS.removeEventListener('registrationError')
    })
    const permissions = await PushNotificationIOS.requestPermissions()
    callback && callback(permissions.authorizationStatus == 1 ? false : true)
  } catch (error) {
    console.error('[REQUEST APNS ERROR]', error)
  }
}

export async function listenPushNotifications(onNotificationReceived: (notification: any) => void) {
  try {
    PushNotificationIOS.addEventListener('notification', (notification) => { onNotificationReceived(notification.getData()) })
  } catch (error) {
    console.error('[LISTEN ERROR]', error)
  }
}

export const requestLocation = () => {
  check(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
        case RESULTS.LIMITED:
        case RESULTS.GRANTED:
        case RESULTS.BLOCKED:
          break
        case RESULTS.DENIED:
          request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
          break
      }
    }
  )
}

export const requestLocationAlways = (Locale: Locales): Promise<boolean> => {
  return new Promise((resolve) => {
    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then(async result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.LIMITED:
          case RESULTS.GRANTED:
            resolve(true)
            break
          case RESULTS.BLOCKED:
          case RESULTS.DENIED:
            const result = await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED || result === RESULTS.UNAVAILABLE) {
              resolve(true)
              break
            }
            Alert.alert(Lit[Locale].Copywrite.AlwaysLocationRequired[0], Lit[Locale].Copywrite.AlwaysLocationRequired[1],
              [
                { text: Lit[Locale].Button.No, onPress: () => resolve(false), },
                { text: Lit[Locale].Button.Ok, onPress: () => {
                  resolve(false)
                  Linking.openURL('app-settings:')
                }, },
              ]
            )
            break
        }
      })
  })
}

// export const getLocation = (callback: (coordinates: any) => void) => {
//   Geolocation.getCurrentPosition(
//     (location) => {
//       callback({ lat: location.coords.latitude, lon: location.coords.longitude, })
//     },
//     (error) => {
//       callback({ lat: undefined, lon: undefined, })
//       console.log('[GET LOCATION ERROR]', error)
//     },
//     { timeout: 10000, }
//   )
// }

export const requestCamera = (Locale: Locales): Promise<boolean> => {
  return new Promise((resolve) => {
    check(PERMISSIONS.IOS.CAMERA)
      .then(async result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.LIMITED:
          case RESULTS.GRANTED:
            resolve(true)
            break
          case RESULTS.BLOCKED:
          case RESULTS.DENIED:
            const result = await request(PERMISSIONS.IOS.CAMERA)
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED || result === RESULTS.UNAVAILABLE) {
              resolve(true)
              break
            }
            Alert.alert(Lit[Locale].Copywrite.CameraRequired[0], Lit[Locale].Copywrite.CameraRequired[1],
              [
                { text: Lit[Locale].Button.No, onPress: () => resolve(false), },
                { text: Lit[Locale].Button.Ok, onPress: () => {
                  resolve(false)
                  Linking.openURL('app-settings:')
                }, },
              ]
            )
            break
        }
      })
  })
}

export const requestMicrophone = (Locale: Locales, alert: boolean = false): Promise<boolean> => {
  return new Promise((resolve) => {
    check(PERMISSIONS.IOS.MICROPHONE)
      .then(async result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.LIMITED:
          case RESULTS.GRANTED:
            resolve(true)
            break
          case RESULTS.BLOCKED:
          case RESULTS.DENIED:
            const result = await request(PERMISSIONS.IOS.MICROPHONE)
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED || result === RESULTS.UNAVAILABLE) {
              resolve(true)
              break
            }
            if (alert) {
              Alert.alert(Lit[Locale].Copywrite.MicrophoneRequired[0], Lit[Locale].Copywrite.MicrophoneRequired[1],
                [
                  { text: Lit[Locale].Button.No, onPress: () => null, },
                  { text: Lit[Locale].Button.Ok, onPress: () => Linking.openURL('app-settings:'), },
                ]
              )
            }
            resolve(false)
            break
        }
      })
  })
}

export const requestPhotoLibrary = (Locale: Locales, alert: boolean = false): Promise<boolean> => {
  return new Promise((resolve) => {
    check(PERMISSIONS.IOS.PHOTO_LIBRARY)
      .then(async result => {
        switch (result) {
          case RESULTS.UNAVAILABLE:
          case RESULTS.LIMITED:
          case RESULTS.GRANTED:
            resolve(true)
            break
          case RESULTS.BLOCKED:
          case RESULTS.DENIED:
            const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY)
            if (result === RESULTS.GRANTED || result === RESULTS.LIMITED || result === RESULTS.UNAVAILABLE) {
              resolve(true)
              break
            }
            if (alert) {
              Alert.alert(Lit[Locale].Copywrite.PhotosRequired[0], Lit[Locale].Copywrite.PhotosRequired[1],
                [
                  { text: Lit[Locale].Button.No, onPress: () => null, },
                  { text: Lit[Locale].Button.Ok, onPress: () => Linking.openURL('app-settings:'), },
                ]
              )
            }
            resolve(false)
            break
        }
      })
  })
}

// export const requestContacts = (callback: (contacts: any) => void, Locale: Locales) => {
//   check(PERMISSIONS.IOS.CONTACTS)
//     .then(async (result) => {
//       switch (result) {
//         case RESULTS.UNAVAILABLE:
//         case RESULTS.LIMITED:
//         case RESULTS.GRANTED:
//           callback(await Contacts.getAll())
//           break
//         case RESULTS.BLOCKED:
//           Alert.alert(Lit[Locale].Copywrite.ContactsRequired[0], Lit[Locale].Copywrite.ContactsRequired[1],
//             [
//               { text: Lit[Locale].Button.No, onPress: () => null, },
//               { text: Lit[Locale].Button.Ok, onPress: () => Linking.openURL('app-settings:'), },
//             ]
//           )
//           break
//         case RESULTS.DENIED:
//           const result = await request(PERMISSIONS.IOS.CONTACTS)
//           if (result === RESULTS.GRANTED) callback(await Contacts.getAll())
//           break
//       }
//     }
//   )
// }

// export const sendSMSInvite = (phonenumbers: Array<string>, username: string, Locale: Locales) => {
//   SendSMS.send(
//     {
//       recipients: phonenumbers,
//       body: `${Domain} \n${Lit[Locale].Copywrite.FindMe} @${username}`,
//     },
//     (completed, cancelled, error) => {
//       if (error) console.log('[SEND SMS ERROR]', error)
//     },
//   )
// }

// export const shareInvite = async (username: string, Locale: Locales) => {
//   await Share.share({ url: Domain, message: `${Lit[Locale].Copywrite.FindMe} @${username}`, })
// }

// export const shareProfile = async (username: string, Locale: Locales) => {
//   await Share.share({ url: `${Domain}${Paths.Profile}${username}`, message: `${Lit[Locale].Copywrite.ShareProfile[0]} ${username} ${Lit[Locale].Copywrite.ShareProfile[1]}!`, })
// }

// export const openCoordinates = (lon: number, lat: number, username: string, locale: string,) => {
//   const scheme = Platform.select({ ios: 'maps://0,0?q=', android: 'geo:0,0?q=', }) || 'geo:0,0?q='
//   const label = `${username}'s ${locale}`
//   const url = (Platform.select({
//     ios: `${scheme}${label}@${lat},${lon}`,
//     android: `${scheme}${lat},${lon}(${label})`
//   }) || 'geo:0,0?q=') as string
//   Linking.openURL(url)
// }

export const openCoordinates = async (lon: number, lat: number, username: string) => {
  const label = encodeURIComponent(`${username}`)
  const appleMapsUrl = `maps://?q=${label}&ll=${lat},${lon}`
  const googleMapsUrl = `comgooglemaps://?q=${label}&ll=${lat},${lon}`
  if (Platform.OS === 'ios') {
    const canOpenGoogleMaps = await Linking.canOpenURL(googleMapsUrl)
    if (canOpenGoogleMaps) {
      Linking.openURL(googleMapsUrl)
      return
    }
    const canOpenAppleMaps = await Linking.canOpenURL(appleMapsUrl)
    if (canOpenAppleMaps) {
      Linking.openURL(appleMapsUrl)
      return
    }
  } else {
    Linking.openURL(googleMapsUrl)
    return
  }
  Linking.openURL(appleMapsUrl)
}

export const hardVibrate = () => {
  ReactNativeHapticFeedback.trigger('impactLight', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  })
}

export const softVibrate = () => {
  ReactNativeHapticFeedback.trigger('soft', {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
  })
}

// export const getIP = (callback: (IP: any) => void) => {
//   NetworkInfo.getIPV4Address().then(ipv4Address => callback(ipv4Address))
// }

// export const getMaxFps = (format: CameraDeviceFormat): number => {
//   return format.frameRateRanges.reduce((prev, curr) => {
//     if (curr.maxFrameRate > prev) return curr.maxFrameRate
//     else return prev
//   }, 0)
// }
