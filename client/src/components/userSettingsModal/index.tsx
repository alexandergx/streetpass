import React from 'react'
import {
  View,
  ScrollView,
  Text,
  Linking,
} from 'react-native'
import NavHeader from '../navigation/NavHeader'
import { BlurView } from '@react-native-community/blur'
import ListGroup, { IListGroupConfig } from '../listGroup'
import { IUserStore } from '../../state/reducers/UserReducer'
import CrossIcon from '../../assets/icons/cross.svg'
import ProfileIcon from '../../assets/icons/profile.svg'
import LockedIcon from '../../assets/icons/locked.svg'
import UnlockedIcon from '../../assets/icons/unlocked.svg'
import CompassIcon from '../../assets/icons/compass.svg'
import SwatchIcon from '../../assets/icons/swatch.svg'
// import LanguageIcon from '../../assets/icons/locale.svg'
import PhoneIcon from '../../assets/icons/phone.svg'
import EmailIcon from '../../assets/icons/email.svg'
import KeyIcon from '../../assets/icons/key.svg'
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

interface IProfileSettingsModalProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  // handleLogout: () => void,
}
interface IProfileSettingsModalState {
  settings: boolean,
  loggingOut: boolean,
}
class UserSettingsModal extends React.Component<IProfileSettingsModalProps> {
  state: IProfileSettingsModalState = {
    settings: true,
    loggingOut: false,
  }

  render() {
    const { navigation, systemStore, userStore, toggleModal, }: IProfileSettingsModalProps = this.props
    const { Colors, Fonts, } = systemStore

    const profileConfig: IListGroupConfig = {
      title: 'App',
      list: [
        { Icon: SwatchIcon, title: 'App style', content: null, onPress: () => null, },
        { Icon: BellIcon, title: 'Notifications', onPress: () => null, },
        { Icon: RestrictedIcon, title: 'Blocked', onPress: () => null, },
      ],
    }

    const accountConfig: IListGroupConfig = {
      title: 'Account',
      list: [
        { Icon: EmailIcon, title: 'Email', content: userStore.user.email, onPress: () => null, },
        { Icon: PhoneIcon, title: 'Phone number', content:
          `${userStore.user.countryCode && userStore.user.phoneNumber ? '+' : ''}${userStore.user.countryCode ? userStore.user.countryCode : ''} ${userStore.user.phoneNumber ? userStore.user.phoneNumber : ''}`,
          onPress: () => null, },
        { Icon: DeleteIcon, title: 'Delete account', onPress: () => null, },
        // { Icon: ShieldIcon, title: '2FA', onPress: () => navigation.navigate(Screens.TwoFactor),},
        { Icon: ExitIcon, title: 'Sign out', disabled: false, noRight: true, loading: this.state.loggingOut,
          onPress: async () => {
            // this.setState({ loggingOut: true, })
            // await handleLogout()
            // this.setState({ loggingOut: false, })
          },
        },
      ],
    }

    const supportConfig: IListGroupConfig = {
      title: 'Support',
      list: [
        { Icon: InfoIcon, title: 'About', onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/about`), },
        { Icon: QuestionIcon, title: 'Help', onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/help`), },
        { Icon: BookIcon, title: 'Terms of Service & Privacy Policy', onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/tos`), },
      ],
    }

    return (
      <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 2, width: '100%', height: '100%',}}>
        <NavHeader
          systemStore={systemStore}
          color={Colors.lightest}
          StartIcon={CrossIcon}
          onPress={() => this.state.loggingOut ? null : toggleModal()}
        />

        <View style={{flex: 1, width: '100%', height: '100%',}}>

          <ScrollView style={{width: '100%', height: '100%', paddingHorizontal: 16,}} showsVerticalScrollIndicator={false}>
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
    )
  }
}

export default UserSettingsModal
