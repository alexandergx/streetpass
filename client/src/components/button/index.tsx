import React from 'react'
import {
  Text,
  TouchableOpacity,
  ActivityIndicator,
  View,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { SvgProps } from 'react-native-svg'

interface IButtonProps {
  systemStore: ISystemStore,
  Icon?: React.FC<SvgProps>,
  title?: string,
  color?: string,
  loading?: boolean,
  disabled?: boolean,
  onPress: () => void,
}
const Button: React.FC<IButtonProps> = ({ systemStore, Icon, title, color, loading, disabled, onPress, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <TouchableOpacity
      onPress={() => !disabled && !loading ? onPress() : null}
      activeOpacity={disabled || loading ? 1 : Colors.activeOpacity}
      style={{
        width: '100%', marginVertical: 8, alignItems: 'center', justifyContent: 'center',
        borderRadius: 12, height: 40, overflow: 'hidden',
      }}
    >
      <BlurView
        blurType={Colors.darkestBlur as any }
        style={{
          position: 'absolute', zIndex: -1, width: '100%', height: '100%',
          backgroundColor: color ? color : Colors.darkBackground,
        }}
      />

      {loading
        ? <ActivityIndicator color={Colors.lighter} />
        : <View style={{flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,}}>
          {Icon && <View><Icon fill={disabled ? Colors.light : Colors.lightest} width={16} height={16} /></View>}
          <Text
            numberOfLines={1}
            style={{
              color: disabled ? Colors.light : Colors.lightest,
              fontWeight: Fonts.middleWeight as any,
              flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
              paddingHorizontal: 8,
            }}
          >
            {title || ''}
          </Text>
        </View>
      }
    </TouchableOpacity>
  )
}

export default Button
