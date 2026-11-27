import { SLIDER2_TIMING } from '../model/home.manifest';
import type { BannerSlide } from '../model/home.types';

export function resolveNextSlideIndex(currentIndex: number, total: number): number {
  if (total <= 1) return 0;
  return (currentIndex + 1) % total;
}

export function resolvePreviousSlideIndex(currentIndex: number, total: number): number {
  if (total <= 1) return 0;
  return (currentIndex - 1 + total) % total;
}

export function reconcileActiveBannerIndex(
  slides: readonly BannerSlide[],
  preferredBannerId: string | null,
  fallbackIndex: number
): number {
  if (slides.length === 0) return 0;
  if (preferredBannerId) {
    const matchedIndex = slides.findIndex((slide) => slide.id === preferredBannerId);
    if (matchedIndex !== -1) {
      return matchedIndex;
    }
  }
  return Math.min(Math.max(fallbackIndex, 0), slides.length - 1);
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
