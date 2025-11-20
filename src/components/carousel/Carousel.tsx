import React, { useState, useEffect, useRef } from 'react'
import { Card } from '../card/Card'
import '../../styles/carousel/styles.css'

interface CarouselProps {
  images?: string[]
  cards?: Array<{
    id: number
    image?: string
    info: string
  }> // Array of cards with image URLs and info
  autoPlay?: boolean // Whether the carousel should advance automatically
  interval?: number // Time interval (ms) between autoPlay slides
}

const Carousel: React.FC<CarouselProps> = ({
  images = [],
  cards = [],
  autoPlay = false,
  interval = 2000
}) => {
  // Current index of the carousel (first visible card)
  const [current, setCurrent] = useState(0)
  const [cardWidth, setCardWidth] = useState(0)
  const [gap, setGap] = useState(0)
  const [containerWidth, setContainerWidth] = useState(0)
  const trackRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Determine total items and type of content
  const hasImages = images.length > 0
  const hasCards = cards.length > 0
  const totalItems = hasImages ? images.length : hasCards ? cards.length : 0

  // Calculate real width of card + gap
  const itemWidth = cardWidth + gap
  // How many cards fit exactly
  const visibleCount = itemWidth > 0 ? Math.floor(containerWidth / itemWidth) : 1
  const maxIndex = Math.max(0, totalItems - visibleCount)

  // Update sizes (card + gap + container) for responsive and carousel design
  useEffect(() => {
    const updateSizes = () => {
      if (!containerRef.current || !trackRef.current) return
      const container = containerRef.current
      const track = trackRef.current
      const firstItem = track.children[0] as HTMLElement
      if (!firstItem) return

      const containerW = container.offsetWidth
      const computedStyle = window.getComputedStyle(track)
      const gapValue = parseFloat(computedStyle.gap) || 0
      const itemWidth = firstItem.offsetWidth

      setContainerWidth(containerW)
      setCardWidth(itemWidth)
      setGap(gapValue)
    }

    updateSizes()
    const resizeObserver = new ResizeObserver(updateSizes)
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current)
    }
    window.addEventListener('resize', updateSizes)

    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateSizes)
    }
  }, [hasImages ? images : cards]) // Re-run when content changes

  // Adjust current index if visibleCount changes
  useEffect(() => {
    if (current > maxIndex) {
      setCurrent(maxIndex)
    }
  }, [current, maxIndex, visibleCount])

  // Move to the next card (wraps around)
  const next = () => {
    setCurrent(prev => (prev >= maxIndex ? 0 : prev + 1))
  }

  // Move to the previous card (wraps around)
  const prev = () => {
    setCurrent(prev => (prev <= 0 ? maxIndex : prev - 1))
  }

  // Auto-play effect
  useEffect(() => {
    if (!autoPlay || totalItems === 0) return // Exit if autoPlay is disabled

    // Set up interval to automatically go to the next slide
    const timer = setInterval(() => {
      next()
    }, interval)

    return () => clearInterval(timer)
  }, [current, autoPlay, interval, totalItems]) // Re-run effect if these dependencies change

  // Render message if no content is provided
  if (totalItems === 0) return <p>No hay autos nuevos para mostrarte</p>

  // Move horizontally on carousel
  const translateX = -(current * itemWidth)

  return (
    <div className='carousel-container' ref={containerRef}>
      <div className='carousel-wrapper'>
        <div
          ref={trackRef}
          className='carousel-track'
          style={{
            transform: `translateX(${translateX}px)`,
            transition: 'transform 0.5s ease-in-out'
          }}
        >
          {/* Render images if provided */}
          {hasImages &&
            images.map((src, index) => (
              <div
                key={`img-${index}`}
                className='carousel-card-wrapper'
                onClick={() => {
                  // TODO: Handle image click (e.g. open lightbox)
                  alert(`Image clicked: ${src}`)
                }}
              >
                <img
                  src={src}
                  alt={`Slide ${index + 1}`}
                  className="carousel-image"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
            ))}

          {/* Render cards if provided */}
          {hasCards &&
            cards.map(card => (
              <div
                key={card.id}
                className='carousel-card-wrapper'
                onClick={() => {
                  window.location.href=`/home?idSelected=${card.id}`
                }}
              >
                <Card image={card.image} info={card.info} />
              </div>
            ))}
        </div>
      </div>

      {/* Navigation buttons */}
      {totalItems > visibleCount && (
        <div className='carousel-buttons'>
          <button onClick={prev} aria-label='Previous'>
            ‹
          </button>
          <button onClick={next} aria-label='Next'>
            ›
          </button>
        </div>
      )}
    </div>
  )
}

export default Carousel