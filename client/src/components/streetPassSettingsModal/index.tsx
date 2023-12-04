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
// import { Slider } from '@miblanchard/react-native-slider'
import { InputLimits, streetPassAges } from '../../utils/constants'
import Slider from '../slider'
// import { requestLocationAlways } from '../../utils/services'
// import { Screens } from '../../navigation'
// import { getAge } from '../../utils/functions'

interface IStreetPassSettingsModalProps {
  navigation: any,
  systemStore: ISystemStore,
  userStore: IUserStore,
  toggleModal: () => void,
  actions: {
    //
  }
}
export interface IStreetPassSettingsModalState {
  streetPass: boolean,
  discoverable: boolean,
  location: boolean,
  sex: boolean | null,
  age: [number, number],
  loading: boolean,
  scroll: boolean,
}
class StreetPassSettingsModal extends React.Component<IStreetPassSettingsModalProps> {
  state: IStreetPassSettingsModalState = {
    streetPass: this.props.userStore.user.streetPass,
    discoverable: this.props.userStore.user.streetPassPreferences.discoverable,
    location: this.props.userStore.user.streetPassPreferences.location,
    sex: this.props.userStore.user.streetPassPreferences.sex,
    age: this.props.userStore.user.streetPassPreferences.age || [InputLimits.StreetPassAgeMin, InputLimits.StreetPassAgeMax],
    loading: false,
    scroll: true,
  }

  updateSettings = async () => {
    if (
      this.state.streetPass !== this.props.userStore.user.streetPass
      || this.state.discoverable !== this.props.userStore.user.streetPassPreferences.discoverable
      || this.state.location !== this.props.userStore.user.streetPassPreferences.location
      || this.state.sex !== this.props.userStore.user.streetPassPreferences.sex
      || this.state.age !== this.props.userStore.user.streetPassPreferences.age
    ) {
      this.setState({ loading: true, })
      // if (this.state.streetPass !== this.props.userStore.user.streetPass) await this.props.actions.setUpdateStreetPass(this.state.streetPass)
      // await this.props.actions.setUpdateStreetPassPreferences({
      //   discoverable: this.state.discoverable,
      //   location: this.state.location,
      //   sex: this.state.sex,
      //   age: this.state.age,
      // })
      this.setState({ loading: false, })
      this.props.toggleModal()
    } else this.props.toggleModal()
  }

  render() {
    const { systemStore, userStore, toggleModal, }: IStreetPassSettingsModalProps = this.props
    const { Colors, } = systemStore

    const streetPassConfig: IListGroupConfig = {
      title: 'Connect with others',
      list: [
        {
          title: 'StreetPass', toggleValue: this.state.streetPass, onToggle: async () => {
            return null
            // if (!userStore.user.dob) {
            //   Alert.alert(Lit[this.props.systemStore.Locale].Copywrite.PersonalInfo[0], Lit[this.props.systemStore.Locale].Copywrite.PersonalInfo[1],
            //     [
            //       { text: Lit[this.props.systemStore.Locale].Button.No, onPress: () => null, },
            //       { text: Lit[this.props.systemStore.Locale].Button.Ok, onPress: () => this.props.navigation.navigate(Screens.PersonalInfo), },
            //     ]
            //   )
            //   return
            // }

            // const age = getAge(userStore.user.dob)
            // if (age <= InputLimits.StreetPassAgeMin) {
            //   Alert.alert(Lit[this.props.systemStore.Locale].Copywrite.StreetPassAge[0], Lit[this.props.systemStore.Locale].Copywrite.StreetPassAge[1],
            //     [
            //       { text: Lit[systemStore.Locale].Button.Ok, onPress: () => null, },
            //     ]
            //   )
            //   return
            // }

            // if (!this.state.streetPass) {
            //   await requestLocationAlways(this.props.systemStore.Locale).then(async result => {
            //     if (!result) return
            //     this.setState({ streetPass: !this.state.streetPass, })
            //   })
            // } else this.setState({ streetPass: !this.state.streetPass, })
          },
          description: 'Lorem ipsum',
        },
      ],
    }

    const sexConfig: IListGroupConfig = {
      title: 'Show me profiles of',
      list: [
        { title: 'Men', color: this.state.sex == true ? Colors.lightBlue : undefined, blur: this.state.sex !== true, onPress: () => this.setState({ sex: true, }), noRight: true,  },
        { title: 'Women', color: this.state.sex == false ? Colors.lightRed : undefined, blur: this.state.sex !== false, onPress: () => this.setState({ sex: false, }), noRight: true,  },
        { title: 'Everybody', blur: this.state.sex !== null, onPress: () => this.setState({ sex: null, }), noRight: true,  },
      ],
    }

    const discoverableConfig: IListGroupConfig = {
      title: 'Let others see me',
      list: [
        {
          title: 'Discoverable', toggleValue: this.state.discoverable, onToggle: () => this.setState({ discoverable: !this.state.discoverable, }),
          description: 'Lorem ipsum',
        },
      ],
    }

    // const locationConfig: IListGroupConfig = {
    //   title: Lit[systemStore.Locale].Title.VisibleOnMap,
    //   list: [
    //     {
    //       title: Lit[systemStore.Locale].Title.StreetPassLocation, toggleValue: this.state.location, onToggle: () => this.setState({ location: !this.state.location, }),
    //       description: Lit[systemStore.Locale].Title.StreetPassLocationDescription,
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
                <ListGroup systemStore={systemStore} config={streetPassConfig} />
                {this.state.streetPass &&
                  <>
                    <ListGroup systemStore={systemStore} config={sexConfig} />
                    <Slider
                      systemStore={systemStore}
                      values={streetPassAges}
                      minValue={this.state.age[0]}
                      maxValue={this.state.age[1]}
                      title={'Age preference'}
                      subtitle={`${this.state.age[0]}-${this.state.age[1] >= InputLimits.StreetPassAgeMax ? this.state.age[1] + '+' : this.state.age[1]}`}
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
                // title={Lit[systemStore.Locale].Button.Save}
                loading={this.state.loading}
              />
            </View>
          </KeyboardAvoidingView>
        </BlurView>
      </>
    )
  }
}

export default StreetPassSettingsModal
