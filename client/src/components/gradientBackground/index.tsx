import React from 'react'
import LinearGradient from 'react-native-linear-gradient'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface IGradientBackgroundProps {
  systemStore: ISystemStore,
}
const GradientBackground: React.FC<IGradientBackgroundProps> = ({ systemStore, }) => {
  const { Colors, } = systemStore
  return (
    <LinearGradient
      style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}}
      colors={Colors.gradient} start={{ x: 1, y: 1, }} end={{ x: 1, y: 0, }}
    />
  )
}

export default GradientBackground
