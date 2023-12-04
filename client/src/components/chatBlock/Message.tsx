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
import { IMessage } from '../../state/reducers/ChatsReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Lit } from '../../utils/locale'
import FastImage from 'react-native-fast-image'
import { IMedia } from '../../state/reducers/MediaReducer'
import LinearGradient from 'react-native-linear-gradient'
import Pretext from '../pretext'
import Thumbnail from '../thumbnail'

const emojis = Object.keys(Emojis)

interface IMessageProps {
  systemStore: ISystemStore,
  userId: string,
  item: IMessage,
  index: number,
  messages: Array<IMessage> | null,
  messageId: string | null,
  messageIdTime: string | null,
  setMessageId: (params: string | null) => void,
  setMessageIdTime: (params: string | null) => void,
  removeMessage: (params: { chatId: string, messageId: string, pushDelete?: boolean, }) => void,
  setMessageReaction: (params: { chatId: string, messageId: string, userId: string, reaction?: string, pushReact?: boolean, }) => void,
  goToProfile: (params: string) => void,
  setMedia: (params: IMedia) => void,
}
const Message: React.FC<IMessageProps>  = React.memo(({
  systemStore, userId, item, index, messages, messageId, messageIdTime, setMessageId, setMessageIdTime,
  removeMessage, setMessageReaction, goToProfile, setMedia,
}) => {
  const { Colors, Fonts, } = systemStore
  const me = item.userId === userId
  const prev = messages && messages[index + 1]?.userId === item.userId && !messages[index + 1]?.deleted
    && withinTime(item.date, messages[index + 1].date, Time.Hour * 1000) ? true : false
  const next = messages && messages[index - 1]?.userId === item.userId && !messages[index - 1]?.deleted
    && withinTime(item.date, messages[index - 1].date, Time.Hour * 1000) ? true : false
  return (
    <>
      {messageId === item.messageId &&
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
      }

      <TouchableOpacity
        onPress={() => setMessageId(null)}
        activeOpacity={1}
        style={{width: '100%', alignItems: me ? 'flex-end' : 'flex-start', paddingHorizontal: 16,}}
      >
        {!prev && <View style={{height: 6,}} />}
        {item.deleted
          ? <TouchableOpacity
            onPress={() => setMessageIdTime(messageIdTime === item.messageId ? null : item.messageId)}
            style={{marginTop: 8, opacity: 0.5,}}
          >
            <Text style={{color: Colors.lightest,}}>{Lit[systemStore.Locale].Title.Deleted}</Text>
          </TouchableOpacity>
          : <>
            <TouchableOpacity
              onPress={() => {
                messageId ? setMessageId(null) : setMessageIdTime(messageIdTime === item.messageId ? null : item.messageId)
              }}
              onLongPress={() => {
                softVibrate()
                setMessageId(messageId === item.messageId ? null : item.messageId)}
              }
              activeOpacity={Colors.activeOpacity}
            >
              <View
                style={{
                  alignItems: 'center', overflow: 'hidden', maxWidth: item.media ? '60%' : '80%', marginTop: 2,
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
                <BlurView blurType={me ? Colors.safeDarkestBlur : Colors.safeDarkerBlur as any} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />
                <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: me ? Colors.lightBlue : Colors.lightGrey,}} />

                {item.media ?
                  <>
                    <TouchableOpacity
                      onPress={() => setMedia(item.media!)}
                      onLongPress={() => {
                        softVibrate()
                        setMessageId(messageId === item.messageId ? null : item.messageId)}
                      }
                      activeOpacity={Colors.activeOpacity}
                      style={{
                        width: '100%', aspectRatio: 1/1.3, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                      }}
                    >
                      {item.media.thumbnail ?
                        <FastImage
                          source={{uri: item.media.thumbnail}}
                          resizeMode={'cover'}
                          style={{position: 'absolute', zIndex: 0, width: '120%', height: '100%',}}
                        />
                      : <View style={{position: 'absolute', zIndex: 0, width: '120%', height: '100%', backgroundColor: Colors.black,}} />}

                      {item.media.video &&
                        <View style={{position: 'absolute', top: 16, right: 16,}}>
                          <PlayIcon fill={Colors.safeLightest} width={16} height={16} />
                        </View>
                      }

                      <LinearGradient
                        style={{position: 'absolute', width: '100%', height: '15%', bottom: 0,}}
                        colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
                      />

                      <Text
                        style={{
                          position: 'absolute', zIndex: 2, bottom: 8, left: 16,
                          color: Colors.safeLightest, fontWeight: Fonts.cruiserWeight as any,
                          shadowRadius: 2, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0, },
                        }}
                      >{item.media.username}</Text>

                      <BlurView
                        blurType={Colors.darkestBlur as any}
                        style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}}
                      />
                    </TouchableOpacity>

                    {item.message &&
                      <View style={{width: '100%',}}>
                        <Pretext
                          systemStore={systemStore}
                          text={item.message}
                          linkColor={me ? Colors.darkBlue : Colors.lightBlue}
                          textStyle={{color: Colors.safeLightest, paddingVertical: 12, paddingHorizontal: 16,}}
                          onPress={(word) => goToProfile(word)}
                          onLongPress={() => {
                            softVibrate()
                            setMessageId(messageId === item.messageId ? null : item.messageId)}
                          }
                        />
                      </View>
                    }
                  </>
                : item.profile ?
                  <>
                    <TouchableOpacity
                      onPress={() => item.profile ? goToProfile(item.profile.username) : null}
                      onLongPress={() => {
                        softVibrate()
                        setMessageId(messageId === item.messageId ? null : item.messageId)}
                      }
                      activeOpacity={Colors.activeOpacity}
                      style={{
                        width: '100%', height: 64, alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        paddingHorizontal: 16, flexDirection: 'row', backgroundColor: Colors.safeDarkBackground,
                      }}
                    >
                      <View style={{flex: 0, marginRight: 12,}}>
                        <Thumbnail systemStore={systemStore} uri={item.profile.profilePicture} size={40} />
                      </View>
                      <View style={{flex: 1,}}>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: Colors.safeLightest, fontWeight: Fonts.cruiserWeight as any,
                            shadowRadius: 2, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0, },
                          }}
                        >{item.profile.username}</Text>
                        <Text
                          numberOfLines={1}
                          style={{
                            color: Colors.safeLightest, fontWeight: Fonts.welterWeight as any,
                            shadowRadius: 2, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0, },
                          }}
                        >{item.profile.name}</Text>
                      </View>
                    </TouchableOpacity>

                    {item.message &&
                      <View style={{width: '100%',}}>
                        <Pretext
                          systemStore={systemStore}
                          text={item.message}
                          linkColor={me ? Colors.darkBlue : Colors.lightBlue}
                          textStyle={{color: Colors.safeLightest, paddingVertical: 12, paddingHorizontal: 16,}}
                          onPress={(word) => goToProfile(word)}
                          onLongPress={() => {
                            softVibrate()
                            setMessageId(messageId === item.messageId ? null : item.messageId)}
                          }
                        />
                      </View>
                    }
                  </>
                : <Pretext
                    systemStore={systemStore}
                    text={item.message}
                    linkColor={me ? Colors.darkBlue : Colors.lightBlue}
                    textStyle={{color: Colors.safeLightest, paddingVertical: 12, paddingHorizontal: 16,}}
                    onPress={(word) => goToProfile(word)}
                    onLongPress={() => {
                      softVibrate()
                      setMessageId(messageId === item.messageId ? null : item.messageId)}
                    }
                  />
                }
              </View>
              <View
                style={{
                  position: 'absolute', zIndex: 1, alignSelf: me ? 'flex-start' : 'flex-end',
                  flexDirection: 'row', bottom: -6, borderRadius: 16, overflow: 'hidden',
                }}
              >
                {messageId && messageId !== item.messageId &&
                  <BlurView
                    blurAmount={1}
                    style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}
                  />
                }
                <BlurView blurType={me ? Colors.safeDarkestBlur : Colors.safeDarkerBlur as any} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />
                <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: me ? Colors.lightBlue : Colors.lightGrey,}} />

                {item.userReaction &&
                  <View style={{padding: 4,}}><Text style={{color: Colors.lightest, fontSize: Fonts.sm,}}>{item.userReaction}</Text></View>
                }
                {item.authUserReaction &&
                  <View style={{padding: 4,}}><Text style={{color: Colors.lightest, fontSize: Fonts.sm,}}>{item.authUserReaction}</Text></View>
                }
              </View>
            </TouchableOpacity>
          </>
        }

        {messageIdTime === item.messageId &&
          <View style={{marginVertical: 4, opacity: 0.5,}}><Text style={{color: Colors.lightest,}}>{formatDate(item.date, true)}</Text></View>
        }
      </TouchableOpacity>
    </>
  )
})

export default Message
