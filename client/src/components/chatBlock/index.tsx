import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
  View,
  KeyboardAvoidingView,
  ActivityIndicator,
  Linking,
  Keyboard,
  Text,
} from 'react-native'
import Message from './Message'
import TextInput from '../textInput'
import SelectionModal from '../selectionModal'
import Thumbnail from '../thumbnail'
import NavHeader from '../navigation/NavHeader'
import { BlurView } from '@react-native-community/blur'
import { IUserStore } from '../../state/reducers/UserReducer'
import SendIcon from '../../assets/icons/send-solid.svg'
import EllipsisIcon from '../../assets/icons/ellipsis.svg'
import BellIcon from '../../assets/icons/bell.svg'
import BellSolidIcon from '../../assets/icons/bell-solid.svg'
import ExclamationCircledIcon from '../../assets/icons/exclamation-circled.svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { MMKVLoader } from 'react-native-mmkv-storage'
import { InputLimits, LocalStorage, } from '../../utils/constants'
import { Lit, } from '../../utils/locale'
import { FlashList, } from '@shopify/flash-list'
import { IChatScreenState } from '../../screens/subScreens/ChatScreen'
import { baseUrl, protocol } from '../../api'
import StreetpassModal from '../streetpassModal'
import { IMatch } from '../../state/reducers/MatchesReducer'
import { IChat, IMessage, IMessages } from '../../state/reducers/ChatsReducer'
import { alertTyping, sendMessage } from '../../api/chats'
import { ISetChatKey, ISetChatNotifications, ISetMessages, ISetReadChat, IUnsetChat } from '../../state/actions/ChatsActions'
import { IUnsetMatch } from '../../state/actions/MatchesActions'
import { timePassedSince } from '../../utils/functions'
import { blockUser } from '../../api/user'
import { ISetChatMessage } from '../../state/actions/ChatMessagesActions'
import LottieView from 'lottie-react-native'
import { IChatMessage } from '../../state/reducers/ChatMessagesReducer'

interface IChatBlockProps {
  navigation: any,
  route: { params: { chat?: IChat, match?: IMatch, }, } | any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  state: IChatScreenState,
  messages?: IMessages,
  chatMessage: IChatMessage,
  setState: (params: any) => void,
  actions: {
    setMessages: (params: ISetMessages) => Promise<void>,
    unsetMatch: (params: IUnsetMatch) => Promise<void>,
    unsetChat: (params: IUnsetChat) => void,
    setChatKey: (params: ISetChatKey) => void,
    setChatNotifications: (params: ISetChatNotifications) => Promise<void>,
    setChatMessage: (params: ISetChatMessage) => void,
  }
}
const ChatBlock: React.FC<IChatBlockProps> = ({ navigation, route, systemStore, userStore, state, messages, chatMessage, setState, actions, }) => {
  const { Colors, Fonts, } = systemStore
  const listRef = useRef<FlashList<IMessage>>(null)
  const scrollTo = useCallback(async (index: number) => listRef.current?.scrollToIndex({ index: index, animated: true, viewPosition: 0.5, }), [])
  const [typing, setTyping] = useState<boolean>(false)

  useEffect(() => {
    if (chatMessage?.typing) {
      const typingTime = new Date(chatMessage.typing).getTime()
      const currentTime = new Date().getTime()
      if (currentTime - typingTime < 5300) {
        setTyping(true)
        const timeoutId = setTimeout(() => {
          setTyping(false)
        }, 5300 - (currentTime - typingTime))
        return () => clearTimeout(timeoutId)
      }
    }
  }, [chatMessage?.typing])

  return (
    <>
      {state.streetpass &&
        <StreetpassModal
          navigation={navigation}
          systemStore={systemStore}
          streetpass={state.streetpass}
          streetpassImageIndex={0}
          hideActions={true}
          toggleModal={() => setState({ streetpass: state.streetpass ? null : state.match, })}
          actions={{
            unsetMatch: actions.unsetMatch,
            unsetChat: actions.unsetChat,
          }}
        />
      }

      <NavHeader
        systemStore={systemStore}
        navigation={navigation}
        title={state.match ? state.match.name : state.chat ? state.chat.name : undefined}
        thumbnail={state.match ? state.match.media[0]?.thumbnail : state.chat ? state.chat.media[0]?.thumbnail : undefined}
        EndIcon={EllipsisIcon}
        onPress={() => {
          actions.setChatKey(null)
          navigation.goBack()
        }}
        onPressEnd={() => {
          Keyboard.dismiss()
          setState({
            selectionModalConfig: {
              titleColor: Colors.safeLightest,
              list: [
                { Icon: ExclamationCircledIcon, image: state.match ? state.match.media[0]?.thumbnail : state.chat ? state.chat.media[0]?.thumbnail : undefined, title: Lit[systemStore.Locale].Button.Unmatch, noRight: true, onPress: () => {
                  actions.unsetMatch({ userId: state.userId, })
                  actions.unsetChat(state.userId)
                  navigation.goBack()
                }, },
                state.chat && {
                  Icon: state.chat?.notifications ? BellIcon : BellSolidIcon,
                  title: state.chat?.notifications ? Lit[systemStore.Locale].Button.Mute : Lit[systemStore.Locale].Button.Unmute,
                  disabled: !state.chat, noRight: true, onPress: () => {
                    if (state.chat) {
                      actions.setChatNotifications({ chatId: state.chat.chatId, notifications: !state.chat.notifications, })
                      setState({ selectionModalConfig: null, chat: { ...state.chat, notifications: !state.chat.notifications, }, })
                    }
                  },
                },
                { Icon: ExclamationCircledIcon, title: Lit[systemStore.Locale].Button.Block, noRight: true, onPress: () => {
                  blockUser({ userId: state.userId, })
                  actions.unsetMatch({ userId: state.userId, pass: true, })
                  actions.unsetChat(state.userId)
                  navigation.goBack()
                }, },
                { Icon: ExclamationCircledIcon, title: Lit[systemStore.Locale].Button.Report, noRight: true, onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/help`), },
              ],
            }
          })
        }}
        onPressThumbnail={() => setState({ streetpass: state.streetpass ? null : state.match, })}
      />

      <KeyboardAvoidingView
        behavior={'padding'}
        style={{flex: 1,}}
      >
        <View style={{flex: 1,}}>
          <FlashList
            ref={listRef}
            data={messages?.messages || []}
            extraData={state}
            estimatedItemSize={51}
            viewabilityConfig={{ itemVisiblePercentThreshold: 100, }}
            onScrollBeginDrag={() => {
              if (state.messageId || state.messageIndex !== null || state.messageTime) setState({ messageId: null, messageIndex: null, messageTime: null, })
            }}
            renderItem={({ item, index, }) => {
              if (!item) return null
              return (
                <Message
                  item={item}
                  index={index}
                  systemStore={systemStore}
                  userId={userStore.user.userId}
                  messages={messages?.messages || []}
                  messageId={state.messageId}
                  messageIndex={state.messageIndex}
                  messageTime={state.messageTime}
                  scrollTo={scrollTo}
                  setState={(params) => setState({ ...params, })}
                />
              )
            }}
            ListHeaderComponent={
              <>
                <View style={{height: state.keyboard ? 88 : 112,}} />

                {typing &&
                  <View style={{
                    width: 64, height: 34, bottom: 104, justifyContent: 'center', alignItems: 'center',
                    left: 16, borderRadius: 16, borderBottomLeftRadius: 4, overflow: 'hidden',
                  }}>
                    <LottieView
                      source={require('../../assets/animations/typing.json')}
                      autoPlay={true}
                      loop={true}
                      speed={1}
                      style={{width: '100%', height: '100%',}}
                    />
                    {state.messageId &&
                      <BlurView
                        blurAmount={1}
                        style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}
                      />
                    }
                    <BlurView blurType={Colors.safeDarkerBlur } style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />
                    <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: Colors.lightGrey,}} />
                  </View>
                }

                {/* {state.messageId &&
                  <TouchableOpacity
                    // onPress={() => setMessageId(null)}
                    style={{
                      position: 'absolute', zIndex: -1, width: '100%', display: 'flex',
                      height: Dimensions.get('window').height * (messages.messages?.length || 1) * 2, bottom: -Dimensions.get('window').height,
                    }}
                  >
                    <BlurView blurAmount={2} style={{position: 'absolute', zIndex: 0, width: '100%', height: '100%',}} />
                  </TouchableOpacity>
                } */}
              </>
            }
            ListFooterComponent={
              <>
                {/* {messages?.continue !== false && state.paginating &&
                  <ActivityIndicator color={Colors.lighter} style={{position: 'absolute', width: '100%', marginTop: 16, alignSelf: 'center',}} />
                } */}
                <View onTouchStart={() => setState({ messageId: null, messageIndex: null, messageTime: null, })} style={{height: 160,}} />
                {!messages?.continue && !state.paginating &&
                  <View onTouchStart={() => setState({ messageId: null, messageIndex: null, messageTime: null, })} style={{width: '100%', justifyContent: 'center', alignItems: 'center', paddingVertical: 32,}}>
                    <Text style={{color: Colors.lighter, fontSize: Fonts.sm, fontWeight: Fonts.heavyWeight , textTransform: 'uppercase',}}>
                      {Lit[systemStore.Locale].Copywrite.MatchedWith} {route.params.chat?.name || route.params.match?.name} {timePassedSince(route.params.chat?.matchDate || route.params.match?.matchDate, systemStore.Locale)}
                    </Text>
                  </View>
                }
              </>
            }
            inverted={true}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'interactive'}
            keyboardShouldPersistTaps={'handled'}
            onEndReached={async () => {
              if (state.chat && messages && messages.continue !== false && !state.paginating) {
                setState({ paginating: true, })
                await actions.setMessages({ chatId: state.chat.chatId, userId: state.userId, index: messages.messages?.length || 0, })
                setState({ paginating: false, })
              }
            }}
            onEndReachedThreshold={0.2}
          />
        </View>

        <View>
          <View style={{position: 'absolute', bottom: 0, flex: 0, width: '100%', minHeight: 64,}}>
            <BlurView blurType={Colors.darkBlur } style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />

            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: state.keyboard ? 0 : 24,}}>
              <View style={{flex: 0, paddingLeft: 16,}}>
                <View style={{marginRight: 8,}}>
                  <Thumbnail systemStore={systemStore} uri={userStore.user.media[0]?.thumbnail} size={40} />
                </View>
              </View>

              <View style={{flex: 1, padding: 16, paddingVertical: 8,}}>
                <TextInput
                  systemStore={systemStore}
                  value={chatMessage?.message || ''}
                  loading={state.sending}
                  disabled={state.sending}
                  onChangeText={(text: string) => {
                    actions.setChatMessage({ userId: state.userId, message: text, })
                    setState({ messageId: null, messageIndex: null, messageTime: null, })
                    const typingTimePassed = state.alertTypingTime ? (new Date().getTime() - state.alertTypingTime.getTime()) / 1000 : null
                    if (state.chat && (!typingTimePassed || typingTimePassed >= 5)) {
                      setState({ alertTypingTime: new Date(), })
                      alertTyping({ chatId: state.chat?.chatId, userId: state.userId, })
                    }
                  }}
                  placeholder={`${Lit[systemStore.Locale].Button.Message}...`}
                  multiline={true}
                  EndIcon={SendIcon}
                  exceedChars={InputLimits.DescriptionMin}
                  limitChars={InputLimits.DescriptionMax}
                  onPressEnd={async () => {
                    setState({ sending: true, })
                    listRef.current?.scrollToOffset({ offset: 0, animated: true, })
                    await sendMessage({
                      chatId: undefined,
                      userId: state.userId,
                      message: chatMessage.message,
                    })
                    actions.setChatMessage({ userId: state.userId, message: '', })
                    setState({ sending: false, })
                  }}
                />
              </View>
            </View>

          </View>
        </View>

        {state.selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={state.selectionModalConfig} toggleModal={() => setState({ selectionModalConfig: null, })} />
        }
      </KeyboardAvoidingView>
    </>
  )
}

export default ChatBlock
