import React from 'react'
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
} from 'react-native'
import Button from '../../components/button'
import NavHeader from '../../components/navigation/NavHeader'
import GradientBackground from '../../components/gradientBackground'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { validateEmail } from '../../utils/functions'
import ButtonInput from '../../components/textInput/ButtonInput'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { InputLimits } from '../../utils/constants'
import { Lit } from '../../utils/locale'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import { ISetUpdateUser, setUpdateUser } from '../../state/actions/UserActions'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore: { user: { email, }, }, } = state
  return { systemStore, email, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setUpdateUser,
    }
  ), dispatch),
})

interface IEmailScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  email: string,
  actions: {
    setUpdateUser: (params: ISetUpdateUser) => Promise<void>,
  }
}
interface IEmailScreenState {
  email: string,
  keyboard: boolean,
  loading: boolean,
}
class EmailScreen extends React.Component<IEmailScreenProps> {
  state: IEmailScreenState = {
    email: this.props.email || '',
    keyboard: false,
    loading: false,
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

  handleUpdateEmail = async () => {
    if (this.state.email !== this.props.email) {
      this.setState({ loading: true, })
      await this.props.actions.setUpdateUser({ email: this.state.email, })
      this.setState({ loading: false, })
    }
    this.props.navigation.goBack()
  }

  render() {
    const { navigation, systemStore, }: IEmailScreenProps = this.props
    const { Colors, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.EmailScreen} />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            flex: 1, display: 'flex',
            justifyContent: 'center', alignItems: 'center', padding: 16,
          }}
        >
          <View style={{flex: 1, width: '100%',}}>
            <ButtonInput
              systemStore={systemStore}
              value={this.state.email}
              textColor={this.state.email.length > InputLimits.EmailMax ? Colors.red : undefined}
              placeholder={'email@address.com'}
              onChangeText={(text: string) => this.setState({ email: text, })}
            />
          </View>

          <View style={{flex: 0, width: '100%', marginBottom: this.state.keyboard ? 8 : 32,}}>
            <Button
              systemStore={systemStore}
              onPress={this.handleUpdateEmail}
              title={Lit[systemStore.Locale].Button.Save}
              loading={this.state.loading}
              disabled={(!this.state.email || this.state.email.length > InputLimits.EmailMax || !validateEmail(this.state.email)) && this.state.email.length !== 0}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EmailScreen)
