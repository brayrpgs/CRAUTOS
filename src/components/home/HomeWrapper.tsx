import { useContext, useEffect, useState } from 'react'
import { HomeContext } from './HomeContext'
import styles from '../../styles/home/styles.module.css'
import stylePagination from '../../styles/pagination/styles.module.css'
import { Card } from '../card/Card'
import { Modal } from '../modal/Modal'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'
import { ModalHeader } from '../modal/ModalHeader'
import { CarTechnicalSheet } from '../CarTechnicalSheet/CarTechnicalSheet'

const HomeWrapper: React.FC = () => {
  const ctx = useContext(HomeContext)
  const [pageModal, setPageModal] = useState(1)
  const MIN_YEAR = 1990
  const MAX_YEAR = 2025
  const [yearFrom, setYearFrom] = useState<number>(2005)
  const [yearTo, setYearTo] = useState<number>(2018)
  const [idSelected, setIdSelected] = useState(0)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const idParam = Number(params.get('idSelected'))
    if (!isNaN(idParam) && idParam >= 0) {
      setIdSelected(idParam)
    }
  }, [])

  useEffect(() => {
  }, [ctx?.stateModal])
  return (
    <div className={styles.container}>
      <div className={`${styles.child} ${styles.childFilters}`}>
        <Modal open={ctx?.stateModal} id='modalFilters' setOpen={ctx?.setStateModal}>
          <ModalHeader>Filtros Avanzados de Busqueda</ModalHeader>
          <ModalContent>
            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='test'>Marca:</label>
              <select id='test' defaultValue={0} className='glass' popover='auto'>
                <option value='0'>option1</option>
                <option value='1'>option2</option>
              </select>
            </span>

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='test'>Modelo:</label>
              <select id='test' defaultValue={0} className='glass'>
                <option value='0'>option1</option>
              </select>
            </span>

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='test'>Estilo:</label>
              <select id='test' defaultValue={0} className='glass'>
                <option value='0'>option1</option>
              </select>
            </span>

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='test'>Color exterior :</label>
              <select id='test' defaultValue={0} className='glass'>
                <option value='0'>option1</option>
              </select>
            </span>

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 1 ? '' : 'hide'}>
              <label htmlFor='test'>Color interior :</label>
              <select id='test' defaultValue={0} className='glass'>
                <option value='0'>option1</option>
              </select>
            </span>
            {/* first options in modal */}

            <span style={{ alignSelf: 'stretch' }} className={pageModal === 2 ? '' : 'hide'}>
              <label htmlFor='test'>Año :</label>
              <div>
                <div className={styles.rangeWrapper}>
                  <input
                    id='year-from'
                    type='range'
                    className='glass range'
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={yearFrom}
                    onChange={e => setYearFrom(Number(e.target.value))}
                    onInput={e => setYearFrom(Number((e.target as HTMLInputElement).value))}
                  />
                  {/* tooltip positioned according to value percent */}
                  <div
                    className='rangeTooltip'
                    style={{ left: `${((yearFrom - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
                  >
                    {yearFrom}
                  </div>
                </div>

                <div className='rangeWrapper'>
                  <input
                    id='year-to'
                    type='range'
                    className='glass range'
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={yearTo}
                    onChange={e => setYearTo(Number(e.target.value))}
                    onInput={e => setYearTo(Number((e.target as HTMLInputElement).value))}
                  />
                  <div
                    className='rangeTooltip'
                    style={{ left: `${((yearTo - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
                  >
                    {yearTo}
                  </div>
                </div>
              </div>
            </span>
            <span style={{ alignSelf: 'stretch' }} className={pageModal === 2 ? '' : 'hide'}>
              <label htmlFor='test'>Precio :</label>
              <div>
                <div className='rangeWrapper'>
                  <input
                    id='year-from'
                    type='range'
                    className='glass range'
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={yearFrom}
                    onChange={e => setYearFrom(Number(e.target.value))}
                    onInput={e => setYearFrom(Number((e.target as HTMLInputElement).value))}
                  />
                  {/* tooltip positioned according to value percent */}
                  <div
                    className='rangeTooltip'
                    style={{ left: `${((yearFrom - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
                  >
                    {yearFrom}
                  </div>
                </div>

                <div className='rangeWrapper'>
                  <input
                    id='year-to'
                    type='range'
                    className='glass range'
                    min={MIN_YEAR}
                    max={MAX_YEAR}
                    value={yearTo}
                    onChange={e => setYearTo(Number(e.target.value))}
                    onInput={e => setYearTo(Number((e.target as HTMLInputElement).value))}
                  />
                  <div
                    className='rangeTooltip'
                    style={{ left: `${((yearTo - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * 100}%` }}
                  >
                    {yearTo}
                  </div>
                </div>
              </div>
            </span>
            <span style={{ alignSelf: 'stretch' }} className={pageModal === 2 ? '' : 'hide'}>
              <label htmlFor='test'>Cilindraje :</label>
              <input type='number' className='glass' min={1} />
            </span>
            {/** second page */}
            <fieldset style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <legend>Transmisión :</legend>
              <div className='radioOptions'>
                <input type='radio' id='1' name='test' className='glass' value='test' />
                <label htmlFor='1'>dato 1</label>
              </div>
              <div className='radioOptions'>
                <input type='radio' id='2' name='test' className='glass' value='test' />
                <label htmlFor='2'>dato 2</label>
              </div>
            </fieldset>
            <fieldset style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <legend>Combustible :</legend>
              <div className='radioOptions'>
                <input type='radio' id='1' name='test' className='glass' value='test' />
                <label htmlFor='1'>dato 1</label>
              </div>
              <div className='radioOptions'>
                <input type='radio' id='2' name='test' className='glass' value='test' />
                <label htmlFor='2'>dato 2</label>
              </div>
            </fieldset>
            <fieldset style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <legend>Cantidad de Puertas :</legend>
              <div className='radioOptions'>
                <input type='radio' id='1' name='test' className='glass' value='test' />
                <label htmlFor='1'>dato 1</label>
              </div>
              <div className='radioOptions'>
                <input type='radio' id='2' name='test' className='glass' value='test' />
                <label htmlFor='2'>dato 2</label>
              </div>
            </fieldset>
            <fieldset style={{ alignSelf: 'stretch', borderRadius: '1rem' }} className={pageModal === 3 ? '' : 'hide'}>
              <legend>Ordernar por :</legend>
              <div className='radioOptions'>
                <input type='radio' id='1' name='test' className='glass' value='test' />
                <label htmlFor='1'>precio</label>
              </div>
              <div className='radioOptions'>
                <input type='radio' id='2' name='test' className='glass' value='test' />
                <label htmlFor='2'>año</label>
              </div>
            </fieldset>
            {/** button navegation in modal */}
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
            <button className='glass'>Realizar filtro</button>
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
        {ctx?.items.map(car => (
          <Card
            image={car.cars_images[0].images.image}
            info={`${car.brands.desc}-${car.styles.desc}-$${car.price}`}
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
