import React from 'react'
import { Alert, KeyboardAvoidingView, ScrollView, View, } from 'react-native'
import { IUserStore } from '../../state/reducers/UserReducer'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import ListGroup, { IListGroupConfig, } from '../listGroup'
import { Lit } from '../../utils/locale'
import { BlurView } from '@react-native-community/blur'
import NavHeader from '../navigation/NavHeader'
import CrossIcon from '../../assets/icons/cross.svg'
import Button from '../button'
import { InputLimits, streetpassAges } from '../../utils/constants'
import Slider from '../slider'
import { requestLocationAlways } from '../../utils/services'
import MaleIcon from '../../assets/icons/male.svg'
import FemaleIcon from '../../assets/icons/female.svg'
import { ISetUpdateUser } from '../../state/actions/UserActions'

interface IStreetpassSettingsModalProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  actions: {
    setUpdateUser: (params: ISetUpdateUser) => void,
  }
}
export interface IStreetpassSettingsModalState {
  streetpass: boolean,
  discoverable: boolean,
  location: boolean,
  sex: boolean | null,
  age: [number, number],
  loading: boolean,
  scroll: boolean,
}
class StreetpassSettingsModal extends React.Component<IStreetpassSettingsModalProps> {
  state: IStreetpassSettingsModalState = {
    streetpass: this.props.userStore.user.streetpass,
    discoverable: this.props.userStore.user.streetpassPreferences.discoverable,
    location: this.props.userStore.user.streetpassPreferences.location,
    sex: this.props.userStore.user.streetpassPreferences.sex,
    age: this.props.userStore.user.streetpassPreferences.age,
    loading: false,
    scroll: true,
  }

  updateSettings = async () => {
    if (true
      // this.state.sp !== this.props.userStore.user.streetpass
      // || this.state.discoverable !== this.props.userStore.user.streetpassPreferences.discoverable
      // || this.state.location !== this.props.userStore.user.streetpassPreferences.location
      // || this.state.sex !== this.props.userStore.user.streetpassPreferences.sex
      // || this.state.age !== this.props.userStore.user.streetpassPreferences.age
    ) {
      this.setState({ loading: true, })
      await this.props.actions.setUpdateUser({
        streetpass: this.state.streetpass,
        streetpassPreferences: {
          discoverable: this.state.discoverable,
          location: this.state.location,
          sex: this.state.sex,
          age: this.state.age,
        },
      })
      this.setState({ loading: false, })
      this.props.toggleModal()
    } else this.props.toggleModal()
  }

  render() {
    const { systemStore, toggleModal, }: IStreetpassSettingsModalProps = this.props
    const { Colors, } = systemStore

    const streetpassConfig: IListGroupConfig = {
      title: Lit[this.props.systemStore.Locale].Title.ConnectWithOthers,
      list: [
        {
          title: Lit[this.props.systemStore.Locale].Title.Streetpass, toggleValue: this.state.streetpass, onToggle: async () => {
            if (!this.state.streetpass) {
              await requestLocationAlways(this.props.systemStore.Locale).then(async result => {
                if (!result) return
                this.setState({ streetpass: !this.state.streetpass, })
              })
            } else this.setState({ streetpass: !this.state.streetpass, })
          },
          description: Lit[this.props.systemStore.Locale].Copywrite.StreetpassDescription,
        },
      ],
    }

    const sexConfig: IListGroupConfig = {
      title: Lit[this.props.systemStore.Locale].Title.ShowMeOthers,
      list: [
        { title: Lit[this.props.systemStore.Locale].Title.Men, Icon: MaleIcon, iconColor: this.state.sex == true ? Colors.lightBlue : Colors.light, color: this.state.sex == true ? Colors.lightBlue : undefined, blur: this.state.sex !== true, onPress: () => this.setState({ sex: true, }), noRight: true,  },
        { title: Lit[this.props.systemStore.Locale].Title.Women, Icon: FemaleIcon, iconColor: this.state.sex == false ? Colors.lightRed : Colors.light, color: this.state.sex == false ? Colors.lightRed : undefined, blur: this.state.sex !== false, onPress: () => this.setState({ sex: false, }), noRight: true,  },
        { title: Lit[this.props.systemStore.Locale].Title.Everybody, blur: this.state.sex !== null, onPress: () => this.setState({ sex: null, }), noRight: true,  },
      ],
    }

    const discoverableConfig: IListGroupConfig = {
      title: Lit[this.props.systemStore.Locale].Title.ShowOthersMe,
      list: [
        {
          title: Lit[this.props.systemStore.Locale].Title.Discoverable, toggleValue: this.state.discoverable, onToggle: () => this.setState({ discoverable: !this.state.discoverable, }),
          description: Lit[this.props.systemStore.Locale].Copywrite.DiscoverableDescription,
        },
      ],
    }

    // const locationConfig: IListGroupConfig = {
    //   title: Lit[systemStore.Locale].Title.VisibleOnMap,
    //   list: [
    //     {
    //       title: Lit[systemStore.Locale].Title.StreetpassLocation, toggleValue: this.state.location, onToggle: () => this.setState({ location: !this.state.location, }),
    //       description: Lit[systemStore.Locale].Copywrite.StreetpassLocationDescription,
    //     },
    //   ],
    // }

    return (
      <>
        <BlurView blurType={Colors.darkBlur as any} style={{position: 'absolute', zIndex: 3, width: '100%', height: '100%',}}>
          <NavHeader systemStore={systemStore} color={Colors.lightest} StartIcon={CrossIcon} onPress={toggleModal} />

          <KeyboardAvoidingView
            behavior={'padding'}
            style={{
              flex: 1, display: 'flex',
              justifyContent: 'center', alignItems: 'center', paddingHorizontal: 16,
            }}
          >
            <View style={{flex: 1, width: '100%',}}>
              <ScrollView scrollEnabled={this.state.scroll} showsVerticalScrollIndicator={false}>
                <ListGroup systemStore={systemStore} config={streetpassConfig} />
                {this.state.streetpass &&
                  <>
                    <ListGroup systemStore={systemStore} config={sexConfig} />
                    <Slider
                      systemStore={systemStore}
                      values={streetpassAges}
                      minValue={this.state.age[0]}
                      maxValue={this.state.age[1]}
                      title={Lit[this.props.systemStore.Locale].Title.AgePreference}
                      subtitle={`${this.state.age[0]}-${this.state.age[1] >= InputLimits.StreetpassAgeMax ? this.state.age[1] + '+' : this.state.age[1]}`}
                      setValues={(minValue, maxValue) => this.setState({ age: [minValue, maxValue], })}
                      onSlidingStart={() => this.setState({ scroll: false, })}
                      onSlidingEnd={() => this.setState({ scroll: true, })}
                    />
                    <ListGroup systemStore={systemStore} config={discoverableConfig} />
                    {/* <ListGroup systemStore={systemStore} config={locationConfig} /> */}

                    <View style={{height: 32,}} />
                  </>
                }
              </ScrollView>
            </View>

            <View style={{flex: 0, width: '100%', marginBottom: 32,}}>
              <Button
                systemStore={systemStore}
                onPress={this.updateSettings}
                title={Lit[systemStore.Locale].Button.Save}
                loading={this.state.loading}
              />
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </>
    )
  }
}

export default StreetpassSettingsModal
