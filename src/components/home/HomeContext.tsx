import { createContext } from 'react'
import type { Cars } from '../../models/car'
import type { catalog } from '../../models/catalog'
import type { filter } from '../../models/filter'

interface HomeContextProps<T> {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  stateModal: boolean
  setStateModal: React.Dispatch<React.SetStateAction<boolean>>
  carSelected?: T
  setCarSelected?: React.Dispatch<React.SetStateAction<T | undefined>>
  openSheet?: boolean
  setOpenSheet?: React.Dispatch<React.SetStateAction<boolean>>
  items: T[]
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
  totalPages?: number
  carSelectedById?: number
  setCarSelectedById?: React.Dispatch<React.SetStateAction<number>>
  catalog?: catalog
  filter?: filter
  setFilters?: React.Dispatch<React.SetStateAction<filter>>
}

const HomeContext = createContext<HomeContextProps<Cars> | null>(null)

export { HomeContext }
