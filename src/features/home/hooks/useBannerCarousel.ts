import { useCallback, useEffect, useRef, useState } from 'react';
import type React from 'react';
import { SLIDER2_TIMING } from '../model/home.tokens';
import type { BannerSlide } from '../model/home.types';

export function resolveNextSlideIndex(currentIndex: number, total: number): number {
  if (total <= 1) return 0;
  return (currentIndex + 1) % total;
}

export function resolvePreviousSlideIndex(currentIndex: number, total: number): number {
  if (total <= 1) return 0;
  return (currentIndex - 1 + total) % total;
}

export function evaluateSwipeDirection(
  dx: number,
  dy: number,
  thresholdPx = SLIDER2_TIMING.swipeThresholdPx,
  dominanceRatio = SLIDER2_TIMING.swipeDominanceRatio
): 'next' | 'prev' | null {
  if (Math.abs(dx) > thresholdPx && Math.abs(dx) > Math.abs(dy) * dominanceRatio) {
    return dx < 0 ? 'next' : 'prev';
  }
  return null;
}

export function useBannerCarousel(slides: BannerSlide[], paused: boolean) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [visibleImageReady, setVisibleImageReady] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isSwiping, setIsSwiping] = useState(false);
  const [isDocumentVisible, setIsDocumentVisible] = useState(true);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLElement>(null);
  const pointerStartRef = useRef<{ id: number; x: number; y: number } | null>(null);

  const safeIndex = slides.length > 0 ? Math.min(activeIndex, slides.length - 1) : 0;

  const goNext = useCallback(() => {
    setActiveIndex((index) => resolveNextSlideIndex(index, slides.length));
  }, [slides.length]);

  const goPrevious = useCallback(() => {
    setActiveIndex((index) => resolvePreviousSlideIndex(index, slides.length));
  }, [slides.length]);

  const goTo = useCallback(
    (index: number) => {
      if (index >= 0 && index < slides.length) {
        setActiveIndex(index);
      }
    },
    [slides.length]
  );

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotionChange = (event: MediaQueryListEvent) => setPrefersReducedMotion(event.matches);
    setPrefersReducedMotion(motionPreference.matches);
    motionPreference.addEventListener('change', onMotionChange);
    return () => motionPreference.removeEventListener('change', onMotionChange);
  }, []);

  useEffect(() => {
    const onVisibilityChange = () => setIsDocumentVisible(document.visibilityState === 'visible');
    onVisibilityChange();
    document.addEventListener('visibilitychange', onVisibilityChange);
    return () => document.removeEventListener('visibilitychange', onVisibilityChange);
  }, []);

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
  }, [
    safeIndex,
    slides.length,
    goNext,
    hasFocus,
    isDocumentVisible,
    isHovered,
    isSwiping,
    paused,
    prefersReducedMotion,
  ]);

  const onKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    if (
      target !== carouselRef.current &&
      (target.closest('button, a, input, textarea, select, [role="button"]') || target.isContentEditable)
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
    if (event.pointerType === 'mouse' && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
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
    activeIndex: safeIndex,
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
