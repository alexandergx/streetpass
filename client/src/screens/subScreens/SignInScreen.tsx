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

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}
const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      //
    }
  ), dispatch),
})

interface ISignInScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    //
  },
}
interface ISignInScreenState {
  //
}
class SignInScreen extends React.Component<ISignInScreenProps> {
  constructor(props: ISignInScreenProps) {
    super(props)
  }

  state: ISignInScreenState = {
    //
  }

  render() {
    const { navigation, systemStore, }: ISignInScreenProps = this.props
    const { Colors, Fonts, } = systemStore

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
              onPress={() => navigation.navigate(Screens.VerifyPhone)}
              Icon={AppleIcon}
            />

            <Button
              systemStore={systemStore}
              title={'Sign in with phone number'}
              onPress={() => navigation.navigate(Screens.VerifyPhone)}
            />
          </View>
        </View>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInScreen)
