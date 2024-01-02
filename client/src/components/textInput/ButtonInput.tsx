import React from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardTypeOptions,
  TextInput as RNTextInput,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { SvgProps } from 'react-native-svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface IButtonInputProps {
  systemStore: ISystemStore,
  inputRef?: any,
  childInputRef?: any,
  buttonTitle?: string,
  value: string,
  textColor?: string,
  disabled?: boolean,
  editable?: boolean,
  placeholder?: string,
  placeholderColor? : string,
  secureTextEntry?: boolean,
  autoCompleteType?: any,
  textContentType?: any,
  keyboardType?: KeyboardTypeOptions,
  textAlign?: 'center' | 'left' | 'right' | undefined,
  StartIcon?: React.FC<SvgProps>,
  EndIcon?: React.FC<SvgProps>,
  iconColor?: string,
  style?: any,
  onPress?: () => void,
  onChangeText: (params: string) => void,
  onEndEditing?: () => void,
  onPressStart?: () => void,
  onPressEnd?: () => void,
}

class ButtonInput extends React.Component<IButtonInputProps> {
  constructor(props: IButtonInputProps) {
    super(props)
    this.textInputRef = React.createRef()
  }
  private textInputRef: React.RefObject<RNTextInput>

  render() {
    const { systemStore, StartIcon, EndIcon, } = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <TouchableOpacity
        onPress={() => this.props.childInputRef?.focus() || this.textInputRef.current?.focus()}
        activeOpacity={1}
        style={{
          flex: 0, flexDirection: 'row', alignItems: 'center', maxHeight: 44,
          marginVertical: 8,  borderRadius: 16, overflow: 'hidden',
        }}
      >
        <BlurView
          blurType={Colors.darkestBlur }
          style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}}
        />

        {this.props.onPress &&
          <TouchableOpacity
            onPress={this.props.onPress}
            style={{
              flex: 0, height: '100%', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
              marginRight: 8, backgroundColor: Colors.darkBackground,
            }}
          >
            <Text style={{color: Colors.lightest, fontWeight: Fonts.middleWeight , fontSize: Fonts.lg,}}>
              {this.props.buttonTitle}
            </Text>
          </TouchableOpacity>
        }

        <View
          style={{
            flex: 1, flexDirection: 'row', width: '100%', height: '100%',
            justifyContent: 'center', alignItems: 'center',
          }}
        >
          {StartIcon &&
            <TouchableOpacity
              onPress={this.props.onPressStart ? this.props.onPressStart : () => null}
              activeOpacity={this.props.onPressStart ? Colors.activeOpacity : 1}
              style={{
                flex: 0, height: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start',
                paddingRight: 8, paddingLeft: 12,
              }}
            >
              <StartIcon
                fill={
                  this.props.iconColor
                    ? this.props.iconColor
                    : this.props.onPressStart
                      ? Colors.lightest
                      : this.props.disabled
                        ? Colors.dark
                        : Colors.light
                }
                width={16}
                height={16}
              />
            </TouchableOpacity>
          }

          <View
            pointerEvents={this.props.disabled ? 'none' : 'auto'}
            style={{
              flex: 1, justifyContent: 'center', alignItems: 'center',
              marginLeft: this.props.StartIcon ? 0 : 16,
              marginRight: this.props.EndIcon ? 0 : 16,
            }}
          >
            <RNTextInput
              {...this.props}
              ref={this.props.inputRef || this.textInputRef}
              multiline={false}
              editable={!this.props.disabled}
              selectTextOnFocus={!this.props.disabled}
              contextMenuHidden={this.props.disabled}
              placeholderTextColor={this.props.placeholderColor ? this.props.placeholderColor : Colors.light}
              autoCapitalize={'none'}
              style={{
                color: this.props.textColor ? this.props.textColor : Colors.lightest,
                fontWeight: this.props.disabled ? Fonts.welterWeight : Fonts.middleWeight ,
                fontSize: Fonts.lg,
                width: '100%', height: '100%', opacity: this.props.editable === false ? 0.4 : 1,
                ...this.props.style,
              }}
            />
          </View>

          {EndIcon &&
            <TouchableOpacity
              onPress={this.props.onPressEnd ? this.props.onPressEnd : () => null}
              activeOpacity={this.props.onPressEnd ? Colors.activeOpacity : 1}
              style={{
                flex: 0, height: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'flex-start',
                padding: 2, paddingLeft: 8, paddingRight: 12,
              }}
            >
              <EndIcon
                fill={
                  this.props.iconColor
                    ? this.props.iconColor
                    : this.props.onPressEnd
                      ? Colors.lightest
                      : this.props.disabled
                        ? Colors.dark
                        : Colors.light
                }
                width={16}
                height={16}
              />
            </TouchableOpacity>
          }
        </View>
      </TouchableOpacity>
    )
  }
}

export default ButtonInput
