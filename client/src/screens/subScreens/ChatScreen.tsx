import React from 'react'
import { AppState, Keyboard, AppStateStatus, } from 'react-native'
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
import { IChat, IChatsStore, IMessages } from '../../state/reducers/ChatsReducer'
import { ISetChatMessage, ISetChatNotifications, ISetMessages, ISetReadChat, IUnsetChat, setChatMessage, setChatNotifications, setMessages, setReadChat, unsetChat } from '../../state/actions/ChatsActions'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, chatsStore, } = state
  return { systemStore, userStore, chatsStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setSeenMatch,
      setMessages,
      setChatMessage,
      unsetMatch,
      unsetChat,
      setReadChat,
      setChatNotifications,
    }
  ), dispatch),
})

interface IChatScreenProps {
  navigation: any,
  route: { params: { chat?: IChat, match?: IMatch, }, } | any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  chatsStore: IChatsStore,
  actions: {
    setSeenMatch: (params: ISetSeenMatch) => void,
    setMessages: (params: ISetMessages) => void,
    setChatMessage: (params: ISetChatMessage) => void,
    unsetMatch: (params: IUnsetMatch) => void,
    unsetChat: (params: IUnsetChat) => void,
    setReadChat: (params: ISetReadChat) => void,
    setChatNotifications: (params: ISetChatNotifications) => void,
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
  messageIdTime: string | null,
  sending: boolean,
  paginating: boolean,
}
class ChatScreen extends React.Component<IChatScreenProps> {
  constructor(props: any) {
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
    messageIdTime: null,
    sending: false,
    paginating: false,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  keyboardWillShow = () => this.setState({ keyboard: true, })
  keyboardWillHide = () => this.setState({ keyboard: false, })
  focusListener!: () => void
  blurListener!: () => void

  UNSAFE_componentWillMount = async () => {
    this.focusListener = this.props.navigation.addListener('focus', () => this.setState({ active: true, }))
    this.blurListener = this.props.navigation.addListener('blur', () => this.setState({ active: false, }))
    const appStateListener = AppState.addEventListener('change', this.appStateChange)
    this.setState({ appStateListener, })
    if (!this.props.chatsStore.messages[this.state.userId]) this.props.actions.setChatMessage({ userId: this.state.userId, message: '', })
    if (this.state.chat && this.props.chatsStore.messages[this.state.userId]?.continue !== false) {
      this.props.actions.setMessages({ chatId: this.state.chat.chatId, userId: this.state.userId, index: undefined, })
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
    if (this.state.appStateListener) this.state.appStateListener.remove()
    if (this.state.chat && this.state.chat.unread) this.props.actions.setReadChat({ chatId: this.state.chat.chatId, })
  }

  appStateChange = (nextAppState: any) => {
    if ((this.state.appState === 'inactive' && nextAppState === 'background') || (this.state.appState === 'background' && nextAppState === 'active')) {
      if (this.state.chat && this.state.chat.unread) this.props.actions.setReadChat({ chatId: this.state.chat.chatId, })
    }
    this.setState({ appState: nextAppState, })
  }

  render() {
    const { navigation, systemStore, userStore, chatsStore, actions, }: IChatScreenProps = this.props

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
          setState={(params) => this.setState({ ...params, })}
          actions={{
            setMessages: actions.setMessages,
            setChatMessage: actions.setChatMessage,
            unsetMatch: actions.unsetMatch,
            unsetChat: actions.unsetChat,
            setChatNotifications: actions.setChatNotifications,
          }}
        />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
