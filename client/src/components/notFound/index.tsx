import React from 'react'
import {
  View,
  Text,
  ActivityIndicator,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Lit } from '../../utils/locale'

interface INotFoundProps {
  systemStore: ISystemStore,
  empty: boolean,
  loading: boolean,
  terminus: boolean,
  clear?: boolean,
}
const NotFound: React.FC<INotFoundProps> = ({ systemStore, empty, loading, terminus, clear, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <>
      {!empty ? (
        <>
          <View style={{height: 16,}} />
          {!terminus && <ActivityIndicator color={Colors.lighter} />}
          <View style={{height: 80,}} />
        </>
        ) : (
          <View
            style={{
              width: '100%', aspectRatio: 1/1, borderRadius: 16, overflow: 'hidden', marginBottom: 72,
              backgroundColor: clear ? Colors.transparent : Colors.darkBackground, justifyContent: 'center', alignItems: 'center',
            }}
          >
            {loading
              ? <ActivityIndicator color={Colors.lighter} />
              : <Text style={{color: clear ? Colors.safeLightest : Colors.lighter, fontWeight: Fonts.welterWeight as any,}}>{Lit[systemStore.Locale].Copywrite.NotFound}</Text>
            }
          </View>
        )
      }
    </>
  )
}

export default NotFound
