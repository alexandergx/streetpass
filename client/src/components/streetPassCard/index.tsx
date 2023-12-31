import React, { RefObject, useState } from 'react'
import {
  Dimensions,
  StyleSheet,
  Text, TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native'
import { ISystemStore, } from '../../state/reducers/SystemReducer'
import { CardItemHandle, TinderCard, } from 'rn-tinder-card'
import Carousel, { ICarouselInstance, } from 'react-native-reanimated-carousel'
import LinearGradient from 'react-native-linear-gradient'
// import UndoIcon from '../../assets/icons/undo.svg'
// import StarIcon from '../../assets/icons/star.svg'
import CrossIcon from '../../assets/icons/cross.svg'
import HeartIcon from '../../assets/icons/heart.svg'
import DotIcon from '../../assets/icons/dot.svg'
import DotFillIcon from '../../assets/icons/dot-fill.svg'
import ChevronUpIcon from '../../assets/icons/chevron-up.svg'
import FastImage from 'react-native-fast-image'
import { IStreetpass } from '../../state/reducers/StreetpassReducer'
import Video from 'react-native-video'
import convertToProxyURL from 'react-native-video-cache'
import { match } from '../../api/matches'
import { timePassedSince } from '../../utils/functions'

interface IStreetpassCardProps {
  navigation: any,
  systemStore: ISystemStore,
  streetpass: IStreetpass,
  setStreetpass: (params: { streetpassCardRef: RefObject<CardItemHandle>, streetpassImageIndex: number, }) => void,
  actions: {
    setStreetpass: () => void,
  }
}
const StreetpassCard: React.FC<IStreetpassCardProps> = ({ navigation, systemStore, streetpass, setStreetpass, actions, }) => {
  const { Colors, Fonts, } = systemStore
  const streetpassCardRef: RefObject<CardItemHandle> = React.createRef()
  const streetpassCarouselRef: RefObject<ICarouselInstance> = React.createRef()
  const [streetpassImageIndex, setStreetpassImageIndex] = useState<number>(0)

  return (
    <View
      pointerEvents={'box-none'}
      key={streetpass.userId}
      style={{...StyleSheet.absoluteFillObject, alignItems: 'center', paddingVertical: 32,}}
    >
      <TinderCard
        ref={streetpassCardRef}
        cardWidth={Dimensions.get('window').width * 0.9}
        cardHeight={Dimensions.get('window').height * 0.72}
        disableTopSwipe={true}
        disableBottomSwipe={true}
        OverlayLabelLeft={() => {
          return (
            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.lightBlue, opacity: 0.5,}}>
              {/* <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold',}}>Dislike</Text> */}
            </View>
          )
        }}
        OverlayLabelRight={() => {
          return (
            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.lightRed, opacity: 0.5,}}>
              {/* <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold',}}>Like</Text> */}
            </View>
          )
        }}
        onSwipedRight={() => {
          actions.setStreetpass()
          match({ userId: streetpass.userId, match: true, })
        }}
        onSwipedLeft={() => {
          actions.setStreetpass()
          match({ userId: streetpass.userId, match: false, })
        }}
        cardStyle={{borderRadius: 32, overflow: 'hidden',}}
      >
        <View style={{flex: 1, flexDirection: 'row',}}>
          <TouchableWithoutFeedback onPress={() => {
            streetpassCarouselRef?.current?.prev()
          }}>
            <View style={{flex: 1,}} />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {
            streetpassCarouselRef?.current?.next()
          }}>
            <View style={{flex: 1,}} />
          </TouchableWithoutFeedback>

          <View style={{position: 'absolute', width: '100%',}}>
            <LinearGradient
              style={{position: 'absolute', width: '100%', height: '140%', top: 0,}}
              colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
            />

            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center',}}>
              {Array.from({ length: streetpass.media.length, }, (v, i) => {
                return streetpassImageIndex === i
                  ? <DotFillIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
                  : <DotIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
              })}
            </View>

            {/* <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 24, paddingBottom: 16,}}>
              <TouchableWithoutFeedback onPress={() => {
                cardRef?.current?.swipeLeft()
              }}>
                <View style={{padding: 12, borderWidth: 1, borderRadius: 64, borderColor: Colors.safeLightest,}}>
                  <UndoIcon fill={Colors.safeLightest} width={24} height={24} />
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback onPress={() => {
                cardRef?.current?.swipeRight()
              }}>
                <View style={{padding: 12, borderWidth: 1, borderRadius: 64, borderColor: Colors.gold,}}>
                  <StarIcon fill={Colors.gold} width={24} height={24} />
                </View>
              </TouchableWithoutFeedback>
            </View> */}
          </View>

          <View style={{position: 'absolute', width: '100%', bottom: 0,}}>
            <LinearGradient
              style={{position: 'absolute', width: '100%', height: '120%', bottom: 0,}}
              colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0.4)', 'rgba(0,0,0,0.3)', 'rgba(0,0,0,0.2)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
            />

            <View style={{flexDirection: 'row', marginBottom: 24, paddingHorizontal: 24,}}>
              <View style={{flex: 1,}}>
                <Text style={{color: Colors.safeLightest, fontSize: Fonts.xl, fontWeight: Fonts.heavyWeight, textShadowColor: Colors.safeDarkest, textShadowRadius: 2,}}>{streetpass.name} <Text style={{fontWeight: Fonts.lightWeight,}}>{streetpass.age}</Text></Text>
                {streetpassImageIndex === 0 &&
                  <Text numberOfLines={1} style={{color: Colors.safeLightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, textShadowColor: Colors.safeDarkest, textShadowRadius: 2}}>{streetpass.bio}</Text>
                }
                {streetpassImageIndex === 1 &&
                  <>
                    <Text numberOfLines={1} style={{color: Colors.safeLightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, textShadowColor: Colors.safeDarkest, textShadowRadius: 2}}>{streetpass.work}</Text>
                    <Text numberOfLines={1} style={{color: Colors.safeLightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, textShadowColor: Colors.safeDarkest, textShadowRadius: 2}}>{streetpass.school}</Text>
                  </>
                }
                {streetpassImageIndex > 1 &&
                  <Text numberOfLines={1} style={{color: Colors.safeLightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight, textShadowColor: Colors.safeDarkest, textShadowRadius: 2}}>Streetpassed {timePassedSince(streetpass.date, systemStore.Locale)}</Text>
                }
              </View>

              <TouchableOpacity
                onPress={() => setStreetpass({ streetpassCardRef, streetpassImageIndex, })}
                activeOpacity={Colors.activeOpacity}
                style={{flex: 0, justifyContent: 'flex-end',}}
              >
                <ChevronUpIcon fill={Colors.safeLightest} width={32} height={32} />
              </TouchableOpacity>
            </View>

            <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 24, paddingBottom: 16,}}>
              <TouchableOpacity
                onPress={() => streetpassCardRef?.current?.swipeLeft()}
                activeOpacity={Colors.activeOpacity}
                style={{padding: 12, borderWidth: 1, borderRadius: 64, borderColor: Colors.lightBlue,}}
              >
                <CrossIcon fill={Colors.lightBlue} width={24} height={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => streetpassCardRef?.current?.swipeRight()}
                activeOpacity={Colors.activeOpacity}
                style={{padding: 12, borderWidth: 1, borderRadius: 64, borderColor: Colors.lightRed,}}
              >
                <HeartIcon fill={Colors.lightRed} width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{position: 'absolute', flex: 1, zIndex: -1, overflow: 'hidden',}}>
          <Carousel
            ref={streetpassCarouselRef}
            loop={false}
            width={Dimensions.get('window').width * 0.9}
            height={Dimensions.get('window').height * 0.72}
            data={streetpass.media}
            onSnapToItem={index => setStreetpassImageIndex(index)}
            renderItem={(item: any) => (
              <View key={item.item.mediaId} style={{width: '100%', height: '100%',}}>
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
              </View>
            )}
          />
        </View>
      </TinderCard>
    </View>
  )
}

export default StreetpassCard
