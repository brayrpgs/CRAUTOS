import React, { useState } from 'react'
import styles from '../../styles/pagination/styles.module.css'

interface PaginationProps<T> {
  items: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemsPerPage?: number
  className?: string
}

function Pagination<T> ({
  items,
  renderItem,
  itemsPerPage = 10,
  className = ''
}: PaginationProps<T>): React.ReactElement {
  const [page, setPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))
  const start = (page - 1) * itemsPerPage
  const currentItems = items.slice(start, start + itemsPerPage)

  const next = (): void => {
    if (page < totalPages) setPage(p => p + 1)
  }

  const prev = (): void => {
    if (page > 1) setPage(p => p - 1)
  }

  return (
    <div className={`${styles.paginationContainer} ${className}`}>
      <div className={styles.itemsList}>
        {currentItems.map((item, index) => (
          <div key={start + index} className={styles.itemWrapper}>
            {renderItem(item, start + index)}
          </div>
        ))}
      </div>

      {/* Barra de controles */}
      <div className={styles.controls}>
        <button
          onClick={prev}
          disabled={page === 1}
          className={styles.btn}
        >
          ←
        </button>

        <span className={styles.pageInfo}>
          Página {page} de {totalPages}
        </span>

        <button
          onClick={next}
          disabled={page === totalPages}
          className={styles.btn}
        >
          →
        </button>
      </div>
    </div>
  )
}

export { Pagination }
