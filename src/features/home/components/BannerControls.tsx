import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { BannerSlide, HomeCopy } from '../model/home.types';

export function BannerControls({
  slides,
  activeIndex,
  c,
  onPrev,
  onNext,
  onSelect,
}: {
  slides: BannerSlide[];
  activeIndex: number;
  c: HomeCopy;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}) {
  if (slides.length <= 1) return null;

  return (
    <div
      className="home2-slider2__controls"
      role="group"
      aria-label={c.carousel.controlsLabel}
    >
      <button
        type="button"
        className="home2-slider2__arrow home2-press"
        onClick={onPrev}
        aria-label={c.carousel.prev}
      >
        <ChevronLeft size={18} aria-hidden="true" />
      </button>
      <div className="home2-slider2__dots">
        {slides.map((slide, i) => (
          <button
            type="button"
            key={slide.id}
            className="home2-slider2__dot"
            aria-current={i === activeIndex ? 'true' : undefined}
            aria-label={c.carousel.goTo(i + 1)}
            onClick={() => onSelect(i)}
          >
            <span aria-hidden="true" />
          </button>
        ))}
      </div>
      <button
        type="button"
        className="home2-slider2__arrow home2-press"
        onClick={onNext}
        aria-label={c.carousel.next}
      >
        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
}
