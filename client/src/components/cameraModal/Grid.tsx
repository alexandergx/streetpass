import React from 'react'
import {
  View,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface ICreateMediaModalGridProps {
  systemStore: ISystemStore,
}
const CreateMediaModalGrid: React.FC<ICreateMediaModalGridProps> = ({ systemStore, }) => {
  const { Colors, } = systemStore

  return (
    <>
      <View style={{ position: 'absolute', top: '35%', left: 0, right: 0, borderBottomWidth: 0.4, borderBottomColor: Colors.safeLightest, }} />
      <View style={{ position: 'absolute', top: '65%', left: 0, right: 0, borderBottomWidth: 0.4, borderBottomColor: Colors.safeLightest, }} />
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: '33.33%', borderLeftWidth: 0.4, borderLeftColor: Colors.safeLightest, }} />
      <View style={{ position: 'absolute', top: 0, bottom: 0, left: '66.66%', borderLeftWidth: 0.4, borderLeftColor: Colors.safeLightest, }} />
    </>
  )
}

export default CreateMediaModalGrid
