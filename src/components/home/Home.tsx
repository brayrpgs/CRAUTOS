import React from 'react'
import { HomeProvider } from './HomeProvider'
import { HomeWrapper } from './HomeWrapper'

const HomeView: React.FC = () => {
  return (
    <HomeProvider>
      <HomeWrapper />
    </HomeProvider>
  )
}

export { HomeView }
