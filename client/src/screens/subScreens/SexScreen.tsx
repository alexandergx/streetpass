import React from 'react'
import {
  View,
  KeyboardAvoidingView,
} from 'react-native'
import Button from '../../components/button'
import NavHeader from '../../components/navigation/NavHeader'
import GradientBackground from '../../components/gradientBackground'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { Screens } from '../../navigation'
import { IUserStore } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { Lit } from '../../utils/locale'
import ListGroup, { IListGroupConfig } from '../../components/listGroup'
import AnimatedBackground from '../../components/animated/AnimatedBackground'
import EditProfileModal from '../../components/editProfileModal'
import MaleIcon from '../../assets/icons/male.svg'
import FemaleIcon from '../../assets/icons/female.svg'
import { ISetSortMedia, ISetUpdateUser, setSortMedia, setUpdateUser, setUser } from '../../state/actions/UserActions'
import { InputLimits } from '../../utils/constants'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setUser,
      setUpdateUser,
      setSortMedia,
    }
  ), dispatch),
})

interface IDOBScreenProps {
  navigation: any,
  route: { params: { editProfile: boolean, }, } | any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  actions: {
    setUser: () => void,
    setUpdateUser: (params: ISetUpdateUser) => void,
    setSortMedia: (params: ISetSortMedia) => void,
  }
}
interface IDOBScreenState {
  loading: boolean,
  sex: boolean | null,
  showSex: boolean | null,
  editProfile: boolean,
}
class DOBScreen extends React.Component<IDOBScreenProps> {
  state: IDOBScreenState = {
    loading: false,
    sex: null,
    showSex: null,
    editProfile: this.props.route?.params?.editProfile || false,
  }

  handleUpdateSex = async () => {
    this.setState({ loading: true, })
    await this.props.actions.setUpdateUser({ sex: this.state.sex, streetpassPreferences: { discoverable: true, location: true, sex: this.state.showSex, age: [InputLimits.StreetpassAgeMin, InputLimits.StreetpassAgeMax] }, })
    this.setState({ loading: false, editProfile: true, })
  }

  render() {
    const { navigation, systemStore, userStore, }: IDOBScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    const sexConfig: IListGroupConfig = {
      title: Lit[systemStore.Locale].Title.IAm,
      list: [
        { title: Lit[systemStore.Locale].Title.Male, Icon: MaleIcon, iconColor: this.state.sex == true ? Colors.lightBlue : Colors.light, color: this.state.sex == true ? Colors.lightBlue : undefined, blur: this.state.sex !== true, onPress: () => this.setState({ sex: true, }), noRight: true,  },
        { title: Lit[systemStore.Locale].Title.Female, Icon: FemaleIcon, iconColor: this.state.sex == false ? Colors.lightRed : Colors.light, color: this.state.sex == false ? Colors.lightRed : undefined, blur: this.state.sex !== false, onPress: () => this.setState({ sex: false, }), noRight: true,  },
        { title: Lit[systemStore.Locale].Title.RatherNotSay, blur: this.state.sex !== null, onPress: () => this.setState({ sex: null, }), noRight: true,  },
      ],
    }

    const showSexConfig: IListGroupConfig = {
      title: Lit[this.props.systemStore.Locale].Title.ShowMeOthers,
      list: [
        { title: Lit[this.props.systemStore.Locale].Title.Men, Icon: MaleIcon, iconColor: this.state.showSex == true ? Colors.lightBlue : Colors.light, color: this.state.showSex == true ? Colors.lightBlue : undefined, blur: this.state.showSex !== true, onPress: () => this.setState({ showSex: true, }), noRight: true,  },
        { title: Lit[this.props.systemStore.Locale].Title.Women, Icon: FemaleIcon, iconColor: this.state.showSex == false ? Colors.lightRed : Colors.light, color: this.state.showSex == false ? Colors.lightRed : undefined, blur: this.state.showSex !== false, onPress: () => this.setState({ showSex: false, }), noRight: true,  },
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
            toggleModal={() => this.props.route?.params?.editProfile ? navigation.goBack() : this.setState({ editProfile: false, })}
            onPress={() => navigation.navigate(Screens.Streetpass)}
            actions={{
              setUser: this.props.actions.setUser,
              setUpdateUser: this.props.actions.setUpdateUser,
              setSortMedia: this.props.actions.setSortMedia,
            }}
          />
        }

        <NavHeader systemStore={systemStore} navigation={navigation} title={Lit[systemStore.Locale].ScreenTitle.SexScreen} />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,}}
        >
          <View style={{flex: 1, width: '100%', justifyContent: 'center',}}>
            <View style={{width: '100%',}}>
              <ListGroup systemStore={systemStore} config={sexConfig} />
              <ListGroup systemStore={systemStore} config={showSexConfig} />
            </View>
          </View>


          <View style={{flex: 0, width: '100%', marginBottom: 32,}}>
            <Button
              systemStore={systemStore}
              onPress={this.handleUpdateSex}
              title={Lit[systemStore.Locale].Button.Next}
              loading={this.state.loading}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(DOBScreen)
