import React from 'react'
import {
  View,
  KeyboardAvoidingView,
  Keyboard,
  Text,
  ScrollView,
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
// import { ISetUpdatePersonalInfo, setUpdatePersonalInfo, } from '../../state/actions/UserActions'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import moment from 'moment'
import { Lit } from '../../utils/locale'
import ListGroup, { IListGroupConfig } from '../../components/listGroup'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import EditProfileModal from '../../components/editProfileModal'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      // setUpdatePersonalInfo,
    }
  ), dispatch),
})

interface IDOBScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    // setUpdatePersonalInfo: (params: ISetUpdatePersonalInfo) => void,
  }
}
interface IDOBScreenState {
  loading: boolean,
  dob: Date,
  sex: boolean | null,
  showSex: boolean | null,
  editProfile: boolean,
}
class DOBScreen extends React.Component<IDOBScreenProps> {
  state: IDOBScreenState = {
    loading: false,
    dob: moment('2000-01-01T00:00:00').toDate(),
    sex: null,
    showSex: null,
    editProfile: false,
  }

  handleUpdatePersonalInfo = async () => {
    // if (this.state.dob !== this.props.userStore.user.dob || this.state.sex !== this.props.userStore.user.sex) {
    //   this.setState({ loading: true, })
    //   await this.props.actions.setUpdatePersonalInfo({ dob: this.state.dob, sex: this.state.sex, })
    //   this.setState({ loading: false, })
    // }
    // this.props.navigation.goBack()
  }

  render() {
    const { navigation, systemStore, userStore, }: IDOBScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    const dobConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.DOB,
      list: [],
    }

    const sexConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.IAm,
      list: [
        { title: Lit[systemStore.Locale].Title.Male, color: this.state.sex == true ? Colors.lightBlue : undefined, blur: this.state.sex !== true, onPress: () => this.setState({ sex: true, }), noRight: true,  },
        { title: Lit[systemStore.Locale].Title.Female, color: this.state.sex == false ? Colors.lightRed : undefined, blur: this.state.sex !== false, onPress: () => this.setState({ sex: false, }), noRight: true,  },
        { title: Lit[systemStore.Locale].Title.RatherNotSay, blur: this.state.sex !== null, onPress: () => this.setState({ sex: null, }), noRight: true,  },
      ],
    }

    const showSexConfig: IListGroupConfig = {
      title: Lit[this.props.systemStore.Locale].Title.ShowMeOthers,
      list: [
        { title: Lit[this.props.systemStore.Locale].Title.Men, color: this.state.showSex == true ? Colors.lightBlue : undefined, blur: this.state.showSex !== true, onPress: () => this.setState({ showSex: true, }), noRight: true,  },
        { title: Lit[this.props.systemStore.Locale].Title.Women, color: this.state.showSex == false ? Colors.lightRed : undefined, blur: this.state.showSex !== false, onPress: () => this.setState({ showSex: false, }), noRight: true,  },
        { title: Lit[this.props.systemStore.Locale].Title.Everybody, blur: this.state.showSex !== null, onPress: () => this.setState({ showSex: null, }), noRight: true,  },
      ],
    }

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        {this.state.editProfile &&
          <EditProfileModal
            navigation={navigation}
            systemStore={systemStore}
            userStore={userStore}
            toggleModal={() => navigation.navigate(Screens.StreetPass)}
            actions={{
              //
            }}
          />
        }

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.PersonalInfoScreen} />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{
            flex: 1, display: 'flex',
            justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16,
          }}
        >
          <View style={{flex: 1, width: '100%',}}>
            <ScrollView style={{flex: 1, width: '100%',}}>
              <View style={{width: '100%',}}>
                <ListGroup systemStore={systemStore} config={dobConfig} />
              </View>

              <View style={{width: '100%', alignItems: 'center', borderRadius: 16, overflow: 'hidden',}}>
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
              </View>

              <View style={{width: '100%',}}>
                <ListGroup systemStore={systemStore} config={sexConfig} />
                <ListGroup systemStore={systemStore} config={showSexConfig} />
              </View>
            </ScrollView>
          </View>


          <View style={{flex: 0, width: '100%', marginBottom: 32,}}>
            <Button
              systemStore={systemStore}
              onPress={() => this.setState({ editProfile: true, })}
              title={Lit[systemStore.Locale].Button.Save}
              loading={this.state.loading}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DOBScreen)
