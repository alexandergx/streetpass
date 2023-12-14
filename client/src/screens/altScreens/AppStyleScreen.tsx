import React from 'react'
import {
  View,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native'
import Button from '../../components/button'
import NavHeader from '../../components/navigation/NavHeader'
import GradientBackground from '../../components/gradientBackground'
import { connect, } from 'react-redux'
import { bindActionCreators, Dispatch, AnyAction, } from 'redux'
import { IStores, } from '../../state/store'
import { ISystemStore, } from '../../state/reducers/SystemReducer'
import { setColors, saveColors, } from '../../state/actions/SystemActions'
import { Themes, } from '../../utils/themes'
import LinearGradient from 'react-native-linear-gradient'
import { BlurView, } from '@react-native-community/blur'
import { Lit, } from '../../utils/locale'
import AnimatedBackground from '../../components/animated/AnimatedBackground'

const mapStateToProps = (state: IStores) => {
  const { systemStore, userStore, } = state
  return { systemStore, userStore, }
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => ({
  actions: bindActionCreators(Object.assign(
    {
      setColors,
      saveColors,
    }
  ), dispatch),
})

interface IAppStyleScreenProps {
  navigation: any,
  systemStore: ISystemStore,
  actions: {
    setColors: (params: keyof typeof Themes) => void,
    saveColors: (params: keyof typeof Themes) => void,
  }
}
interface IAppStyleScreenState {
  Theme: string,
}
class AppStyleScreen extends React.Component<IAppStyleScreenProps> {
  state: IAppStyleScreenState = {
    Theme: this.props.systemStore.Theme,
  }

  handleGoBack = () => {
    this.props.actions.setColors(this.props.systemStore.Theme as keyof typeof Themes)
    this.props.navigation.goBack()
  }

  handleSetTheme = (theme: keyof typeof Themes) => {
    if (theme === this.state.Theme) return
    this.setState({ Theme: theme, })
    this.props.actions.setColors(theme as keyof typeof Themes)
  }

  handleSaveTheme = (theme: keyof typeof Themes) => {
    this.props.actions.saveColors(theme)
    this.props.navigation.goBack()
  }

  render() {
    const { navigation, systemStore, }: IAppStyleScreenProps = this.props
    const { Colors, Fonts, } = systemStore

    return (
      <>
        <GradientBackground systemStore={systemStore} />
        <AnimatedBackground systemStore={systemStore} />

        <NavHeader
          systemStore={systemStore}
          navigation={navigation}
          title={Lit[systemStore.Locale].ScreenTitle.AppStyleScreen}
          onPress={this.handleGoBack}
        />

        <KeyboardAvoidingView
          behavior={'padding'}
          style={{flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 16,}}
        >
          <View style={{flex: 1, width: '100%', marginVertical: 16, borderRadius: 16, overflow: 'hidden',}}>
            <BlurView
              blurType={Colors.darkestBlur as any}
              style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%',}}
            />

            <ScrollView showsVerticalScrollIndicator={false} style={{width: '100%', height: '100%', padding: 16,}}>
              {Object.keys(Themes).map((theme, index) => {
                return (
                  <View
                    key={index}
                    style={{width: '100%', borderTopWidth: index ? 0.3 : 0, borderColor: Colors.light,}}
                  >
                    <TouchableOpacity
                      onPress={() => this.handleSetTheme(theme as keyof typeof Themes)}
                      style={{
                        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                        paddingTop: index ? 8 : 0, paddingBottom: 8,
                      }}
                    >
                      <View style={{marginHorizontal: 8,}}>
                        <Text style={{color: Colors.lightest, fontSize: Fonts.xl, fontWeight: Fonts.featherWeight, opacity: this.state.Theme === theme ? 0.3 : 1,}}>{theme}</Text>
                      </View>

                      <View style={{width: 48, aspectRatio: 1/1, borderRadius: 32, overflow: 'hidden', backgroundColor: 'white', opacity: this.state.Theme === theme ? 0.3 : 1,}}>
                        <LinearGradient
                          style={{position: 'absolute', width: '100%', height: '100%',}}
                          colors={Themes[theme as keyof typeof Themes].gradient} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
                        />
                      </View>
                    </TouchableOpacity>
                  </View>
                )
              })}
              <View style={{height: 32,}} />
            </ScrollView>
          </View>

          <View style={{flex: 0, width: '100%', marginBottom: 32,}}>
            <Button
              systemStore={systemStore}
              title={Lit[systemStore.Locale].Button.Save}
              onPress={() => this.handleSaveTheme(this.state.Theme as keyof typeof Themes)}
            />
          </View>
        </KeyboardAvoidingView>
      </>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppStyleScreen)
