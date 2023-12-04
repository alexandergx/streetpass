import React, { useEffect, useRef } from 'react'
import { Animated, } from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface IAnimatedPulseProps {
  systemStore: ISystemStore,
}
const AnimatedPulse: React.FC<IAnimatedPulseProps> = ({ systemStore, }) => {
  const { Colors, } = systemStore

  const pulseAnim = useRef(new Animated.Value(0)).current
  const singlePulse = () => (
    Animated.sequence([
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
      Animated.timing(pulseAnim, {
        toValue: 0,
        duration: 0,
        useNativeDriver: true,
      })
    ])
  )

  const startPulse = () => {
    Animated.sequence([
      singlePulse(),
      singlePulse(),
      singlePulse(),
      Animated.delay(5000),
    ]).start(() => startPulse())
  }
  
  useEffect(() => {
    startPulse()
  }, [])
  
  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          zIndex: -1,
          width: 20,
          aspectRatio: 1/1,
          backgroundColor: Colors.lightBlue,
          borderRadius: 16,
          justifyContent: 'center',
          alignItems: 'center',
        },
        {
          transform: [{
            scale: pulseAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 2.2],
            })
          }],
          opacity: pulseAnim.interpolate({
            inputRange: [0, 1],
            outputRange: [1, 0],
          }),
        },
      ]}
    />
  )
}

export default AnimatedPulse
