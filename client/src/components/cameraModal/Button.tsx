import { BlurView } from '@react-native-community/blur'
import React from 'react'
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SvgProps } from 'react-native-svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface ICreateMediaModalButtonProps {
  systemStore: ISystemStore,
  Icon: React.FC<SvgProps>,
  color?: string,
  text?: string,
  loading?: boolean,
  disabled?: boolean,
  onPress: () => void,
}
const CreateMediaModalButton: React.FC<ICreateMediaModalButtonProps> = ({ systemStore, Icon, color, text, loading, disabled, onPress, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <TouchableOpacity
      onPress={() => loading || disabled ? null : onPress()}
      activeOpacity={disabled ? 0.3 : Colors.activeOpacity}
      style={{
        borderRadius: 64, overflow: 'hidden', flexDirection: 'row',
        justifyContent: 'center', alignItems: 'center', marginHorizontal: 24,
        opacity: disabled ? 0.3 : 1,
      }}
    >
      <BlurView blurType={Colors.safeDarkBlur as any} style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}} />
      {text && !loading &&
        <View style={{paddingLeft: 12,}}>
          <Text style={{color: Colors.safeLightest, fontWeight: Fonts.heavyWeight as any,}}>{text}</Text>
        </View>
      }
      <View style={{width: 40, aspectRatio: 1/1, justifyContent: 'center', alignItems: 'center',}}>
        {loading
          ? <ActivityIndicator color={Colors.safeLighter} />
          : <Icon fill={color ? color : Colors.safeLightest} width={24} height={24} />
        }
      </View>
    </TouchableOpacity>
  )
}

export default CreateMediaModalButton
