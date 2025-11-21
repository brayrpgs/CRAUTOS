import { useContext, useEffect, useRef, useState } from 'react'
import { HomeContext } from './HomeContext'
import styles from '../../styles/home/styles.module.css'
import stylePagination from '../../styles/pagination/styles.module.css'
import { Card } from '../card/Card'
import { Modal } from '../modal/Modal'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'
import { ModalHeader } from '../modal/ModalHeader'
import { CarTechnicalSheet } from '../CarTechnicalSheet/CarTechnicalSheet'
import { TransmissionEnum } from '../../enums/TransmissionEnum'

const HomeWrapper: React.FC = () => {
  const ctx = useContext(HomeContext)
  const [pageModal, setPageModal] = useState(1)
  const [yearFrom, setYearFrom] = useState<number>(0)
  const [yearTo, setYearTo] = useState<number>(0)
  const [priceFrom, setPriceFrom] = useState<number>(0)
  const [priceTo, setPriceTo] = useState<number>(0)

  /// referencias del los filtros avanzados
  const brandRef = useRef<HTMLSelectElement>(null)
  const modelRef = useRef<HTMLSelectElement>(null)
  const styleRef = useRef<HTMLSelectElement>(null)
  const colorExtRef = useRef<HTMLInputElement>(null)
  const colorInterRef = useRef<HTMLInputElement>(null)
  const yearFromRef = useRef<HTMLInputElement>(null)
  const yearToRef = useRef<HTMLInputElement>(null)
  const priceFromRef = useRef<HTMLInputElement>(null)
  const priceToRef = useRef<HTMLInputElement>(null)
  const displacementsRef = useRef<HTMLSelectElement>(null)
  const transmissionsRef = useRef<HTMLSelectElement>(null)
  const fuelRef = useRef<HTMLSelectElement>(null)
  const dorsRef = useRef<HTMLInputElement>(null)
  const orderByPriceRef = useRef<HTMLInputElement>(null)
  const orderByYearRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = Number(params.get('car'))
    if (!isNaN(idParam) && idParam >= 0) {
      ctx?.setCarSelectedById?.(idParam)
    }
  }, [ctx?.setCarSelectedById])

  useEffect(() => {
  }, [ctx?.stateModal])

  // initialize range state values from catalog bounds (catalog arrays are already ordered)
  useEffect(() => {
    const years = ctx?.catalog?.years ?? []
    if (Array.isArray(years) && years.length > 0) {
      const minY = parseInt(String(years[0].desc)) || 0
      const maxY = parseInt(String(years[years.length - 1].desc)) || minY
      setYearFrom(minY)
      setYearTo(maxY)
    }

    const prices = ctx?.catalog?.prices ?? []
    if (Array.isArray(prices) && prices.length > 0) {
      const minP = prices[0].price ?? 0
      const maxP = prices[prices.length - 1].price ?? minP
      setPriceFrom(minP)
      setPriceTo(maxP)
    }
  }, [ctx?.catalog])

  // compute min/max locally without mutating catalog arrays (avoid using .reverse())
  const minYear = (() => {
    const y = ctx?.catalog?.years
    return Array.isArray(y) && y.length > 0 ? parseInt(String(y[0].desc)) : 0
  })()
  const maxYear = (() => {
    const y = ctx?.catalog?.years
    return Array.isArray(y) && y.length > 0 ? parseInt(String(y[y.length - 1].desc)) : 0
  })()
  const minPrice = (() => {
    const p = ctx?.catalog?.prices
    return Array.isArray(p) && p.length > 0 ? p[0].price : 0
  })()
  const maxPrice = (() => {
    const p = ctx?.catalog?.prices
    return Array.isArray(p) && p.length > 0 ? p[p.length - 1].price : 0
  })()

  const percentPos = (value: number, min: number, max: number): number => {
    const range = max - min
    const safeRange = Number.isFinite(range) && range !== 0 ? range : 1
    return ((value - min) / safeRange) * 100
  }
  return (
    <div className={styles.container}>
      <div className={`${styles.child} ${styles.childFilters}`}>
        <Modal open={ctx?.stateModal} id='modalFilters' setOpen={ctx?.setStateModal}>
          <ModalHeader>Filtros Avanzados de Busqueda</ModalHeader>
          <ModalContent>
            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='brand'>Marca:</label>
              <select id='brand' defaultValue={0} className='glass' popover='auto' ref={brandRef}>
                <option value={0}>-seleccione una marca-</option>
                {(ctx?.catalog?.brands ?? []).map(brand =>
                  <option value={brand.id_brands} key={brand.id_brands}>{brand.desc}</option>
                )}
              </select>
            </span>

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='models'>Modelo:</label>
              <select id='models' defaultValue={0} className='glass' ref={modelRef}>
                <option value='0'>-seleccione un modelo-</option>
                {(ctx?.catalog?.models ?? []).map(model =>
                  <option value={model.id_models} key={model.id_models}>{model.desc}</option>
                )}
              </select>
            </span>

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='style'>Estilo:</label>
              <select id='style' defaultValue={0} className='glass' ref={styleRef}>
                <option value='0'>-seleccione un estilo-</option>
                {(ctx?.catalog?.styles ?? []).map(style =>
                  <option value={style.id_styles} key={style.id_styles}>{style.desc}</option>
                )}
              </select>
            </span>

            <span
              style={{
                alignSelf: 'stretch',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBlock: '1rem'
              }} className={pageModal === 1 ? '' : 'hide'}
            >
              <label htmlFor='colorExt'>Color exterior :</label>
              <input style={{ width: '100%' }} className='glass' type='text' name='colorExt' id='colorExt' placeholder='busque su color preferido' ref={colorExtRef} />
            </span>

            <span
              style={{
                alignSelf: 'stretch',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                marginBlock: '1rem'
              }} className={pageModal === 1 ? '' : 'hide'}
            >
              <label htmlFor='colorInter'>Color interior :</label>
              <input style={{ width: '100%' }} className='glass' type='text' name='colorInter' id='colorInter' placeholder='busque su color preferido' ref={colorInterRef} />
            </span>

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 2 ? '' : 'hide'}>
              <label htmlFor='year-from'>Año :</label>
              <div>
                <div className='rangeWrapper'>
                  <input
                    id='year-from'
                    type='range'
                    className='glass range'
                    min={minYear}
                    max={maxYear}
                    value={yearFrom}
                    step={1}
                    onChange={e => setYearFrom(Number(e.target.value))}
                    onInput={e => setYearFrom(Number((e.target as HTMLInputElement).value))}
                    ref={yearFromRef}
                  />
                  {/* tooltip positioned according to value percent */}
                  <div
                    className='rangeTooltip'
                    style={{ left: `${percentPos(yearFrom, minYear, maxYear)}%` }}
                  >
                    {yearFrom}
                  </div>
                </div>

                <div className='rangeWrapper'>
                  <input
                    id='year-to'
                    type='range'
                    className='glass range'
                    min={minYear}
                    max={maxYear}
                    value={yearTo}
                    onChange={e => setYearTo(Number(e.target.value))}
                    onInput={e => setYearTo(Number((e.target as HTMLInputElement).value))}
                    ref={yearToRef}
                  />
                  <div
                    className='rangeTooltip'
                    style={{ left: `${percentPos(yearTo, minYear, maxYear)}%` }}
                  >
                    {yearTo}
                  </div>
                </div>
              </div>
            </span>
            <span style={{ alignSelf: 'stretch' }} className={pageModal === 2 ? '' : 'hide'}>
              <label htmlFor='price-from'>Precio :</label>
              <div>
                <div className='rangeWrapper'>
                  <input
                    id='price-from'
                    type='range'
                    className='glass range'
                    min={minPrice}
                    max={maxPrice}
                    value={priceFrom}
                    step={250000}
                    onChange={e => setPriceFrom(Number(e.target.value))}
                    onInput={e => setPriceFrom(Number((e.target as HTMLInputElement).value))}
                    ref={priceFromRef}
                  />
                  <div
                    className='rangeTooltip'
                    style={{ left: `${percentPos(priceFrom, minPrice, maxPrice)}%` }}
                  >
                    {priceFrom.toLocaleString('CR-cr')}
                  </div>
                </div>

                <div className='rangeWrapper'>
                  <input
                    id='price-to'
                    type='range'
                    className='glass range'
                    min={minPrice}
                    max={maxPrice}
                    value={priceTo}
                    step={250000}
                    onChange={e => setPriceTo(Number(e.target.value))}
                    onInput={e => setPriceTo(Number((e.target as HTMLInputElement).value))}
                    ref={priceToRef}
                  />
                  <div
                    className='rangeTooltip'
                    style={{ left: `${percentPos(priceTo, minPrice, maxPrice)}%` }}
                  >
                    {priceTo.toLocaleString('CR-cr')}
                  </div>
                </div>
              </div>
            </span>
            <span style={{ alignSelf: 'stretch' }} className={pageModal === 2 ? '' : 'hide'}>
              <label htmlFor='displacements'>Cilindraje :</label>
              <select id='displacements' defaultValue={0} className='glass' ref={displacementsRef}>
                <option value='0'>-seleccione un cilindraje-</option>
                {(ctx?.catalog?.displacements ?? []).map(displasments =>
                  <option value={displasments.id_displacements} key={displasments.id_displacements}>{displasments.desc}</option>
                )}
              </select>
            </span>
            <span style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <label htmlFor='transmissions'>Transmisión :</label>
              <select id='transmissions' defaultValue={0} className='glass' ref={transmissionsRef}>
                <option value='0'>-seleccione un transmisión-</option>
                {(ctx?.catalog?.transmissions ?? []).map(transmissions =>
                  <option value={transmissions.id_transmissions} key={transmissions.id_transmissions}>{TransmissionEnum[transmissions.desc]}</option>
                )}
              </select>
            </span>
            <span style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <label htmlFor='fuel'>Combustible :</label>
              <select id='fuel' defaultValue={0} className='glass' ref={fuelRef}>
                <option value='0'>-seleccione un tipo de combustible-</option>
                {(ctx?.catalog?.fuel ?? []).map(fuel =>
                  <option value={fuel.id_fuel} key={fuel.id_fuel}>{fuel.desc}</option>
                )}
              </select>
            </span>
            <span style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <label htmlFor='dors'>Cantidad de puertas :</label>
              <input style={{ width: '100%' }} className='glass' type='number' name='fuel' id='dors' placeholder='' ref={dorsRef} />
            </span>
            <fieldset style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <legend>Ordernar por :</legend>
              <div className='radioOptions'>
                <input type='radio' id='orderByPrice' name='test' className='glass' ref={orderByPriceRef} />
                <label htmlFor='orderByPrice'>precio</label>
              </div>
              <div className='radioOptions'>
                <input type='radio' id='orderByYear' name='test' className='glass' ref={orderByYearRef} />
                <label htmlFor='orderByYear'>año</label>
              </div>
            </fieldset>
            <span style={{
              alignSelf: 'stretch',
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              columnGap: '1rem',
              marginBlock: '.5rem'
            }}
            >
              <button
                style={{ display: 'block', flex: '1' }}
                className={pageModal === 2 || pageModal === 3 ? 'glass' : 'hide'}
                onClick={(e) => { setPageModal(pageModal - 1) }}
              >
                atras
              </button>
              <button
                style={{ display: 'block', flex: '1' }}
                className={pageModal === 1 || pageModal === 2 ? 'glass' : 'hide'}
                onClick={(e) => { setPageModal(pageModal + 1) }}
              >
                siguiente
              </button>
            </span>
          </ModalContent>
          <ModalFooter>
            <button
              className='glass'
              onClick={(e) => {
                ctx?.setFilters?.(
                  {
                    brand: brandRef.current?.value,
                    model: modelRef.current?.value,
                    style: styleRef.current?.value,
                    colorExt: colorExtRef.current?.value,
                    colorInter: colorInterRef.current?.value,
                    yearFrom: yearFromRef.current?.value,
                    yearTo: yearToRef.current?.value,
                    priceFrom: priceFromRef.current?.value,
                    priceTo: priceToRef.current?.value,
                    dors: dorsRef.current?.value,
                    fuel: fuelRef.current?.value,
                    orderByPrice: orderByPriceRef.current?.checked,
                    orderByYear: orderByYearRef.current?.checked
                  }
                )
              }}
            >
              Realizar filtro
            </button>
          </ModalFooter>
        </Modal>
        <button className='glass' onClick={() => ctx?.setStateModal?.(prev => !prev)}>Filtros</button>
        <input
          type='search'
          placeholder='busquedas'
          className={`glass ${styles.searchBar}`}
          value={ctx?.searchQuery ?? ''}
          onChange={e => ctx?.setSearchQuery?.(e.target.value)}
        />
      </div>
      <div className={`${styles.child} ${styles.childContent}`}>
        {(ctx?.items ?? []).map(car => (
          <Card
            image={car.cars_images[0].images.image}
            info={`${car.brands.desc}-${car.models.desc}-$${car.price}`}
            key={car.id_cars}
            onClick={
              (e) => {
                ctx?.setCarSelected?.(car)
                ctx?.setOpenSheet?.(true)
              }
          }
          />
        ))}
      </div>
      <div className={`${stylePagination.controls} ${styles.fixPagination}`}>
        <button disabled={!!(ctx?.page !== undefined && ctx.page <= 1)} className={stylePagination.btn} onClick={(e) => ctx?.setPage(ctx.page - 1)}>←</button>
        <span className={stylePagination.pageInfo}>
          Página {ctx?.page} de {ctx?.totalPages}
        </span>
        <button disabled={ctx?.page !== undefined && ctx.page >= (ctx.totalPages as number)} className={stylePagination.btn} onClick={(e) => ctx?.setPage(ctx.page + 1)}>→</button>
      </div>
      <CarTechnicalSheet />
    </div>
  )
}

export { HomeWrapper }
