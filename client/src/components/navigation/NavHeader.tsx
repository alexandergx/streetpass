import React from 'react'
import {
  View,
  TouchableOpacity,
  Text,
} from 'react-native'
import LeftIcon from '../../assets/icons/chevron-left.svg'
import { SvgProps } from 'react-native-svg'
import { BlurView } from '@react-native-community/blur'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import Thumbnail from '../thumbnail'

interface INavHeaderProps {
  systemStore: ISystemStore,
  navigation?: any,
  title?: string,
  subtitle?: string,
  bannerTitle?: string,
  thumbnail?: string | null,
  thumbnailRight?: boolean,
  thumbnailSquare?: boolean,
  color?: string,
  bannerColor?: string,
  StartIcon?: React.FC<SvgProps>,
  EndIcon?: React.FC<SvgProps>,
  shorten?: boolean,
  onPress?: () => void,
  onPressEnd?: () => void,
  onPressTitle?: () => void,
  onPressThumbnail?: () => void,
  onPressBanner?: () => void,
}
const NavHeader: React.FC<INavHeaderProps> = ({
  systemStore, navigation, title, subtitle, bannerTitle, thumbnail, thumbnailRight, thumbnailSquare, color, bannerColor, StartIcon, EndIcon, shorten,
  onPress, onPressEnd, onPressTitle, onPressThumbnail, onPressBanner, }) => {
  const { Colors, Fonts, } = systemStore

  return (
    <>
      <View
        style={{
          zIndex: 2, flex: 0, height: shorten ? 56 : 96, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end',
          shadowRadius: 3, shadowOpacity: 0.1, shadowOffset: { width: 0, height: -0.5, },
          backgroundColor: Colors.darkerBackground,
          // borderBottomWidth: 2, borderBottomColor: Colors.middleGrey,
        }}
      >
        <BlurView
          blurType={Colors.darkestBlur as any}
          blurAmount={8}
          style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}}
        />

        {(navigation || onPress) &&
          <TouchableOpacity
            onPress={() => onPress ? onPress() : navigation ? navigation.goBack() : null}
            style={{flex: 0, padding: 16, paddingRight: 24,}}
          >
            {StartIcon
              ? <StartIcon fill={color ? color : Colors.lightest} width={24} height={24} />
              : <LeftIcon fill={color ? color : Colors.lightest} width={24} height={24} />
            }
          </TouchableOpacity>
        }

        {thumbnail !== undefined && !thumbnailRight &&
          <TouchableOpacity
            onPress={() => onPressThumbnail ? onPressThumbnail() : navigation ? navigation.goBack() : null}
            activeOpacity={onPressThumbnail || navigation ? Colors.activeOpacity : 1}
            style={{marginBottom: 8,}}
          >
            <Thumbnail systemStore={systemStore} uri={thumbnail} square={thumbnailSquare} size={40} />
          </TouchableOpacity>
        }

        <TouchableOpacity
          onPress={() => onPressTitle ? onPressTitle() : onPressThumbnail ? onPressThumbnail() : null}
          activeOpacity={onPressTitle ? Colors.activeOpacity : onPressThumbnail ? Colors.activeOpacity : 1}
          style={{
            position: 'absolute', zIndex: -1, width: '100%', height: '100%',
            justifyContent: 'flex-end', alignItems: navigation || onPress ? 'center' : 'flex-start',
            padding: 16, top: subtitle ? 8 : 0,
          }}
        >
          <Text numberOfLines={1} style={{color: color ? color : Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.heavyWeight as any,}}>{title && title}</Text>
          {subtitle && <Text numberOfLines={1} style={{color: color ? color : Colors.lightest, fontSize: Fonts.md, fontWeight: Fonts.welterWeight as any,}}>{subtitle}</Text>}
        </TouchableOpacity>

        <View style={{flex: 1,}} />

        {EndIcon && onPressEnd &&
          <TouchableOpacity
            onPress={onPressEnd}
            style={{flex: 0, padding: 16, paddingLeft: 24,}}
          >
            <EndIcon fill={color ? color : Colors.lightest} width={24} height={24} />
          </TouchableOpacity>
        }

        {thumbnail !== undefined && thumbnailRight &&
          <TouchableOpacity
            onPress={() => onPressThumbnail ? onPressThumbnail() : navigation ? navigation.goBack() : null}
            activeOpacity={onPressThumbnail ? Colors.activeOpacity : 1}
            style={{marginBottom: 8, paddingRight: 16,}}
          >
            <Thumbnail systemStore={systemStore} uri={thumbnail} square={thumbnailSquare} size={40} />
          </TouchableOpacity>
        }
      </View>

      {bannerTitle && onPressBanner &&
        <TouchableOpacity
          onPress={onPressBanner}
          style={{
            width: '100%', justifyContent: 'center', alignItems: 'center',
            backgroundColor: bannerColor ? bannerColor : Colors.lightBlue, paddingVertical: 12,
          }}
        >
          <Text numberOfLines={1} style={{color: Colors.safeLightest, fontSize: Fonts.md, fontWeight: Fonts.cruiserWeight as any,}}>{bannerTitle}</Text>
        </TouchableOpacity>
      }
    </>
  )
}

export default NavHeader
