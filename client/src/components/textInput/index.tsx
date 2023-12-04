import React, { useRef, } from 'react'
import {
  View,
  TouchableOpacity,
  TextInput as RNTextInput,
  KeyboardTypeOptions,
  ActivityIndicator,
  Text,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { SvgProps } from 'react-native-svg'
import { ISystemStore } from '../../state/reducers/SystemReducer'

interface ITextInputProps {
  systemStore: ISystemStore,
  inputRef?: any,
  childInputRef?: any,
  value: string,
  textColor?: string,
  disabled?: boolean,
  loading?: boolean,
  placeholder?: string,
  placeholderColor?: string,
  secureTextEntry?: boolean,
  multiline?: boolean,
  keyboardType?: KeyboardTypeOptions,
  StartIcon?: React.FC<SvgProps>,
  EndIcon?: React.FC<SvgProps>,
  iconColor?: string,
  exceedChars?: number,
  limitChars?: number,
  onChangeText: (params: string) => void,
  onStartEditing?: () => void,
  onEndEditing?: () => void,
  onPressStart?: () => void,
  onPressEnd?: () => void,
}

const TextInput: React.FC<ITextInputProps> = (props) => {
  const { systemStore, StartIcon, EndIcon, } = props
  const { Colors, Fonts, } = systemStore

  const inputRef = useRef<any>(null)

  const exceeded = props.exceedChars !== undefined ? props.value.replace(/(\r\n|\n|\r)/gm, '').length > props.exceedChars : true
  const limited = props.limitChars !== undefined ? props.value.replace(/(\r\n|\n|\r)/gm, '').length - 1 < props.limitChars : true
  const limitRemaining: any = props.limitChars !== undefined && props.limitChars - props.value.replace(/(\r\n|\n|\r)/gm, '').length

  return (
    <>
      {limitRemaining !== undefined &&
        <View style={{position: 'absolute', right: 24, top: 0,}}>
          <Text style={{color: limitRemaining <= 10 && limitRemaining > -1 ? Colors.light : limitRemaining < 0 ? Colors.red : 'transparent',}}>
            {limitRemaining <= 10 && limitRemaining}
          </Text>
        </View>
      }

      <TouchableOpacity
        onPress={() => props.childInputRef?.focus() || inputRef.current?.focus()}
        activeOpacity={1}
        style={{
          flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginVertical: 8, padding: 8, borderRadius: 16, overflow: 'hidden',
        }}
      >
        <BlurView
          blurType={props.disabled ? Colors.lightBlur : Colors.darkestBlur as any}
          style={{position: 'absolute', zIndex: -1, width: '200%', height: '200%', backgroundColor: Colors.darkestBackground,}}
        />

        {StartIcon &&
          <TouchableOpacity
            onPress={props.onPressStart && !props.loading ? props.onPressStart : () => null}
            activeOpacity={props.onPressStart ? Colors.activeOpacity : 1}
            style={{
              flex: 0, justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: props.multiline ? 'flex-end' : 'center',
              padding: 2, paddingLeft: 4, paddingRight: 8,
              bottom: props.multiline ? 2 : 0,
            }}
          >
            <StartIcon
              fill={
                props.iconColor
                  ? props.iconColor
                  : props.onPressStart
                    ? Colors.lightest
                    : props.disabled
                      ? Colors.dark
                      : Colors.light
              }
              width={16}
              height={16}
            />
          </TouchableOpacity>
        }

        <View
          pointerEvents={props.disabled ? 'none' : 'auto'}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginHorizontal: StartIcon ? 0 : 4,}}
        >
          <RNTextInput
            multiline={false}
            ref={props.inputRef || inputRef}
            editable={!props.disabled}
            selectTextOnFocus={!props.disabled}
            contextMenuHidden={props.disabled}
            placeholderTextColor={props.placeholderColor ? props.placeholderColor : props.disabled ? Colors.darker : Colors.light}
            autoCapitalize={'none'}
            onTouchStart={props.onStartEditing}
            style={{
              color: props.textColor !== undefined ? props.textColor : Colors.lightest,
              fontWeight: props.disabled ? Fonts.welterWeight : Fonts.middleWeight as any,
              width: '100%',
              minHeight: 16,
              maxHeight: 128,
              padding: 2,
              bottom: props.multiline ? 2 : 0,
            }}
            {...props}
          />
        </View>

        {EndIcon &&
          <TouchableOpacity
            onPress={props.onPressEnd && exceeded && limited && !props.loading ? props.onPressEnd : () => null}
            activeOpacity={props.onPressEnd && exceeded && limited ? Colors.activeOpacity : 1}
            style={{
              flex: 0, justifyContent: 'flex-end', alignItems: 'flex-end', alignSelf: props.multiline ? 'flex-end' : 'center',
              paddingVertical: props.loading ? 2 : 4, paddingRight: 4, paddingLeft: 10, bottom: 0,
            }}
          >
            {props.loading
              ? <ActivityIndicator color={Colors.lighter} />
              : <EndIcon
                fill={
                  props.iconColor
                    ? props.iconColor
                    : props.onPressEnd && exceeded && limited
                      ? Colors.lightest
                      : props.disabled
                        ? Colors.dark
                        : Colors.light
                }
                width={16}
                height={16}
              />
            }
          </TouchableOpacity>
        }
      </TouchableOpacity>
    </>
  )
}

export default TextInput
