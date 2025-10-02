import React from 'react'

interface CardProps {
  image: string
  info: string
}

const Card: React.FC<CardProps> = (data: CardProps) => {
  return (
    <>
      <div className='container-card size-card'>
        <div className='image size-card'>
          <img src={data.image} alt='' />
        </div>
        <p className='info size-card'>
          {data.info}
        </p>
      </div>
    </>
  )
}

export { Card }
