import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { Screens, } from '../../navigation'
import ConnectIcon from '../../assets/icons/connect.svg'
import MessageIcon from '../../assets/icons/message-solid.svg'
import { BlurView } from '@react-native-community/blur'
import Thumbnail from '../thumbnail'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Lit, } from '../../utils/locale'
import { useNetInfo, } from '@react-native-community/netinfo'

interface INavTabBarProps {
  systemStore: ISystemStore,
  activeTab: Screens,
  profilePicture: string | null,
  descend?: boolean,
  onPressStreetpass?: () => void,
  onPressChat?: () => void,
  onPressUser?: () => void,
}
const NavTabBar: React.FC<INavTabBarProps> = ({
  systemStore, activeTab, profilePicture, descend, onPressStreetpass, onPressChat, onPressUser,
}) => {
  const { Colors, Fonts, } = systemStore
  const { isConnected, } = useNetInfo()

  return (
    <View style={{position: 'absolute', zIndex: descend ? 0 : 1, width: '100%', height: 72, bottom: 0,}}>
      <BlurView
        pointerEvents={'none'}
        blurType={Colors.darkestBlur }
        blurAmount={8}
        style={{position: 'absolute', zIndex: 0, width: '100%', height: '100%', bottom: 0,}}
      />

      <View
        style={{
          position: 'absolute', zIndex: 0, width: '100%', height: '100%', display: 'flex',
          flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start',
        }}
      >
        <View style={{flexDirection: 'row', alignItems: 'flex-start', width: '100%', height: '100%',}}>
          <TouchableOpacity
            onPress={onPressStreetpass}
            activeOpacity={activeTab === Screens.Streetpass ? 1 : Colors.activeOpacity}
            style={{flex: 1, height: '100%', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 8,}}
          >
            <ConnectIcon fill={activeTab === Screens.Streetpass ? Colors.lightBlue : Colors.safeDark} width={24} height={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressChat}
            activeOpacity={activeTab === Screens.Chats ? 1 : Colors.activeOpacity}
            style={{flex: 1, height: '100%', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 8,}}
          >
            <MessageIcon fill={activeTab === Screens.Chats ? Colors.lightBlue : Colors.safeDark} width={24} height={24} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onPressUser}
            activeOpacity={activeTab === Screens.User ? 1 : Colors.activeOpacity}
            style={{flex: 1, height: '100%', justifyContent: 'flex-start', alignItems: 'center', paddingTop: 8,}}
          >
            <Thumbnail systemStore={systemStore} uri={profilePicture} size={24} color={activeTab === Screens.User ? Colors.lightBlue : undefined} />
          </TouchableOpacity>
        </View>
      </View>

      {!isConnected &&
        <View pointerEvents={'none'} style={{position: 'absolute', zIndex: 0, width: '100%', height: '100%', top: 8, justifyContent: 'center', alignItems: 'center',}}>
          <Text style={{color: Colors.safeLight, fontWeight: Fonts.cruiserWeight ,}}>{Lit[systemStore.Locale].Title.NotConnected}</Text>
        </View>
      }
    </View>
  )
}

export default NavTabBar
