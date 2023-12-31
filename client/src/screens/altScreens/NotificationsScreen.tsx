import React from 'react'
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Linking,
  Alert,
} from 'react-native'
import Button from '../../components/button'
import NavHeader from '../../components/navigation/NavHeader'
import GradientBackground from '../../components/gradientBackground'
import { connect, } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import ListGroup, { IListGroupConfig } from '../../components/listGroup'
import UserIcon from '../../assets/icons/user.svg'
import UserAddIcon from '../../assets/icons/user-add.svg'
import HeartIcon from '../../assets/icons/heart-solid.svg'
import ChatIcon from '../../assets/icons/comment-solid.svg'
import AtIcon from '../../assets/icons/at.svg'
import BellIcon from '../../assets/icons/bell-angle-solid.svg'
import MessageIcon from '../../assets/icons/message-solid.svg'
import EmailIcon from '../../assets/icons/email.svg'
import PaperIcon from '../../assets/icons/paper.svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { IUserStore } from '../../state/reducers/UserReducer'
// import { setUpdateNotificationPreferences, ISetUpdateNotificationPreferences, } from '../../state/actions/UserActions'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Lit, } from '../../utils/locale'
import { Screens, } from '../../navigation'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import { ISetUpdateUser, setUpdateUser } from '../../state/actions/UserActions'

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

interface INotificationsScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setUpdateUser: (params: ISetUpdateUser) => Promise<void>,
  }
}
interface INotificationsScreenState {
  messages: boolean,
  matches: boolean,
  streetpasses: boolean,
  emails: boolean,
  newsletters: boolean,
  loading: boolean,
}
class NotificationsScreen extends React.Component<INotificationsScreenProps> {
  state: INotificationsScreenState = {
    messages: this.props.userStore.user.notificationPreferences.messages,
    matches: this.props.userStore.user.notificationPreferences.matches,
    streetpasses: this.props.userStore.user.notificationPreferences.streetpasses,
    emails: this.props.userStore.user.notificationPreferences.emails,
    newsletters: this.props.userStore.user.notificationPreferences.newsletters,
    loading: false,
  }

  unsetNotifications = async () => {
    Alert.alert(
      Lit[this.props.systemStore.Locale].Copywrite.NotificationsRequired[0], Lit[this.props.systemStore.Locale].Copywrite.NotificationsRequired[1],
      [
        { text: Lit[this.props.systemStore.Locale].Button.No, onPress: () => null, },
        { text: Lit[this.props.systemStore.Locale].Button.Enable, onPress: () => Linking.openURL('app-settings:')},
      ]
    )
    await this.props.actions.setUpdateUser({
      notificationPreferences: {
        messages: false,
        matches: false,
        streetpasses: false,
        emails: this.props.userStore.user.notificationPreferences.emails,
        newsletters: this.props.userStore.user.notificationPreferences.newsletters,
      }
    })
    this.setState({
      messages: false,
      matches: false,
      streetpasses: false,
    })
  }

  unsetEmails = async () => {
    Alert.alert(
      Lit[this.props.systemStore.Locale].Copywrite.EmailRequired[0], Lit[this.props.systemStore.Locale].Copywrite.EmailRequired[1],
      [
        { text: Lit[this.props.systemStore.Locale].Button.No, onPress: () => null, },
        { text: Lit[this.props.systemStore.Locale].Button.Enable, onPress: () => this.props.navigation.navigate(Screens.Email)},
      ]
    )
    await this.props.actions.setUpdateUser({
      notificationPreferences: {
        messages: this.props.userStore.user.notificationPreferences.messages,
        matches: this.props.userStore.user.notificationPreferences.matches,
        streetpasses: this.props.userStore.user.notificationPreferences.streetpasses,
        emails: false,
        newsletters: false,
      }
    })
    this.setState({
      emails: false,
      newsletters: false,
    })
  }

  handleUpdateNotifications = async () => {
    this.setState({ loading: true, })
    if ((this.state.emails || this.state.newsletters) && !this.props.userStore.user.email) {
      this.unsetEmails()
      this.setState({ loading: false, })
      return
    }
    if (this.state.messages || this.state.matches || this.state.streetpasses) {
      // const permissions = await PushNotificationIOS.requestPermissions()
      // if (permissions.authorizationStatus === 1) {
      //   this.unsetNotifications()
      //   this.setState({ loading: false, })
      //   return
      // }
    }
    await this.props.actions.setUpdateUser({
      notificationPreferences: {
        messages: this.state.messages,
        matches: this.state.matches,
        streetpasses: this.state.streetpasses,
        emails: this.state.emails,
        newsletters: this.state.newsletters,
      }
    })
    this.setState({ loading: false, })
    this.props.navigation.goBack()
  }

  render() {
    const { navigation, systemStore, }: INotificationsScreenProps = this.props

    const pushNotificationsConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.Alerts,
      list: [
        { Icon: MessageIcon, title: Lit[systemStore.Locale].Title.Messages, toggleValue: this.state.messages, onToggle: () => this.setState({ messages: !this.state.messages, }), },
        { Icon: MessageIcon, title: Lit[systemStore.Locale].Title.Matches, toggleValue: this.state.matches, onToggle: () => this.setState({ matches: !this.state.matches, }), },
        { Icon: MessageIcon, title: Lit[systemStore.Locale].Title.Streetpasses, toggleValue: this.state.streetpasses, onToggle: () => this.setState({ streetpasses: !this.state.streetpasses, }), },
      ],
    }

    const notificationsConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.Email,
      list: [
        { Icon: EmailIcon, title: Lit[systemStore.Locale].Title.EmailNotifications, toggleValue: this.state.emails, onToggle: () => this.setState({ emails: !this.state.emails, }), },
        { Icon: PaperIcon, title: Lit[systemStore.Locale].Title.Newsletters, toggleValue: this.state.newsletters, onToggle: () => this.setState({ newsletters: !this.state.newsletters, }), },
      ],
    }

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.NotificationsScreen} />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            flex: 1, display: 'flex',
            justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
          }}
        >
          <View style={{flex: 1, width: '100%',}}>
            <ScrollView>
              <ListGroup systemStore={systemStore} config={pushNotificationsConfig} />
              <ListGroup systemStore={systemStore} config={notificationsConfig} />
            </ScrollView>
          </View>

          <View style={{flex: 0, width: '100%', marginBottom: 32,}}>
            <Button
              systemStore={systemStore}
              onPress={this.handleUpdateNotifications}
              title={Lit[systemStore.Locale].Button.Save}
              loading={this.state.loading}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(NotificationsScreen)
