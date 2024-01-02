import React, { RefObject, useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  Text, TouchableWithoutFeedback, View,
} from 'react-native'
import { ISystemStore, } from '../../state/reducers/SystemReducer'
import { CardItemHandle, } from 'rn-tinder-card'
import Carousel, { ICarouselInstance, } from 'react-native-reanimated-carousel'
import LinearGradient from 'react-native-linear-gradient'
import DeleteIcon from '../../assets/icons/delete.svg'
import ExclamationIcon from '../../assets/icons/exclamation-circled.svg'
import CrossIcon from '../../assets/icons/cross.svg'
import HeartIcon from '../../assets/icons/heart.svg'
import DotIcon from '../../assets/icons/dot.svg'
import DotFillIcon from '../../assets/icons/dot-fill.svg'
import EllipsisIcon from '../../assets/icons/ellipsis.svg'
import ChevronDownIcon from '../../assets/icons/chevron-down.svg'
import WorkIcon from '../../assets/icons/work.svg'
import SchoolIcon from '../../assets/icons/school.svg'
import FastImage from 'react-native-fast-image'
import { BlurView } from '@react-native-community/blur'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { timePassedSince } from '../../utils/functions'
import { IListGroupConfig } from '../listGroup'
import SelectionModal from '../selectionModal'
import Video from 'react-native-video'
import convertToProxyURL from 'react-native-video-cache'
import { blockUser } from '../../api/user'
import { IStreetpass } from '../../state/reducers/StreetpassReducer'
import { IUnsetChat } from '../../state/actions/ChatsActions'
import { IUnsetMatch } from '../../state/actions/MatchesActions'

interface IStreetpassModalProps {
  navigation: any,
  systemStore: ISystemStore,
  streetpass: IStreetpass,
  streetpassCardRef?: RefObject<CardItemHandle> | null,
  streetpassImageIndex: number | null,
  hideActions?: boolean,
  unsetStreetpass: () => void,
  actions: {
    unsetMatch: (params: IUnsetMatch) => void,
    unsetChat: (params: IUnsetChat) => void,
  }
}
const StreetpassModal: React.FC<IStreetpassModalProps> = ({ navigation, systemStore, streetpass, streetpassCardRef, streetpassImageIndex, hideActions, unsetStreetpass, actions, }) => {
  const { Colors, Fonts, } = systemStore
  const streetpassCarouselRef: RefObject<ICarouselInstance> = React.createRef()
  const [imageIndex, setImageIndex] = useState<number>(streetpassImageIndex || 0)
  const [selectionModalConfig, setSelectionModalConfig] = useState<IListGroupConfig | null>(null)
  const swipeLeft = streetpassCardRef?.current?.swipeLeft
  const swipeRight = streetpassCardRef?.current?.swipeRight

  return (
    <>
      <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 3, width: '100%', height: '100%',}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 64,}}>
            <Carousel
              ref={streetpassCarouselRef}
              enabled={streetpass.media.length > 1}
              panGestureHandlerProps={{ activeOffsetX: [-10, 10], }}
              defaultIndex={streetpassImageIndex || 0}
              loop={false}
              width={Dimensions.get('window').width}
              height={Dimensions.get('window').height * 0.65}
              data={streetpass.media}
              onSnapToItem={index => setImageIndex(index)}
              renderItem={(item: any) => (
                <>
                  {item.item.thumbnail &&
                    <FastImage source={{ uri: item.item.thumbnail, }} style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}} />
                  }

                  {item.item.image &&
                    <FastImage source={{ uri: item.item.image, }} style={{width: '100%', height: '100%',}} />
                  }

                  {item.item.video &&
                    <Video
                      source={{ uri: convertToProxyURL(item.item.video), }}
                      paused={false}
                      repeat={true}
                      playInBackground={false}
                      playWhenInactive={false}
                      mixWithOthers={'mix'}
                      ignoreSilentSwitch={'ignore'}
                      muted={true}
                      bufferConfig={{
                        minBufferMs: 500,
                        maxBufferMs: 30000,
                        bufferForPlaybackMs: 500,
                        bufferForPlaybackAfterRebufferMs: 1000,
                      }}
                      resizeMode={'cover'}
                      style={{width: '100%', height: '100%',}}
                    />
                  }

                  <View style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%', flexDirection: 'row',}}>
                    <TouchableWithoutFeedback onPress={() => streetpassCarouselRef?.current?.prev()}>
                      <View style={{flex: 1,}} />
                    </TouchableWithoutFeedback>
                    <TouchableWithoutFeedback onPress={() => streetpassCarouselRef?.current?.next()}>
                      <View style={{flex: 1,}} />
                    </TouchableWithoutFeedback>
                  </View>
                </>
              )}
            />

            <View style={{position: 'absolute', width: '100%',}}>
              <LinearGradient
                style={{position: 'absolute', width: '100%', height: '140%', top: 0,}}
                colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
              />

              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center', marginTop: 8,}}>
                {streetpass.media.length > 1 && Array.from({ length: streetpass.media.length, }, (v, i) => {
                  return imageIndex === i
                    ? <DotFillIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
                    : <DotIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
                })}
              </View>
            </View>

            <View style={{position: 'absolute', top: 0, right: 0, paddingVertical: 8, paddingHorizontal: 24,}}>
              <View style={{flex: 0, justifyContent: 'center',}}>
                <TouchableOpacity
                  activeOpacity={Colors.activeOpacity}
                  onPress={() => setSelectionModalConfig({
                    title: streetpass.name,
                    list: [
                      { Icon: DeleteIcon, title: 'Block', noRight: true, onPress: async () => {
                        blockUser({ userId: streetpass.userId, })
                        if (hideActions) {
                          actions.unsetMatch({ userId: streetpass.userId, pass: true, })
                          actions.unsetChat(streetpass.userId)
                          navigation.goBack()
                        } else {
                          await unsetStreetpass()
                          swipeLeft && swipeLeft()
                        }
                      }, },
                      { Icon: ExclamationIcon, title: 'Report', noRight: true, onPress: () => null, },
                    ],
                  })}
                >
                  <EllipsisIcon fill={Colors.safeLightest} width={32} height={32} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={{position: 'absolute', bottom: 0, right: 0, padding: 24,}}>
              <View style={{flex: 0, justifyContent: 'center',}}>
                <TouchableOpacity
                  activeOpacity={Colors.activeOpacity}
                  onPress={unsetStreetpass}
                >
                  <ChevronDownIcon fill={Colors.safeLightest} width={32} height={32} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16, paddingTop: 24,}}>
            <View style={{flex: 1, marginBottom: 16,}}>
              <Text style={{color: Colors.lightest, fontSize: Fonts.xl, fontWeight: Fonts.heavyWeight, textShadowColor: Colors.darkest, textShadowRadius: 2,}}>{streetpass.name} <Text style={{fontWeight: Fonts.lightWeight,}}>{streetpass.age}</Text></Text>
              <Text numberOfLines={1} style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.lightWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>Streetpassed {timePassedSince(streetpass.streetpassDate, systemStore.Locale)}</Text>
            </View>

            {!hideActions &&
              <View style={{flex: 0, flexDirection: 'row',}}>
                <TouchableOpacity
                  onPress={async () => {
                    await unsetStreetpass()
                    swipeLeft && swipeLeft()
                  }}
                  activeOpacity={Colors.activeOpacity}
                  style={{padding: 12, borderWidth: 1, borderRadius: 64, marginHorizontal: 8, borderColor: Colors.lightBlue,}}
                >
                  <CrossIcon fill={Colors.lightBlue} width={24} height={24} />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={async () => {
                    await unsetStreetpass()
                    swipeRight && swipeRight()
                  }}
                  activeOpacity={Colors.activeOpacity}
                  style={{padding: 12, borderWidth: 1, borderRadius: 64, marginHorizontal: 8, borderColor: Colors.red,}}
                >
                  <HeartIcon fill={Colors.red} width={24} height={24} />
                </TouchableOpacity>
              </View>
            }
          </View>

          {streetpass.work &&
            <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16,}}>
              <WorkIcon fill={Colors.lightest} width={16} height={16} />
              <Text style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, marginLeft: 8,}}>{streetpass.work}</Text>
            </View>
          }

          {streetpass.school &&
            <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16, marginBottom: 8,}}>
              <SchoolIcon fill={Colors.lightest} width={16} height={16} />
              <Text style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, marginLeft: 8,}}>{streetpass.school}</Text>
            </View>
          }

          <View style={{flex: 1, paddingHorizontal: 16, marginTop: 8,}}>
            <Text style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.middleWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>{streetpass.bio}</Text>
          </View>

          <View style={{height: 128,}} />
        </ScrollView>

        {selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={selectionModalConfig} toggleModal={() => setSelectionModalConfig(null)} />
        }
      </BlurView>
    </>
  )
}

export default StreetpassModal
