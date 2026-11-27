import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  HOME_COLORS,
  HOME_LAYOUT,
  SLIDER2_FALLBACK_THEMES,
  buildPublishedBackupSlides,
} from './model/home.tokens';
import {
  fetchPublishedBanners,
  isBannerCmsConfigured,
  slider2ThemeStyle,
  type CmsBannerRow,
} from './services/bannerService';
import {
  BRANDING_402_COOLDOWN_MS,
  BRANDING_ERROR_COOLDOWN_MS,
  brandingReadsAllowed,
  noteBrandingResponse,
  resetBrandingHealthForTest,
} from './services/brandingCmsHealth';
import {
  evaluateSwipeDirection,
  resolveNextSlideIndex,
  resolvePreviousSlideIndex,
} from './hooks/useBannerCarousel';
import { evaluateRecordLookup } from './hooks/useHomeNavigation';
import { homeCopy } from './i18n';
import { PaymentRecordSearch, sanitizeReferenceQuery } from './components/PaymentRecordSearch';
import { BannerContent } from './components/BannerContent';
import { HomeDesktopLayout } from './components/HomeDesktopLayout';
import { HomeMobileLayout } from './components/HomeMobileLayout';
import { INITIAL_TRANSACTIONS } from '../../shared/mockData';

test('Home 2 design tokens and layout metrics match approved specification', () => {
  assert.equal(HOME_COLORS.background, '#F4F6FA');
  assert.equal(HOME_COLORS.textPrimary, '#0F1D34');
  assert.equal(HOME_COLORS.textSecondary, '#3E4B62');
  assert.equal(HOME_COLORS.textMuted, '#5D697E');
  assert.equal(HOME_COLORS.border, '#DFE5EE');
  assert.equal(HOME_COLORS.primaryHeroButton, '#2F55A4');
  assert.equal(HOME_COLORS.primaryHeroHover, '#1F3C7A');
  assert.equal(HOME_COLORS.bentoAllTax, '#A5BCE1');
  assert.equal(HOME_COLORS.bentoHistory, '#E3DDD4');
  assert.equal(HOME_COLORS.bentoCertificates, '#CECFEB');
  assert.equal(HOME_COLORS.bentoCorrections, '#E3D2D4');
  assert.equal(HOME_COLORS.bentoPayAgainDesktop, '#E3DDD4');
  assert.equal(HOME_COLORS.bentoPayAgainMobile, '#CCE4EB');
  assert.equal(HOME_COLORS.bentoDrafts, '#D5E6D4');
  assert.equal(HOME_COLORS.bentoSecurity, '#CAD8EF');
  assert.equal(HOME_COLORS.bentoHelp, '#CCE4EB');

  assert.equal(HOME_LAYOUT.desktopBreakpointPx, 960);
  assert.equal(HOME_LAYOUT.desktopHeaderHeightPx, 64);
  assert.equal(HOME_LAYOUT.desktopMaxWidthPx, 1240);
  assert.equal(HOME_LAYOUT.mobileMaxWidthPx, 430);
});

test('bannerService honors empty CMS response and never resurrects unpublished banners', async () => {
  resetBrandingHealthForTest();
  const emptyFetch: typeof fetch = async () =>
    new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  const slides = await fetchPublishedBanners({
    config: {
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
      baseUrl: '/Nbr-taxpay-v2/',
    },
    fetcher: emptyFetch,
  });

  assert.deepEqual(slides, []);
});

test('bannerService maps published CMS rows, palettes, and snapshot URLs', async () => {
  resetBrandingHealthForTest();
  const rows: CmsBannerRow[] = [
    {
      id: 'intro',
      service_code: null,
      heading_en: 'Custom Heading',
      heading_bn: 'কাস্টম শিরোনাম',
      mobile_heading_en: 'Mobile Heading',
      mobile_heading_bn: 'মোবাইল শিরোনাম',
      description_en: 'Desc EN',
      description_bn: 'Desc BN',
      mobile_description_en: 'Mob EN',
      mobile_description_bn: 'Mob BN',
      action_en: 'Pay Tax',
      action_bn: 'কর পরিশোধ',
      desktop_image_path: 'banners/intro/c6bd8f1e-611d-4691-932f-9b6812f46085.jpg',
      background_color: '#112233',
      heading_color: '#445566',
      body_color: '#778899',
      outline_color: '#AABBCC',
    },
    {
      id: 'custom-travel',
      service_code: 'TRAVEL_TAX',
      heading_en: 'Travel',
      heading_bn: 'ভ্রমণ',
      mobile_heading_en: 'Travel',
      mobile_heading_bn: 'ভ্রমণ',
      description_en: 'Travel EN',
      description_bn: 'Travel BN',
      mobile_description_en: 'Travel Mob',
      mobile_description_bn: 'Travel Mob BN',
      action_en: 'Pay Travel Tax',
      action_bn: 'ভ্রমণ কর',
      desktop_image_path: 'banners/custom/travel-hero.png',
    },
  ];

  const okFetch: typeof fetch = async () =>
    new Response(JSON.stringify(rows), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  const slides = await fetchPublishedBanners({
    config: {
      supabaseUrl: 'https://example.supabase.co',
      supabaseAnonKey: 'anon-key',
      baseUrl: '/Nbr-taxpay-v2/',
    },
    fetcher: okFetch,
  });

  assert.equal(slides.length, 2);
  assert.equal(slides[0].image, '/Nbr-taxpay-v2/branding/published/banner-intro.jpg');
  assert.equal(
    slides[1].image,
    'https://example.supabase.co/storage/v1/object/public/taxpay-banners/banners/custom/travel-hero.png'
  );

  const customPalette = slider2ThemeStyle(slides[0]) as Record<string, string>;
  assert.equal(customPalette['--slider2-bg'], '#112233');
  assert.equal(customPalette['--slider2-outline'], '#AABBCC');

  const fallbackPalette = slider2ThemeStyle(slides[1]) as Record<string, string>;
  assert.equal(fallbackPalette['--slider2-bg'], SLIDER2_FALLBACK_THEMES.TRAVEL_TAX[0]);
  assert.equal(isBannerCmsConfigured({ supabaseUrl: '', supabaseAnonKey: '' }), false);
});

test('brandingCmsHealth enforces 402 and transient error cooldown windows', () => {
  resetBrandingHealthForTest();
  const t0 = 1_000_000;
  assert.equal(brandingReadsAllowed(t0), true);

  noteBrandingResponse(503, true, t0);
  assert.equal(brandingReadsAllowed(t0 + 1000), false);
  assert.equal(brandingReadsAllowed(t0 + BRANDING_ERROR_COOLDOWN_MS), true);

  noteBrandingResponse(402, true, t0 + BRANDING_ERROR_COOLDOWN_MS);
  assert.equal(brandingReadsAllowed(t0 + BRANDING_ERROR_COOLDOWN_MS + 60_000), false);
  assert.equal(
    brandingReadsAllowed(t0 + BRANDING_ERROR_COOLDOWN_MS + BRANDING_402_COOLDOWN_MS),
    true
  );
  resetBrandingHealthForTest();
});

test('carousel index wrap and 45px swipe dominance math behave deterministically', () => {
  assert.equal(resolveNextSlideIndex(4, 5), 0);
  assert.equal(resolvePreviousSlideIndex(0, 5), 4);
  assert.equal(resolveNextSlideIndex(0, 0), 0);

  assert.equal(evaluateSwipeDirection(-60, 10), 'next');
  assert.equal(evaluateSwipeDirection(60, 10), 'prev');
  assert.equal(evaluateSwipeDirection(30, 0), null);
  assert.equal(evaluateSwipeDirection(50, 50), null);
});

test('record lookup respects trimming, minimum length, and hosted PUBLIC_PREVIEW isolation', () => {
  assert.equal(sanitizeReferenceQuery('  SOHO-2026-98124  '), 'SOHO-2026-98124');
  assert.equal(evaluateRecordLookup('   ', INITIAL_TRANSACTIONS, false), null);
  assert.deepEqual(evaluateRecordLookup('12345', INITIAL_TRANSACTIONS, false), {
    kind: 'too_short',
    reference: '12345',
  });

  const hostedResult = evaluateRecordLookup('SOHO-2026-98124', INITIAL_TRANSACTIONS, true);
  assert.equal(hostedResult?.kind, 'preview_blocked');

  const devMatch = evaluateRecordLookup('soho-2026-98124', INITIAL_TRANSACTIONS, false);
  assert.equal(devMatch?.kind, 'matched_sample');

  const devMiss = evaluateRecordLookup('UNKNOWN-REF-999', INITIAL_TRANSACTIONS, false);
  assert.equal(devMiss?.kind, 'not_found');
});

test('Home 2 desktop and mobile SSR markup matches EN/BN copy and excludes Home 1 / Home 3 switcher links', () => {
  for (const lang of ['en', 'bn'] as const) {
    const c = homeCopy[lang];
    const desktopHtml = renderToStaticMarkup(
      React.createElement(HomeDesktopLayout, {
        c,
        language: lang,
        onToggleLang: () => {},
        onAction: () => {},
        onSearch: () => {},
        signedIn: false,
        sliderPaused: true,
      })
    );
    assert.match(desktopHtml, new RegExp(c.section.title));
    assert.match(desktopHtml, new RegExp(c.features.all.title));
    assert.match(desktopHtml, /data-testid="home2-reference"/);
    assert.match(desktopHtml, /maxlength="120"/i);
    assert.doesNotMatch(desktopHtml, /Home 3/i);
    assert.doesNotMatch(desktopHtml, /Original Home/i);
    assert.doesNotMatch(desktopHtml, /মূল পাতা/);

    const mobileHtml = renderToStaticMarkup(
      React.createElement(HomeMobileLayout, {
        c,
        language: lang,
        onToggleLang: () => {},
        onAction: () => {},
        onSearch: () => {},
        signedIn: true,
        sliderPaused: true,
      })
    );
    assert.match(mobileHtml, new RegExp(c.dashboard));
    assert.match(mobileHtml, new RegExp(c.nav.guideShort));
    assert.doesNotMatch(mobileHtml, /Home 3/i);
    assert.doesNotMatch(mobileHtml, /Original Home/i);
    assert.doesNotMatch(mobileHtml, /মূল পাতা/);
  }

  const backupSlides = buildPublishedBackupSlides('/');
  const emptyUnavailableHtml = renderToStaticMarkup(
    React.createElement(BannerContent, {
      slides: [],
      fixedSlide: backupSlides[0],
      language: 'en',
      c: homeCopy.en,
      bannerStatus: 'unavailable',
      onPayTax: () => {},
      onOtherTax: () => {},
      onRetry: () => {},
    })
  );
  assert.match(emptyUnavailableHtml, /Retry banner loading/);
  assert.match(emptyUnavailableHtml, /Pay Tax/);
  assert.match(emptyUnavailableHtml, /Other Tax/);

  const searchHtml = renderToStaticMarkup(
    React.createElement(PaymentRecordSearch, {
      c: homeCopy.en,
      onSearch: () => {},
    })
  );
  assert.match(searchHtml, /h-\[52px\]/);
  assert.match(searchHtml, /disabled=""/);
});
