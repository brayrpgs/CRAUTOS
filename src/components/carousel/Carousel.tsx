import React, { useState, useEffect } from "react";
import "./Carousel.css";

interface CarouselProps {
    images: string[];           // Array of image URLs
    autoPlay?: boolean;         // Whether the carousel should advance automatically
    interval?: number;          // Time interval (ms) between autoPlay slides
}

const Carousel: React.FC<CarouselProps> = ({ images = [], autoPlay = false, interval = 2000 }) => {
    // Current index of the carousel (first visible slide)
    const [current, setCurrent] = useState(0);

    // Maximum number of slides visible at the same time
    const maxVisible = 3;

    // Move to the next slide (wraps around using modulo)
    const next = () => setCurrent((c) => (c + 1) % images.length);

    // Move to the previous slide (wraps around)
    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

    // Auto-play effect
    useEffect(() => {
        if (!autoPlay) return; // Exit if autoPlay is disabled

        // Set up interval to automatically go to the next slide
        const timer = setInterval(() => {
            next();
        }, interval);

        // Clean up interval on component unmount or dependency change
        return () => clearInterval(timer);
    }, [current, autoPlay, interval]); // Re-run effect if these dependencies change

    // Render message if no images are provided
    if (images.length === 0) return <p>No images to display</p>;

    // Determine which slides are visible
    // Adds 1 to maxVisible to include the current slide
    const visibleSlides = Array.from({ length: Math.min(maxVisible + 1, images.length) }, (_, i) => {
        return (current + i) % images.length; // Wrap around the index using modulo
    });

    return (
        <div className="carousel-container">
            <div className="carousel-stack">
                {visibleSlides.map((i, pos) => {
                    // pos is the position relative to the current slide (0 = front)
                    const offset = pos;

                    // Scale down each subsequent slide for 3D stack effect
                    const scale = 1 - 0.1 * offset;

                    // Translate slides horizontally
                    const translateX = offset * 40;

                    return (
                        <div
                            key={i}
                            className="slide"
                            style={{
                                transform: `translateX(${translateX}%) scale(${scale})`,
                                zIndex: maxVisible - offset, // Ensure front slides appear on top
                                opacity: 1,
                            }}
                        >
                            <img src={images[i]} alt={`Slide ${i}`} />
                        </div>
                    );
                })}
            </div>

            {/* Navigation buttons */}
            <div className="carousel-buttons">
                <button onClick={prev}>‹</button>
                <button onClick={next}>›</button>
            </div>
        </div>
    );
};

export default Carousel;
