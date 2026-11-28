import test from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { ThemeProvider } from '@mui/material/styles';
import { I18nextProvider } from 'react-i18next';
import i18n from '../../i18n/i18n';
import { readPublicBackendConfig } from '../../config/publicBackend';
import { getTheme } from '../../design-system/theme';
import { INITIAL_TRANSACTIONS } from '../../shared/mockData';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { BannerContent } from './components/BannerContent';
import { HelpChatDialog } from './components/dialogs/HelpChatDialog';
import { OtherTaxDialog } from './components/dialogs/OtherTaxDialog';
import { RecordLookupDialog } from './components/dialogs/RecordLookupDialog';
import { HomeDesktopLayout } from './components/HomeDesktopLayout';
import { HomeMobileLayout } from './components/HomeMobileLayout';
import { PaymentRecordSearch } from './components/PaymentRecordSearch';
import {
  evaluateSwipeDirection,
  reconcileActiveBannerIndex,
  resolveNextSlideIndex,
  resolvePreviousSlideIndex,
} from './hooks/useBannerCarousel';
import { evaluateRecordLookup, sanitizeReferenceQuery } from './hooks/useHomeNavigation';
import { homeCopy } from './i18n';
import { HOME_COLORS, SLIDER2_FALLBACK_THEMES } from './model/home.colors';
import { HOME_LAYOUT } from './model/home.manifest';
import { buildPublishedBackupSlides } from './model/home.slides';
import type { BannerSlide } from './model/home.types';
import { matchHelpAnswer, resolveHomeActionTarget } from './model/routeContract';
import {
  fetchPublishedBanners,
  isBannerCmsConfigured,
  parseCmsBannerRows,
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
import { getRecordVerificationServiceStatus } from './services/recordVerificationService';

function renderHomeWithTheme(node: React.ReactElement): string {
  return renderToStaticMarkup(
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={getTheme('light')}>{node}</ThemeProvider>
    </I18nextProvider>
  );
}

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

test('publicBackend supports VITE_SUPABASE_PUBLISHABLE_KEY, anon fallback, and rejects secret keys', () => {
  const publishableCfg = readPublicBackendConfig({
    VITE_SUPABASE_URL: 'https://project.supabase.co',
    VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_demo_key',
    VITE_SUPABASE_ANON_KEY: 'legacy_anon_key',
  });
  assert.equal(publishableCfg.configured, true);
  assert.equal(publishableCfg.publishableKey, 'sb_publishable_demo_key');
  assert.equal(publishableCfg.keySource, 'publishable');

  const fallbackCfg = readPublicBackendConfig({
    VITE_SUPABASE_URL: 'https://project.supabase.co',
    VITE_SUPABASE_ANON_KEY: 'legacy_anon_key',
  });
  assert.equal(fallbackCfg.configured, true);
  assert.equal(fallbackCfg.publishableKey, 'legacy_anon_key');
  assert.equal(fallbackCfg.keySource, 'anon_fallback');

  const rejectedSecretPrefix = readPublicBackendConfig({
    VITE_SUPABASE_URL: 'https://project.supabase.co',
    VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_secret_should_never_be_exposed',
  });
  assert.equal(rejectedSecretPrefix.configured, false);
  assert.equal(rejectedSecretPrefix.publishableKey, '');

  const serviceRoleJwtHeader = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const serviceRoleJwtPayload = Buffer.from(JSON.stringify({ role: 'service_role' })).toString('base64url');
  const rejectedJwt = readPublicBackendConfig({
    VITE_SUPABASE_URL: 'https://project.supabase.co',
    VITE_SUPABASE_PUBLISHABLE_KEY: `${serviceRoleJwtHeader}.${serviceRoleJwtPayload}.sig`,
  });
  assert.equal(rejectedJwt.configured, false);

  const disabledCfg = readPublicBackendConfig({
    VITE_SUPABASE_URL: 'https://project.supabase.co',
    VITE_SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_demo_key',
    VITE_SUPABASE_DISABLED: 'true',
  });
  assert.equal(disabledCfg.configured, false);
  assert.equal(disabledCfg.disabled, true);
});

test('bannerService validates response payloads at runtime and supports AbortSignal', async () => {
  assert.throws(() => parseCmsBannerRows({ notAnArray: true }), /expected an array/i);
  assert.throws(
    () => parseCmsBannerRows([{ id: 'x', heading_en: '' }]),
    /missing string field/i
  );
  assert.throws(
    () =>
      parseCmsBannerRows([
        {
          id: 'bad-service',
          service_code: 'UNKNOWN_SERVICE',
          heading_en: 'H',
          heading_bn: 'হ',
          mobile_heading_en: 'MH',
          mobile_heading_bn: 'মহ',
          description_en: 'D',
          description_bn: 'ড',
          mobile_description_en: 'MD',
          mobile_description_bn: 'মড',
          action_en: 'A',
          action_bn: 'আ',
        },
      ]),
    /unrecognized service_code/i
  );

  resetBrandingHealthForTest();
  let receivedSignal: AbortSignal | undefined;
  const controller = new AbortController();
  const emptyFetch: typeof fetch = async (_input, init) => {
    receivedSignal = init?.signal ?? undefined;
    return new Response(JSON.stringify([]), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const slides = await fetchPublishedBanners({
    config: {
      supabaseUrl: 'https://example.supabase.co',
      supabasePublishableKey: 'sb_publishable_key',
      baseUrl: '/Nbr-taxpay-v2/',
    },
    fetcher: emptyFetch,
    signal: controller.signal,
  });

  assert.equal(receivedSignal, controller.signal);
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
      supabasePublishableKey: 'sb_publishable_key',
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
  assert.equal(isBannerCmsConfigured({ supabaseUrl: '', supabasePublishableKey: '' }), false);
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

test('carousel preserves active banner identity across reorders and removals', () => {
  const baseSlides = buildPublishedBackupSlides('/');
  // Reorder slides: move 'advance' from index 2 to index 4
  const reordered: BannerSlide[] = [
    baseSlides[0],
    baseSlides[1],
    baseSlides[3],
    baseSlides[4],
    baseSlides[2],
  ];
  assert.equal(reconcileActiveBannerIndex(reordered, 'advance', 2), 4);

  // Remove preceding slide 'intro'; 'advance' stays active at its new index 1
  const shifted = baseSlides.slice(1);
  assert.equal(reconcileActiveBannerIndex(shifted, 'advance', 2), 1);

  // Remove active slide 'travel' (index 4); clamp safely to final valid slide
  const shortened = baseSlides.slice(0, 3);
  assert.equal(reconcileActiveBannerIndex(shortened, 'travel', 4), 2);
  assert.equal(reconcileActiveBannerIndex([], 'intro', 0), 0);

  assert.equal(resolveNextSlideIndex(4, 5), 0);
  assert.equal(resolvePreviousSlideIndex(0, 5), 4);
  assert.equal(resolveNextSlideIndex(0, 0), 0);

  assert.equal(evaluateSwipeDirection(-60, 10), 'next');
  assert.equal(evaluateSwipeDirection(60, 10), 'prev');
  assert.equal(evaluateSwipeDirection(30, 0), null);
  assert.equal(evaluateSwipeDirection(50, 50), null);
});

test('record lookup distinguishes invalid input, service unavailability, unauthorized, and matches', () => {
  assert.equal(sanitizeReferenceQuery('  SOHO-2026-98124  '), 'SOHO-2026-98124');
  assert.equal(
    evaluateRecordLookup('   ', INITIAL_TRANSACTIONS, {
      isPreviewMode: false,
      serviceAvailable: true,
      signedIn: true,
    }),
    null
  );
  assert.deepEqual(
    evaluateRecordLookup('12345', INITIAL_TRANSACTIONS, {
      isPreviewMode: false,
      serviceAvailable: true,
      signedIn: true,
    }),
    { kind: 'too_short', reference: '12345' }
  );
  assert.deepEqual(
    evaluateRecordLookup('BAD@REF#1', INITIAL_TRANSACTIONS, {
      isPreviewMode: false,
      serviceAvailable: true,
      signedIn: true,
    }),
    { kind: 'invalid', reference: 'BAD@REF#1' }
  );

  const previewResult = evaluateRecordLookup('SOHO-2026-98124', INITIAL_TRANSACTIONS, {
    isPreviewMode: true,
    serviceAvailable: true,
    signedIn: false,
  });
  assert.equal(previewResult?.kind, 'service_unavailable');

  const unconfiguredResult = evaluateRecordLookup('SOHO-2026-98124', INITIAL_TRANSACTIONS, {
    isPreviewMode: false,
    serviceAvailable: false,
    signedIn: true,
  });
  assert.equal(unconfiguredResult?.kind, 'service_unavailable');

  const unauthorizedResult = evaluateRecordLookup('SOHO-2026-98124', INITIAL_TRANSACTIONS, {
    isPreviewMode: false,
    serviceAvailable: true,
    signedIn: false,
  });
  assert.equal(unauthorizedResult?.kind, 'unauthorized');

  const devMatch = evaluateRecordLookup('soho-2026-98124', INITIAL_TRANSACTIONS, {
    isPreviewMode: false,
    serviceAvailable: true,
    signedIn: true,
  });
  assert.equal(devMatch?.kind, 'matched_sample');

  const devMiss = evaluateRecordLookup('UNKNOWN-REF-999', INITIAL_TRANSACTIONS, {
    isPreviewMode: false,
    serviceAvailable: true,
    signedIn: true,
  });
  assert.equal(devMiss?.kind, 'not_found');
});

test('route contracts and help Q&A map accurately to original Home 2 destinations', () => {
  assert.deepEqual(resolveHomeActionTarget('certificates', false), {
    kind: 'unavailable',
    unavailableKind: 'certificates',
    contract: 'verify',
  });
  assert.deepEqual(resolveHomeActionTarget('certificates', true), {
    kind: 'unavailable',
    unavailableKind: 'certificates',
    contract: 'certificates',
  });
  assert.deepEqual(resolveHomeActionTarget('status', false), {
    kind: 'unavailable',
    unavailableKind: 'status',
    contract: 'verify',
  });
  assert.deepEqual(resolveHomeActionTarget('guide', false), {
    kind: 'navigate',
    path: '/support?contract=user_guide',
    contract: 'user_guide',
  });
  assert.deepEqual(resolveHomeActionTarget('receipts', false), {
    kind: 'navigate',
    path: '/support?contract=user_guide&category=records',
    contract: 'user_guide',
  });
  assert.deepEqual(resolveHomeActionTarget('security', false), {
    kind: 'navigate',
    path: '/support?contract=user_guide&category=security',
    contract: 'user_guide',
  });
  assert.deepEqual(resolveHomeActionTarget('report', false), {
    kind: 'navigate',
    path: '/support?contract=incident',
    contract: 'incident',
  });
  assert.deepEqual(resolveHomeActionTarget('drafts', false), {
    kind: 'navigate',
    path: '/login',
    contract: 'taxpayer_login',
  });
  assert.deepEqual(resolveHomeActionTarget('drafts', true), {
    kind: 'navigate',
    path: '/drafts',
    contract: 'taxpayer_home',
  });

  const travelAnswer = matchHelpAnswer(
    'How do I pay travel tax?',
    homeCopy.en.dialogs.helpTopics,
    homeCopy.en.dialogs.helpFallbackAnswer
  );
  assert.match(travelAnswer, /Travel Tax/i);

  const fallbackAnswer = matchHelpAnswer(
    'unrelated random question',
    homeCopy.en.dialogs.helpTopics,
    homeCopy.en.dialogs.helpFallbackAnswer
  );
  assert.equal(fallbackAnswer, homeCopy.en.dialogs.helpFallbackAnswer);
});

test('Home 2 desktop and mobile SSR markup matches EN/BN copy and excludes Home 1 / Home 3 and floating Help', () => {
  for (const lang of ['en', 'bn'] as const) {
    const c = homeCopy[lang];
    const desktopHtml = renderHomeWithTheme(
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
    assert.doesNotMatch(desktopHtml, /home2-floating-help/);
    assert.doesNotMatch(desktopHtml, /Home 3/i);
    assert.doesNotMatch(desktopHtml, /Original Home/i);
    assert.doesNotMatch(desktopHtml, /মূল পাতা/);

    const mobileHtml = renderHomeWithTheme(
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
  const emptyUnavailableHtml = renderHomeWithTheme(
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

  const searchHtml = renderHomeWithTheme(
    React.createElement(PaymentRecordSearch, {
      c: homeCopy.en,
      onSearch: () => {},
    })
  );
  assert.match(searchHtml, /h-\[52px\]/);
  assert.match(searchHtml, /disabled=""/);

  // OtherTaxDialog must list only Travel Tax & Gift Tax
  const otherTaxHtml = renderHomeWithTheme(
    React.createElement(OtherTaxDialog, {
      open: true,
      onClose: () => {},
      c: homeCopy.en,
      onNavigate: () => {},
      disablePortal: true,
    })
  );
  assert.match(otherTaxHtml, /Travel Tax/);
  assert.match(otherTaxHtml, /Gift Tax/);
  assert.doesNotMatch(otherTaxHtml, /Tax with Return/i);

  // RecordLookupDialog for service_unavailable never falsely reports "No record for"
  const unavailableLookupHtml = renderHomeWithTheme(
    React.createElement(RecordLookupDialog, {
      lookupOutcome: { kind: 'service_unavailable', reference: 'SOHO-2026-98124' },
      onClose: () => {},
      c: homeCopy.en,
      onNavigate: () => {},
      onSelectReceipt: () => {},
      disablePortal: true,
    })
  );
  assert.match(unavailableLookupHtml, /Verification service unavailable/);
  assert.doesNotMatch(unavailableLookupHtml, /No record for/);
});

test('Cycle 05 verification decoupling, tightened help matching, HelpChatDialog, and boundary guards', () => {
  // Record verification availability is independent of banner CMS configuration
  const status = getRecordVerificationServiceStatus();
  assert.deepEqual(status, {
    available: false,
    mode: 'unavailable',
    reason: 'payment_verification_unconfigured',
  });
  assert.equal(
    isBannerCmsConfigured({
      supabaseUrl: 'https://example.supabase.co',
      supabasePublishableKey: 'sb_publishable_demo',
    }),
    true
  );
  assert.equal(getRecordVerificationServiceStatus().available, false);

  // 1-char query does not trigger false substring match
  const singleCharAnswer = matchHelpAnswer(
    'a',
    homeCopy.en.dialogs.helpTopics,
    homeCopy.en.dialogs.helpFallbackAnswer
  );
  assert.equal(singleCharAnswer, homeCopy.en.dialogs.helpFallbackAnswer);

  // Real BN 2-char keyword matches cleanly
  const bnMatchAnswer = matchHelpAnswer(
    'কর',
    homeCopy.bn.dialogs.helpTopics,
    homeCopy.bn.dialogs.helpFallbackAnswer
  );
  assert.notEqual(bnMatchAnswer, homeCopy.bn.dialogs.helpFallbackAnswer);

  // HelpChatDialog renders accessible log, topic buttons, and scoped help input
  const helpDialogHtml = renderHomeWithTheme(
    React.createElement(HelpChatDialog, {
      open: true,
      onClose: () => {},
      c: homeCopy.en,
      onNavigate: () => {},
      disablePortal: true,
    })
  );
  assert.match(helpDialogHtml, /role="log"/);
  assert.match(helpDialogHtml, /aria-live="polite"/);
  assert.match(helpDialogHtml, new RegExp(homeCopy.en.dialogs.helpTitle));

  // Boundary guard blocks restricted operations in preview mode
  assert.equal(isRestrictedOperationAllowed('sign_in', true), false);
  assert.equal(isRestrictedOperationAllowed('beneficiary_write', true), false);
  assert.equal(isRestrictedOperationAllowed('correction_write', true), false);
  assert.equal(isRestrictedOperationAllowed('support_ticket_write', true), false);
  assert.equal(isRestrictedOperationAllowed('sign_in', false), true);
});
