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
import UndoIcon from '../../assets/icons/undo.svg'
import StarIcon from '../../assets/icons/star.svg'
import CrossIcon from '../../assets/icons/cross.svg'
import HeartIcon from '../../assets/icons/heart.svg'
import DotIcon from '../../assets/icons/dot.svg'
import DotFillIcon from '../../assets/icons/dot-fill.svg'
import ChevronUpIcon from '../../assets/icons/chevron-up.svg'
import FastImage from 'react-native-fast-image'

interface IStreetPassCardProps {
  navigation: any,
  systemStore: ISystemStore,
  streetPass: any,
  setStreetPass: (params: { streetPassCardRef: RefObject<CardItemHandle>, streetPassImageIndex: number, }) => void,
}
const StreetPassCard: React.FC<IStreetPassCardProps> = ({ navigation, systemStore, streetPass, setStreetPass, }) => {
  const { Colors, Fonts, } = systemStore
  const streetPassCardRef: RefObject<CardItemHandle> = React.createRef()
  const streetPassCarouselRef: RefObject<ICarouselInstance> = React.createRef()
  const [streetPassImageIndex, setStreetPassImageIndex] = useState<number>(0)

  return (
    <View
      pointerEvents={'box-none'}
      key={streetPass.userId}
      style={{...StyleSheet.absoluteFillObject, alignItems: 'center', paddingVertical: 32,}}
    >
      <TinderCard
        ref={streetPassCardRef}
        cardWidth={Dimensions.get('window').width * 0.9}
        cardHeight={Dimensions.get('window').height * 0.72}
        disableTopSwipe={true}
        disableBottomSwipe={true}
        OverlayLabelLeft={() => {
          return (
            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.blue, opacity: 0.5,}}>
              <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold',}}>Dislike</Text>
            </View>
          )
        }}
        OverlayLabelRight={() => {
          return (
            <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.red, opacity: 0.5,}}>
              <Text style={{color: 'white', fontSize: 32, fontWeight: 'bold',}}>Like</Text>
            </View>
          )
        }}
        onSwipedRight={() => {
          // Alert.alert('[RIGHT]')
        }}
        onSwipedLeft={() => {
          // Alert.alert('[LEFT]')
        }}
        cardStyle={{borderRadius: 32, overflow: 'hidden',}}
      >
        <View style={{flex: 1, flexDirection: 'row',}}>
          <TouchableWithoutFeedback onPress={() => {
            streetPassCarouselRef?.current?.prev()
          }}>
            <View style={{flex: 1,}} />
          </TouchableWithoutFeedback>

          <TouchableWithoutFeedback onPress={() => {
            streetPassCarouselRef?.current?.next()
          }}>
            <View style={{flex: 1,}} />
          </TouchableWithoutFeedback>

          <View style={{position: 'absolute', width: '100%',}}>
            <LinearGradient
              style={{position: 'absolute', width: '100%', height: '140%', top: 0,}}
              colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
            />

            <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center',}}>
              {Array.from({ length: streetPass.media.length, }, (v, i) => {
                return streetPassImageIndex === i
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

            <View style={{flexDirection: 'row', marginBottom: 16, paddingHorizontal: 24,}}>
              <View style={{flex: 1,}}>
                <Text style={{color: Colors.safeLightest, fontSize: Fonts.lg, fontWeight: Fonts.heavyWeight, textShadowColor: Colors.safeDarkest, textShadowRadius: 2,}}>{streetPass.name} <Text style={{fontWeight: Fonts.lightWeight,}}>{streetPass.age}</Text></Text>
                <Text numberOfLines={1} style={{color: Colors.safeLightest, fontSize: Fonts.md, fontWeight: Fonts.lightWeight, textShadowColor: Colors.safeDarkest, textShadowRadius: 2}}>{streetPass.bio}</Text>
              </View>

              <TouchableOpacity
                onPress={() => setStreetPass({ streetPassCardRef, streetPassImageIndex, })}
                activeOpacity={Colors.activeOpacity}
                style={{flex: 0, justifyContent: 'center',}}
              >
                <ChevronUpIcon fill={Colors.safeLightest} width={32} height={32} />
              </TouchableOpacity>
            </View>

            <View style={{justifyContent: 'space-between', flexDirection: 'row', paddingHorizontal: 24, paddingBottom: 16,}}>
              <TouchableOpacity
                onPress={() => streetPassCardRef?.current?.swipeLeft()}
                activeOpacity={Colors.activeOpacity}
                style={{padding: 12, borderWidth: 1, borderRadius: 64, borderColor: Colors.lightBlue,}}
              >
                <CrossIcon fill={Colors.lightBlue} width={24} height={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => streetPassCardRef?.current?.swipeRight()}
                activeOpacity={Colors.activeOpacity}
                style={{padding: 12, borderWidth: 1, borderRadius: 64, borderColor: Colors.red,}}
              >
                <HeartIcon fill={Colors.red} width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={{position: 'absolute', flex: 1, zIndex: -1, overflow: 'hidden',}}>
          <Carousel
            ref={streetPassCarouselRef}
            loop={false}
            width={Dimensions.get('window').width * 0.9}
            height={Dimensions.get('window').height * 0.72}
            data={streetPass.media}
            onSnapToItem={index => setStreetPassImageIndex(index)}
            renderItem={(item: any) => (
              <FastImage key={item.index} source={{ uri: item.item.image, }} style={{width: '100%', height: '100%',}} />
            )}
          />
        </View>
      </TinderCard>
    </View>
  )
}

export default StreetPassCard
