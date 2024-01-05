import React from 'react'
import { AppState, Keyboard, } from 'react-native'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores } from '../../state/store'
import { IUserStore } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { IListGroupConfig } from '../../components/listGroup'
import ChatBlock from '../../components/chatBlock'
import GradientBackground from '../../components/gradientBackground'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import { IMatch } from '../../state/reducers/MatchesReducer'
import { IStreetpass } from '../../state/reducers/StreetpassReducer'
import { ISetSeenMatch, IUnsetMatch, setSeenMatch, unsetMatch } from '../../state/actions/MatchesActions'
import { IChat, IChatsStore, } from '../../state/reducers/ChatsReducer'
import { ISetChatKey, ISetChatNotifications, ISetMessages, ISetReadChat, ISetUpdateMessages, IUnsetChat, setChatKey, setChatNotifications, setMessages, setReadChat, setUpdateMessages, unsetChat } from '../../state/actions/ChatsActions'
import { ISetChatMessage, setChatMessage } from '../../state/actions/ChatMessagesActions'
import { IChatMessagesStore } from '../../state/reducers/ChatMessagesReducer'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, chatsStore, chatMessagesStore, } = state
  return { systemStore, userStore, chatsStore, chatMessagesStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setSeenMatch,
      setMessages,
      setUpdateMessages,
      unsetMatch,
      unsetChat,
      setChatKey,
      setReadChat,
      setChatNotifications,
      setChatMessage,
    }
  ), dispatch),
})

interface IChatScreenProps {
  navigation: any,
  route: { params: { chat?: IChat, match?: IMatch, }, } | any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  chatsStore: IChatsStore,
  chatMessagesStore: IChatMessagesStore,
  actions: {
    setSeenMatch: (params: ISetSeenMatch) => void,
    setMessages: (params: ISetMessages) => void,
    setUpdateMessages: (params: ISetUpdateMessages) => void,
    unsetMatch: (params: IUnsetMatch) => void,
    unsetChat: (params: IUnsetChat) => void,
    setChatKey: (params: ISetChatKey) => void,
    setReadChat: (params: ISetReadChat) => void,
    setChatNotifications: (params: ISetChatNotifications) => void,
    setChatMessage: (params: ISetChatMessage) => void,
  },
}
export interface IChatScreenState {
  keyboard: boolean,
  appState: string | null,
  appStateListener: any,
  match: IMatch | null,
  chat: IChat | null,
  userId: string,
  selectionModalConfig: IListGroupConfig | null,
  streetpass: IStreetpass | null,
  messageId: string | null,
  messageIndex: number | null
  messageTime: string | null,
  sending: boolean,
  paginating: boolean,
}
class ChatScreen extends React.Component<IChatScreenProps> {
  constructor(props: IChatScreenProps) {
    super(props)
    this.flatListRef = React.createRef()
  }
  flatListRef: any

  state: IChatScreenState = {
    keyboard: false,
    appState: null,
    appStateListener: null,
    match: this.props.route.params.match || null,
    chat: this.props.chatsStore.chats?.find(chat => chat.userId === this.props.route.params.match?.userId || chat.userId === this.props.route.params.chat?.userId) || null,
    userId: this.props.route.params.match?.userId || this.props.route.params.chat.userId,
    selectionModalConfig: null,
    streetpass: null,
    messageId: null,
    messageIndex: null,
    messageTime: null,
    sending: false,
    paginating: false,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  keyboardWillShow = () => this.setState({ keyboard: true, messageId: null, messageIndex: null, })
  keyboardWillHide = () => this.setState({ keyboard: false, })
  focusListener!: () => void
  blurListener!: () => void

  UNSAFE_componentWillMount = async () => {
    this.focusListener = this.props.navigation.addListener('focus', () => this.setState({ active: true, }))
    this.blurListener = this.props.navigation.addListener('blur', () => this.setState({ active: false, }))
    const appStateListener = AppState.addEventListener('change', this.appStateChange)
    this.setState({ appStateListener, })
    this.props.actions.setChatKey(this.state.userId)
    if (!this.props.chatsStore.messages[this.state.userId]) this.props.actions.setChatMessage({ userId: this.state.userId, message: '', })
    if (this.state.chat && this.props.chatsStore.messages[this.state.userId]?.continue !== false) {
      this.props.actions.setMessages({ chatId: this.state.chat.chatId, userId: this.state.userId, index: undefined, })
    }
    if (this.state.chat && this.state.chat.lastMessageId !== this.props.chatsStore.messages[this.state.userId]?.messages?.[0]?.messageId) {
      this.props.actions.setUpdateMessages({
        chatId: this.state.chat.chatId,
        userId: this.state.chat.userId,
        messageId: this.props.chatsStore.messages[this.state.userId]?.messages?.[0]?.messageId as string,
      })
    }
  }

  componentDidMount(): void {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    if (this.state.match && this.state.match.seen === false) this.props.actions.setSeenMatch({ userId: this.state.match.userId, })
    if (this.state.chat && this.state.chat.unread) this.props.actions.setReadChat({ chatId: this.state.chat.chatId, })
  }

  componentDidUpdate(): void {
    if (!this.state.chat) {
      const chat = this.props.chatsStore.chats?.find(chat => chat.userId === this.state.userId)
      if (chat) this.setState({ chat: chat, })
    }
  }

  componentWillUnmount(): void {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
    this.props.actions.setChatKey(null)
    if (this.state.appStateListener) this.state.appStateListener.remove()
    if (this.state.chat && this.props.chatsStore.chats?.find(chat => chat.chatId === this.state.chat?.chatId)?.unread) this.props.actions.setReadChat({ chatId: this.state.chat.chatId, })
  }

  appStateChange = (nextAppState: any) => {
    if ((this.state.appState === 'inactive' && nextAppState === 'background') || (this.state.appState === 'background' && nextAppState === 'active')) {
      if (this.state.chat && this.props.chatsStore.chats?.find(chat => chat.chatId === this.state.chat?.chatId)?.unread) this.props.actions.setReadChat({ chatId: this.state.chat.chatId, })
    }
    this.setState({ appState: nextAppState, })
  }

  render() {
    const { navigation, systemStore, userStore, chatsStore, chatMessagesStore, actions, }: IChatScreenProps = this.props

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
          messages={chatsStore.messages[this.state.userId]}
          chatMessage={chatMessagesStore.chatMessages[this.state.userId]}
          setState={(params) => this.setState({ ...params, })}
          actions={{
            setMessages: actions.setMessages,
            setChatMessage: actions.setChatMessage,
            unsetMatch: actions.unsetMatch,
            unsetChat: actions.unsetChat,
            setChatKey: actions.setChatKey,
            setChatNotifications: actions.setChatNotifications,
          }}
        />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
