import React from 'react'
import { HomeProvider } from '../home/HomeProvider'
import { FavoriteCarsManager } from './FavoriteCarsManager'
import { CarTechnicalSheet } from '../CarTechnicalSheet/CarTechnicalSheet'

export const FavoritesPage: React.FC = () => {
  return (
    <HomeProvider>
      <FavoriteCarsManager />
      <CarTechnicalSheet />
    </HomeProvider>
  )
}
