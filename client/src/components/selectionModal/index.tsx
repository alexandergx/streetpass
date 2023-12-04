import React from 'react'
import {
  View,
  TouchableOpacity,
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
  state: ISelectionModalState = {
    settings: true,
  }

  render() {
    const { systemStore, config, clear, } = this.props
    const { Colors, } = systemStore

    return (
      <TouchableOpacity
        onPress={this.props.toggleModal}
        activeOpacity={1}
        style={{position: 'absolute', zIndex: 2, width: '100%', height: '100%',}}
      >
        {!clear && <BlurView blurAmount={2} style={{position: 'absolute', zIndex: -1, width: '100%', height: '100%', display: 'flex',}} />}

        <View style={{flex: 1, width: '100%', height: '100%', justifyContent: 'flex-end', marginBottom: 16, paddingBottom: 16,}}>
          <View>
            <LinearGradient
              style={{position: 'absolute', zIndex: 0, width: '100%', height: '150%', bottom: -64,}}
              colors={['rgba(0,0,0,0.7)', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0.35)', 'rgba(0,0,0,0)']} start={{ x: 1, y: 1 }} end={{ x: 1, y: 0 }}
            />

            <View style={{zIndex: 1, paddingHorizontal: 16,}}>
              <ListGroup systemStore={systemStore} config={{ ...config, titleShadow: true, titleColor: Colors.safeLightest, }} />

              <View style={{marginTop: 16,}}>
                <Button
                  systemStore={systemStore}
                  // title={Lit[systemStore.Locale].Button.Done}
                  color={Colors.darkerBackground}
                  onPress={this.props.toggleModal}
                />
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    )
  }
}

export default SelectionModal
