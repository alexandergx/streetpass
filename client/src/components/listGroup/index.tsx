import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import RightIcon from '../../assets/icons/chevron-right.svg'
import { BlurView } from '@react-native-community/blur'
import { SvgProps } from 'react-native-svg'
import { Switch } from '../switch'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import FastImage from 'react-native-fast-image'

export interface IListGroupConfig {
  title?: string,
  subtitle?: string,
  titleShadow?: boolean,
  titleColor?: string,
  list: Array<{
    Icon?: React.FC<SvgProps>,
    iconColor?: string,
    image?: string,
    title: string | null,
    color?: string,
    content?: string | null,
    description?: string | null,
    toggleValue?: boolean,
    disabled?: boolean,
    blur?: boolean,
    loading?: boolean,
    noRight?: boolean,
    id?: string,
    onPress?: () => void,
    onToggle?: () => void,
  }>,
}
interface IListGroupProps {
  systemStore: ISystemStore,
  config: IListGroupConfig,
}
interface IListGroupState {
  settings: boolean,
}
class ListGroup extends React.Component<IListGroupProps> {
  state: IListGroupState = {
    settings: true,
  }

  render() {
    const { systemStore, config, }: IListGroupProps = this.props
    const { Colors, Fonts, } = systemStore

    const configList = config.list.filter(i => i)

    return (
      <>
        <View style={{marginTop: 24, marginBottom: config.title ? 8 : 0, flexDirection: 'row', justifyContent: 'space-between',}}>
          {config?.title &&
            <Text
              style={[
                {color: config.titleColor ? config.titleColor : Colors.lightest, fontSize: Fonts.sm, fontWeight: Fonts.heavyWeight as any,},
                config.titleShadow && {shadowRadius: 2, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0, },},
              ]}
            >
              {config.title}
            </Text>
          }
          {config?.subtitle &&
            <Text
              style={[
                {color: config.titleColor ? config.titleColor : Colors.lightest, fontSize: Fonts.sm, fontWeight: Fonts.cruiserWeight as any,},
                config.titleShadow && {shadowRadius: 2, shadowOpacity: 0.5, shadowOffset: { width: 0, height: 0, },},
              ]}
            >
              {config.subtitle}
            </Text>
          }
        </View>

        <BlurView blurType={Colors.darkestBlur as any} style={{borderRadius: 16, backgroundColor: Colors.darkerBackground,}}>
          {configList.map(({Icon, iconColor, image, title, color, content, description, toggleValue, disabled, blur, loading, noRight, onPress, onToggle,}, index: number) => {
            return (
              <View
                key={index}
                style={{
                  width: '100%', borderRadius: 32,
                  borderBottomWidth: index + 1 === configList.length ? 0 : 0.3, borderBottomColor: Colors.light,
                }}
              >
                <TouchableOpacity
                  onPress={() => !disabled && !loading && onPress ? onPress() : null}
                  activeOpacity={disabled || loading || !onPress ? 1 : Colors.activeOpacity}
                  style={{flexDirection: 'row', width: '100%', justifyContent: 'center', alignItems: 'center', height: 48, paddingHorizontal: 16,}}
                >
                  {Icon &&
                    <View style={{flex: 0,}}>
                      <Icon fill={disabled ? Colors.light : iconColor ? iconColor : Colors.lightest} width={16} height={16} />
                    </View>
                  }
        
                  <View style={{
                    flex: 1, flexDirection: 'row', width: '100%', marginLeft: 16, justifyContent: 'center', alignItems: 'center',
                  }}>
                    <View style={{flex: 1,}}>
                      <Text numberOfLines={1} style={{color: color ? color : disabled || blur ? Colors.light : Colors.lightest, fontWeight: Fonts.cruiserWeight as any,}}>{title && title}</Text>
                    </View>
                    <View style={{flex: 0, marginRight: 16, maxWidth: '50%',}}>
                      <Text numberOfLines={1} style={{color: color ? color : disabled || blur ? Colors.light : Colors.lightest, fontWeight: Fonts.welterWeight as any,}}>{content && content}</Text>
                    </View>
                    <View style={{flex: 0,}}>
                      {loading
                        ? <ActivityIndicator color={Colors.lighter} style={{width: 8, aspectRatio: 1/1,}} />
                        : onToggle
                          ? <Switch systemStore={systemStore} value={toggleValue || false} onToggle={onToggle} />
                          : image ? <View style={{flex: 0, width: 24, aspectRatio: 1/1, borderRadius: 6, overflow: 'hidden',}}>
                              <FastImage
                                source={{uri: image}}
                                resizeMode={'cover'}
                                style={{width: '120%', height: '100%', alignSelf: 'center',}}
                              />
                            </View>
                            : !noRight && <RightIcon fill={Colors.lighter} width={12} height={12} />
                      }
                    </View>
                  </View>
                </TouchableOpacity>

                {description &&
                  <View style={{marginHorizontal: 32, marginBottom: 16,}}>
                    <Text style={{color: disabled || blur ? Colors.light : Colors.lightest, fontWeight: Fonts.lightWeight as any,}}>{description}</Text>
                  </View>
                }
              </View>
            )
          })}
        </BlurView>
      </>
    )
  }
}

export default ListGroup
