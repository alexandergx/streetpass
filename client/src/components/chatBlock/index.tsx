import React, { memo, useRef, useState, } from 'react'
import {
  View,
  KeyboardAvoidingView,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Dimensions,
  Keyboard,
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
import { AuthStore, InputLimits, LocalStorage, Time } from '../../utils/constants'
import GradientBackground from '../gradientBackground'
import { IListGroupConfig } from '../listGroup'
import { useSubscription } from '@apollo/client'
// import { SUBSCRIBE_MESSAGES, apiRequest, baseUrl, protocol } from '../../api'
// import { IMessage } from '../../state/reducers/ChatsReducer'
import { Screens } from '../../navigation'
// import { ISetChatId, ISetReadChat } from '../../state/actions/ChatsActions'
import { useIsFocused } from '@react-navigation/native'
import { Lit, Locales, } from '../../utils/locale'
import { FlashList, } from '@shopify/flash-list'
import { IChatScreenState } from '../../screens/subScreens/ChatScreen'
import { SUBSCRIBE_MESSAGES, apiRequest, baseUrl, protocol } from '../../api'
import StreetpassModal from '../streetpassModal'
import { IMatch } from '../../state/reducers/MatchesReducer'
import { IChat, IChatsStore, IMessage, IMessageMetadata, IMessages } from '../../state/reducers/ChatsReducer'
import { sendMessage } from '../../api/chats'
import { ISetChatMessage } from '../../state/actions/ChatsActions'

const MMKV = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()

interface IChatBlockProps {
  navigation: any,
  route: { params: { chatId?: string, match: IMatch, }, } | any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  chatsStore: IChatsStore,
  state: IChatScreenState,
  messages: IMessages,
  setState: (params: any) => void,
  actions: {
    setChatMessage: (params: ISetChatMessage) => void,
  }
}
const ChatBlock: React.FC<IChatBlockProps> = ({
  navigation, route, systemStore, userStore, chatsStore, state, messages, setState, actions,
}) => {
  const { Colors, Fonts, } = systemStore
  const flatListRef = useRef(null)
  const isFocused = useIsFocused()

  useSubscription(SUBSCRIBE_MESSAGES({
    chatId: state.chat?.chatId || undefined,
    userId: userStore.user.userId,
  }), {
    skip: !state.chat || !MMKV.getString(AuthStore.AccessToken),
    shouldResubscribe: true,
    onData: (data) => {
      const { message, metadata, } = data?.data?.data?.messages as { chat?: IChat, message: IMessage, metadata: IMessageMetadata, }
      // if (isFocused) actions.setChatId(data.data.data.messageSent.chatId)
      // else actions.setChatId(null)
      // setNewMessage(data.data.data.messageSent)
    },
    onError: async (error) => {
      console.log('[SUBSCRIBE MESSAGES ERROR]', error)
      await apiRequest(null)
    }
  })

  return (
    <>
      {state.streetpass &&
        <StreetpassModal
          navigation={navigation}
          systemStore={systemStore}
          streetpass={state.streetpass}
          streetpassImageIndex={0}
          hideActions={true}
          unsetStreetpass={() => setState({ streetpass: state.streetpass ? null : state.match, })}
        />
      }

      <NavHeader
        systemStore={systemStore}
        navigation={navigation}
        title={state.match ? state.match.name : state.chat ? state.chat.name : undefined}
        thumbnail={state.match ? state.match.media[0]?.thumbnail : state.chat ? state.chat.media[0]?.thumbnail : undefined}
        EndIcon={EllipsisIcon}
        onPress={() => {
          // actions.setChatId(null)
          // state.chat?.chatId && actions.setReadChat(state.chat.chatId)
          navigation.goBack()
        }}
        onPressEnd={() => {
          Keyboard.dismiss()
          setState({
            selectionModalConfig: {
              titleColor: Colors.safeLightest,
              list: [
                // {
                //   Icon: state.chat?.notifications || state.chat?.notifications === null ? BellIcon : BellSolidIcon,
                //   title: state.chat?.notifications || state.chat?.notifications === null ? Lit[systemStore.Locale].Button.Mute : Lit[systemStore.Locale].Button.Unmute,
                //   disabled: !state.messages?.length, noRight: true, onPress: setNotifications,
                // },
                { Icon: ExclamationCircledIcon, image: state.match ? state.match.media[0]?.thumbnail : state.chat ? state.chat.media[0]?.thumbnail : undefined, title: Lit[systemStore.Locale].Button.Unmatch, noRight: true,
                  onPress: () => null,
                },
                { Icon: ExclamationCircledIcon, title: Lit[systemStore.Locale].Button.Block, noRight: true, onPress: () => null, },
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
            ref={flatListRef}
            // data={state.messages || []}
            data={[]}
            extraData={state}
            estimatedItemSize={51}
            renderItem={({ item, index, }) => {
              if (!item) return null
              return (
                <>
                </>
                // <Message
                //   item={item}
                //   index={index}
                //   messages={state.messages}
                //   messageId={state.messageId}
                //   messageIdTime={state.messageIdTime}
                //   setMessageId={setMessageId}
                //   setMessageIdTime={setMessageIdTime}
                //   removeMessage={removeMessage}
                //   setMessageReaction={setMessageReaction}
                //   systemStore={systemStore}
                //   userId={userStore.user.userId}
                // />
              )
            }}
            ListHeaderComponent={
              <>
                <View style={{height: state.keyboard ? 88 : 112,}} />
                {/* {state.messageId &&
                  <TouchableOpacity
                    onPress={() => setMessageId(null)}
                    style={{
                      position: 'absolute', zIndex: -1, width: '100%', display: 'flex',
                      height: Dimensions.get('window').height * (state.messages?.length || 1) * 2, bottom: -Dimensions.get('window').height,
                    }}
                  >
                    <BlurView blurAmount={2} style={{position: 'absolute', zIndex: 0, width: '100%', height: '100%',}} />
                  </TouchableOpacity>
                } */}
              </>
            }
            ListFooterComponent={
              <>
                {/* {state.messagesPage !== -1 && state.loading &&
                  <ActivityIndicator color={Colors.lighter} style={{position: 'absolute', width: '100%', marginTop: 16, alignSelf: 'center',}} />
                } */}
                <View pointerEvents={'none'} style={{height: 160,}} />
              </>
            }
            inverted={true}
            onScrollBeginDrag={() => {
              // if (state.messageId || state.messageIdTime) {
              //   setMessageId(null)
              //   setMessageIdTime(null)
              // }
            }}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'interactive'}
            keyboardShouldPersistTaps={'handled'}
            // onEndReached={() => loadMessages()}
            onEndReachedThreshold={0.2}
          />
        </View>

        <View>
          <View style={{position: 'absolute', bottom: 0, flex: 0, width: '100%', minHeight: 64,}}>
            <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />

            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: state.keyboard ? 0 : 24,}}>
              <View style={{flex: 0, paddingLeft: 16,}}>
                <View style={{marginRight: 8,}}>
                  <Thumbnail systemStore={systemStore} uri={userStore.user.media[0]?.thumbnail} size={40} />
                </View>
              </View>

              <View style={{flex: 1, padding: 16, paddingVertical: 8,}}>
                <TextInput
                  systemStore={systemStore}
                  value={messages?.message || ''}
                  loading={state.sending}
                  disabled={state.sending}
                  onChangeText={(text: string) => actions.setChatMessage({ userId: state.userId, message: text, })}
                  // placeholder={(state.chat?.private && !state.messages?.length)
                  //   ? Lit[systemStore.Locale].Input.MessagesLimited
                  //   : state.chat?.isBlocking || state.chat?.isBlocker
                  //     ? Lit[systemStore.Locale].Input.MessagesBlocked
                  //     : Lit[systemStore.Locale].Input.Message
                  // }
                  multiline={true}
                  EndIcon={SendIcon}
                  exceedChars={InputLimits.DescriptionMin}
                  limitChars={InputLimits.DescriptionMax}
                  onPressEnd={async () => {
                    setState({ sending: true, })
                    await sendMessage({
                      chatId: undefined,
                      userId: state.userId,
                      message: messages.message,
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
