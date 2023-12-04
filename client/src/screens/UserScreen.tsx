import React, { RefObject } from 'react'
import {
  Dimensions,
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
import { IChatsStore, } from '../state/reducers/ChatsReducer'
import GradientBackground from '../components/gradientBackground'
import NavHeader from '../components/navigation/NavHeader'
import GearIcon from '../assets/icons/gear.svg'
import PencilIcon from '../assets/icons/pencil.svg'
import DotIcon from '../assets/icons/dot.svg'
import DotFillIcon from '../assets/icons/dot-fill.svg'
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel'
import { mockUserProfile } from '../utils/MockData'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import { timePassedSince } from '../utils/functions'
import EditProfileModal from '../components/editProfileModal'
import UserSettingsModal from '../components/userSettingsModal'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      //
    }
  ), dispatch),
})

interface IUserScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    //
  },
}
interface IUserScreenState {
  imageIndex: number,
  editProfile: boolean,
  userSettings: boolean,
}
class UserScreen extends React.Component<IUserScreenProps> {
  constructor(props: IUserScreenProps) {
    super(props)
  }

  state: IUserScreenState = {
    imageIndex: 0,
    editProfile: false,
    userSettings: false,
  }

  render() {
    const { navigation, systemStore, userStore, actions, }: IUserScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    const userProfileCarouselRef: RefObject<ICarouselInstance> = React.createRef()

    const userProfile = mockUserProfile

    return (
      <>
        {this.state.editProfile &&
          <EditProfileModal
            navigation={navigation}
            systemStore={systemStore}
            userStore={userStore}
            toggleModal={() => this.setState({ editProfile: false, })}
            actions={{
              //
            }}
          />
        }

        {this.state.userSettings &&
          <UserSettingsModal
            navigation={navigation}
            systemStore={systemStore}
            userStore={userStore}
            toggleModal={() => this.setState({ userSettings: false, })}
          />
        }

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <GradientBackground systemStore={systemStore} />
          {/* <AnimatedBackground systemStore={systemStore} /> */}

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
                  panGestureHandlerProps={{ activeOffsetX: [-10, 10], }}
                  loop={false}
                  width={Dimensions.get('window').width}
                  height={Dimensions.get('window').height * 0.60}
                  data={userProfile.media}
                  onSnapToItem={index => this.setState({ imageIndex: index, })}
                  renderItem={(item: any) => (
                    <>
                      <FastImage key={item.index} source={{ uri: item.item.image, }} style={{width: '100%', height: '100%',}} />
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
                    {Array.from({ length: userProfile.media.length, }, (v, i) => {
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
              
              <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16, paddingTop: 24, marginBottom: 8,}}>
                <View style={{flex: 1,}}>
                  <Text style={{color: Colors.lightest, fontSize: Fonts.lg, fontWeight: Fonts.heavyWeight, textShadowColor: Colors.darkest, textShadowRadius: 2,}}>{userProfile.name} <Text style={{fontWeight: Fonts.lightWeight,}}>{userProfile.age}</Text></Text>
                  <Text numberOfLines={1} style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.featherWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>Joined {timePassedSince(userProfile.joinDate, systemStore.Locale)}</Text>
                </View>
              </View>

              <View style={{flex: 1, paddingHorizontal: 16,}}>
                <Text style={{marginTop: 16, color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.lightWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>{userProfile.bio}</Text>
              </View>

              <View style={{height: 80,}} />
            </ScrollView>
          </View>

          <NavTabBar
            systemStore={systemStore}
            activeTab={Screens.User}
            profilePicture={null}
            onPressStreetPass={() => navigation.navigate(Screens.StreetPass)}
            onPressChat={() => navigation.navigate(Screens.Chats)}
            onPressUser={() => null}
          />
        </View>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserScreen)
