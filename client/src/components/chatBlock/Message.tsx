import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Keyboard,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { Time } from '../../utils/constants'
import { formatDate, getLineCount, withinTime } from '../../utils/functions'
import { hardVibrate } from '../../utils/services'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import Pretext from '../pretext'
import { IMessage } from '../../state/reducers/ChatsReducer'
import MessageControls from './MessageControls'

interface IMessageProps {
  item: IMessage,
  index: number,
  systemStore: ISystemStore,
  userId: string,
  messages: Array<IMessage>,
  messageId: string | null,
  messageIndex: number | null,
  messageTime: string | null,
  scrollTo: (params: number) => void,
  setState: (params: any) => void,
}
const Message: React.FC<IMessageProps>  = React.memo(({ systemStore, userId, item, index, messages, messageId, messageIndex, messageTime, scrollTo, setState, }) => {
  const { Colors, Fonts, } = systemStore
  const me = item.userId === userId
  const prev = messages[index + 1]?.userId === item.userId && withinTime(item.date, messages[index + 1].date, Time.Minute * 10 * 1000) ? true : false
  const next = messages[index - 1]?.userId === item.userId && withinTime(item.date, messages[index - 1].date, Time.Minute * 10 * 1000) ? true : false
  const longPress = () => {
    Keyboard.dismiss()
    hardVibrate()
    setState({ messageId: messageId === item.messageId ? null : item.messageId, messageIndex: messageIndex === index ? null : index, })
    let lineCount = index > 3 ? 0 : getLineCount(messages[index].message)
    let messageCount = 0
    while ((index <= 3) && (lineCount < 3 )&& (index - messageCount >= 0)) {
      messageCount += 1
      lineCount += getLineCount(messages[index - messageCount]?.message)
    }
    if (index > 3 || lineCount > 3) scrollTo(index)
  }

  return (
    <>
      {messageId === item.messageId &&
        <MessageControls
          systemStore={systemStore}
          item={item}
          me={me}
          setState={setState}
        />
      }

      <TouchableOpacity
        onPress={() => setState({ messageId: null, })}
        activeOpacity={1}
        style={{width: '100%', alignItems: me ? 'flex-end' : 'flex-start', paddingHorizontal: 16,}}
      >
        {!prev && messageId !== item.messageId && <View style={{height: 12,}} />}

        <TouchableOpacity
          onPress={() => messageId ? setState({ messageId: null, messageIndex: null, }) : setState({ messageTime: messageTime === item.messageId ? null : item.messageId, })}
          onLongPress={longPress}
          activeOpacity={Colors.activeOpacity}
        >
          <View
            style={{
              alignItems: 'center', overflow: 'hidden', maxWidth: '80%', marginTop: 3,
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
              textStyle={{color: Colors.safeLightest, paddingVertical: 10, paddingHorizontal: 16,}}
              onPress={(word) => null}
              onLongPress={longPress}
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
