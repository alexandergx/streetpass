import React from 'react'
import {
  StatusBar,
  useColorScheme,
} from 'react-native'
import { Provider } from 'react-redux'
import configureStore from './src/state/store'
import AppNavigation from './src/navigation'
import { ApolloProvider, } from '@apollo/client'
import { customClient, } from './src/api'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import 'react-native-reanimated'

const store = configureStore()

const App: React.FC<null> = () => {
  const isDarkMode = useColorScheme() === 'dark'
  const backgroundStyle = { backgroundColor: isDarkMode ? '#fff' : '#000', }

  return (
    <GestureHandlerRootView style={{flex: 1,}}>
      <ApolloProvider client={customClient}>
        <Provider store={store}>
          <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={backgroundStyle.backgroundColor} />
          <AppNavigation />
        </Provider>
      </ApolloProvider>
    </GestureHandlerRootView>
  )
}

export default App
