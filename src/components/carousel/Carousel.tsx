import React, { useState, useEffect } from "react";
import "./Carousel.css";

interface CarouselProps {
    images: string[];
    autoPlay?: boolean;
    interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({ images = [], autoPlay = false, interval = 2000 }) => {
    const [current, setCurrent] = useState(0);
    const maxVisible = 3;

    const next = () => setCurrent((c) => (c + 1) % images.length);
    const prev = () => setCurrent((c) => (c - 1 + images.length) % images.length);

    useEffect(() => {
        if (!autoPlay) return;
        const timer = setInterval(() => {
            next();
        }, interval);
        return () => clearInterval(timer);
    }, [current, autoPlay, interval]);

    if (images.length === 0) return <p>No hay imágenes para mostrar</p>;

    const visibleSlides = Array.from({ length: Math.min(maxVisible + 1, images.length) }, (_, i) => {
        return (current + i) % images.length;
    });

    return (
        <div className="carousel-container">
            <div className="carousel-stack">
                {visibleSlides.map((i, pos) => {
                    const offset = pos;
                    const scale = 1 - 0.1 * offset;
                    const translateX = offset * 40;

                    return (
                        <div
                            key={i}
                            className="slide"
                            style={{
                                transform: `translateX(${translateX}%) scale(${scale})`,
                                zIndex: maxVisible - offset,
                                opacity: 1,
                            }}
                        >
                            <img src={images[i]} alt={`Slide ${i}`} />
                        </div>
                    );
                })}
            </div>

            <div className="carousel-buttons">
                <button onClick={prev}>‹</button>
                <button onClick={next}>›</button>
            </div>
        </div>
    );
};

export default Carousel;
