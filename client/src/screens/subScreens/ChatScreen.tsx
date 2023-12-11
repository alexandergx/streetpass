import React from 'react'
import { Keyboard, } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores } from '../../state/store'
import { IUserStore } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { IListGroupConfig } from '../../components/listGroup'
// import { deleteMessage, getMessages, reactMessage, sendMessage, setNotificationsChat, } from '../../api/chats'
import ChatBlock from '../../components/chatBlock'
import { IChat, IChatsStore, IMessage } from '../../state/reducers/ChatsReducer'
// import { ISetChatId, ISetReadChat, setChatId, setChats, setReadChat } from '../state/actions/ChatsActions'
// import PushNotificationIOS from '@react-native-community/push-notification-ios'
import { Screens, } from '../../navigation'
import StreetPassModal from '../../components/streetPassModal'
import GradientBackground from '../../components/gradientBackground'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import { IMatch } from '../../state/reducers/MatchesReducer'
import { IStreetPass } from '../../state/reducers/StreetPassReducer'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, chatsStore, } = state
  return { systemStore, userStore, chatsStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      // setChatId,
      // setReadChat,
      // setMediaMetadata,
      // unsetMedia,
      // setMediaLiked,
      // setProfile,
      // setChats,
      // setProfileSearch,
      // unsetProfileSearch,
    }
  ), dispatch),
})

interface IChatScreenProps {
  navigation: any,
  route: { params: { chatId?: string, match: IMatch, }, } | any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  chatsStore: IChatsStore,
  actions: {
    // setChatId: (params: ISetChatId) => void,
    // setReadChat: (params: ISetReadChat) => void,
    // setProfile: () => void,
    // setMediaMetadata: (params: ISetMediaMetadata) => void,
    // unsetMedia: () => void,
    // setMediaLiked: (params: ISetMediaLiked) => void,
    // setChats: () => void,
    // setProfileSearch: (params: ISetProfileSearch) => void,
    // unsetProfileSearch: () => void,
  },
}
export interface IChatScreenState {
  loading: boolean,
  messageLoading: boolean,
  keyboard: boolean,
  mounted: false,
  message: string,
  messageId: string | null,
  messageIdTime: string | null,
  messages: Array<IMessage> | null,
  chat: IChat | null,
  messagesPage: number | null,
  selectionModalConfig: IListGroupConfig | null,
  active: boolean,
  streetPass: IStreetPass | null,
}
class ChatScreen extends React.Component<IChatScreenProps> {
  constructor(props: any) {
    super(props)
    this.flatListRef = React.createRef()
  }
  flatListRef: any

  state: IChatScreenState = {
    loading: false,
    messageLoading: false,
    keyboard: false,
    mounted: false,
    message: '',
    messageId: null,
    messageIdTime: null,
    messages: null,
    chat: this.props.chatsStore.chats?.find(chat => chat.chatId === this.props.route.params?.chatId) || null,
    messagesPage: null,
    selectionModalConfig: null,
    active: false,
    streetPass: null,
  }

  focusListener!: () => void
  blurListener!: () => void
  UNSAFE_componentWillMount = async () => {
    this.focusListener = this.props.navigation.addListener('focus', () => {
      this.setState({ active: true, })
    })
    this.blurListener = this.props.navigation.addListener('blur', () => {
      this.setState({ active: false, })
    })
    this.setState({ loading: true, })
    this.loadMessages()
    this.setState({ loading: false, mounted: true, })
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  componentDidMount () {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    // this.props.actions.setChatId(this.props.route.params?.chatId || this.state.chat?.chatId || null)
  }
  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
    // this.props.actions.setChatId(null)
  }
  keyboardWillShow = () => {
    this.setState({ keyboard: true, })
  }
  keyboardWillHide = () => {
    this.setState({ keyboard: false, })
  }

  setMessage = (text: string) => { this.setState({ message: text, }) }

  setMessageId = (messageId: string | null) => { this.setState({ messageId, }) }

  setMessageIdTime = (messageId: string | null) => { this.setState({ messageIdTime: messageId, }) }

  setSelectionModalConfig = (selectionModalConfig: IListGroupConfig | null) => { this.setState({ selectionModalConfig, }) }

  setNewMessage = (message: IMessage) => {
    // this.props.actions.setReadChat(message.chatId)
    // this.setState({ messages: this.state.messages ? [message, ...this.state.messages] : [message], chat: { ...this.state.chat, chatId: message.chatId, }, })
  }

  loadMessages = async () => {
    // if ((this.state.messagesPage !== -1) && !this.state.loading) {
    //   this.setState({ loading: true, })
    //   const messages = await getMessages({
    //     chatId: this.props.route.params?.chatId,
    //     userId: this.props.route.params?.userId,
    //     index: (this.state.messages && this.state.messages[this.state.messages.length - 1].messageId) || undefined,
    //     messagesPage: this.state.messagesPage,
    //   })
    //   this.setState({
    //     messagesPage: messages.messagesPage,
    //     messages: messages.messagesPage === 0
    //       ? messages.messages
    //       : messages.messagesPage === -1 && (this.state.messagesPage === null || this.state.messagesPage === -1)
    //         ? messages.messages
    //         : [...this.state.messages || [], ...messages.messages],
    //     chat: messages.chat || null,
    //   })
    //   this.props.actions.setChatId(messages.chat?.chatId || null)
    //   messages.chat?.chatId && this.props.actions.setReadChat(messages.chat.chatId)
    //   if (messages.chat?.unread) {
    //     PushNotificationIOS.getApplicationIconBadgeNumber((badgeCount) => {
    //       if (badgeCount > 0) { PushNotificationIOS.setApplicationIconBadgeNumber(badgeCount - 1) }
    //     })
    //   }
    //   this.setState({ loading: false, })
    // }
  }

  sendMessage = async () => {
    // this.setState({ loading: true, messageLoading: true, message: '', })
    // await sendMessage({ userId: this.state.chat?.userId || this.props.route.params?.userId, message: this.state.message, })
    // this.setState({ loading: false, messageLoading: false, })
  }

  removeMessage = async ({ chatId, messageId, pushDelete, }: { chatId: string, messageId: string, pushDelete?: boolean, }) => {
    // let deleteMessageResult
    // if (!pushDelete) {
    //   this.setState({ loading: true, })
    //   deleteMessageResult = await deleteMessage({ chatId, messageId, })
    //   return
    // }
    // if (deleteMessageResult || pushDelete) {
    //   this.setState((state: IChatScreenState) => ({
    //     messages: state.messages?.map(message => message.messageId === messageId ? { ...message, deleted: true, } : message)
    //   }))
    // }
    // this.setState({ loading: false, messageId: null, })
  }

  setMessageReaction = async ({ chatId, messageId, userId, reaction, pushReact, }: { chatId: string, userId: string, messageId: string, reaction?: string,  pushReact?: boolean, }) => {
    // if (!pushReact) {
    //   this.setState({ loading: true, })
    //   await reactMessage({ chatId, messageId, userId, reaction: reaction || null, })
    //   return
    // }
    // if (pushReact) {
    //   this.setState((state: IChatScreenState) => ({
    //     messages: state.messages?.map(message => {
    //       if (message.messageId === messageId) {
    //         let newMessage = {...message}
    //         if (userId === this.props.userStore.user.userId) {
    //           if (userId === message.userId) {
    //             newMessage.authUserReaction = reaction
    //           } else {
    //             newMessage.userReaction = reaction
    //           }
    //         } else {
    //           newMessage.userReaction = reaction
    //         }
    //         return newMessage
    //       }
    //       return message
    //     }
    //       // message.messageId === messageId
    //       // ? message.userId === this.props.userStore.user.userId
    //       //   ? { ...message, authUserReaction: reaction, }
    //       //   : { ...message, userReaction: reaction, }
    //       // : message
    //     )
    //   }))
    // }
    // this.setState({ loading: false, })
  }

  setNotifications = async () => {
    // if (this.state.chat?.chatId) {
    //   this.setState({ loading: true, })
    //   await setNotificationsChat({
    //     chatId: this.state.chat.chatId,
    //     notifications: this.state.chat?.notifications || this.state.chat?.notifications === null ? false : true,
    //   })
    //   this.setState({ chat: { ...this.state.chat, notifications: this.state.chat?.notifications || this.state.chat?.notifications === null ? false : true, }, })
    //   this.setState({ loading: false, selectionModalConfig: null, })
    // }
  }

  setStreetPass = () => {
    this.setState({ streetPass: this.state.streetPass ? null : this.props.route.params.match, })
  }

  render() {
    const { systemStore, navigation, userStore, chatsStore, actions, }: IChatScreenProps = this.props

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <ChatBlock
          navigation={navigation}
          route={this.props.route}
          systemStore={systemStore}
          userStore={userStore}
          state={this.state}
          setMessage={this.setMessage}
          setMessageId={this.setMessageId}
          setMessageIdTime={this.setMessageIdTime}
          setSelectionModalConfig={this.setSelectionModalConfig}
          setNewMessage={this.setNewMessage}
          loadMessages={this.loadMessages}
          sendMessage={this.sendMessage}
          removeMessage={this.removeMessage}
          setMessageReaction={this.setMessageReaction}
          setNotifications={this.setNotifications}
          setStreetPass={this.setStreetPass}
          actions={{
            // setChatId: actions.setChatId,
            // setReadChat: actions.setReadChat,
          }}
        />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
