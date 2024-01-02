import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import Thumbnail from '../thumbnail'
import { SvgProps } from 'react-native-svg'
import { IProfilePreview } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface IProfileItemProps {
  systemStore: ISystemStore,
  profile: IProfilePreview,
  loading?: boolean,
  active?: boolean,
  blur?: boolean,
  StartIcon?: React.FC<SvgProps>,
  EndIcon?: React.FC<SvgProps>,
  startIconColor?: string,
  endIconColor?: string,
  onPress: () => void,
  onPressStart?: () => void,
  onPressEnd?: () => void,
}
const ProfileItem: React.FC<IProfileItemProps> = ({ systemStore, profile, loading, active, blur, StartIcon, EndIcon, startIconColor, endIconColor, onPress, onPressStart, onPressEnd, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <TouchableOpacity
      onLongPress={onPressEnd ? onPressEnd : undefined}
      activeOpacity={onPressEnd ? Colors.activeOpacity : 1}
      style={{
        flexDirection: 'row', width: '100%', height: 72, alignItems: 'center', marginVertical: 4,
      }}
    >
      {blur &&
        <BlurView
          blurAmount={2}
          style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%', borderRadius: 16,}}
        />
      }
      <View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', borderRadius: 16, overflow: 'hidden',}}>
        <BlurView
          blurType={blur ? 'light' : Colors.darkestBlur }
          style={{
            position: 'absolute', zIndex: -1, width: '100%', height: '100%',
            backgroundColor: blur ? undefined : active? Colors.darkerBackground : Colors.darkBackground,
          }}
        />
      </View>

      <TouchableOpacity
        onPress={onPress}
        onLongPress={onPressEnd ? onPressEnd : undefined}
        activeOpacity={Colors.activeOpacity}
        style={{flex: 1, flexDirection: 'row', justifyContent: 'center',}}
      >
        <View style={{flex: 0, marginLeft: 8,}}>
          <Thumbnail systemStore={systemStore} uri={profile?.profilePicture} size={48} />
        </View>

        <View style={{flex: 1, justifyContent: 'center', marginLeft: 16,}}>
            <Text numberOfLines={1} style={{color: Colors.lightest, fontWeight: Fonts.cruiserWeight ,}}>{profile.username}</Text>
            <Text numberOfLines={1} style={{color: Colors.lightest, fontWeight: Fonts.lightWeight ,}}>{profile.name}</Text>
        </View>
      </TouchableOpacity>

      <View style={{flex: 0, height: '100%', flexDirection: 'row', alignItems: 'center', overflow: 'visible',}}>
        {loading
          ? <View style={{paddingHorizontal: 16,}}>
            <ActivityIndicator color={Colors.lighter} />
          </View>
          : <>
            {StartIcon &&
              <TouchableOpacity
                onPress={onPressStart ? onPressStart : undefined}
                onLongPress={onPressEnd ? onPressEnd : undefined}
                activeOpacity={onPressStart ? Colors.activeOpacity : 1}
                style={{height: '100%', justifyContent: 'center', paddingHorizontal: 16,}}
              >
                <StartIcon
                  fill={
                    startIconColor
                      ? startIconColor
                      : onPressStart
                        ? Colors.lightest
                        : Colors.light
                  }
                  width={16}
                  height={16}
                />
              </TouchableOpacity>
            }

            {EndIcon &&
              <TouchableOpacity
                onPress={onPressEnd ? onPressEnd : undefined}
                onLongPress={onPressEnd ? onPressEnd : undefined}
                activeOpacity={onPressEnd ? Colors.activeOpacity : 1}
                style={{height: '100%', justifyContent: 'center', paddingHorizontal: 16,}}
              >
                <EndIcon
                  fill={
                    endIconColor
                      ? endIconColor
                      : onPressEnd
                        ? Colors.lightest
                        : Colors.light
                  }
                  width={16}
                  height={16}
                />
              </TouchableOpacity>
            }
          </>
        }
      </View>
    </TouchableOpacity>
  )
}

export default ProfileItem
