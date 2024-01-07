import React, { RefObject } from 'react'
import {
  Dimensions,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import GearIcon from '../assets/icons/gear.svg'
import PencilIcon from '../assets/icons/pencil.svg'
import DotIcon from '../assets/icons/dot.svg'
import DotFillIcon from '../assets/icons/dot-fill.svg'
import WorkIcon from '../assets/icons/work.svg'
import SchoolIcon from '../assets/icons/school.svg'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import { getAge, timePassedSince } from '../utils/functions'
import EditProfileModal from '../components/editProfileModal'
import UserSettingsModal from '../components/userSettingsModal'
import AnimatedBackground from '../components/animated/AnimatedBackground'
import { ISetSortMedia, ISetUpdateUser, setSignOut, setSortMedia, setUpdateUser, setUser } from '../state/actions/UserActions'
import Video from 'react-native-video'
import convertToProxyURL from 'react-native-video-cache'
import { requestPushNotifications } from '../utils/services'
import { OS } from '../utils/constants'
import PushNotificationIOS from '@react-native-community/push-notification-ios'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setUser,
      setUpdateUser,
      setSortMedia,
      setSignOut,
    }
  ), dispatch),
})

interface IUserScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setUser: () => Promise<void>,
    setUpdateUser: (params: ISetUpdateUser) => Promise<void>,
    setSortMedia: (params: ISetSortMedia) => Promise<void>,
    setSignOut: () => Promise<void>,
  },
}
interface IUserScreenState {
  imageIndex: number,
  editProfile: boolean,
  userSettings: boolean,
  signingOut: boolean,
}
class UserScreen extends React.Component<IUserScreenProps> {
  constructor(props: IUserScreenProps) {
    super(props)
  }

  state: IUserScreenState = {
    imageIndex: 0,
    editProfile: false,
    userSettings: false,
    signingOut: false,
  }

  handleSignOut = async () => {
    this.setState({ signingOut: true, })
    await requestPushNotifications(async (deviceToken: string) => {
      // await registerDevice({ manufacturer: OS[Platform.OS], deviceToken, unregister: true, })
      PushNotificationIOS.setApplicationIconBadgeNumber(0)
    })
    await this.props.actions.setSignOut()
    this.setState({ signingOut: false, })
    this.props.navigation.navigate(Screens.SignIn)
  }

  render() {
    const { navigation, systemStore, userStore, actions, }: IUserScreenProps = this.props
    const { Colors, Fonts, } = systemStore
    const userProfileCarouselRef: RefObject<ICarouselInstance> = React.createRef()

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        {this.state.editProfile &&
          <EditProfileModal
            navigation={navigation}
            systemStore={systemStore}
            userStore={userStore}
            toggleModal={() => this.setState({ editProfile: false, })}
            actions={{
              setUser: this.props.actions.setUser,
              setUpdateUser: this.props.actions.setUpdateUser,
              setSortMedia: this.props.actions.setSortMedia,
            }}
          />
        }

        {this.state.userSettings &&
          <UserSettingsModal
            navigation={navigation}
            systemStore={systemStore}
            userStore={userStore}
            toggleModal={() => this.setState({ userSettings: false, })}
            handleSignOut={this.handleSignOut}
          />
        }

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <NavHeader
            systemStore={systemStore}
            color={Colors.lightest}
            title={'Streetpass'}
            EndIcon={GearIcon}
            onPressTitle={() => null}
            onPressEnd={() => this.setState({ userSettings: true, })}
          />

          <View style={{flex: 1,}}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View>
                <Carousel
                  ref={userProfileCarouselRef}
                  enabled={userStore.user.media.length > 1}
                  panGestureHandlerProps={{ activeOffsetX: [-10, 10], }}
                  loop={false}
                  width={Dimensions.get('window').width}
                  height={Dimensions.get('window').height * 0.57}
                  data={userStore.user.media}
                  onSnapToItem={index => this.setState({ imageIndex: index, })}
                  renderItem={(item: any) => (
                    <>
                      {item.item.thumbnail &&
                        <FastImage source={{ uri: item.item.thumbnail, }} style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}} />
                      }

                      {item.item.image &&
                        <FastImage source={{ uri: item.item.image, }} style={{width: '100%', height: '100%',}} />
                      }

                      {item.item.video &&
                        <Video
                          source={{ uri: convertToProxyURL(item.item.video), }}
                          paused={false}
                          repeat={true}
                          playInBackground={false}
                          playWhenInactive={false}
                          mixWithOthers={'mix'}
                          ignoreSilentSwitch={'ignore'}
                          muted={true}
                          bufferConfig={{
                            minBufferMs: 500,
                            maxBufferMs: 30000,
                            bufferForPlaybackMs: 500,
                            bufferForPlaybackAfterRebufferMs: 1000,
                          }}
                          resizeMode={'cover'}
                          style={{width: '100%', height: '100%',}}
                        />
                      }
                      <View style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%', flexDirection: 'row',}}>
                        <TouchableWithoutFeedback onPress={() => {
                          userProfileCarouselRef?.current?.prev()
                        }}>
                          <View style={{flex: 1,}} />
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => {
                          userProfileCarouselRef?.current?.next()
                        }}>
                          <View style={{flex: 1,}} />
                        </TouchableWithoutFeedback>
                      </View>
                    </>
                  )}
                />

                <View style={{position: 'absolute', width: '100%',}}>
                  <LinearGradient
                    style={{position: 'absolute', width: '100%', height: '140%', top: 0,}}
                    colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
                  />

                  <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center',}}>
                    {userStore.user.media.length > 1 && Array.from({ length: userStore.user.media.length, }, (v, i) => {
                      return this.state.imageIndex === i
                        ? <DotFillIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
                        : <DotIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
                    })}
                  </View>
                </View>

                <View style={{position: 'absolute', bottom: 0, right: 0, padding: 24,}}>
                  <View style={{flex: 0, justifyContent: 'center',}}>
                    <TouchableOpacity
                      activeOpacity={Colors.activeOpacity}
                      onPress={() => this.setState({ editProfile: true, })}
                    >
                      <PencilIcon fill={Colors.safeLightest} width={40} height={40} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16, paddingTop: 24, marginBottom: 16,}}>
                <View style={{flex: 1,}}>
                  <Text style={{color: Colors.lightest, fontSize: Fonts.xl, fontWeight: Fonts.heavyWeight, textShadowColor: Colors.darkest, textShadowRadius: 2,}}>{userStore.user.name} <Text style={{fontWeight: Fonts.lightWeight,}}> {getAge(userStore.user.dob)}</Text></Text>
                  <Text numberOfLines={1} style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.lightWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>Joined {timePassedSince(userStore.user.joinDate, systemStore.Locale)}</Text>
                </View>
              </View>

              {userStore.user.work &&
                <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16,}}>
                  <WorkIcon fill={Colors.lightest} width={16} height={16} />
                  <Text style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, marginLeft: 8,}}>{userStore.user.work}</Text>
                </View>
              }

              {userStore.user.school &&
                <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8,}}>
                  <SchoolIcon fill={Colors.lightest} width={16} height={16} />
                  <Text style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, marginLeft: 8,}}>{userStore.user.school}</Text>
                </View>
              }

              <View style={{flex: 1, paddingHorizontal: 16, marginTop: 8,}}>
                <Text style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.middleWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>{userStore.user.bio}</Text>
              </View>

              <View style={{height: 128,}} />
            </ScrollView>
          </View>

          <NavTabBar
            systemStore={systemStore}
            activeTab={Screens.User}
            profilePicture={userStore.user.media[0]?.thumbnail || null}
            onPressStreetpass={() => navigation.navigate(Screens.Streetpass)}
            onPressChat={() => navigation.navigate(Screens.Chats)}
            onPressUser={() => null}
          />
        </View>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)
