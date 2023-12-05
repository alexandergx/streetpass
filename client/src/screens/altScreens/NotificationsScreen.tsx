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

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      // setUpdateNotificationPreferences,
    }
  ), dispatch),
})

interface INotificationsScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    // setUpdateNotificationPreferences: (params: ISetUpdateNotificationPreferences) => void,
  }
}
interface INotificationsScreenState {
  messages: boolean,
  matches: boolean,
  streetPasses: boolean,
  emails: boolean,
  newsletters: boolean,
  loading: boolean,
}
class NotificationsScreen extends React.Component<INotificationsScreenProps> {
  state: INotificationsScreenState = {
    messages: this.props.userStore.user.notificationPreferences.messages,
    matches: this.props.userStore.user.notificationPreferences.matches,
    streetPasses: this.props.userStore.user.notificationPreferences.streetPasses,
    emails: this.props.userStore.user.notificationPreferences.emails,
    newsletters: this.props.userStore.user.notificationPreferences.newsletters,
    loading: false,
  }

  unsetNotifications = async () => {
    // Alert.alert(
    //   Lit[this.props.systemStore.Locale].Copywrite.NotificationsRequired[0], Lit[this.props.systemStore.Locale].Copywrite.NotificationsRequired[1],
    //   [
    //     { text: Lit[this.props.systemStore.Locale].Button.No, onPress: () => null, },
    //     { text: Lit[this.props.systemStore.Locale].Button.Enable, onPress: () => Linking.openURL('app-settings:')},
    //   ]
    // )
    // await this.props.actions.setUpdateNotificationPreferences({
    //   follows: false,
    //   followRequests: false,
    //   likes: false,
    //   comments: false,
    //   replies: false,
    //   subscribedPosts: false,
    //   messages: false,
    //   streetPasses: false,
    //   emails: this.props.userStore.user.notificationPreferences.emails,
    //   newsletters: this.props.userStore.user.notificationPreferences.emails,
    // })
    // this.setState({
    //   follows: false,
    //   followRequests: false,
    //   likes: false,
    //   comments: false,
    //   replies: false,
    //   subscribedPosts: false,
    //   messages: false,
    //   streetPasses: false,
    // })
  }

  unsetEmails = async () => {
    // Alert.alert(
    //   Lit[this.props.systemStore.Locale].Copywrite.EmailRequired[0], Lit[this.props.systemStore.Locale].Copywrite.EmailRequired[1],
    //   [
    //     { text: Lit[this.props.systemStore.Locale].Button.No, onPress: () => null, },
    //     { text: Lit[this.props.systemStore.Locale].Button.Enable, onPress: () => this.props.navigation.navigate(Screens.Email)},
    //   ]
    // )
    // await this.props.actions.setUpdateNotificationPreferences({
    //   follows: this.props.userStore.user.notificationPreferences.follows,
    //   followRequests: this.props.userStore.user.notificationPreferences.followRequests,
    //   likes: this.props.userStore.user.notificationPreferences.likes,
    //   comments: this.props.userStore.user.notificationPreferences.comments,
    //   replies: this.props.userStore.user.notificationPreferences.replies,
    //   subscribedPosts: this.props.userStore.user.notificationPreferences.subscribedPosts,
    //   messages: this.props.userStore.user.notificationPreferences.messages,
    //   streetPasses: this.props.userStore.user.notificationPreferences.streetPasses,
    //   emails: false,
    //   newsletters: false,
    // })
    // this.setState({
    //   emails: false,
    //   newsletters: false,
    // })
  }

  handleUpdateNotifications = async () => {
    // this.setState({ loading: true, })
    // if ((this.state.emails || this.state.newsletters) && !this.props.userStore.user.email) {
    //   this.unsetEmails()
    //   this.setState({ loading: false, })
    //   return
    // }
    // if (this.state.follows || this.state.followRequests || this.state.likes || this.state.comments || this.state.replies || this.state.subscribedPosts || this.state.messages || this.state.streetPasses) {
    //   const permissions = await PushNotificationIOS.requestPermissions()
    //   if (permissions.authorizationStatus === 1) {
    //     this.unsetNotifications()
    //     this.setState({ loading: false, })
    //     return
    //   }
    // }
    // await this.props.actions.setUpdateNotificationPreferences({
    //   follows: this.state.follows,
    //   followRequests: this.state.followRequests,
    //   likes: this.state.likes,
    //   comments: this.state.comments,
    //   replies: this.state.replies,
    //   subscribedPosts: this.state.subscribedPosts,
    //   messages: this.state.messages,
    //   streetPasses: this.state.streetPasses,
    //   emails: this.state.emails,
    //   newsletters: this.state.newsletters,
    // })
    // this.setState({ loading: false, })
    // this.props.navigation.goBack()
  }

  render() {
    const { navigation, systemStore, }: INotificationsScreenProps = this.props

    const pushNotificationsConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.Alerts,
      list: [
        { Icon: MessageIcon, title: Lit[systemStore.Locale].Title.Messages, toggleValue: this.state.messages, onToggle: () => this.setState({ messages: !this.state.messages, }), },
        { Icon: MessageIcon, title: Lit[systemStore.Locale].Title.Matches, toggleValue: this.state.matches, onToggle: () => this.setState({ matches: !this.state.matches, }), },
        { Icon: MessageIcon, title: Lit[systemStore.Locale].Title.StreetPasses, toggleValue: this.state.streetPasses, onToggle: () => this.setState({ streetPasses: !this.state.streetPasses, }), },
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
