import React, { useEffect } from 'react';
import { FALLBACK_SLIDES } from '../model/home.tokens';
import type { HomeAction, HomeCopy, HomeLang } from '../model/home.types';
import { slider2ThemeStyle } from '../services/bannerService';
import { usePublishedBanners } from '../hooks/usePublishedBanners';
import { useBannerCarousel } from '../hooks/useBannerCarousel';
import { BannerArtwork } from './BannerArtwork';
import { BannerContent } from './BannerContent';
import { BannerControls } from './BannerControls';

export function Slider2({
  language,
  c,
  onAction,
  paused = false,
}: {
  language: HomeLang;
  c: HomeCopy;
  onAction: (action: HomeAction) => void;
  paused?: boolean;
}) {
  const { slides, bannerStatus, retryLoad, setActiveBannerId } = usePublishedBanners();
  const carousel = useBannerCarousel(slides, paused);
  const current = slides[carousel.activeIndex];
  const fixedSlide = slides.find((slide) => !slide.serviceCode) ?? FALLBACK_SLIDES[0];

  useEffect(() => {
    setActiveBannerId(current?.id ?? null);
  }, [current?.id, setActiveBannerId]);

  const currentHeading = current
    ? language === 'bn'
      ? current.headingBn
      : current.headingEn
    : c.carousel.unavailableTitle;

  return (
    <div
      className="home2-slider2"
      data-testid="slider2"
      ref={carousel.containerRef}
      onPointerEnter={carousel.onPointerEnter}
      onPointerLeave={carousel.onPointerLeave}
      onFocusCapture={carousel.onFocusCapture}
      onBlurCapture={carousel.onBlurCapture}
    >
      <section
        ref={carousel.carouselRef}
        className="home2-slider2__frame"
        data-testid="home2-desktop-hero"
        role="region"
        aria-roledescription="carousel"
        tabIndex={0}
        aria-label={c.carousel.regionLabel}
        aria-description={c.carousel.regionDescription}
        data-active-slide={carousel.activeIndex}
        data-payment-service={current?.serviceCode}
        data-banner-id={current?.id}
        data-banner-count={slides.length}
        data-paused={paused}
        data-dragging={carousel.isSwiping}
        style={slider2ThemeStyle(current)}
        onKeyDown={carousel.onKeyDown}
        onPointerDown={carousel.onSwipeStart}
        onPointerUp={carousel.onSwipeEnd}
        onPointerCancel={carousel.cancelSwipe}
        onLostPointerCapture={carousel.cancelSwipe}
      >
        <div className="home2-slider2__artwork" aria-hidden="true">
          {slides.map((slide, i) => (
            <div
              key={slide.id}
              className="home2-slider2__layer"
              data-testid="slider2-artwork"
              data-active={i === carousel.activeIndex}
              data-banner-id={slide.id}
              data-payment-service={slide.serviceCode}
              style={slider2ThemeStyle(slide)}
            >
              <BannerArtwork
                key={`${slide.id}:${slide.image}:${slide.mobileImage || ''}`}
                slide={slide}
                visible={i === carousel.activeIndex}
                preload={
                  carousel.visibleImageReady &&
                  slides.length > 1 &&
                  i === (carousel.activeIndex + 1) % slides.length
                }
                mobileMaxWidth={959}
                onVisibleReady={() => carousel.setVisibleImageReady(true)}
              />
            </div>
          ))}
        </div>

        <BannerContent
          slides={slides}
          fixedSlide={fixedSlide}
          language={language}
          c={c}
          bannerStatus={bannerStatus}
          onPayTax={() => onAction('pay')}
          onOtherTax={() => onAction('other')}
          onRetry={retryLoad}
        />
      </section>

      <BannerControls
        slides={slides}
        activeIndex={carousel.activeIndex}
        c={c}
        onPrev={carousel.goPrevious}
        onNext={carousel.goNext}
        onSelect={carousel.goTo}
      />

      {slides.length > 0 && (
        <span className="sr-only" role="status" aria-live="polite">
          {c.carousel.slideAnnouncement(carousel.activeIndex, slides.length, currentHeading)}
        </span>
      )}
    </div>
  );
}
