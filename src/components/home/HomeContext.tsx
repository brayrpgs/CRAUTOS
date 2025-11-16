import { createContext } from 'react'

interface HomeContextProps<T> {
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  stateModal: boolean
  setStateModal: React.Dispatch<React.SetStateAction<boolean>>
  items: T[]
  setItems: React.Dispatch<React.SetStateAction<T[]>>
  page: number
  setPage: React.Dispatch<React.SetStateAction<number>>
}

const HomeContext = createContext<HomeContextProps<any> | null>(null)

export { HomeContext }
