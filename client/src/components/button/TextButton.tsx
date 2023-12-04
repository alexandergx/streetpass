import React from 'react'
import {
  Text,
  TouchableOpacity,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface ITextButtonProps {
  systemStore: ISystemStore,
  title: string,
  color?: string,
  fontWeight?: string,
  disabled?: boolean,
  noPadding?: boolean,
  onPress: () => void,
}
const TextButton: React.FC<ITextButtonProps> = ({ systemStore, title, color, fontWeight, disabled, noPadding, onPress, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <TouchableOpacity
      activeOpacity={Colors.activeOpacity}
      onPress={disabled ? undefined : onPress}
      style={{paddingVertical: noPadding ? 0 : 16,}}
    >
      <Text style={{color: color ? color : Colors.lighter, fontWeight: fontWeight ? fontWeight : Fonts.welterWeight as any,}}>{title}</Text>
    </TouchableOpacity>
  )
}

export default TextButton
