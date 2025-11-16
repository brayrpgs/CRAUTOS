import { useContext, useEffect } from 'react'
import { HomeContext } from './HomeContext'
import styles from '../../styles/home/styles.module.css'
import { Card } from '../card/Card'
import { Modal } from '../modal/Modal'
import { ModalContent } from '../modal/ModalContent'
import { ModalFooter } from '../modal/ModalFooter'
import { ModalHeader } from '../modal/ModalHeader'

const HomeWrapper: React.FC = () => {
  const ctx = useContext(HomeContext)
  useEffect(() => {
    console.table(ctx)
  }, [ctx?.stateModal])
  return (
    <div className={styles.container}>
      <div className={`${styles.child} ${styles.childFilters}`}>
        <Modal open={ctx?.stateModal} id='modalFilters' setOpen={ctx?.setStateModal}>
          <ModalHeader>Filtros Avanzados de Busqueda</ModalHeader>
          <ModalContent />
          <ModalFooter />
        </Modal>
        <button onClick={() => ctx?.setStateModal?.(prev => !prev)}>Filters</button>
        <input
          type='search'
          placeholder='busquedas'
          className={styles.searchBar}
          value={ctx?.searchQuery ?? ''}
          onChange={e => ctx?.setSearchQuery?.(e.target.value)}
        />
      </div>
      <div className={`${styles.child} ${styles.childContent}`}>
        <Card image='ram1.avif' info='test' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
        <Card image='ram1.avif' />
      </div>
    </div>
  )
}

export { HomeWrapper }
