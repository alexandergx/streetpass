import React, { RefObject } from 'react'
import {
  View,
} from 'react-native'
import NavTabBar from '../components/navigation/NavTabBar'
// import { Errors, NotificationType, OS, PushNotificationMessage, Time, } from '../utils/constants'
import { Screens } from '../navigation'
import { connect, } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../state/store'
import { IUserStore, } from '../state/reducers/UserReducer'
// import Geolocation from '@react-native-community/geolocation'
import { ISystemStore, } from '../state/reducers/SystemReducer'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'
// import { requestLocationAlways, requestPushNotifications, } from '../utils/services'
// import { registerDevice, syncLocation, } from '../api/user'
// import { ISetChat, ISetChatId, ISetChats, ISetChatsSearch, IUnsetChat, setChat, setChatId, setChats, setChatsSearch, unsetChat, unsetChatsSearch, } from '../state/actions/ChatsActions'
// import BackgroundGeolocation, { Subscription, } from 'react-native-background-geolocation'
// import { apiRequest, baseUrl, getAccessHeaders, protocol, } from '../api'
// import BackgroundFetch from 'react-native-background-fetch'
import GradientBackground from '../components/gradientBackground'
import NavHeader from '../components/navigation/NavHeader'
import SlidersIcon from '../assets/icons/sliders.svg'
import StreetPassCard from '../components/streetPassCard'
import StreetPassSettingsModal from '../components/streetPassSettingsModal'
import StreetPassModal from '../components/streetPassModal'
import { CardItemHandle } from 'rn-tinder-card'
import { mockStreetPasses, } from '../utils/MockData'
import AnimatedBackground from '../components/animated/AnimatedBackground'
import { ISetUpdateUser, setUpdateUser } from '../state/actions/UserActions'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setUpdateUser,
    }
  ), dispatch),
})

interface IStreetPassScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setUpdateUser: (params: ISetUpdateUser) => void,
  },
}
interface IStreetPassScreenState {
  streetPass: any | null,
  streetPassSettings: boolean,
  streetPassCardRef: RefObject<CardItemHandle> | null,
  streetPassImageIndex: number | null,
}
class StreetPassScreen extends React.Component<IStreetPassScreenProps> {
  constructor(props: IStreetPassScreenProps) {
    super(props)
  }

  state: IStreetPassScreenState = {
    streetPass: null,
    streetPassSettings: false,
    streetPassCardRef: null,
    streetPassImageIndex: null,
  }

  render() {
    const { navigation, systemStore, userStore, actions, }: IStreetPassScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    const streetPasses = mockStreetPasses

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        {this.state.streetPassSettings &&
          <StreetPassSettingsModal
            navigation={navigation}
            systemStore={systemStore}
            userStore={userStore}
            toggleModal={() => this.setState({ streetPassSettings: false, })}
            actions={{
              setUpdateUser: actions.setUpdateUser,
            }}
          />
        }

        {this.state.streetPass &&
          <StreetPassModal
            navigation={navigation}
            systemStore={systemStore}
            streetPass={this.state.streetPass}
            streetPassCardRef={this.state.streetPassCardRef}
            streetPassImageIndex={this.state.streetPassImageIndex}
            unsetStreetPass={() => this.setState({ streetPass: null, streetPassCardRef: null, streetPassImageIndex: null, })}
          />
        }

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <NavHeader
            systemStore={systemStore}
            color={Colors.lightest}
            title={'Streetpass'}
            EndIcon={SlidersIcon}
            onPressTitle={() => null}
            onPressEnd={() => this.setState({ streetPassSettings: true, })}
          />

          <View style={{flex: 1,}}>
            {streetPasses.map(streetPass => {
              return (
                <StreetPassCard
                  key={streetPass.userId}
                  navigation={navigation}
                  systemStore={systemStore}
                  streetPass={streetPass}
                  setStreetPass={({ streetPassCardRef, streetPassImageIndex, }) => {
                    this.setState({ streetPass: streetPass, streetPassCardRef, streetPassImageIndex, })
                  }}
                />
              )
            })}
          </View>

          <NavTabBar
            systemStore={systemStore}
            activeTab={Screens.StreetPass}
            profilePicture={null}
            onPressStreetPass={() => null}
            onPressChat={() => navigation.navigate(Screens.Chats)}
            onPressUser={() => navigation.navigate(Screens.User)}
          />
        </View>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StreetPassScreen)
