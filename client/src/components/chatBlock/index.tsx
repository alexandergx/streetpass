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
import { IMessage } from '../../state/reducers/ChatsReducer'
import { Screens } from '../../navigation'
// import { ISetChatId, ISetReadChat } from '../../state/actions/ChatsActions'
import { useIsFocused } from '@react-navigation/native'
import { Lit, Locales, } from '../../utils/locale'
import { FlashList, } from '@shopify/flash-list'
import { IChatScreenState } from '../../screens/subScreens/ChatScreen'
import { IMatch } from '../../state/reducers/MatchesReducer'
import { baseUrl, protocol } from '../../api'
import StreetPassModal from '../streetPassModal'

const MMKV = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()

interface IChatBlockProps {
  navigation: any,
  route: { params: { chatId?: string, match: IMatch, }, } | any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  state: IChatScreenState,
  setMessage: (params: string) => void,
  setMessageId: (params: string | null) => void,
  setMessageIdTime: (params: string | null) => void,
  setSelectionModalConfig: (params: IListGroupConfig | null) => void,
  setNewMessage: (params: IMessage) => void,
  loadMessages: () => void,
  sendMessage: () => void,
  removeMessage: (params: { chatId: string, messageId: string, pushDelete?: boolean, }) => void,
  setMessageReaction: (params: { chatId: string, messageId: string, userId: string, reaction?: string, pushReact?: boolean, }) => void,
  setNotifications: () => void,
  setStreetPass: () => void,
  actions: {
    // setChatId: (params: ISetChatId) => void,
    // setReadChat: (params: ISetReadChat) => void,
  }
}
const ChatBlock: React.FC<IChatBlockProps> = ({
  navigation, route, systemStore, userStore, state, setMessage, setMessageId, setMessageIdTime, setSelectionModalConfig,
  setNewMessage, loadMessages, sendMessage, removeMessage, setMessageReaction, setNotifications, setStreetPass, actions,
}) => {
  const { Colors, Fonts, } = systemStore
  const flatListRef = useRef(null)
  const isFocused = useIsFocused()

  // useSubscription(SUBSCRIBE_MESSAGES({
  //   chatId: route.params?.chatId || state.chat?.chatId || undefined,
  //   userId: userStore.user.userId,
  // }), {
  //   skip: !userStore.loggedIn || !MMKV.getString(AuthStore.AccessToken),
  //   shouldResubscribe: true,
  //   onData: (data) => {
  //     if (data.data.data.messageSent.deleted) {
  //       removeMessage({ chatId: data.data.data.messageSent.chatId, messageId: data.data.data.messageSent.messageId, pushDelete: true, })
  //       return
  //     }
  //     if (data.data.data.messageSent.authUserReaction || data.data.data.messageSent.userReaction) {
  //       let reaction = null
  //       if ((data.data.data.messageSent.authUserReaction && data.data.data.messageSent.authUserReaction !== 'null') || data.data.data.messageSent.authUserReaction === null) {
  //         reaction = data.data.data.messageSent?.authUserReaction
  //       }
  //       if ((data.data.data.messageSent?.userReaction && data.data.data.messageSent.userReaction !== 'null') || data.data.data.messageSent.userReaction === null) {
  //         reaction = data.data.data.messageSent?.userReaction
  //       }
  //       setMessageReaction({
  //         chatId: data.data.data.messageSent.chatId,
  //         messageId: data.data.data.messageSent.messageId,
  //         userId: data.data.data.messageSent.userId,
  //         reaction: reaction,
  //         pushReact: true,
  //       })
  //       return
  //     }
  //     if (isFocused) actions.setChatId(data.data.data.messageSent.chatId)
  //     else actions.setChatId(null)
  //     setNewMessage(data.data.data.messageSent)
  //   },
  //   onError: async (error) => {
  //     console.log('[SUBSCRIPTION ERROR]', error)
  //     await apiRequest(null)
  //   }
  // })

  return (
    <>
      {state.streetPass &&
        <StreetPassModal
          navigation={navigation}
          systemStore={systemStore}
          streetPass={state.streetPass}
          streetPassImageIndex={0}
          hideActions={true}
          unsetStreetPass={setStreetPass}
        />
      }

      <NavHeader
        systemStore={systemStore}
        navigation={navigation}
        title={route.params.match.name}
        thumbnail={route.params.match.media[0].image || null}
        EndIcon={EllipsisIcon}
        onPress={() => {
          // actions.setChatId(null)
          // state.chat?.chatId && actions.setReadChat(state.chat.chatId)
          navigation.goBack()
        }}
        onPressEnd={() => {
          Keyboard.dismiss()
          setSelectionModalConfig({
            titleColor: Colors.safeLightest,
            list: [
              {
                Icon: state.chat?.notifications || state.chat?.notifications === null ? BellIcon : BellSolidIcon,
                title: state.chat?.notifications || state.chat?.notifications === null ? Lit[systemStore.Locale].Button.Mute : Lit[systemStore.Locale].Button.Unmute,
                disabled: !state.messages?.length, noRight: true, onPress: setNotifications,
              },
              { Icon: ExclamationCircledIcon, title: Lit[systemStore.Locale].Button.Block, noRight: true, onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/help`), },
              { Icon: ExclamationCircledIcon, title: Lit[systemStore.Locale].Button.Report, noRight: true, onPress: () => Linking.openURL(`${protocol[0]}${baseUrl}/help`), },
            ],
          })
        }}
        onPressThumbnail={setStreetPass}
      />

      <KeyboardAvoidingView
        behavior={'padding'}
        style={{flex: 1,}}
      >
        <View style={{flex: 1,}}>
          <FlashList
            ref={flatListRef}
            data={state.messages || []}
            extraData={state}
            estimatedItemSize={51}
            renderItem={({ item, index, }) => {
              if (!item) return null
              return (
                <Message
                  item={item}
                  index={index}
                  messages={state.messages}
                  messageId={state.messageId}
                  messageIdTime={state.messageIdTime}
                  setMessageId={setMessageId}
                  setMessageIdTime={setMessageIdTime}
                  removeMessage={removeMessage}
                  setMessageReaction={setMessageReaction}
                  systemStore={systemStore}
                  userId={userStore.user.userId}
                />
              )
            }}
            ListHeaderComponent={
              <>
                <View style={{height: state.keyboard ? 88 : 112,}} />
                {state.messageId &&
                  <TouchableOpacity
                    onPress={() => setMessageId(null)}
                    style={{
                      position: 'absolute', zIndex: -1, width: '100%', display: 'flex',
                      height: Dimensions.get('window').height * (state.messages?.length || 1) * 2, bottom: -Dimensions.get('window').height,
                    }}
                  >
                    <BlurView blurAmount={2} style={{position: 'absolute', zIndex: 0, width: '100%', height: '100%',}} />
                  </TouchableOpacity>
                }
              </>
            }
            ListFooterComponent={
              <>
                {state.messagesPage !== -1 && state.loading &&
                  <ActivityIndicator color={Colors.lighter} style={{position: 'absolute', width: '100%', marginTop: 16, alignSelf: 'center',}} />
                }
                <View pointerEvents={'none'} style={{height: 160,}} />
              </>
            }
            inverted={true}
            onScrollBeginDrag={() => {
              if (state.messageId || state.messageIdTime) {
                setMessageId(null)
                setMessageIdTime(null)
              }
            }}
            showsVerticalScrollIndicator={false}
            keyboardDismissMode={'interactive'}
            keyboardShouldPersistTaps={'handled'}
            onEndReached={() => loadMessages()}
            onEndReachedThreshold={0.2}
          />
        </View>

        <View>
          <View style={{position: 'absolute', bottom: 0, flex: 0, width: '100%', minHeight: 64,}}>
            <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />

            <View style={{width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'row', marginBottom: state.keyboard ? 0 : 24,}}>
              <View style={{flex: 0, paddingLeft: 16,}}>
                <View style={{marginRight: 16,}}>
                  <Thumbnail systemStore={systemStore} uri={userStore.user.media[0]?.image || null} size={40} />
                </View>
              </View>

              <View style={{flex: 1, padding: 16, paddingVertical: 8,}}>
                <TextInput
                  systemStore={systemStore}
                  value={state.message}
                  loading={state.messageLoading}
                  // disabled={(state.chat?.private && !state.messages?.length) || state.chat?.isBlocking || state.chat?.isBlocker || !route.params.userId}
                  onChangeText={(text: string) => setMessage(text)}
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
                  onPressEnd={() => state.messageLoading ? null : sendMessage()}
                />
              </View>
            </View>

          </View>
        </View>

        {state.selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={state.selectionModalConfig} toggleModal={() => setSelectionModalConfig(null)} />
        }
      </KeyboardAvoidingView>
    </>
  )
}

export default ChatBlock
