import { useEffect, useState } from 'react'
import { HomeContext } from './HomeContext'
import { CARS_URL } from '../../common/common'
import type { Cars } from '../../models/car'

interface HomeProviderProps {
  children: React.ReactNode
}

const HomeProvider: React.FC<HomeProviderProps> = ({ children }) => {
  const [stateModal, setStateModal] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [items, setItems] = useState<Cars[]>([])
  const [page, setPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(0)
  const [carSelected, setCarSelected] = useState<Cars | undefined>(undefined)
  const [openSheet, setOpenSheet] = useState<boolean>(false)

  // fetch all cars
  const fetchData = async (): Promise<void> => {
    const request = await fetch(
      `${CARS_URL}?select=*,brands(*),models(*),styles(*),transmissions(*),displacements(*),fuel(*),years(*),audit(*),users(*),cars_images(images(*))`,
      {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Range: `${(page - 1) * 10}-${page * 10 - 1}`,
          'Range-Unit': 'items',
          Prefer: 'count=exact'
        }
      }
    )
    // hay que ver cuantas paginas hay
    if (!request.ok) return
    const totalCountData = await request.headers.get('content-range')
    const totalPages = Math.ceil(Number(totalCountData?.split('/')[1]) / 10)
    setTotalPages(totalPages)
    const data = await request.json() as Cars[]
    setItems(data)
  }

  // Provide the context values to children components
  useEffect(() => {
    void fetchData()
  }, [page])

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
          setPage,
          totalPages,
          carSelected,
          setCarSelected,
          openSheet,
          setOpenSheet
        }
      }
    >
      {children}
    </HomeContext.Provider>
  )
}

export { HomeProvider }
