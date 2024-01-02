import React from 'react'
import {
  Linking,
  Text,
} from 'react-native'
import { ISystemStore } from '../../state/reducers/SystemReducer'
import Hyperlink from 'react-native-hyperlink'

interface IPretextProps {
  systemStore: ISystemStore,
  text: string,
  linkColor?: string,
  textProps?: any,
  textStyle?: any,
  onPress: (params: string) => void,
  onLongPress?: () => void,
}

const Pretext: React.FC<IPretextProps> = ({ systemStore, text, linkColor, textProps, textStyle, onPress, onLongPress }) => {
  const { Colors, Fonts, } = systemStore
  const tokens = text.split(/(https?:\/\/[^\s]+|@[\w]+|[^\p{L}\p{N}\p{Emoji_Presentation}\s]\w*|\s|\n)/gu).filter(Boolean)

  return (
    <Hyperlink
      linkStyle={{color: linkColor ? linkColor : Colors.lightBlue,}}
      linkDefault={true}
      onPress={url => Linking.openURL(url)}
    >
      <Text {...textProps} style={textStyle}>
        {tokens.map((token, index) => {
          // if (token.startsWith('@')) {
          //   return (
          //     <Text
          //       key={index}
          //       onPress={() => onPress(token.replace('@', '').trim())}
          //       onLongPress={onLongPress}
          //       style={{color: linkColor ? linkColor : Colors.lightBlue, fontWeight: Fonts.cruiserWeight,}}
          //     >
          //       {token}
          //     </Text>
          //   )
          // } else
          return <Text key={index} style={{fontWeight: Fonts.middleWeight,}}>{token}</Text>
        })}
      </Text>
    </Hyperlink>
  )
}

export default Pretext
