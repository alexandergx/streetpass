import React from 'react'
import {
  Keyboard,
  KeyboardAvoidingView,
  View,
} from 'react-native'
import { connect, } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { IUserStore, } from '../../state/reducers/UserReducer'
import { ISystemStore, } from '../../state/reducers/SystemReducer'
import Button from '../../components/button'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import GradientBackground from '../../components/gradientBackground'
import NavHeader from '../../components/navigation/NavHeader'
import { Lit } from '../../utils/locale'
import CodeInput from '../../components/textInput/CodeInput'
import ButtonInput from '../../components/textInput/ButtonInput'
import { countryData, formatPhonenumber, phoneNumberPlaceholders } from '../../utils/data'
import { InputLimits } from '../../utils/constants'
import PickerModal from '../../components/pickerModal'
import { IListGroupConfig } from '../../components/listGroup'
import { Screens } from '../../navigation'
import { validatePhoneNumber, } from '../../utils/functions'
import { verifyPhoneNumber, } from '../../api/user'
import { ISetPhoneNumber, setPhoneNumber } from '../../state/actions/UserActions'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setPhoneNumber,
    }
  ), dispatch),
})

interface IVerifyPhoneScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setPhoneNumber: (params: ISetPhoneNumber) => void,
  },
}
interface IVerifyPhoneScreenState {
  phoneNumber: string,
  countryCode: string,
  validPhoneNumber: boolean,
  securityPin: string,
  loadingPin: boolean,
  pinSent: boolean,
  loading: boolean,
  keyboard: boolean,
  pickerModalConfig: IListGroupConfig | null,
}
class VerifyPhoneScreen extends React.Component<IVerifyPhoneScreenProps> {
  constructor(props: IVerifyPhoneScreenProps) {
    super(props)
    this.inputRef = this.inputRef.bind(this)
  }
  childRef: any
  inputRef(input: any) { this.childRef = input }

  state: IVerifyPhoneScreenState = {
    phoneNumber: '',
    countryCode: '1',
    validPhoneNumber: false,
    securityPin: '',
    loadingPin: false,
    pinSent: false,
    loading: false,
    keyboard: false,
    pickerModalConfig: null,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  keyboardWillShow = () => this.setState({ keyboard: true, })
  keyboardWillHide = () => this.setState({ keyboard: false, })

  componentDidMount(): void {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount(): void {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  handleSendPin = async () => {
    try {
      this.setState({ loadingPin: true, })
      await this.props.actions.setPhoneNumber({ phoneNumber: this.state.phoneNumber.replace(/\s/g, ''), countryCode: this.state.countryCode, })
      this.setState({ loadingPin: false, pinSent: true, })
    } catch {
      this.setState({ loadingPin: false, })
    }
  }

  handleVerifyPhoneNumber = async () => {
    try {
      this.setState({ loading: true, })
      const result = await verifyPhoneNumber({ securityPin: this.state.securityPin, })
      this.setState({ loading: false, pinSent: true, })
      if (result) {
        if (!this.props.userStore.user.dob) this.props.navigation.navigate(Screens.PersonalInfo)
        else if (!this.props.userStore.user.media.length) this.props.navigation.navigate(Screens.Sex)
        else this.props.navigation.navigate(Screens.Streetpass)
      }
    } catch {
      this.setState({ loading: false, })
    }
  }

  render() {
    const { navigation, systemStore, }: IVerifyPhoneScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <NavHeader
            systemStore={systemStore}
            color={Colors.lightest}
            title={Lit[systemStore.Locale].ScreenTitle.VerifyPhoneScreen}
            onPress={() => navigation.goBack()}
          />

          {/* <View style={{flex: 1, padding: 16,}}>

            <CodeInput
              systemStore={systemStore}
              onPress={() => null}
              onChangeText={text => this.setState({ securityPin: text, })}
            />

          </View> */}
          <KeyboardAvoidingView
            behavior={'padding'}
            style={{flex: 1, padding: 16,}}
          >
            <View style={{flex: 1, width: '100%', justifyContent: 'center',}}>
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
                onChangeText={(text: string) => {
                  this.setState({
                    phoneNumber: formatPhonenumber(this.state.countryCode, text.slice(0, InputLimits.PhoneNumberMax)),
                    validPhoneNumber: validatePhoneNumber(text),
                  })
                }}
              />

              <Button
                systemStore={systemStore}
                title={this.state.pinSent ? Lit[systemStore.Locale].Button.PinSent : Lit[systemStore.Locale].Button.SendPin}
                disabled={!this.state.validPhoneNumber || this.state.pinSent}
                loading={this.state.loadingPin}
                onPress={this.handleSendPin}
              />

              <View style={{height: 32,}} />

              <CodeInput
                systemStore={systemStore}
                disabled={!this.state.pinSent}
                onChangeText={text => this.setState({ securityPin: text, })}
              />
            </View>
            {/* {this.state.usernameEntered &&
              <View style={{marginTop: 8, marginBottom: 16,}}>

                <View>
                  <Text style={{color: Colors.lighter, fontWeight: Fonts.lightWeight as any,}}>
                    {Lit[systemStore.Locale].Copywrite.EnterPin} {`*******${this.state.phonenumberPreview}`}
                  </Text>
                </View>
              </View>
            } */}

            {/* <View style={{width: '100%', height: 24,}}>
              {this.state.error &&
                <TextButton
                  systemStore={systemStore}
                  title={Lit[systemStore.Locale].Button.ContactSupport}
                  color={Colors.lightBlue}
                  noPadding={true}
                  onPress={() => Linking.openURL(`${protocol[0]}${baseUrl}/help`)}
                />
              }
            </View> */}

            <View style={{marginBottom: this.state.keyboard ? 0 : 32,}}>
              <Button
                systemStore={systemStore}
                title={Lit[systemStore.Locale].Button.Continue}
                disabled={this.state.securityPin.length !== 6}
                loading={this.state.loading}
                onPress={this.handleVerifyPhoneNumber}
              />
            </View>
          </KeyboardAvoidingView>
        </View>

        {this.state.pickerModalConfig &&
          <PickerModal systemStore={systemStore} config={this.state.pickerModalConfig} toggleModal={() => this.setState({ pickerModalConfig: null, })} />
        }
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(VerifyPhoneScreen)
