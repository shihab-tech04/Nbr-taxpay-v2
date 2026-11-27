import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { SLIDER2_TIMING } from '../model/home.manifest';
import type { BannerSlide } from '../model/home.types';
import {
  evaluateSwipeDirection,
  reconcileActiveBannerIndex,
  resolveNextSlideIndex,
  resolvePreviousSlideIndex,
} from './carouselLogic';
import { useDocumentVisibility, usePrefersReducedMotion } from './useCarouselMediaState';

export {
  evaluateSwipeDirection,
  reconcileActiveBannerIndex,
  resolveNextSlideIndex,
  resolvePreviousSlideIndex,
};

interface ActiveBannerCursor {
  bannerId: string | null;
  fallbackIndex: number;
}

export function useBannerCarousel(slides: BannerSlide[], paused: boolean) {
  const [cursor, setCursor] = useState<ActiveBannerCursor>(() => ({
    bannerId: slides[0]?.id ?? null,
    fallbackIndex: 0,
  }));
  const [visibleImageReady, setVisibleImageReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);

  const isDocumentVisible = useDocumentVisibility();
  const prefersReducedMotion = usePrefersReducedMotion();

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLElement>(null);
  const pointerStartRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const activeIndex = reconcileActiveBannerIndex(slides, cursor.bannerId, cursor.fallbackIndex);

  const goNext = useCallback(() => {
    setCursor((prev) => {
      const currentIdx = reconcileActiveBannerIndex(slides, prev.bannerId, prev.fallbackIndex);
      const nextIdx = resolveNextSlideIndex(currentIdx, slides.length);
      return { bannerId: slides[nextIdx]?.id ?? null, fallbackIndex: nextIdx };
    });
  }, [slides]);

  const goPrevious = useCallback(() => {
    setCursor((prev) => {
      const currentIdx = reconcileActiveBannerIndex(slides, prev.bannerId, prev.fallbackIndex);
      const nextIdx = resolvePreviousSlideIndex(currentIdx, slides.length);
      return { bannerId: slides[nextIdx]?.id ?? null, fallbackIndex: nextIdx };
    });
  }, [slides]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setCursor({ bannerId: slides[index]?.id ?? null, fallbackIndex: index });
      }
    },
    [slides]
  );

  useEffect(() => {
    if (
      slides.length <= 1 ||
      paused ||
      prefersReducedMotion ||
      isHovered ||
      hasFocus ||
      isSwiping ||
      !isDocumentVisible
    ) {
      return;
    }
    const timer = window.setTimeout(goNext, SLIDER2_TIMING.autoplayIntervalMs);
    return () => window.clearTimeout(timer);
  }, [activeIndex, slides.length, goNext, hasFocus, isDocumentVisible, isHovered, isSwiping, paused, prefersReducedMotion]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (
      target !== carouselRef.current &&
      (target.closest('button, a, input, textarea, select, [role="button"]') ||
        target.isContentEditable)
    ) {
      return;
    }
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      goPrevious();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      goNext();
    }
  };

  const onPointerEnter = (event: React.PointerEvent) => {
    if (
      event.pointerType === 'mouse' &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches
    ) {
      setIsHovered(true);
    }
  };

  const onPointerLeave = (event: React.PointerEvent) => {
    if (event.pointerType === 'mouse') setIsHovered(false);
  };

  const onFocusCapture = () => setHasFocus(true);

  const onBlurCapture = (event: React.FocusEvent) => {
    if (!containerRef.current?.contains(event.relatedTarget as Node | null)) {
      setHasFocus(false);
    }
  };

  const onSwipeStart = (event: React.PointerEvent<HTMLElement>) => {
    if (!event.isPrimary || (event.pointerType === 'mouse' && event.button !== 0)) return;
    const target = event.target as HTMLElement;
    if (target.closest('button, a, input, textarea, select, [role="button"]')) return;
    pointerStartRef.current = { id: event.pointerId, x: event.clientX, y: event.clientY };
    if (event.nativeEvent.isTrusted) {
      try {
        event.currentTarget.setPointerCapture(event.pointerId);
      } catch {
        // Ignore if pointer capture is unsupported
      }
    }
    setIsSwiping(true);
  };

  const onSwipeEnd = (event: React.PointerEvent<HTMLElement>) => {
    const start = pointerStartRef.current;
    if (start?.id === event.pointerId) {
      const direction = evaluateSwipeDirection(event.clientX - start.x, event.clientY - start.y);
      if (direction === 'next') goNext();
      else if (direction === 'prev') goPrevious();
    }
    pointerStartRef.current = null;
    setIsSwiping(false);
  };

  const cancelSwipe = () => {
    pointerStartRef.current = null;
    setIsSwiping(false);
  };

  return {
    activeIndex,
    visibleImageReady,
    setVisibleImageReady,
    isSwiping,
    containerRef,
    carouselRef,
    goNext,
    goPrevious,
    goTo,
    onKeyDown,
    onPointerEnter,
    onPointerLeave,
    onFocusCapture,
    onBlurCapture,
    onSwipeStart,
    onSwipeEnd,
    cancelSwipe,
  };
}
