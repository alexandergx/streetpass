import React, {} from 'react'
import {
  View,
  TouchableOpacity,
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { BlurView } from '@react-native-community/blur'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface IThumbnailProps {
  systemStore: ISystemStore,
  uri: string | null | undefined,
  size: number,
  square?: boolean,
  color?: string | undefined,
  onPress?: (() => void) | null,
}
class Thumbnail extends React.Component<IThumbnailProps> {
  render() {
    const { systemStore, uri, size, square, color, onPress, }: IThumbnailProps = this.props
    const { Colors, } = systemStore

    return (
      <View
        pointerEvents={onPress ? 'auto' : 'none'}
        style={{
          flex: 0, width: size || 40, aspectRatio: 1/1, borderRadius: square ? 8 : 64, overflow: 'hidden',
          borderWidth: color ? 0.8 : 0, borderColor: color ? color : Colors.safeLighter,
        }}
      >
        <TouchableOpacity
          onPress={onPress ? onPress : () => null}
          activeOpacity={onPress ? Colors.activeOpacity : 1}
          style={{width: '100%', height: '100%',}}
        >
          <BlurView blurType={Colors.lightBlur } style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}}/>
          {uri &&
            <FastImage
              source={{uri: uri}}
              style={{width: '100%', aspectRatio: 1/1,}}
            />
          }
        </TouchableOpacity>
      </View>
    )
  }
}

export default Thumbnail
