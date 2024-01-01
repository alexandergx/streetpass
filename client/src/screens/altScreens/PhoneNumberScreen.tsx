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
import { validatePhoneNumber, } from '../../utils/functions'
import { formatPhonenumber, countryData, phoneNumberPlaceholders, } from '../../utils/data'
import ButtonInput from '../../components/textInput/ButtonInput'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { IListGroupConfig } from '../../components/listGroup'
import { Lit } from '../../utils/locale'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import CodeInput from '../../components/textInput/CodeInput'
import { ISetPhoneNumber, setPhoneNumber, } from '../../state/actions/UserActions'
import { InputLimits } from '../../utils/constants'
import { verifyPhoneNumber } from '../../api/user'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore: { user: { countryCode, phoneNumber, }, }, } = state
  return { systemStore, phoneNumber, countryCode, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setPhoneNumber,
    }
  ), dispatch),
})

interface IPhoneNumberScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  phoneNumber: string,
  countryCode: string,
  actions: {
    setPhoneNumber: (params: ISetPhoneNumber) => void,
  }
}
interface IPhoneNumberScreenState {
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
class PhoneNumberScreen extends React.Component<IPhoneNumberScreenProps> {
  constructor(props: IPhoneNumberScreenProps) {
    super(props)
    this.inputRef = this.inputRef.bind(this)
  }
  childRef: any
  inputRef(input: any) { this.childRef = input }

  state: IPhoneNumberScreenState = {
    phoneNumber: formatPhonenumber(this.props.countryCode, this.props.phoneNumber),
    countryCode: this.props.countryCode,
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
      if (result) this.props.navigation.goBack()
    } catch {
      this.setState({ loading: false, })
    }
  }

  render() {
    const { navigation, systemStore, }: IPhoneNumberScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>
          <NavHeader
            systemStore={systemStore}
            color={Colors.lightest}
            title={Lit[systemStore.Locale].ScreenTitle.ChangePhoneScreen}
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
            <View style={{flex: 1, width: '100%',}}>
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
                disabled={!this.state.validPhoneNumber || this.state.pinSent || `${this.state.countryCode}${this.state.phoneNumber}` === `${this.props.countryCode}${this.props.phoneNumber}`}
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
      // <>
      //   <GradientBackground systemStore={systemStore} />
      //   <AnimatedBackground systemStore={systemStore} />

      //   <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.PhoneNumberScreen} />

      //   <KeyboardAvoidingView
      //     behavior={'padding'}
      //     style={{
      //       flex: 1, display: 'flex',
      //       justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
      //     }}
      //   >
      //     <View style={{flex: 1, marginTop: 8,}}>
      //       <ButtonInput
      //         systemStore={systemStore}
      //         inputRef={this.inputRef}
      //         childInputRef={this.childRef}
      //         buttonTitle={`+${this.state.countryCode}`}
      //         value={this.state.phoneNumber}
      //         placeholder={phoneNumberPlaceholders[this.state.countryCode] || phoneNumberPlaceholders['n']}
      //         keyboardType={'numeric'}
      //         onPress={() => {
      //           this.childRef.blur()
      //           const configList = Object.keys(countryData).map((c: string) => {
      //             return {
      //               title: `${countryData[c].name.eng}`,
      //               content: ` ${c} +${countryData[c].callingCode}`,
      //               noRight: true,
      //               onPress: () => {
      //                 this.setState({ countryCode: countryData[c].callingCode, })
      //                 this.setState({ pickerModalConfig: null, })
      //               },
      //             }
      //           })
      //           const config = { list: configList, }
      //           this.setState({ pickerModalConfig: config, })
      //         }}
      //         onChangeText={(text: string) => this.setState({ phonenumber: formatPhonenumber(this.state.countryCode, text), })}
      //       />

      //       <Button
      //         systemStore={systemStore}
      //         title={Lit[systemStore.Locale].Button.SendPin}
      //         disabled={true}
      //         onPress={() => null}
      //       />

      //       <View style={{height: 32,}} />

      //       <CodeInput
      //         systemStore={systemStore}
      //         disabled={true}
      //         onChangeText={text => this.setState({ securityPin: text, })}
      //       />
      //     </View>

      //     <View style={{flex: 0, width: '100%', marginBottom: this.state.keyboard ? 8 : 32,}}>
      //       <Button
      //         systemStore={systemStore}
      //         onPress={this.handleUpdatePhonenumber}
      //         title={Lit[systemStore.Locale].Button.Save}
      //         loading={this.state.loading}
      //         disabled={(!this.state.countryCode || !this.state.phoneNumber || !validatePhoneNumber(this.state.phoneNumber)) && this.state.phoneNumber.length !== 0}
      //       />
      //     </View>
      //   </KeyboardAvoidingView>

      //   {this.state.pickerModalConfig &&
      //     <PickerModal systemStore={systemStore} config={this.state.pickerModalConfig} toggleModal={() => this.setState({ pickerModalConfig: null, })} />
      //   }
      // </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PhoneNumberScreen)
