import React from 'react';
import { ReceiptText, WalletCards } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import type { BannerLoadStatus, BannerSlide, HomeCopy, HomeLang } from '../model/home.types';

export function BannerContent({
  slides,
  fixedSlide,
  language,
  c,
  bannerStatus,
  onPayTax,
  onOtherTax,
  onRetry,
}: {
  slides: BannerSlide[];
  fixedSlide: BannerSlide;
  language: HomeLang;
  c: HomeCopy;
  bannerStatus: BannerLoadStatus;
  onPayTax: () => void;
  onOtherTax: () => void;
  onRetry: () => void;
}) {
  const bn = language === 'bn';
  const hasSlides = slides.length > 0;
  const heading = bn ? fixedSlide.headingBn : fixedSlide.headingEn;
  const mobileHeading = bn ? fixedSlide.mobileHeadingBn : fixedSlide.mobileHeadingEn;
  const description = bn ? fixedSlide.descriptionBn : fixedSlide.descriptionEn;
  const mobileDescription = bn ? fixedSlide.mobileDescriptionBn : fixedSlide.mobileDescriptionEn;
  const primaryAction = bn ? fixedSlide.actionBn : fixedSlide.actionEn;

  return (
    <div className="home2-slider2__copy" data-testid="home2-hero-copy">
      <div data-testid="home2-primary-slide" className="home2-slider2__content">
        <h1>
          {hasSlides ? (
            <>
              <span className="home2-slider2__desktop-copy">{heading}</span>
              <span className="home2-slider2__mobile-copy">{mobileHeading}</span>
            </>
          ) : (
            c.carousel.unavailableTitle
          )}
        </h1>
        <p role={!hasSlides ? 'status' : undefined}>
          {hasSlides ? (
            <>
              <span className="home2-slider2__desktop-copy">{description}</span>
              <span className="home2-slider2__mobile-copy">{mobileDescription}</span>
            </>
          ) : bannerStatus === 'loading' ? (
            c.carousel.loadingMessage
          ) : (
            c.carousel.unavailableMessage
          )}
        </p>
        <div className="home2-slider2__actions">
          <AppButton
            tone="hero"
            size="large"
            data-testid="home2-pay"
            className="home2-slider2__pay home2-press"
            onClick={onPayTax}
            startIcon={<WalletCards size={18} aria-hidden="true" />}
          >
            {hasSlides ? primaryAction : c.payTax}
          </AppButton>
          <AppButton
            tone="heroSecondary"
            size="large"
            data-testid="home2-other"
            className="home2-slider2__other home2-press"
            onClick={onOtherTax}
            startIcon={<ReceiptText size={18} aria-hidden="true" />}
          >
            {c.otherTax}
          </AppButton>
        </div>
        {!hasSlides && bannerStatus === 'unavailable' && (
          <AppButton
            tone="ghost"
            size="small"
            className="home2-slider2__retry"
            onClick={onRetry}
            sx={{
              mt: 1.5,
              px: 0,
              minHeight: 32,
              color: 'var(--slider2-heading)',
              textDecoration: 'underline',
              bgcolor: 'transparent',
              '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' },
            }}
          >
            {c.carousel.retryLabel}
          </AppButton>
        )}
      </div>
    </div>
  );
}
