import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import ListGroup, { IListGroupConfig } from '../listGroup'
import Button from '../button'
import { BlurView } from '@react-native-community/blur'

interface IPickerModalProps {
  systemStore: ISystemStore,
  config: IListGroupConfig,
  title?: string,
  loading?: boolean,
  disabled?: boolean,
  toggleModal: () => void,
  onPress?: () => void,
}
interface IPickerModalState {
  settings: boolean,
}
class PickerModal extends React.Component<IPickerModalProps> {
  constructor(props: IPickerModalProps) {
    super(props)
    this.fadeAnim = new Animated.Value(0)
    this.heightAnim = new Animated.Value(Dimensions.get('window').height)
  }
  fadeAnim: Animated.Value
  heightAnim: Animated.Value

  state: IPickerModalState = {
    settings: true,
  }

  componentDidMount() {
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true, }),
      Animated.spring(this.heightAnim, { toValue: 0, speed: 12, bounciness: 6, useNativeDriver: true, }),
    ]).start()
  }

  close = () => {
    Animated.parallel([
      Animated.timing(this.fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true, }),
      Animated.timing(this.heightAnim, { toValue: Dimensions.get('window').height, duration: 200, useNativeDriver: true, }),
    ]).start(() => this.props.toggleModal())
  }

  render() {
    const { systemStore, } = this.props

    return (
      <TouchableOpacity
        onPress={this.close}
        activeOpacity={1}
        style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%', justifyContent: 'flex-end',}}
      >
        <Animated.View style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', opacity: this.fadeAnim,}}>
          <BlurView blurAmount={2} style={{width: '100%', height: '100%',}} />
        </Animated.View>

        <Animated.View
          style={{
            width: '100%', justifyContent: 'flex-end', transform: [{ translateY: this.heightAnim }],
            flex: 0, paddingBottom: 16, marginTop: 96, padding: 16, marginBottom: this.props.onPress ? 16 : 80,
          }}
        >
          <ScrollView
            style={{
              borderRadius: 16, overflow: 'hidden',
            }}
            showsVerticalScrollIndicator={false}
          >
            <ListGroup systemStore={systemStore} config={this.props.config} />
          </ScrollView>

          {this.props.onPress &&
            <Button
              systemStore={systemStore}
              title={this.props.title}
              loading={this.props.loading}
              disabled={this.props.disabled}
              onPress={this.props.onPress}
            />
          }
        </Animated.View>
      </TouchableOpacity>
    )
  }
}

export default PickerModal
