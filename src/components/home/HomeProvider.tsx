import { useState } from 'react'
import { HomeContext } from './HomeContext'
interface HomeProviderProps {
  children: React.ReactNode
}

const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [stateModal, setStateModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [items, setItems] = useState<any[]>([])
  const [page, setPage] = useState<number>(1)

  /** */

  return (
    <HomeContext.Provider
      value={
        {
          stateModal,
          setStateModal,
          searchQuery,
          setSearchQuery,
          items,
          setItems,
          page,
          setPage
        }
      }
    >
      {children}
    </HomeContext.Provider>
  )
}

export { HomeProvider }
