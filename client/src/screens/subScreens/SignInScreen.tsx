import React from 'react'
import {
  Text,
  View,
} from 'react-native'
import { connect, } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { IUserStore, } from '../../state/reducers/UserReducer'
import { ISystemStore, } from '../../state/reducers/SystemReducer'
import Button from '../../components/button'
import AppleIcon from '../../assets/icons/apple.svg'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import { Screens } from '../../navigation'
import GradientBackground from '../../components/gradientBackground'
import { appleAuth, } from '@invertase/react-native-apple-authentication'
import { ISignInErrors } from '../../utils/constants'
import { ISetSignIn, setSignIn, } from '../../state/actions/UserActions'
import { signInCallback } from '../../utils/services'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setSignIn,
    }
  ), dispatch),
})

interface ISignInScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setSignIn: (params: ISetSignIn) => void,
  },
}
interface ISignInScreenState {
  loadingApple: boolean,
}
class SignInScreen extends React.Component<ISignInScreenProps> {
  constructor(props: ISignInScreenProps) {
    super(props)
  }

  state: ISignInScreenState = {
    loadingApple: false,
  }

  handleAppleSignIn = async () => {
    try {
      this.setState({ loadingApple: true, })
      if (!appleAuth.isSupported) return
      const appleAuthRequestResponse = await appleAuth.performRequest({ requestedOperation: appleAuth.Operation.LOGIN, })
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user)
      if (credentialState === 1 && appleAuthRequestResponse.identityToken) {
        this.props.actions.setSignIn({
          input: { appleAuth: appleAuthRequestResponse.identityToken, },
          callback: (code) => signInCallback(this.props.navigation, code)
        })
      }
      this.setState({ loadingApple: false, })
    } catch {
      this.setState({ loadingApple: false, })
    }
  }

  render() {
    const { navigation, systemStore, }: ISignInScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    // TODO - on mount this.props.actions.signOutUser()

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center',}}>

          <View style={{width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', padding: 32,}}>

            <Text>Streetpass</Text>

            <Button
              systemStore={systemStore}
              title={'Sign in with Apple'}
              loading={this.state.loadingApple}
              Icon={AppleIcon}
              onPress={this.handleAppleSignIn}
            />

            {/* <Button
              systemStore={systemStore}
              title={'Sign in with phone number'}
              onPress={() => null}
            /> */}
          </View>
        </View>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
