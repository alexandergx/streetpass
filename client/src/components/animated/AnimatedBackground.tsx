import React from 'react'
import { View } from 'react-native'
import LottieView from 'lottie-react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Themes } from '../../utils/themes'

interface IAnimatedBackgroundProps {
  systemStore: ISystemStore,
  source?: any,
  speed?: number,
}
const AnimatedBackground: React.FC<IAnimatedBackgroundProps> = ({ systemStore, source, speed, }) => {
  const animation = source || Themes[systemStore.Theme as keyof typeof Themes].animation

  return (
    <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center',}}>
      {/* {animation &&
        <LottieView
          source={animation}
          autoPlay={true}
          loop={true}
          speed={speed || 0.5}
          style={{width: '220%', height: '100%',}}
        />
      } */}
    </View>
  )
}

export default AnimatedBackground
