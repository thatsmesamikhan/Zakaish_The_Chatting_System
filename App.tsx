import React from 'react'
import RootNavigators from './src/navigators/RootNavigators'
import { FontSizeProvider } from './src/context/FontSizeContext'

const App = () => {
  return (
    <FontSizeProvider>
      <RootNavigators />
    </FontSizeProvider>
  )
}

export default App