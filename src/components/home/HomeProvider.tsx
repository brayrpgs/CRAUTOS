import { useEffect, useState } from 'react'
import { HomeContext } from './HomeContext'
import { CARS_URL } from '../../common/common'
import type { Cars } from '../../models/car'
import { getLoggedUserId } from '../../utils/GetUserUtils'

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
    try {
      // Intentar obtener el usuario logueado (si existe)
      let loggedId: number | null = null
      try {
        loggedId = getLoggedUserId()
      } catch {
        loggedId = null
      }

      // Construir el filtro dinámico
      // Siempre → traer solo los NO vendidos
      let query = `${CARS_URL}?sold=eq.false`

      // Si hay usuario logueado → excluir sus carros
      if (loggedId !== null) {
        query += `&id_users=neq.${loggedId}`
      }

      // Campos a seleccionar
      query += '&select=*,brands(*),models(*),styles(*),transmissions(*),displacements(*),fuel(*),years(*),audit(*),users(*),cars_images(images(*))'

      // Petición con paginación
      const request = await fetch(query, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Range: `${(page - 1) * 10}-${page * 10 - 1}`,
          'Range-Unit': 'items',
          Prefer: 'count=exact'
        }
      })

      if (!request.ok) return

      // Obtener total de páginas
      const totalCountData = request.headers.get('content-range')
      const totalPages = Math.ceil(Number(totalCountData?.split('/')[1]) / 10)
      setTotalPages(totalPages)

      // Guardar resultados
      const data = await request.json() as Cars[]
      setItems(data)
    } catch (error) {
      console.error('Error cargando autos', error)
    }
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
