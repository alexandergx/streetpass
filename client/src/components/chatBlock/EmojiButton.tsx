import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface IReactionButtonProps {
  systemStore: ISystemStore,
  title: string,
  active?: boolean,
  onPress: () => void,
}
const ReactionButton: React.FC<IReactionButtonProps> = ({ systemStore, title, active, onPress, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <TouchableOpacity
      activeOpacity={Colors.activeOpacity}
      onPress={onPress}
      style={{paddingHorizontal: 8,}}
    >
      <View style={[{borderRadius: 24, overflow: 'hidden',}, active && {backgroundColor: Colors.lightBlue,}]}>
        <Text style={{padding: 4, fontSize: Fonts.xl,}}>{title}</Text>
      </View>
    </TouchableOpacity>
  )
}

export default ReactionButton
