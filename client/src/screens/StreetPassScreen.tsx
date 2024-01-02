import React, { RefObject } from 'react'
import {
  ActivityIndicator,
  AppState,
  Text,
  View,
} from 'react-native'
import NavTabBar from '../components/navigation/NavTabBar'
import { Screens } from '../navigation'
import { connect, } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../state/store'
import { IUserStore, } from '../state/reducers/UserReducer'
import { ISystemStore, } from '../state/reducers/SystemReducer'
import GradientBackground from '../components/gradientBackground'
import NavHeader from '../components/navigation/NavHeader'
import SlidersIcon from '../assets/icons/sliders.svg'
import DeleteIcon from '../assets/icons/delete.svg'
import ExclamationIcon from '../assets/icons/exclamation-circled.svg'
import StreetpassCard from '../components/streetpassCard'
import StreetpassSettingsModal from '../components/streetpassSettingsModal'
import StreetpassModal from '../components/streetpassModal'
import { CardItemHandle } from 'rn-tinder-card'
import AnimatedBackground from '../components/animated/AnimatedBackground'
import { ISetUpdateUser, setUpdateUser } from '../state/actions/UserActions'
import { requestLocationAlways } from '../utils/services'
import BackgroundGeolocation, { Subscription } from 'react-native-background-geolocation'
import { Errors, Time } from '../utils/constants'
import { apiRequest, baseUrl, getAccessHeaders, protocol } from '../api'
import { IStreetpassStore } from '../state/reducers/StreetpassReducer'
import { setStreetpass, setStreetpasses } from '../state/actions/StreetpassActions'
import { IListGroupConfig } from '../components/listGroup'
import SelectionModal from '../components/selectionModal'
import { ICarouselInstance } from 'react-native-reanimated-carousel'
import { blockUser } from '../api/user'
import { IUnsetMatch, unsetMatch } from '../state/actions/MatchesActions'
import { IUnsetChat, unsetChat } from '../state/actions/ChatsActions'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, streetpassStore, } = state
  return { systemStore, userStore, streetpassStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setUpdateUser,
      setStreetpasses,
      setStreetpass,
      unsetMatch,
      unsetChat,
    }
  ), dispatch),
})

interface IStreetpassScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  streetpassStore: IStreetpassStore,
  actions: {
    setUpdateUser: (params: ISetUpdateUser) => void,
    setStreetpasses: () => void,
    setStreetpass: () => void,
    unsetMatch: (params: IUnsetMatch) => void,
    unsetChat: (params: IUnsetChat) => void,
  },
}
interface IStreetpassScreenState {
  streetpass: any | null,
  streetpassLoading: string | null,
  streetpassSettings: boolean,
  streetpassImageIndex: number | null,
  selectionModalConfig: IListGroupConfig | null,
  appState: string | null,
  appStateListener: any,
}
class StreetpassScreen extends React.Component<IStreetpassScreenProps> {
  constructor(props: IStreetpassScreenProps) {
    super(props)
    this.backgroundLocationSubscriptions = []
    this.streetpassCardRefs = {}
  }
  backgroundLocationSubscriptions: Subscription[] = []
  streetpassCardRefs: Record<string, React.RefObject<CardItemHandle>> = {}

  state: IStreetpassScreenState = {
    streetpass: null,
    streetpassLoading: null,
    streetpassSettings: false,
    streetpassImageIndex: null,
    selectionModalConfig: null,
    appState: null,
    appStateListener: null,
  }

  UNSAFE_componentWillMount(): void {
    const appStateListener = AppState.addEventListener('change', this.handleAppStateChange)
    this.setState({ appStateListener, })
    if (this.props.userStore.signedIn) {
      if (this.props.userStore.user.streetpass) {
        this.startStreetPass()
      }
    }
  }

  componentWillUnmount(): void {
    if (this.state.appStateListener) this.state.appStateListener.remove()
    this.stopStreetPass()
  }

  componentDidUpdate(): void {
    if (this.props.streetpassStore.streetpasses?.length === this.props.streetpassStore.count && !this.state.streetpassLoading) {
      this.props.actions.setStreetpasses()
    }
  }

  handleAppStateChange = async (nextAppState: any) => {
    if (this.state.appState === 'background' && nextAppState === 'active') {
      if (this.props.userStore.user.streetpass) {
        await requestLocationAlways(this.props.systemStore.Locale).then(async result => {
          if (!result) {
            await this.props.actions.setUpdateUser({ streetpass: false, })
            return false
          }
        })
      }
    }
    this.setState({ appState: nextAppState, })
  }

  startStreetPass = async () => {
    await requestLocationAlways(this.props.systemStore.Locale).then(async result => {
      if (!result) {
        await this.props.actions.setUpdateUser({ streetpass: false, })
        return false
      }
      try {
        BackgroundGeolocation.ready({
          desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_HIGH,
          distanceFilter: 30,
          heartbeatInterval: Time.Minute * 3,
          stopTimeout: 5,
          stopOnTerminate: false,
          startOnBoot: true,
          autoSync: true,
          batchSync: false,
          url: `${protocol[0]}${baseUrl}/graphql`,
          method: 'POST',
          headers: getAccessHeaders(),
          httpRootProperty: '.',
          locationTemplate: '{"query": "mutation streetpass($lat: Float!, $lon: Float!) { streetpass(input: { lat: $lat, lon: $lon }) }", "variables": {"lat": <%= latitude %>, "lon": <%= longitude %>}}',
        }, (state) => { if (!state.enabled) BackgroundGeolocation.start() })
        this.backgroundLocationSubscriptions.push(BackgroundGeolocation.onHttp(async response => {
          if (response.status === 200 && response.responseText.includes(Errors.JwtExpired)) {
            await apiRequest(null)
            BackgroundGeolocation.setConfig({ headers: getAccessHeaders(), })
            BackgroundGeolocation.sync()
          }
        }))
        BackgroundGeolocation.onGeofencesChange(() => {})
      } catch(e) {
        console.log('[BACKGROUND GEOLOCATION ERROR]', e)
      }
    })
  }

  stopStreetPass = () => {
    this.backgroundLocationSubscriptions.forEach((subscription) => subscription.remove())
    BackgroundGeolocation.stop()
  }

  render() {
    const { navigation, systemStore, userStore, streetpassStore, actions, }: IStreetpassScreenProps = this.props
    const { Colors, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        {this.state.streetpassSettings &&
          <StreetpassSettingsModal
            navigation={navigation}
            systemStore={systemStore}
            userStore={userStore}
            toggleModal={() => this.setState({ streetpassSettings: false, })}
            actions={{
              setUpdateUser: actions.setUpdateUser,
            }}
          />
        }

        {this.state.streetpass &&
          <StreetpassModal
            navigation={navigation}
            systemStore={systemStore}
            streetpass={this.state.streetpass}
            streetpassCardRef={this.streetpassCardRefs[this.state.streetpass.userId]}
            streetpassImageIndex={this.state.streetpassImageIndex}
            unsetStreetpass={() => this.setState({ streetpass: null, streetpassImageIndex: null, })}
            actions={{
              unsetMatch: actions.unsetMatch,
              unsetChat: actions.unsetChat,
            }}
          />
        }

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <NavHeader
            systemStore={systemStore}
            color={Colors.lightest}
            title={'Streetpass'}
            EndIcon={SlidersIcon}
            onPressTitle={() => null}
            onPressEnd={() => this.setState({ streetpassSettings: true, })}
          />

          <View style={{flex: 1,}}>
            {this.props.streetpassStore.streetpasses?.length === this.props.streetpassStore.count
              ? <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <ActivityIndicator color={Colors.lighter} size={'large'} />
                {/* TODO - replace with better loader */}
              </View>
              : streetpassStore.streetpasses ? streetpassStore.streetpasses.map(streetpass => {
                if (!this.streetpassCardRefs[streetpass.userId]) this.streetpassCardRefs[streetpass.userId] = React.createRef()
                return (
                  <StreetpassCard
                    ref={this.streetpassCardRefs[streetpass.userId]}
                    key={streetpass.userId}
                    navigation={navigation}
                    systemStore={systemStore}
                    streetpass={streetpass}
                    streetpassLoading={this.state.streetpassLoading}
                    setStreetpass={({ streetpassImageIndex, }) => this.setState({ streetpass: streetpass, streetpassImageIndex, })}
                    setSelectionModalConfig={(streetpass) => this.setState({ selectionModalConfig: {
                      title: streetpass.name,
                      list: [
                        { Icon: DeleteIcon, title: 'Block', noRight: true, onPress: () => {
                          blockUser({ userId: streetpass.userId, })
                          this.streetpassCardRefs[streetpass.userId].current?.swipeLeft()
                          this.setState({ selectionModalConfig: null, })
                        }, },
                        { Icon: ExclamationIcon, title: 'Report', noRight: true, onPress: () => null, },
                      ],
                    }, })}
                    setStreetpassLoading={(userId) => this.setState({ streetpassLoading: userId, })}
                    actions={{
                      setStreetpass: actions.setStreetpass,
                    }}
                  />
                )})
                : <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
                <Text>START STREETPASSING!</Text>
              </View>
              }
          </View>

          <NavTabBar
            systemStore={systemStore}
            activeTab={Screens.Streetpass}
            profilePicture={userStore.user.media[0]?.thumbnail || null}
            onPressStreetpass={() => null}
            onPressChat={() => navigation.navigate(Screens.Chats)}
            onPressUser={() => navigation.navigate(Screens.User)}
          />
        </View>

        {this.state.selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={this.state.selectionModalConfig} toggleModal={() => this.setState({ selectionModalConfig: null, })} />
        }
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(StreetpassScreen)
