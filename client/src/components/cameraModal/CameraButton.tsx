import React, { useEffect, } from 'react'
import { View, } from 'react-native'
import Animated, {
  useSharedValue,
  withTiming,
  Easing,
  useDerivedValue,
  useAnimatedProps,
} from 'react-native-reanimated'

import { Circle, G, Svg, } from 'react-native-svg'
import { ISystemStore, } from '../../state/reducers/SystemReducer'
import { InputLimits, } from '../../utils/constants'

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

interface IAnimatedCircularProgressProps {
  systemStore: ISystemStore,
  size?: number,
  strokeWidth?: number,
  duration?: number,
}
const AnimatedCircularProgress: React.FC<IAnimatedCircularProgressProps> = ({ systemStore, size = 82, strokeWidth = 8, duration = InputLimits.VideoLengthMax * 1000, }) => {
  const { Colors, } = systemStore
  const progress = useSharedValue(0)

  useEffect(() => {
    progress.value = withTiming(1, {
      duration: duration,
      easing: Easing.linear,
    })
  }, [progress, duration])

  const strokeDashoffset = useDerivedValue(() => {
    const circleSize = size - strokeWidth
    const circumference = 2 * Math.PI * (circleSize / 2)
    return (1 - progress.value) * circumference
  })

  const animatedProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: strokeDashoffset.value,
    }
  })

  const circleSize = size - strokeWidth
  const viewBoxSize = size + strokeWidth

  return (
    <View style={{position: 'absolute',}}>
      <Svg width={size} height={size} viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}>
        <G rotation='-90' origin={`${viewBoxSize / 2}, ${viewBoxSize / 2}`}>
          <Circle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={circleSize / 2}
            strokeWidth={strokeWidth}
            stroke={Colors.safeLightBackground}
            fill={'none'}
          />
          <AnimatedCircle
            cx={viewBoxSize / 2}
            cy={viewBoxSize / 2}
            r={circleSize / 2}
            strokeWidth={strokeWidth}
            strokeLinecap={'butt'}
            stroke={Colors.safeLightest}
            fill={'none'}
            strokeDasharray={`${circleSize * Math.PI}, ${circleSize * Math.PI}`}
            animatedProps={animatedProps}
          />
        </G>
      </Svg>
    </View>
  )
}

export default AnimatedCircularProgress
