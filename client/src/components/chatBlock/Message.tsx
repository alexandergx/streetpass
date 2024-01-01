import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Linking,
  Clipboard,
  ScrollView,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import CopyIcon from '../../assets/icons/copy.svg'
import DeleteIcon from '../../assets/icons/delete.svg'
import PlayIcon from '../../assets/icons/play.svg'
import { Emojis, Time } from '../../utils/constants'
import ListGroup from '../listGroup'
import { formatDate, withinTime } from '../../utils/functions'
import ReactionButton from './EmojiButton'
import { softVibrate } from '../../utils/services'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Lit } from '../../utils/locale'
import FastImage from 'react-native-fast-image'
import LinearGradient from 'react-native-linear-gradient'
import Pretext from '../pretext'
import Thumbnail from '../thumbnail'
import { IMessage } from '../../state/reducers/ChatsReducer'

const emojis = Object.keys(Emojis)

interface IMessageProps {
  systemStore: ISystemStore,
  userId: string,
  item: IMessage,
  index: number,
  messages: Array<IMessage> | null,
  // messageId: string | null,
  // messageIdTime: string | null,
  // setMessageId: (params: string | null) => void,
  // setMessageIdTime: (params: string | null) => void,
  // setMessageReaction: (params: { chatId: string, messageId: string, userId: string, reaction?: string, pushReact?: boolean, }) => void,
}
const Message: React.FC<IMessageProps>  = React.memo(({
  systemStore, userId, item, index, messages,
  // messageId, messageIdTime,
  // setMessageId, setMessageIdTime, removeMessage, setMessageReaction,
}) => {
  const { Colors, Fonts, } = systemStore
  const me = item.userId === userId
  const prev = messages && messages[index + 1]?.userId === item.userId
    && withinTime(item.date, messages[index + 1].date, Time.Minute * 10 * 1000) ? true : false
  const next = messages && messages[index - 1]?.userId === item.userId
    && withinTime(item.date, messages[index - 1].date, Time.Minute * 10 * 1000) ? true : false

  return (
    <>
      {/* {messageId === item.messageId &&
        <>
          <TouchableOpacity
            onPress={() => setMessageId(null)}
            activeOpacity={1}
            style={{zIndex: 1, width: '100%', paddingHorizontal: 16, bottom: 2,}}
          >
            <View style={{alignSelf: me ? 'flex-end' : 'flex-start', marginBottom: 4,}}>
              <ListGroup
                systemStore={systemStore}
                config={{
                  list: me ? [
                    { Icon: DeleteIcon, title: Lit[systemStore.Locale].Button.Delete, noRight: true, onPress: () => removeMessage({ chatId: item.chatId, messageId: item.messageId, }), },
                    { Icon: CopyIcon, title: Lit[systemStore.Locale].Button.CopyText, noRight: true, onPress: () => {
                      Clipboard.setString(item.message)
                      setMessageId(null)
                    }, },
                  ] : [
                    { Icon: CopyIcon, title: Lit[systemStore.Locale].Button.CopyText, noRight: true, onPress: () => {
                      Clipboard.setString(item.message)
                      setMessageId(null)
                    }, },
                  ],
                }}
              />
            </View>

            <View style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '80%', height: 52, borderRadius: 16, overflow: 'hidden',}}>
              <BlurView blurType={Colors.darkestBlur as any} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex', backgroundColor: Colors.darkerBackground,}} />
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                keyboardDismissMode={'none'}
                keyboardShouldPersistTaps={'always'}
              >
                <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                  {emojis.map((emoji, index) =>
                    <ReactionButton
                      key={index}
                      systemStore={systemStore}
                      title={Emojis[emoji]}
                      active={me ? item.authUserReaction === Emojis[emoji] : item.userReaction === Emojis[emoji]}
                      onPress={() => {
                        setMessageReaction({
                          chatId: item.chatId,
                          messageId: item.messageId,
                          userId: item.userId,
                          reaction: me
                            ? item.authUserReaction === Emojis[emoji] ? null : Emojis[emoji]
                            : item.userReaction === Emojis[emoji] ? null : Emojis[emoji],
                        })
                        setMessageId(null)
                      }}
                    />
                  )}
                </View>
              </ScrollView>
            </View>
          </TouchableOpacity>
        </>
      } */}

      <TouchableOpacity
        // onPress={() => setMessageId(null)}
        activeOpacity={1}
        style={{width: '100%', alignItems: me ? 'flex-end' : 'flex-start', paddingHorizontal: 16,}}
      >
        {!prev && <View style={{height: 6,}} />}
        <TouchableOpacity
          onPress={() => {
            // messageId ? setMessageId(null) : setMessageIdTime(messageIdTime === item.messageId ? null : item.messageId)
          }}
          onLongPress={() => {
            softVibrate()
            // setMessageId(messageId === item.messageId ? null : item.messageId)
          }}
          activeOpacity={Colors.activeOpacity}
        >
          <View
            style={{
              alignItems: 'center', overflow: 'hidden', maxWidth: '80%', marginTop: 2,
              borderTopLeftRadius: prev && !me ? 4 : 20, borderTopRightRadius: prev && me ? 4 : 20,
              borderBottomLeftRadius: next && !me ? 4 : 20, borderBottomRightRadius: next && me ? 4 : 20,
            }}
          >
            {/* {messageId && messageId !== item.messageId &&
              <BlurView
                blurAmount={1}
                style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}
              />
            } */}
            <BlurView blurType={me ? Colors.safeDarkestBlur : Colors.safeDarkerBlur as any} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />
            <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: me ? Colors.lightBlue : Colors.lightGrey,}} />

            <Pretext
              systemStore={systemStore}
              text={item.message}
              linkColor={me ? Colors.darkBlue : Colors.lightBlue}
              textStyle={{color: Colors.safeLightest, paddingVertical: 12, paddingHorizontal: 16,}}
              onPress={(word) => null}
              onLongPress={() => {
                softVibrate()
                // setMessageId(messageId === item.messageId ? null : item.messageId)
              }}
            />
          </View>
          <View
            style={{
              position: 'absolute', zIndex: 1, alignSelf: me ? 'flex-start' : 'flex-end',
              flexDirection: 'row', bottom: -6, borderRadius: 16, overflow: 'hidden',
            }}
          >
            {/* {messageId && messageId !== item.messageId &&
              <BlurView
                blurAmount={1}
                style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}
              />
            } */}
            <BlurView blurType={me ? Colors.safeDarkestBlur : Colors.safeDarkerBlur as any} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />
            <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: me ? Colors.lightBlue : Colors.lightGrey,}} />

            {/* {item.userReaction &&
              <View style={{padding: 4,}}><Text style={{color: Colors.lightest, fontSize: Fonts.sm,}}>{item.userReaction}</Text></View>
            }
            {item.authUserReaction &&
              <View style={{padding: 4,}}><Text style={{color: Colors.lightest, fontSize: Fonts.sm,}}>{item.authUserReaction}</Text></View>
            } */}
          </View>
        </TouchableOpacity>

        {/* {messageIdTime === item.messageId &&
          <View style={{marginVertical: 4, opacity: 0.5,}}><Text style={{color: Colors.lightest,}}>{formatDate(item.date, true)}</Text></View>
        } */}
      </TouchableOpacity>
    </>
  )
})

export default Message
