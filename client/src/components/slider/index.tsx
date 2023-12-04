import React from 'react'
import {
  Text,
} from 'react-native'
import { BlurView } from '@react-native-community/blur'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import ListGroup, { IListGroupConfig } from '../listGroup'
import { Slider as RNSlider } from '@miblanchard/react-native-slider'

interface ISliderProps {
  systemStore: ISystemStore,
  values: Array<number>,
  minValue: number,
  maxValue: number,
  title?: string,
  subtitle?: string,
  color?: string,
  setValues: (minValue: number, maxValue: number) => void,
  onSlidingStart?: () => void,
  onSlidingEnd?: () => void,
}
const Slider: React.FC<ISliderProps> = ({
  systemStore, values, minValue, maxValue, title, subtitle, color, setValues, onSlidingStart, onSlidingEnd,
}) => {
  const { Colors, } = systemStore

  const ageConfig: IListGroupConfig = {
    title: title,
    subtitle: subtitle,
    list: [],
  }

  return (
    <>
      <ListGroup systemStore={systemStore} config={ageConfig} />
      <BlurView blurType={Colors.darkestBlur as any} style={{borderRadius: 16, backgroundColor: Colors.darkerBackground, paddingHorizontal: 16, paddingVertical: 4, }}>
        <RNSlider
          value={[values.indexOf(minValue), values.indexOf(maxValue)]}
          minimumValue={0}
          maximumValue={values.length - 1}
          step={1}
          maximumTrackTintColor={Colors.safeLightest}
          minimumTrackTintColor={color ? color : Colors.lightBlue}
          thumbTintColor={color ? color : Colors.lightBlue}
          onValueChange={(newValues) => {
            let minSliderIndex = newValues[0]
            let maxSliderIndex = newValues[1]
            if (maxSliderIndex - minSliderIndex < 2) {
              if (values.indexOf(minValue) !== minSliderIndex) {
                minSliderIndex = Math.max(0, maxSliderIndex - 2)
              } else if (values.indexOf(maxValue) !== maxSliderIndex) {
                maxSliderIndex = Math.min(values.length - 1, minSliderIndex + 2)
              }
            }
            setValues(values[minSliderIndex], values[maxSliderIndex])
          }}
          onSlidingStart={onSlidingStart}
          onSlidingComplete={onSlidingEnd}
        />
      </BlurView>
    </>
  )
}

export default Slider
