import * as PackageJson from '../../../package.json'
import React from 'react'
import {
  View, Text,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface IAppTitleProps {
  systemStore: ISystemStore,
  fontSize?: string,
  fontWeight?: string,
  color?: string,
}
const AppTitle: React.FC<IAppTitleProps> = ({ systemStore, fontSize, fontWeight, color, }) => {
  const { Colors, Fonts, } = systemStore
  return (
    <View style={{flexDirection: 'row',}}>
      <Text style={{color: color || Colors.light, fontWeight: fontWeight || Fonts.middleWeight , fontSize: fontSize || Fonts.md,}}>{PackageJson.name}</Text>
    </View>
  )
}

export default AppTitle
