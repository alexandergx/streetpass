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
import { Emojis, Time } from '../../utils/constants'
import ListGroup from '../listGroup'
import { formatDate, withinTime } from '../../utils/functions'
import ReactionButton from './EmojiButton'
import { softVibrate } from '../../utils/services'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Lit } from '../../utils/locale'
import Pretext from '../pretext'
import { IMessage } from '../../state/reducers/ChatsReducer'
import { reactMessage } from '../../api/chats'

interface IMessageProps {
  item: IMessage,
  index: number,
  systemStore: ISystemStore,
  userId: string,
  messages: Array<IMessage> | null,
  messageId: string | null,
  messageIndex: number | null,
  messageTime: string | null,
  setState: (params: any) => void,
}
const Message: React.FC<IMessageProps>  = React.memo(({ systemStore, userId, item, index, messages, messageId, messageIndex, messageTime, setState, }) => {
  const { Colors, Fonts, } = systemStore
  const me = item.userId === userId
  const prev = messages && messages[index + 1]?.userId === item.userId && withinTime(item.date, messages[index + 1].date, Time.Minute * 10 * 1000) ? true : false
  const next = messages && messages[index - 1]?.userId === item.userId && withinTime(item.date, messages[index - 1].date, Time.Minute * 10 * 1000) ? true : false

  return (
    <>
      {messageId === item.messageId &&
        <>
          <TouchableOpacity
            onPress={() => setState({ messageId: null, messageIndex: null, })}
            activeOpacity={1}
            style={{zIndex: 1, width: '100%', paddingHorizontal: 16, bottom: 2,}}
          >
            <View style={{alignSelf: me ? 'flex-end' : 'flex-start', marginBottom: 4,}}>
              <ListGroup
                systemStore={systemStore}
                config={{
                  list: me ? [
                    { Icon: CopyIcon, title: Lit[systemStore.Locale].Button.Copy, noRight: true, onPress: () => {
                      Clipboard.setString(item.message)
                      setState({ messageId: null, messageIndex: null, })
                    }, },
                  ] : [
                    { Icon: CopyIcon, title: Lit[systemStore.Locale].Button.Copy, noRight: true, onPress: () => {
                      Clipboard.setString(item.message)
                      setState({ messageId: null, messageIndex: null, })
                    }, },
                  ],
                }}
              />
            </View>

            {!me &&
              <View style={{alignSelf: me ? 'flex-end' : 'flex-start', maxWidth: '85%', height: 52, borderRadius: 16, overflow: 'hidden',}}>
                <BlurView blurType={Colors.darkestBlur } style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex', backgroundColor: Colors.darkerBackground,}} />

                <ScrollView
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  keyboardDismissMode={'none'}
                  keyboardShouldPersistTaps={'always'}
                >
                  <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center',}}>
                    {Emojis.map((emoji, index) =>
                      <ReactionButton
                        key={index}
                        systemStore={systemStore}
                        title={emoji}
                        active={item.reaction === emoji}
                        onPress={async () => {
                          await reactMessage({ chatId: item.chatId, messageId: item.messageId, reaction: item.reaction === emoji ? null : emoji })
                          setState({ messageId: null, messageIndex: null, })
                        }}
                      />
                    )}
                  </View>
                </ScrollView>
              </View>
            }
          </TouchableOpacity>
        </>
      }

      <TouchableOpacity
        onPress={() => setState({ messageId: null, })}
        activeOpacity={1}
        style={{width: '100%', alignItems: me ? 'flex-end' : 'flex-start', paddingHorizontal: 16,}}
      >
        {!prev && messageId !== item.messageId && <View style={{height: 12,}} />}

        <TouchableOpacity
          onPress={() => messageId ? setState({ messageId: null, messageIndex: null, }) : setState({ messageTime: messageTime === item.messageId ? null : item.messageId, })}
          onLongPress={() => {
            softVibrate()
            setState({ messageId: messageId === item.messageId ? null : item.messageId, messageIndex: messageIndex === index ? null : index, })
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
            {messageId && messageId !== item.messageId &&
              <BlurView
                blurAmount={1}
                style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}
              />
            }

            <BlurView blurType={me ? Colors.safeDarkestBlur : Colors.safeDarkerBlur } style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />

            <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: me ? Colors.lightBlue : Colors.lightGrey,}} />

            <Pretext
              systemStore={systemStore}
              text={item.message}
              linkColor={me ? Colors.darkBlue : Colors.lightBlue}
              textStyle={{color: Colors.safeLightest, paddingVertical: 12, paddingHorizontal: 16,}}
              onPress={(word) => null}
              onLongPress={() => {
                softVibrate()
                setState({ messageId: messageId === item.messageId ? null : item.messageId, messageIndex: messageIndex === index ? null : index, })
              }}
            />
          </View>

          <View
            style={{
              position: 'absolute', zIndex: 1, alignSelf: me ? 'flex-start' : 'flex-end', left: me ? -4 : undefined, right: me ? undefined : -4,
              flexDirection: 'row', bottom: -6, borderRadius: 16, overflow: 'hidden',
            }}
          >
            {messageId && messageId !== item.messageId &&
              <BlurView
                blurAmount={1}
                style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}
              />
            }

            <BlurView blurType={me ? Colors.safeDarkestBlur : Colors.safeDarkerBlur } style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />

            <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: me ? Colors.lightBlue : Colors.lightGrey,}} />

            {item.reaction &&
              <View style={{padding: 4,}}><Text style={{color: Colors.lightest, fontSize: Fonts.sm,}}>{item.reaction}</Text></View>
            }
          </View>
        </TouchableOpacity>

        {messageTime === item.messageId &&
          <View style={{marginVertical: 4, opacity: 0.5,}}><Text style={{color: Colors.lightest,}}>{formatDate(item.date, true)}</Text></View>
        }
      </TouchableOpacity>
    </>
  )
})

export default Message
