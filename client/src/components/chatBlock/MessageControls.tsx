import React, { useEffect, useRef } from 'react'
import {
  View,
  TouchableOpacity,
  Clipboard,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import CopyIcon from '../../assets/icons/copy.svg'
import { Emojis, } from '../../utils/constants'
import ListGroup from '../listGroup'
import ReactionButton from './EmojiButton'
import { midVibrate, softVibrate } from '../../utils/services'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Lit } from '../../utils/locale'
import { IMessage } from '../../state/reducers/ChatsReducer'
import { reactMessage } from '../../api/chats'

interface IMessageProps {
  systemStore: ISystemStore,
  item: IMessage,
  me: boolean,
  setState: (params: any) => void,
}
const MessageControls: React.FC<IMessageProps>  = React.memo(({ systemStore, item, me, setState, }) => {
  const { Colors, } = systemStore
  const fadeAnim = useRef(new Animated.Value(0)).current
  const widthAnim = useRef(new Animated.Value(Dimensions.get('window').width * 0.1)).current
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true, }),
      Animated.spring(widthAnim, { toValue: 0, speed: 16, bounciness: 16, useNativeDriver: true, }),
    ]).start()
  }, [fadeAnim, widthAnim])
  // const close = () => {
  //   Animated.parallel([
  //     Animated.timing(fadeAnim, { toValue: 0, duration: 200, useNativeDriver: true, }),
  //     Animated.timing(widthAnim, { toValue: Dimensions.get('window').height * 0.1, duration: 200, useNativeDriver: true, }),
  //   ]).start(() => null)
  // }

  return (
    <Animated.View style={{zIndex: 1, width: '100%', paddingHorizontal: 16, bottom: 2, opacity: fadeAnim, transform: [{ translateX: widthAnim, }],}}>
      <TouchableOpacity
        onPress={() => setState({ messageId: null, messageIndex: null, })}
        activeOpacity={1}
        style={{width: '100%',}}
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
                // { Icon: Icon, title: 'Unsend', noRight: true, onPress: () => {
                // }, },
              ] : [
                { Icon: CopyIcon, title: Lit[systemStore.Locale].Button.Copy, noRight: true, onPress: () => {
                  Clipboard.setString(item.message)
                  setState({ messageId: null, messageIndex: null, })
                }, },
              ],
            }}
          />
        </View>

        {me &&
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
                      item.reaction === null ? midVibrate() : softVibrate()
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
    </Animated.View>
  )
})

export default MessageControls
