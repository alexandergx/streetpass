import React from 'react'
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native'
import Button from '../../components/button'
import NavHeader from '../../components/navigation/NavHeader'
import GradientBackground from '../../components/gradientBackground'
import PickerModal from '../../components/pickerModal'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { Screens } from '../../navigation'
import { validatePhonenumber, } from '../../utils/functions'
import { formatPhonenumber, countryData, phoneNumberPlaceholders, } from '../../utils/data'
import ButtonInput from '../../components/textInput/ButtonInput'
// import { ISetUpdatePhonenumber, setUpdatePhonenumber } from '../../state/actions/UserActions'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { IListGroupConfig } from '../../components/listGroup'
import { Lit } from '../../utils/locale'
import AnimatedBackground from '../../components/animated/AnimatedBackground'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore: { user: { countryCode, phoneNumber, }, }, } = state
  return { systemStore, countryCode, phoneNumber, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      // setUpdatePhonenumber,
    }
  ), dispatch),
})

interface IPhoneNumberScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  countryCode: string,
  phoneNumber: string,
  actions: {
    // setUpdatePhonenumber: (params: ISetUpdatePhonenumber) => void,
  }
}
interface IPhoneNumberScreenState {
  countryCode: string,
  phoneNumber: string,
  verified: boolean,
  keyboard: boolean,
  pickerModalConfig: IListGroupConfig | null,
  loading: boolean,
}
class PhoneNumberScreen extends React.Component<IPhoneNumberScreenProps> {
  constructor(props: IPhoneNumberScreenProps) {
    super(props)
    this.inputRef = this.inputRef.bind(this)
  }
  childRef: any
  inputRef(input: any) { this.childRef = input }

  state: IPhoneNumberScreenState = {
    countryCode: this.props.countryCode || '1',
    phoneNumber: this.props.countryCode?.length && this.props.phoneNumber?.length && formatPhonenumber(this.props.countryCode, this.props.phoneNumber) || '',
    verified: false,
    keyboard: false,
    pickerModalConfig: null,
    loading: false,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any

  componentDidMount () {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  keyboardWillShow = () => {
    this.setState({ keyboard: true, })
  }

  keyboardWillHide = () => {
    this.setState({ keyboard: false, })
  }

  handleUpdatePhonenumber = async () => {
    // if (this.state.countryCode !== this.props.countryCode || this.state.phoneNumber !== this.props.phonenumber) {
    //   this.setState({ loading: true, })
    //   await this.props.actions.setUpdatePhonenumber({
    //     countryCode: this.state.phoneNumber.length > 0 ? this.state.countryCode : '',
    //     phonenumber: this.state.phoneNumber.replace(/\s/g, ''),
    //   })
    //   this.setState({ loading: false, })
    // }
    // this.props.navigation.goBack()
  }

  render() {
    const { navigation, systemStore, }: IPhoneNumberScreenProps = this.props

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.PhoneNumberScreen} />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            flex: 1, display: 'flex',
            justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
          }}
        >
          <View style={{flex: 1, width: '100%', marginTop: 8,}}>
            <ButtonInput
              systemStore={systemStore}
              inputRef={this.inputRef}
              childInputRef={this.childRef}
              buttonTitle={`+${this.state.countryCode}`}
              value={this.state.phoneNumber}
              placeholder={phoneNumberPlaceholders[this.state.countryCode] || phoneNumberPlaceholders['n']}
              keyboardType={'numeric'}
              onPress={() => {
                this.childRef.blur()
                const configList = Object.keys(countryData).map((c: string) => {
                  return {
                    title: `${countryData[c].name.eng}`,
                    content: ` ${c} +${countryData[c].callingCode}`,
                    noRight: true,
                    onPress: () => {
                      this.setState({ countryCode: countryData[c].callingCode, })
                      this.setState({ pickerModalConfig: null, })
                    },
                  }
                })
                const config = { list: configList, }
                this.setState({ pickerModalConfig: config, })
              }}
              onChangeText={(text: string) => this.setState({ phonenumber: formatPhonenumber(this.state.countryCode, text), })}
            />
          </View>

          <View style={{flex: 0, width: '100%', marginBottom: this.state.keyboard ? 8 : 32,}}>
            <Button
              systemStore={systemStore}
              onPress={this.handleUpdatePhonenumber}
              title={Lit[systemStore.Locale].Button.Save}
              loading={this.state.loading}
              disabled={(!this.state.countryCode || !this.state.phoneNumber || !validatePhonenumber(this.state.phoneNumber)) && this.state.phoneNumber.length !== 0}
            />
          </View>
        </KeyboardAvoidingView>

        {this.state.pickerModalConfig &&
          <PickerModal systemStore={systemStore} config={this.state.pickerModalConfig} toggleModal={() => this.setState({ pickerModalConfig: null, })} />
        }
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberScreen)
