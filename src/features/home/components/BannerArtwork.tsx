import React, { useEffect, useState } from 'react';
import { findCategoryFallbackImage } from '../model/home.slides';
import type { BannerSlide } from '../model/home.types';

export function BannerArtwork({
  slide,
  visible,
  preload,
  onVisibleReady,
  mobileMaxWidth = 959,
}: {
  slide: BannerSlide;
  visible: boolean;
  preload: boolean;
  onVisibleReady: () => void;
  mobileMaxWidth?: number;
}) {
  const [imageFailed, setImageFailed] = useState(false);
  const [bundledFallback, setBundledFallback] = useState<string | null>(null);
  const [requested, setRequested] = useState(visible || preload);
  const shouldRequest = requested || visible || preload;

  useEffect(() => {
    if (visible || preload) setRequested(true);
  }, [visible, preload]);

  useEffect(() => {
    if (!imageFailed) return;
    let active = true;
    void import('../model/home.assets')
      .then((m) => {
        if (active) setBundledFallback(m.resolveBundledHeroAsset(slide.serviceCode));
      })
      .catch(() => {
        // Keep public path fallback
      });
    const retry = () => setImageFailed(false);
    window.addEventListener('online', retry);
    window.addEventListener('focus', retry);
    return () => {
      active = false;
      window.removeEventListener('online', retry);
      window.removeEventListener('focus', retry);
    };
  }, [imageFailed, slide.serviceCode]);

  const fallbackImage = bundledFallback ?? findCategoryFallbackImage(slide.serviceCode);
  const resolvedImage = imageFailed ? fallbackImage : slide.image;

  return (
    <picture className="public-hero-carousel__image-layer" data-visible={visible}>
      {!imageFailed && slide.mobileImage && (
        <source
          media={`(max-width: ${mobileMaxWidth}px)`}
          srcSet={shouldRequest ? slide.mobileImage : undefined}
        />
      )}
      <img
        className="public-information-hero__image public-hero-carousel__service-image"
        src={shouldRequest ? resolvedImage : undefined}
        data-deferred-src={resolvedImage}
        alt=""
        decoding="async"
        loading={visible || preload ? 'eager' : 'lazy'}
        fetchPriority={visible ? 'high' : 'low'}
        onLoad={() => {
          if (visible) onVisibleReady();
        }}
        onError={() => setImageFailed(true)}
      />
    </picture>
  );
}
