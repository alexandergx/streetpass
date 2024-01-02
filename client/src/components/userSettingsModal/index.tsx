import React from 'react'
import {
  View,
  ScrollView,
  Text,
  Linking,
  Animated,
  Dimensions,
} from 'react-native'
import NavHeader from '../navigation/NavHeader'
import { BlurView } from '@react-native-community/blur'
import ListGroup, { IListGroupConfig } from '../listGroup'
import { IUserStore } from '../../state/reducers/UserReducer'
import CrossIcon from '../../assets/icons/cross.svg'
import SwatchIcon from '../../assets/icons/swatch.svg'
import PhoneIcon from '../../assets/icons/phone.svg'
import EmailIcon from '../../assets/icons/email.svg'
import BellIcon from '../../assets/icons/bell-solid.svg'
import RestrictedIcon from '../../assets/icons/restricted.svg'
import DeleteIcon from '../../assets/icons/delete.svg'
import ExitIcon from '../../assets/icons/logout.svg'
import QuestionIcon from '../../assets/icons/question.svg'
import InfoIcon from '../../assets/icons/info.svg'
import BookIcon from '../../assets/icons/book.svg'
import { Screens } from '../../navigation'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import AppTitle from '../appTitle'
import { AppVersion } from '../../utils/constants'
import { baseUrl, protocol } from '../../api'
import { Lit } from '../../utils/locale'
import { formatPhonenumber } from '../../utils/data'

interface IProfileSettingsModalProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  handleSignOut: () => void,
}
interface IProfileSettingsModalState {
  settings: boolean,
  signingOut: boolean,
}
class UserSettingsModal extends React.Component<IProfileSettingsModalProps> {
  constructor(props: IProfileSettingsModalProps) {
    super(props)
    this.fadeAnim = new Animated.Value(0)
    this.heightAnim = new Animated.Value(Dimensions.get('window').height)
  }
  fadeAnim: Animated.Value
  heightAnim: Animated.Value

  state: IProfileSettingsModalState = {
    settings: true,
    signingOut: false,
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true, }),
      Animated.timing(this.heightAnim, { toValue: 0, duration: 200, useNativeDriver: true, }),
    ]).start()
  }

  close = () => {
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true, }),
      Animated.timing(this.heightAnim, { toValue: Dimensions.get('window').height, duration: 200, useNativeDriver: true, }),
    ]).start(() => this.props.toggleModal())
  }

  render() {
    const { navigation, systemStore, userStore, handleSignOut, }: IProfileSettingsModalProps = this.props
    const { Colors, Fonts, } = systemStore

    const profileConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.App,
      list: [
        { Icon: SwatchIcon, title: Lit[systemStore.Locale].ScreenTitle.AppStyleScreen, content: null, onPress: () => navigation.navigate(Screens.AppStyle), },
        { Icon: BellIcon, title: Lit[systemStore.Locale].ScreenTitle.NotificationsScreen, onPress: () => navigation.navigate(Screens.Notifications), },
        // { Icon: RestrictedIcon, title: Lit[systemStore.Locale].ScreenTitle.BlockingScreen, onPress: () => navigation.navigate(Screens.Blocking), },
      ],
    }

    // formatPhonenumber(userStore.user.countryCode, userStore.user.phoneNumber)

    const accountConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.Account,
      list: [
        { Icon: EmailIcon, title: Lit[systemStore.Locale].ScreenTitle.EmailScreen, content: userStore.user.email, onPress: () => navigation.navigate(Screens.Email), },
        { Icon: PhoneIcon, title: Lit[systemStore.Locale].ScreenTitle.PhoneNumberScreen, content:
          `${userStore.user.countryCode && userStore.user.phoneNumber ? `+${userStore.user.countryCode} ${formatPhonenumber(userStore.user.countryCode, userStore.user.phoneNumber)}` : ''}`,
          onPress: () => navigation.navigate(Screens.PhoneNumber), },
        { Icon: DeleteIcon, title: Lit[systemStore.Locale].Title.DeleteAccount, onPress: () => navigation.navigate(Screens.DeleteAccount), },
        { Icon: ExitIcon, title: Lit[systemStore.Locale].Title.SignOut, disabled: false, noRight: true, loading: this.state.signingOut,
          onPress: async () => {
            this.setState({ signingOut: true, })
            await handleSignOut()
            this.setState({ signingOut: false, })
          },
        },
      ],
    }

    const supportConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.Support,
      list: [
        { Icon: InfoIcon, title: Lit[systemStore.Locale].Title.About, onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/about`), },
        { Icon: QuestionIcon, title: Lit[systemStore.Locale].Title.Help, onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/help`), },
        { Icon: BookIcon, title: Lit[systemStore.Locale].Title.ToS, onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/tos`), },
      ],
    }

    return (
      <Animated.View style={{position: 'absolute', zIndex: 2, width: '100%', height: '100%', opacity: this.fadeAnim, transform: [{ translateY: this.heightAnim }],}}>
        <BlurView blurType={Colors.darkBlur as any} style={{width: '100%', height: '100%',}}>
          <NavHeader
            systemStore={systemStore}
            title={Lit[systemStore.Locale].Title.Settings}
            color={Colors.lightest}
            StartIcon={CrossIcon}
            onPress={() => this.state.signingOut ? null : this.close()}
          />

          <View style={{flex: 1, width: '100%', height: '100%',}}>

            <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%', height: '100%', paddingHorizontal: 16,}} >
              <ListGroup systemStore={systemStore} config={profileConfig} />
              <ListGroup systemStore={systemStore} config={accountConfig} />
              <ListGroup systemStore={systemStore} config={supportConfig} />

              <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginVertical: 32,}}>
                <AppTitle systemStore={systemStore} fontSize={Fonts.sm} fontWeight={Fonts.lightWeight} />
                <Text
                  style={{color: Colors.light, fontWeight: Fonts.lightWeight as any, fontSize: Fonts.sm,}}
                > v{AppVersion}</Text>
              </View>

              <View style={{height: 32,}} />
            </ScrollView>
          </View>
        </BlurView>
      </Animated.View>
    )
  }
}

export default UserSettingsModal
