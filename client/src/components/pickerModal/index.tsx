import React from 'react'
import {
  View,
  ScrollView,
  TouchableOpacity,
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
  state: IPickerModalState = {
    settings: true,
  }

  render() {
    const { systemStore, } = this.props

    return (
      <TouchableOpacity
        onPress={this.props.toggleModal}
        activeOpacity={1}
        style={{position: 'absolute', zIndex: 1, width: '100%', height: '100%', justifyContent: 'flex-end',}}
      >
        <BlurView blurAmount={2} style={{position: 'absolute', zIndex: -1, height: '100%', width: '100%', display: 'flex',}} />

        <View
          style={{
            flex: 0, width: '100%', justifyContent: 'flex-end',
            marginTop: 96, marginBottom: this.props.onPress ? 16 : 80, padding: 16,
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
        </View>
      </TouchableOpacity>
    )
  }
}

export default PickerModal
