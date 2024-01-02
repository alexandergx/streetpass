import React from 'react'
import {
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'
import Button from '../button'
import ListGroup, { IListGroupConfig } from '../listGroup'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import { BlurView } from '@react-native-community/blur'
import LinearGradient from 'react-native-linear-gradient'
import { Lit } from '../../utils/locale'

export interface ISelectionModalProps {
  systemStore: ISystemStore,
  config: IListGroupConfig,
  clear?: boolean,
  toggleModal: () => void,
}
interface ISelectionModalState {
  settings: boolean,
}
class SelectionModal extends React.Component<ISelectionModalProps> {
  constructor(props: ISelectionModalProps) {
    super(props)
    this.fadeAnim = new Animated.Value(0)
    this.heightAnim = new Animated.Value(Dimensions.get('window').height)
  }
  fadeAnim: Animated.Value
  heightAnim: Animated.Value

  state: ISelectionModalState = {
    settings: true,
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true, }),
      Animated.spring(this.heightAnim, { toValue: 0, speed: 12, bounciness: 4, useNativeDriver: true, }),
    ]).start()
  }

  close = () => {
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true, }),
      Animated.timing(this.heightAnim, { toValue: Dimensions.get('window').height, duration: 200, useNativeDriver: true, }),
    ]).start(() => this.props.toggleModal())
  }

  render() {
    const { systemStore, config, clear, } = this.props
    const { Colors, } = systemStore

    return (
      <TouchableOpacity
        onPress={this.close}
        activeOpacity={1}
        style={{position: 'absolute', zIndex: 3, width: '100%', height: '100%',}}
      >
        {!clear &&
          <Animated.View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', opacity: this.fadeAnim,}}>
            <BlurView blurAmount={2} style={{width: '100%', height: '100%',}} />
          </Animated.View>
        }

        <Animated.View style={{flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end', marginBottom: 16, paddingBottom: 16, transform: [{ translateY: this.heightAnim }],}}>            
          <View style={{zIndex: 1,}}>
            <LinearGradient
              style={{position: 'absolute', zIndex: 0, width: '100%', height: '130%', bottom: -64,}}
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
            />

            <View style={{paddingHorizontal: 16,}}>              
              <ListGroup systemStore={systemStore} config={{ ...config, titleShadow: true, titleColor: Colors.safeLightest, }} />
              <View style={{marginTop: 16,}}>
                <Button
                  systemStore={systemStore}
                  title={Lit[systemStore.Locale].Button.Done}
                  color={Colors.darkerBackground}
                  onPress={this.close}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

export default SelectionModal
