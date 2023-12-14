import { BlurView } from '@react-native-community/blur'
import React from 'react'
import {
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { SvgProps } from 'react-native-svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import PlusIcon from '../../assets/icons/plus.svg'
import MinusIcon from '../../assets/icons/minus.svg'

interface ICreateMediaModalSwitchProps {
  systemStore: ISystemStore,
  Icon: React.FC<SvgProps>,
  title: string,
  subtitle?: string,
  active: boolean,
  onPress: () => void,
}
const CreateMediaModalSwitch: React.FC<ICreateMediaModalSwitchProps> = ({ systemStore, Icon, title, subtitle, active, onPress, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={Colors.activeOpacity}
      style={{
        flexDirection: 'row', alignItems: 'center', width: '100%', borderRadius: 16, overflow: 'hidden',
        paddingHorizontal: 8, paddingVertical: 4, marginBottom: 8,
        borderColor: active ? Colors.safeLightest : Colors.safeDark, borderWidth: 1,
      }}
    >
      <BlurView blurType={active ? Colors.safeLightBlur : Colors.safeDarkBlur as any} style={{position: 'absolute', zIndex: -1, width: '200%', height: '200%',}} />

      <Icon fill={active ? Colors.safeLightest : Colors.safeLight} width={24} height={24} />

      <View style={{flex: 1, marginLeft: 16, paddingVertical: 8,}}>
        <Text style={{color: Colors.safeLightest, fontWeight: Fonts.heavyWeight, marginBottom: 4,}}>{title}</Text>
        <Text style={{color: Colors.safeLightest, fontWeight: Fonts.welterWeight,}}>{subtitle}</Text>
      </View>

      {active ? <MinusIcon fill={Colors.safeLightest} width={24} height={24} /> : <PlusIcon fill={Colors.safeLightest} width={24} height={24} />}
    </TouchableOpacity>
  )
}

export default CreateMediaModalSwitch
