import { useEffect, useState } from 'react'
import { HomeContext } from './HomeContext'
import { BRANDS_URL, CARS_URL, DISPLACEMENT_URL, FUEL_URL, MODELS_URL, STYLES_URL, TRANSMISSIONS_URL, YEARS_URL } from '../../common/common'
import type { Brands, Cars, Displacements, Fuel, Models, Styles, Transmissions, Years } from '../../models/car'
import { getLoggedUserId } from '../../utils/GetUserUtils'
import type { catalog } from '../../models/catalog'
import type { Prices } from '../../models/Prices'
import type { Dors } from '../../models/dors'
import type { filter } from '../../models/filter'

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
  const [aux, setAux] = useState<boolean>(false)
  const [catalog, setCatalog] = useState<catalog>()
  const [filters, setFilters] = useState<filter>()

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

  const fetchDataWithQuery = async (): Promise<void> => {
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

      if (filters?.brand !== undefined) {
        query += `&id_brands=eq.${filters.brand}`
      }
      if (filters?.model !== undefined) {
        query += `&id_models=eq.${filters.model}`
      }
      if (filters?.style !== undefined) {
        query += `&id_styles=eq.${filters.style}`
      }
      if (filters?.colorExt !== undefined) {
        query += `&color_ext=ilike.*${filters.colorExt}*`
      }
      if (filters?.colorInter !== undefined) {
        query += `&color_int=ilike.*${filters.colorInter}*`
      }
      if (filters?.yearFrom !== undefined) {
        query += `&id_years=gte.${filters.yearFrom}`
      }
      if (filters?.yearTo !== undefined) {
        query += `&id_years=lte.${filters.yearTo}`
      }
      if (filters?.priceFrom !== undefined) {
        query += `&price=gte.${filters.priceFrom}`
      }
      if (filters?.priceTo !== undefined) {
        query += `&price=lte.${filters.priceTo}`
      }
      if (filters?.dors !== undefined) {
        query += `&dors=eq.${filters.dors}`
      }
      if (filters?.fuel !== undefined) {
        query += `&id_fuel=eq.${filters.fuel}`
      }
      if (filters?.orderByPrice !== undefined) {
        query += '&order=price.asc'
      }
      if (filters?.orderByYear !== undefined) {
        query += '&order=id_years.asc'
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

  // filter brands
  const fetchFilterBrands = async (data: Cars[] = []): Promise<Cars[]> => {
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
  const fetchFilterModels = async (data: Cars[] = []): Promise<Cars[]> => {
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

  const fetchSearch = async (): Promise<void> => {
    let data: Cars[]
    data = await fetchFilterBrands()
    data = await fetchFilterModels(data)
    setItems(data)
  }

  const fetchCarById = async (id: number): Promise<void> => {
    try {
      const response = await fetch(`${CARS_URL}?id_cars=eq.${id}&select=*,brands(*),models(*),styles(*),transmissions(*),displacements(*),fuel(*),years(*),audit(*),users(*),cars_images(images(*))`, {
        method: 'GET',
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

  useEffect(() => {
    let mounted = true

    const load = async (): Promise<void> => {
      try {
        const urls = [
            `${BRANDS_URL}?order=desc.asc`,
            `${MODELS_URL}?order=desc.asc`,
             `${STYLES_URL}?order=desc.asc`,
             `${YEARS_URL}?order=desc.asc`,
             `${CARS_URL}?select=price&order=price.asc`,
             `${DISPLACEMENT_URL}?order=desc.asc`,
             TRANSMISSIONS_URL,
            `${FUEL_URL}?order=desc.asc`,
            `${CARS_URL}?select=number_of_doors&order=number_of_doors.asc`
        ]

        const responses = await Promise.all(urls.map(async url => await fetch(url)))
        const data = await Promise.all(responses.map(async r => await r.json()))
        const brands = data[0] as Brands[]
        const models = data[1] as Models[]
        const styles = data[2] as Styles[]
        const years = data[3] as Years[]
        const prices = data[4] as Prices[]
        const displacements = data[5] as Displacements[]
        const transmissions = data[6] as Transmissions[]
        const fuel = data[7] as Fuel[]
        const dors = data[8] as Dors[]
        if (mounted) {
          setCatalog(
            {
              brands,
              models,
              styles,
              years,
              prices,
              displacements,
              transmissions,
              fuel,
              dors
            }
          )
        }
      } catch (err) {
        console.error('Error cargando catálogos:', err)
      }
    }

    void load()
    return () => { mounted = false }
  }, [])

  // Provide the context values to children components
  useEffect(() => {
    const exec = async (): Promise<void> => {
      if (searchQuery === '' && carSelectedById === 0) {
        setAux(true)
        await fetchData()
        setAux(false)
      }
      if (searchQuery !== '' && carSelectedById === 0) {
        setAux(true)
        await fetchSearch()
        setAux(false)
      }
      if (carSelectedById !== 0) {
        setAux(true)
        await fetchCarById(carSelectedById)
        setAux(false)
      }
    }
    void exec()
  }, [page, searchQuery, carSelectedById, aux])

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
          setCarSelectedById,
          catalog,
          filters,
          setFilters
        }
      }
    >
      {children}
    </HomeContext.Provider>
  )
}

export { HomeProvider }
