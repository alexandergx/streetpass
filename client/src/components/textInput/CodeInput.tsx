import React from 'react'
import {
  View,
  TouchableOpacity,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import RefreshIcon from '../../assets/icons/refresh.svg'
import ButtonInput from './ButtonInput'

interface ICodeInputProps {
  systemStore: ISystemStore,
  onPress: () => void,
  onChangeText: (params: string) => void,
}
class CodeInput extends React.Component<ICodeInputProps> {
  constructor(props: ICodeInputProps) {
    super(props)
    this.inputRef1 = this.inputRef1.bind(this)
    this.inputRef2 = this.inputRef2.bind(this)
    this.inputRef3 = this.inputRef3.bind(this)
    this.inputRef4 = this.inputRef4.bind(this)
    this.inputRef5 = this.inputRef5.bind(this)
  }
  childRef1: any; inputRef1(input: any) { this.childRef1 = input }
  childRef2: any; inputRef2(input: any) { this.childRef2 = input }
  childRef3: any; inputRef3(input: any) { this.childRef3 = input }
  childRef4: any; inputRef4(input: any) { this.childRef4 = input }
  childRef5: any; inputRef5(input: any) { this.childRef5 = input }

  state = {
    input0: '',
    input1: '',
    input2: '',
    input3: '',
    input4: '',
    input5: '',
  }

  handleChangeText = async (state: any) => {
    await this.setState(state)
    this.props.onChangeText(`${this.state.input0}${this.state.input1}${this.state.input2}${this.state.input3}${this.state.input4}${this.state.input5}`)
  }

  handleSetInputs = async (text: string) => {
    await this.setState({
      input0: text[0] || '',
      input1: text[1] || '',
      input2: text[2] || '',
      input3: text[3] || '',
      input4: text[4] || '',
      input5: text[5] || '',
    })
    this.props.onChangeText(`${this.state.input0}${this.state.input1}${this.state.input2}${this.state.input3}${this.state.input4}${this.state.input5}`)
  }

  handleResetInputs = () => {
    this.setState({ input0: '', input1: '', input2: '', input3: '', input4: '', input5: '', })
  }

  render() {
    const { systemStore, } = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <View style={{width: '100%', flexDirection: 'row', alignItems: 'center',}}>
        <TouchableOpacity
          onPress={() => {
            this.handleResetInputs()
            this.props.onPress()
          }}
          style={{flex: 1.2, alignItems: 'center', marginHorizontal: 4,}}
        >
          <RefreshIcon
            fill={Colors.lightest}
            width={16}
            height={16}
          />
        </TouchableOpacity>

        <View style={{flex: 1, marginRight: 4,}}>
          <ButtonInput
            systemStore={systemStore}
            value={this.state.input0}
            onChangeText={(text: string) => {
              if (text.length > 1)  {
                this.handleSetInputs(text)
                this.childRef5.focus()
                this.childRef5.blur()
                return
              } else if (text.length) this.childRef1.focus()
              this.handleChangeText({ input0: text[0] || '', })
            }}
            placeholder={'0'}
            keyboardType={'numeric'}
            textAlign={'center'}
          />
        </View>

        <View style={{flex: 1, marginRight: 4,}}>
          <ButtonInput
            systemStore={systemStore}
            inputRef={this.inputRef1}
            childInputRef={this.childRef1}
            value={this.state.input1}
            onChangeText={(text: string) => {
              if (text.length) this.childRef2.focus()
              this.handleChangeText({ input1: text[0] || '', })
            }}
            placeholder={'0'}
            keyboardType={'numeric'}
            textAlign={'center'}
          />
        </View>
        
        <View style={{flex: 1, marginRight: 4,}}>
          <ButtonInput
            systemStore={systemStore}
            inputRef={this.inputRef2}
            childInputRef={this.childRef2}
            value={this.state.input2}
            onChangeText={(text: string) => {
              if (text.length) this.childRef3.focus()
              this.handleChangeText({ input2: text[0] || '', })
            }}
            placeholder={'0'}
            keyboardType={'numeric'}
            textAlign={'center'}
          />
        </View>

        <View style={{flex: 1, marginRight: 4,}}>
          <ButtonInput
            systemStore={systemStore}
            inputRef={this.inputRef3}
            childInputRef={this.childRef3}
            value={this.state.input3}
            onChangeText={(text: string) => {
              if (text.length) this.childRef4.focus()
              this.handleChangeText({ input3: text[0] || '', })
            }}
            placeholder={'0'}
            keyboardType={'numeric'}
            textAlign={'center'}
          />
        </View>

        <View style={{flex: 1, marginRight: 4,}}>
          <ButtonInput
            systemStore={systemStore}
            inputRef={this.inputRef4}
            childInputRef={this.childRef4}
            value={this.state.input4}
            onChangeText={(text: string) => {
              if (text.length) this.childRef5.focus()
              this.handleChangeText({ input4: text[0] || '', })
            }}
            placeholder={'0'}
            keyboardType={'numeric'}
            textAlign={'center'}
          />
        </View>

        <View style={{flex: 1,}}>
          <ButtonInput
            systemStore={systemStore}
            inputRef={this.inputRef5}
            childInputRef={this.childRef5}
            value={this.state.input5}
            onChangeText={(text: string) => {
              if (text.length) this.childRef5.blur()
              this.handleChangeText({ input5: text[0] || '', })
            }}
            placeholder={'0'}
            keyboardType={'numeric'}
            textAlign={'center'}
          />
        </View>
      </View>
    )
  }
}

export default CodeInput
