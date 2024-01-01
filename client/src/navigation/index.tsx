import { useEffect, useState, } from 'react'
import { Platform, View, } from 'react-native'
import { NavigationContainer, createNavigationContainerRef, } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores } from '../state/store'
import { MMKVLoader } from 'react-native-mmkv-storage'
import { AppVersion, AuthStore, LocalStorage, OS, } from '../utils/constants'
import { getDeviceId, getCarrier, } from 'react-native-device-info'
import { IUserStore } from '../state/reducers/UserReducer'
import { ISystemStore } from '../state/reducers/SystemReducer'
// import { getIP, getLocation, requestPushNotifications } from '../utils/services'

// MAIN ROUTES
import StreetpassScreen from '../screens/StreetpassScreen'
import ChatsScreen from '../screens/ChatsScreen'
import UserScreen from '../screens/UserScreen'
// SUB ROUTES
import SignInScreen from '../screens/subScreens/SignInScreen'
import VerifyPhoneScreen from '../screens/subScreens/VerifyPhoneScreen'
import PersonalInfoScreen from '../screens/subScreens/PersonalInfoScreen'
import SexScreen from '../screens/subScreens/SexScreen'
import ChatScreen from '../screens/subScreens/ChatScreen'
// ALT ROUTES
import AppStyleScreen from '../screens/altScreens/AppStyleScreen'
import NotificationsScreen from '../screens/altScreens/NotificationsScreen'
import BlockingScreen from '../screens/altScreens/BlockingScreen'
import EmailScreen from '../screens/altScreens/EmailScreen'
import PhoneNumberScreen from '../screens/altScreens/PhoneNumberScreen'
import DeleteAccountScreen from '../screens/altScreens/DeleteAccountScreen'
import { ISetSignIn, ISetUpdateUser, setSignIn, setUpdateUser, } from '../state/actions/UserActions'
import { requestPushNotifications, signInCallback } from '../utils/services'
import { registerDevice } from '../api/user'
import { ISetMatch, ISetMatches, setMatch, setMatches } from '../state/actions/MatchesActions'
import { setStreetpasses } from '../state/actions/StreetpassActions'
import { useSubscription } from '@apollo/client'
import { SUBSCRIBE_MATCHES, SUBSCRIBE_MESSAGES, SUBSCRIBE_STREETPASSES, apiRequest } from '../api'
import { IMatch } from '../state/reducers/MatchesReducer'
import { IStreetpassStore } from '../state/reducers/StreetpassReducer'
import { ISetChat, ISetChats, ISetMessage, setChat, setChats, setMessage } from '../state/actions/ChatsActions'
import { IChat, IMessage, IMessageMetadata } from '../state/reducers/ChatsReducer'

export const navigationRef = createNavigationContainerRef()

const MMKV = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, streetpassStore, } = state
  return { systemStore, userStore, streetpassStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setSignIn,
      setUpdateUser,
      setStreetpasses,
      setMatches,
      setMatch,
      setChats,
      setChat,
      setMessage,
    }
  ), dispatch),
})

const App = createNativeStackNavigator()

export enum Screens {
  // MAIN ROUTES
  Streetpass = 'STREETPASS',
  Chats = 'CHATS',
  User = 'USER',
  // SUB ROUTES
  SignIn = 'SIGN_IN',
  VerifyPhone = 'VERIFY_PHONE',
  PersonalInfo = 'PERSONAL_INFO',
  Sex = 'SEX',
  Chat = 'CHAT',
  // ALT ROUTES
  AppStyle = 'APP_STYLE',
  Notifications = 'NOTIFICATIONS',
  Blocking = 'BLOCKING',
  Email = 'EMAIL',
  PhoneNumber = 'PHONE_NUMBER',
  DeleteAccount = 'DELETE_ACCOUNT',
}

interface IMapScreenProps {
  systemStore: ISystemStore,
  userStore: IUserStore,
  streetpassStore: IStreetpassStore,
  actions: {
    setSignIn: (params: ISetSignIn) => Promise<any>,
    setUpdateUser: (params: ISetUpdateUser) => void,
    setStreetpasses: () => void,
    setMatches: (params: ISetMatches) => void,
    setMatch: (params: ISetMatch) => void,
    setChats: (params: ISetChats) => void,
    setChat: (params: ISetChat) => void,
    setMessage: (params: ISetMessage) => void,
  },
}

function AppNavigation({ systemStore, userStore, streetpassStore, actions, }: IMapScreenProps) {
  const [initialized, setInitialized] = useState<boolean>(false)
  const accessToken = MMKV.getString(AuthStore.AccessToken)
  useEffect(() => {
    const autoSignIn = async () => {
      await actions.setSignIn({
        input: { appleAuth: '', }, callback: (code) => signInCallback(navigationRef, code),
      }).then(async () => {
        setInitialized(true)
        actions.setStreetpasses()
        actions.setMatches({ index: undefined, })
        actions.setChats({ index: undefined, })
        await requestPushNotifications(async (deviceToken: string) => {
          await registerDevice({ manufacturer: OS[Platform.OS], deviceToken, })
        }, async (result) => {
          !result && await actions.setUpdateUser({
            notificationPreferences: {
              messages: false,
              matches: false,
              streetpasses: false,
              emails: userStore.user.notificationPreferences.emails,
              newsletters: userStore.user.notificationPreferences.newsletters,
            }
          })
        })
      }).catch((e: any) => {
        setInitialized(true)
        console.log('[AUTOSIGNIN ERROR]', e)
      })
    }
    if (!userStore.signedIn && accessToken) autoSignIn()
    else setInitialized(true)
  }, [userStore.signedIn, accessToken, navigationRef])

  useSubscription(SUBSCRIBE_STREETPASSES({ userId: userStore.user.userId, }), {
    skip: !userStore.signedIn || !MMKV.getString(AuthStore.AccessToken),
    shouldResubscribe: true,
    onData: (data) => {
      const streetpasses = data?.data?.data?.streetpasses as boolean
      if (streetpasses && !streetpassStore.streetpasses) actions.setStreetpasses()
    },
    onError: async (error) => {
      console.log('[SUBSCRIBE STREETPASSES ERROR]', error)
      await apiRequest(null)
    }
  })

  useSubscription(SUBSCRIBE_MATCHES({ userId: userStore.user.userId, }), {
    skip: !userStore.signedIn || !MMKV.getString(AuthStore.AccessToken),
    shouldResubscribe: true,
    onData: (data) => {
      const match = data?.data?.data?.matches as IMatch
      if (match) actions.setMatch(match)
    },
    onError: async (error) => {
      console.log('[SUBSCRIBE MATCHES ERROR]', error)
      await apiRequest(null)
    }
  })

  useSubscription(SUBSCRIBE_MESSAGES({ userId: userStore.user.userId, }), {
    skip: !userStore.signedIn || !MMKV.getString(AuthStore.AccessToken),
    shouldResubscribe: true,
    onData: (data) => {
      const { chat, message, metadata, } = data?.data?.data?.messages as { chat?: IChat, message: IMessage, metadata: IMessageMetadata, }
      if (chat) actions.setChat(chat)
      actions.setMessage({ userId: metadata.sender === userStore.user.userId ? metadata.recipient : metadata.sender, message: message, })
    },
    onError: async (error) => {
      console.log('[SUBSCRIBE MESSAGES ERROR]', error)
      await apiRequest(null)
    }
  })

  return (
    <NavigationContainer ref={navigationRef}>
      {initialized ?
        <App.Navigator
          initialRouteName={userStore.signedIn ? Screens.Streetpass : Screens.SignIn}
          screenOptions={{ headerShown: false, }}
        >
          {/* MAIN ROUTES */}
          <App.Screen name={Screens.Streetpass} component={StreetpassScreen}
            options={{
              animation: 'fade_from_bottom',
              gestureEnabled: false,
            }}
          />
          <App.Screen name={Screens.Chats} component={ChatsScreen}
            options={{
              animation: 'none',
              gestureEnabled: false,
            }}
          />
          <App.Screen name={Screens.User} component={UserScreen}
            options={{
              animation: 'none',
              gestureEnabled: false,
            }}
          />
          {/* SUB ROUTES */}
          <App.Screen name={Screens.SignIn} component={SignInScreen}
            options={{
              animation: 'none',
              gestureEnabled: false,
            }}
          />
          <App.Screen name={Screens.VerifyPhone} component={VerifyPhoneScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <App.Screen name={Screens.PersonalInfo} component={PersonalInfoScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <App.Screen name={Screens.Sex} component={SexScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          <App.Screen name={Screens.Chat} component={ChatScreen}
            options={{
              animation: 'fade_from_bottom',
            }}
          />
          {/* ALT ROUTES */}
          <App.Screen name={Screens.AppStyle} component={AppStyleScreen}
            options={{
            }}
          />
          <App.Screen name={Screens.Notifications} component={NotificationsScreen}
            options={{
            }}
          />
          <App.Screen name={Screens.Blocking} component={BlockingScreen}
            options={{
            }}
          />
          <App.Screen name={Screens.Email} component={EmailScreen}
            options={{
            }}
          />
          <App.Screen name={Screens.PhoneNumber} component={PhoneNumberScreen}
            options={{
            }}
          />
          <App.Screen name={Screens.DeleteAccount} component={DeleteAccountScreen}
            options={{
            }}
          />
        </App.Navigator>
      : <View style={{flex: 1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',}}>
          {/* <GradientBackground systemStore={systemStore} /> */}
          {/* <AnimatedBackground systemStore={systemStore} source={require('../assets/animations/2.json')} /> */}
          {/* <AppTitle systemStore={systemStore} fontSize={systemStore.Fonts.md} fontWeight={systemStore.Fonts.lightWeight} color={'white'} /> */}
        </View>
      }
    </NavigationContainer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigation)
