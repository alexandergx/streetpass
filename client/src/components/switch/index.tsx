import React, { useState, useEffect, } from 'react'
import { View, Animated, TouchableOpacity, } from 'react-native'
import { SvgProps } from 'react-native-svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { softVibrate, hardVibrate } from '../../utils/services'

interface ISwitchProps {
  systemStore: ISystemStore,
  value: boolean,
  disabled?: boolean,
  StartIcon?: React.FC<SvgProps>,
  EndIcon?: React.FC<SvgProps>,
  onToggle: () => void,
}

export const Switch: React.FC<ISwitchProps> = function ({ systemStore, value, disabled, StartIcon, EndIcon, onToggle, }) {
  const { Colors, } = systemStore

  const [toggleValue, setToggleValue] = useState<boolean>(value)
  const [animXValue] = useState(new Animated.Value(toggleValue ? 1 : 0))

  const circleTransform = { translateX: animXValue.interpolate({ inputRange: [0, 1], outputRange: [2, 23], }), }

  useEffect(() => {
    setToggleValue(value)
    Animated.timing(animXValue, { useNativeDriver: false, toValue: value ? 1 : 0, duration: 100, }).start()
  }, [value, animXValue])

  return (
    <TouchableOpacity
      onPress={() => {
        !toggleValue ? hardVibrate() : softVibrate()
        setToggleValue(!toggleValue)
        onToggle()
      }}
      disabled={disabled}
      activeOpacity={Colors.activeOpacity}
      style={{height: 32, aspectRatio: 2 / 1.2,}}
    >
      <View
        style={{
          flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%', borderRadius: 32,
          backgroundColor: value ? Colors.lightBlue : Colors.safeDark,
        }}
      >
        <Animated.View
          style={{
            transform: [circleTransform], height: 26, aspectRatio: 1 / 1, left: 1, borderRadius: 32,
            backgroundColor: 'white',
          }}
        />
      </View>
    </TouchableOpacity>
  )
}
