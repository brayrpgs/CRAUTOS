import { useEffect, useRef, useState } from 'react'
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
  const [carSelectedById, setCarSelectedById] = useState<number>(0)

  const abortControllerRef = useRef<AbortController | null>(null)

  // fetch all cars
  const fetchData = async (signal: AbortSignal): Promise<void> => {
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
        signal,
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

  // filter brands
  const fetchFilterBrands = async (data: Cars[] = [], signal: AbortSignal): Promise<Cars[]> => {
    if (searchQuery === '') return []
    try {
      // Intentar obtener el usuario logueado (si existe)
      let loggedId: number | null = null
      try {
        loggedId = getLoggedUserId()
      } catch {
        loggedId = null
      }

      // Construir el filtro dinámico
      let query = `${CARS_URL}?sold=eq.false`

      if (loggedId !== null) {
        query += `&id_users=neq.${loggedId}`
      }

      // brands filter
      query += `&brands.desc=ilike.${searchQuery}*`

      // Campos a seleccionar
      query += '&select=*,brands(*),models(*),styles(*),transmissions(*),displacements(*),fuel(*),years(*),audit(*),users(*),cars_images(images(*))'

      // Petición con paginación
      const request = await fetch(query, {
        method: 'GET',
        signal,
        headers: {
          accept: 'application/json',
          Range: `${(page - 1) * 10}-${page * 10 - 1}`,
          'Range-Unit': 'items',
          Prefer: 'count=exact'
        }
      })

      if (!request.ok) return []

      // Obtener total de páginas
      const totalCountData = request.headers.get('content-range')
      const totalPagesFromBack = Math.ceil(Number(totalCountData?.split('/')[1]) / 10)
      setTotalPages(totalPagesFromBack >= totalPages ? totalPagesFromBack : totalPages)

      // Guardar resultados
      data = await request.json() as Cars[]
      return data.filter(car => car.brands !== null)
    } catch (error) {
      console.error('Error cargando autos', error)
      return []
    }
  }

  // filter models
  const fetchFilterModels = async (data: Cars[] = [], signal: AbortSignal): Promise<Cars[]> => {
    if (searchQuery === '') return []
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

      // brands filter
      query += `&models.desc=ilike.${searchQuery}*`

      // Campos a seleccionar
      query += '&select=*,brands(*),models(*),styles(*),transmissions(*),displacements(*),fuel(*),years(*),audit(*),users(*),cars_images(images(*))'

      // Petición con paginación
      const request = await fetch(query, {
        method: 'GET',
        signal,
        headers: {
          accept: 'application/json',
          Range: `${(page - 1) * 10}-${page * 10 - 1}`,
          'Range-Unit': 'items',
          Prefer: 'count=exact'
        }
      })

      if (!request.ok) return []

      // Obtener total de páginas
      const totalCountData = request.headers.get('content-range')
      const totalPagesFromBack = Math.ceil(Number(totalCountData?.split('/')[1]) / 10)
      setTotalPages(totalPagesFromBack >= totalPages ? totalPagesFromBack : totalPages)

      // Guardar resultados
      data = (await request.json() as Cars[]).filter(car => car.models !== null).concat(data)
      const unique: Cars[] = Array.from(
        new Map(data.map(car => [car.id_cars, car])).values()
      )
      return unique
    } catch (error) {
      console.error('Error cargando autos', error)
      return []
    }
  }

  const fetchSearch = async (signal: AbortSignal): Promise<void> => {
    let data: Cars[]
    data = await fetchFilterBrands(undefined, signal)
    data = await fetchFilterModels(undefined, signal)
    setItems(data)
  }

  const fetchCarById = async (id: number, signal: AbortSignal): Promise<void> => {
    try {
      const response = await fetch(`${CARS_URL}?id_cars=eq.${id}&select=*,brands(*),models(*),styles(*),transmissions(*),displacements(*),fuel(*),years(*),audit(*),users(*),cars_images(images(*))`, {
        method: 'GET',
        signal,
        headers: {
          accept: 'application/json'
        }
      })
      if (!response.ok) return
      const data = (await response.json() as Cars[])
      setTotalPages(1)
      setItems(data)
    } catch (error) {
      console.error('Error cargando auto por ID', error)
    }
  }

  const cancelPreviousRequest = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    abortControllerRef.current = new AbortController()
    return abortControllerRef.current.signal
  }

  // Provide the context values to children components
  useEffect(() => {
    const signal = cancelPreviousRequest()

    const exec = async (): Promise<void> => {
      if (carSelectedById !== 0) {
        await fetchCarById(carSelectedById, signal)
      } else if (searchQuery !== '') {
        await fetchSearch(signal)
      } else {
        await fetchData(signal)
      }
    }

    void exec()

    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [page, searchQuery, carSelectedById])

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
          setOpenSheet,
          carSelectedById,
          setCarSelectedById
        }
      }
    >
      {children}
    </HomeContext.Provider>
  )
}

export { HomeProvider }
