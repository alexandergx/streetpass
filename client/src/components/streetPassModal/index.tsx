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
import FastImage from 'react-native-fast-image'
import { BlurView } from '@react-native-community/blur'
import { ScrollView, TouchableOpacity } from 'react-native-gesture-handler'
import { timePassedSince } from '../../utils/functions'
import { IListGroupConfig } from '../listGroup'
import SelectionModal from '../selectionModal'

interface IStreetPassModalProps {
  navigation: any,
  systemStore: ISystemStore,
  streetPass: any,
  streetPassCardRef: RefObject<CardItemHandle> | null,
  streetPassImageIndex: number | null,
  unsetStreetPass: () => void,
}
const StreetPassModal: React.FC<IStreetPassModalProps> = ({
  navigation, systemStore, streetPass, streetPassCardRef, streetPassImageIndex, unsetStreetPass,
}) => {
  const { Colors, Fonts, } = systemStore
  const streetPassCarouselRef: RefObject<ICarouselInstance> = React.createRef()
  const [imageIndex, setImageIndex] = useState<number>(streetPassImageIndex || 0)
  const [selectionModalConfig, setSelectionModalConfig] = useState<IListGroupConfig | null>(null)
  const swipeLeft = streetPassCardRef?.current?.swipeLeft
  const swipeRight = streetPassCardRef?.current?.swipeRight

  return (
    <>
      <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%',}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{marginTop: 64,}}>
            <Carousel
              ref={streetPassCarouselRef}
              panGestureHandlerProps={{ activeOffsetX: [-10, 10], }}
              defaultIndex={streetPassImageIndex || 0}
              loop={false}
              width={Dimensions.get('window').width}
              height={Dimensions.get('window').height * 0.65}
              data={streetPass.media}
              onSnapToItem={index => setImageIndex(index)}
              renderItem={(item: any) => (
                <>
                  <FastImage key={item.index} source={{ uri: item.item.image, }} style={{width: '100%', height: '100%',}} />
                  <View style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%', flexDirection: 'row',}}>
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
                  </View>
                </>
              )}
            />

            <View style={{position: 'absolute', width: '100%',}}>
              <LinearGradient
                style={{position: 'absolute', width: '100%', height: '140%', top: 0,}}
                colors={['rgba(0,0,0,0.0)', 'rgba(0,0,0,0.05)', 'rgba(0,0,0,0.1)', 'rgba(0,0,0,0.2)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
              />

              <View style={{flexDirection: 'row', width: '100%', justifyContent: 'center',}}>
                {Array.from({ length: streetPass.media.length, }, (v, i) => {
                  return imageIndex === i
                    ? <DotFillIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
                    : <DotIcon key={i} fill={Colors.safeLightest} width={24} height={24} />
                })}
              </View>
            </View>

            <View style={{position: 'absolute', top: 0, right: 0, padding: 24,}}>
              <View style={{flex: 0, justifyContent: 'center',}}>
                <TouchableOpacity
                  activeOpacity={Colors.activeOpacity}
                  onPress={() => setSelectionModalConfig({
                    title: streetPass.name,
                    list: [
                      { Icon: DeleteIcon, title: 'Block', noRight: true, onPress: () => null, },
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
                  onPress={unsetStreetPass}
                >
                  <ChevronDownIcon fill={Colors.safeLightest} width={32} height={32} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          <View style={{flex: 1, flexDirection: 'row', paddingHorizontal: 16, paddingTop: 24, marginBottom: 8,}}>
            <View style={{flex: 1,}}>
              <Text style={{color: Colors.lightest, fontSize: Fonts.lg, fontWeight: Fonts.heavyWeight, textShadowColor: Colors.darkest, textShadowRadius: 2,}}>{streetPass.name} <Text style={{fontWeight: Fonts.lightWeight,}}>{streetPass.age}</Text></Text>
              <Text numberOfLines={1} style={{color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.featherWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>Streetpassed {timePassedSince(streetPass.streetPassDate, systemStore.Locale)}</Text>
            </View>

            <View style={{flex: 0, flexDirection: 'row',}}>
              <TouchableOpacity
                onPress={async () => {
                  await unsetStreetPass()
                  swipeLeft && swipeLeft()
                }}
                activeOpacity={Colors.activeOpacity}
                style={{padding: 12, borderWidth: 1, borderRadius: 64, marginHorizontal: 8, borderColor: Colors.lightBlue,}}
              >
                <CrossIcon fill={Colors.lightBlue} width={24} height={24} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  await unsetStreetPass()
                  swipeRight && swipeRight()
                }}
                activeOpacity={Colors.activeOpacity}
                style={{padding: 12, borderWidth: 1, borderRadius: 64, marginHorizontal: 8, borderColor: Colors.red,}}
              >
                <HeartIcon fill={Colors.red} width={24} height={24} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={{flex: 1, paddingHorizontal: 16,}}>
            <Text style={{marginTop: 16, color: Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.lightWeight, textShadowColor: Colors.darkest, textShadowRadius: 2}}>{streetPass.bio}</Text>
          </View>

          <View style={{height: 80,}} />
        </ScrollView>

        {selectionModalConfig &&
          <SelectionModal systemStore={systemStore} config={selectionModalConfig} toggleModal={() => setSelectionModalConfig(null)} />
        }
      </BlurView>
    </>
  )
}

export default StreetPassModal
