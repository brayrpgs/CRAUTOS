import type { Brands, Displacements, Models, Styles, Years, Transmissions, Fuel } from './car'
import type { Dors } from './dors'
import type { Prices } from './Prices'

export interface catalog {
  brands: Brands[]
  models: Models[]
  styles: Styles[]
  years: Years[]
  prices: Prices[]
  displacements: Displacements[]
  transmissions: Transmissions[]
  fuel: Fuel[]
  dors: Dors[]
}
