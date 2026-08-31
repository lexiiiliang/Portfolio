"use client";

import { Children, useState } from "react";

export function Carousel({ children }: { children?: React.ReactNode }) {
  const slides = Children.toArray(children).filter(Boolean);
  const [index, setIndex] = useState(0);

  if (!slides.length) return null;

  const go = (next: number) => setIndex((next + slides.length) % slides.length);

  return (
    <div className="carousel">
      <div className="carousel-viewport">
        <div className="carousel-track" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, slideIndex) => (
            <div className="carousel-slide" key={slideIndex}>{slide}</div>
          ))}
        </div>
      </div>
      {slides.length > 1 ? (
        <div className="carousel-controls">
          <button type="button" className="carousel-arrow" onClick={() => go(index - 1)} aria-label="Previous slide">‹</button>
          <div className="carousel-dots">
            {slides.map((_, dotIndex) => (
              <button
                key={dotIndex}
                type="button"
                className={`carousel-dot ${dotIndex === index ? "is-active" : ""}`}
                onClick={() => go(dotIndex)}
                aria-label={`Go to slide ${dotIndex + 1}`}
              />
            ))}
          </div>
          <button type="button" className="carousel-arrow" onClick={() => go(index + 1)} aria-label="Next slide">›</button>
        </div>
      ) : null}
    </div>
  );
}
