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
import { ISetSeenMatch, setSeenMatch } from '../../state/actions/MatchesActions'
import { IChat, IChatsStore, IMessages } from '../../state/reducers/ChatsReducer'
import { ISetChatMessage, setChatMessage } from '../../state/actions/ChatsActions'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, chatsStore, } = state
  return { systemStore, userStore, chatsStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setSeenMatch,
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
  actions: {
    setSeenMatch: (params: ISetSeenMatch) => void,
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
    chat: this.props.chatsStore.chats?.find(chat => chat.userId === this.props.route.params.match?.userId || chat.userId === this.props.route.params.chat.userId) || null,
    userId: this.props.route.params.match?.userId || this.props.route.params.chat.userId,
    selectionModalConfig: null,
    streetpass: null,
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
  }

  componentDidMount(): void {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
    if (this.state.match && this.state.match.seen === false) this.props.actions.setSeenMatch({ userId: this.state.match.userId, })
    // TODO - set read chat
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
    // TODO - set read chat
  }

  appStateChange = (nextAppState: any) => {
    // TODO - background -> active
    // TODO - active -> background ?
    // TODO - inactive -> background ?
    if (this.state.appState !== nextAppState) {
      console.log('[APP STATE CHANGE]', this.state.appState, nextAppState)
      // TODO - set read chat
    }
    this.setState({ appState: nextAppState, })
  }

  render() {
    const { navigation, route, systemStore, userStore, chatsStore, actions, }: IChatScreenProps = this.props

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <ChatBlock
          navigation={navigation}
          route={this.props.route}
          systemStore={systemStore}
          userStore={userStore}
          chatsStore={chatsStore}
          state={this.state}
          messages={chatsStore.messages[this.state.userId]}
          setState={(params) => this.setState({ ...params, })}
          actions={{
            setChatMessage: actions.setChatMessage,
          }}
        />
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatScreen)
