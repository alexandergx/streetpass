import React from 'react'
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
} from 'react-native'
import Button from '../../components/button'
import NavHeader from '../../components/navigation/NavHeader'
import GradientBackground from '../../components/gradientBackground'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { Screens } from '../../navigation'
import { ISystemStore } from '../../state/reducers/SystemReducer'
// import { setLoginError, deleteUser, IDeleteUser, ISetLoginError, } from '../../state/actions/UserActions'
// import { unsetMarkers, } from '../../state/actions/MapActions'
import ButtonInput from '../../components/textInput/ButtonInput'
import EyeIcon from '../../assets/icons/eye.svg'
import EyeClosedIcon from '../../assets/icons/eye-closed.svg'
import { IUserStore } from '../../state/reducers/UserReducer'
import { MMKVLoader } from 'react-native-mmkv-storage'
import { LocalStorage, } from '../../utils/constants'
import { Lit } from '../../utils/locale'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import { setSignOut } from '../../state/actions/UserActions'
import { deleteAccount } from '../../api/user'

const MMKVTheme = new MMKVLoader().withInstanceID(LocalStorage.SystemStore).initialize()
const MMKVAuth = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.AuthStore).initialize()
const MMKVCamera = new MMKVLoader().withEncryption().withInstanceID(LocalStorage.CameraStore).initialize()

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setSignOut,
    }
  ), dispatch),
})

interface IDeleteAccountScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setSignOut: () => void,
  },
}
interface IDeleteAccountScreenState {
  delete: string,
  keyboard: boolean,
  loading: boolean,
}
class DeleteAccountScreen extends React.Component<IDeleteAccountScreenProps> {
  state: IDeleteAccountScreenState = {
    delete: '',
    keyboard: false,
    loading: false,
  }

  private keyboardWillShowListener: any
  private keyboardWillHideListener: any
  keyboardWillShow = () => this.setState({ keyboard: true, })
  keyboardWillHide = () => this.setState({ keyboard: false, })

  componentDidMount () {
    this.keyboardWillShowListener = Keyboard.addListener('keyboardWillShow', this.keyboardWillShow)
    this.keyboardWillHideListener = Keyboard.addListener('keyboardWillHide', this.keyboardWillHide)
  }

  componentWillUnmount () {
    this.keyboardWillShowListener.remove()
    this.keyboardWillHideListener.remove()
  }

  handleDeleteAccount = async () => {
    Alert.alert(
      Lit[this.props.systemStore.Locale].Copywrite.DeleteAccount[0], Lit[this.props.systemStore.Locale].Copywrite.DeleteAccount[1],
      [
        { text: Lit[this.props.systemStore.Locale].Button.Delete, onPress: async () => {
          this.setState({ loading: true, })
          const result = await deleteAccount()
          if (result) {
            await this.props.actions.setSignOut()
            MMKVTheme.clearStore()
            MMKVAuth.clearStore()
            MMKVCamera.clearStore()
            this.props.navigation.navigate(Screens.SignIn)
          }
          this.setState({ loading: false, })
        }},
        { text: Lit[this.props.systemStore.Locale].Button.Cancel, onPress: () => null, style: 'cancel', },
      ]
    )
  }

  render() {
    const { navigation, systemStore, }: IDeleteAccountScreenProps = this.props
    const { Colors, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.DeleteAccountScreen} />

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
              value={this.state.delete}
              placeholder={Lit[systemStore.Locale].Button.Delete}
              onChangeText={(text: string) => this.setState({ delete: text, })}
            />
          </View>

          <View style={{flex: 0, width: '100%', marginBottom: this.state.keyboard ? 8 : 32,}}>
            <Button
              systemStore={systemStore}
              onPress={this.handleDeleteAccount}
              title={Lit[systemStore.Locale].Button.DeleteAccount}
              color={Colors.red}
              loading={this.state.loading}
              disabled={this.state.delete !== Lit[systemStore.Locale].Button.Delete}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteAccountScreen)
