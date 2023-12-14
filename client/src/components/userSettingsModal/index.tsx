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

interface IProfileSettingsModalProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  // handleLogout: () => void,
}
interface IProfileSettingsModalState {
  settings: boolean,
  signingOut: boolean,
}
class UserSettingsModal extends React.Component<IProfileSettingsModalProps> {
  state: IProfileSettingsModalState = {
    settings: true,
    signingOut: false,
  }

  render() {
    const { navigation, systemStore, userStore, toggleModal, }: IProfileSettingsModalProps = this.props
    const { Colors, Fonts, } = systemStore

    const profileConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.App,
      list: [
        { Icon: SwatchIcon, title: Lit[systemStore.Locale].ScreenTitle.AppStyleScreen, content: null, onPress: () => navigation.navigate(Screens.AppStyle), },
        { Icon: BellIcon, title: Lit[systemStore.Locale].ScreenTitle.NotificationsScreen, onPress: () => navigation.navigate(Screens.Notifications), },
        { Icon: RestrictedIcon, title: Lit[systemStore.Locale].ScreenTitle.BlockingScreen, onPress: () => navigation.navigate(Screens.Blocking), },
      ],
    }

    const accountConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.Account,
      list: [
        { Icon: EmailIcon, title: Lit[systemStore.Locale].ScreenTitle.EmailScreen, content: userStore.user.email, onPress: () => navigation.navigate(Screens.Email), },
        { Icon: PhoneIcon, title: Lit[systemStore.Locale].ScreenTitle.PhoneNumberScreen, content:
          `${userStore.user.countryCode && userStore.user.phoneNumber ? '+' : ''}${userStore.user.countryCode ? userStore.user.countryCode : ''} ${userStore.user.phoneNumber ? userStore.user.phoneNumber : ''}`,
          onPress: () => navigation.navigate(Screens.PhoneNumber), },
        { Icon: DeleteIcon, title: Lit[systemStore.Locale].Title.DeleteAccount, onPress: () => navigation.navigate(Screens.DeleteAccount), },
        { Icon: ExitIcon, title: Lit[systemStore.Locale].Title.SignOut, disabled: false, noRight: true, loading: this.state.signingOut,
          onPress: async () => {
            // this.setState({ signingOut: true, })
            // await handleLogout()
            // this.setState({ signingOut: false, })
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
      <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 2, width: '100%', height: '100%',}}>
        <NavHeader
          systemStore={systemStore}
          title={Lit[systemStore.Locale].Title.Settings}
          color={Colors.lightest}
          StartIcon={CrossIcon}
          onPress={() => this.state.signingOut ? null : toggleModal()}
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
