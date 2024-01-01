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
import { Screens } from '../../navigation'
import DatePicker from 'react-native-date-picker'
import { BlurView } from '@react-native-community/blur'
import { IUserStore } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import moment from 'moment'
import { Lit } from '../../utils/locale'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import CakeIcon from '../../assets/icons/cake.svg'
import ButtonInput from '../../components/textInput/ButtonInput'
import { ISetUpdateUser, setUpdateUser } from '../../state/actions/UserActions'
import { InputLimits } from '../../utils/constants'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setUpdateUser,
    }
  ), dispatch),
})

interface IDOBScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setUpdateUser: (params: ISetUpdateUser) => void,
  }
}
interface IDOBScreenState {
  loading: boolean,
  name: string,
  dob: Date,
  keyboard: boolean,
}
class DOBScreen extends React.Component<IDOBScreenProps> {
  state: IDOBScreenState = {
    loading: false,
    name: '',
    dob: moment('2000-01-01T00:00:00').toDate(),
    keyboard: false,
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

  handleUpdatePersonalInfo = async () => {
    this.setState({ loading: true, })
    await this.props.actions.setUpdateUser({ name: this.state.name, dob: this.state.dob, })
    this.setState({ loading: false, })
    this.props.navigation.navigate(Screens.Sex)
  }

  render() {
    const { navigation, systemStore, userStore, }: IDOBScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.PersonalInfoScreen} />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            flex: 1, display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16,
          }}
        >
          <View style={{flex: 1, width: '100%', justifyContent: 'center',}}>
            <ButtonInput
              systemStore={systemStore}
              value={this.state.name}
              placeholder={Lit[systemStore.Locale].Title.EnterName}
              onChangeText={(text: string) => this.setState({ name: text.slice(0, InputLimits.NameMax), })}
            />

            <View style={{width: '100%', alignItems: 'center', borderRadius: 16, overflow: 'hidden', marginTop: 16,}}>
              <BlurView
                blurType={Colors.darkestBlur as any}
                style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', backgroundColor: Colors.darkerBackground,}}
              />

              <DatePicker
                date={this.state.dob}
                mode={'date'}
                locale={systemStore.Locale}
                textColor={Colors.lightest}
                minimumDate={moment('1901-01-01').toDate()}
                maximumDate={moment().toDate()}
                onDateChange={(date: Date) => this.setState({ dob: date, })}
              />

              <View style={{position: 'absolute', right: 8, top: 8,}}>
                <CakeIcon fill={Colors.light} width={24} height={24} />
              </View>
            </View>
          </View>


          <View style={{flex: 0, width: '100%', marginBottom: this.state.keyboard ? 0 : 32,}}>
            <Button
              systemStore={systemStore}
              title={Lit[systemStore.Locale].Button.Next}
              disabled={this.state.name.length < InputLimits.NameMin}
              loading={this.state.loading}
              onPress={this.handleUpdatePersonalInfo}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DOBScreen)
