export const HOME_LAYOUT = {
  desktopBreakpointPx: 960,
  desktopHeaderHeightPx: 64,
  desktopMaxWidthPx: 1240,
  desktopHorizontalPaddingPx: 32,
  desktopTopPaddingPx: 20,
  desktopBentoGapPx: 16,
  mobileMaxWidthPx: 430,
  mobileHorizontalPaddingPx: 16,
  mobileBentoGapPx: 12,
  cardRadiusPx: 20,
} as const;

export const SLIDER2_TIMING = {
  autoplayIntervalMs: 8_000,
  cmsFallbackPollMs: 5 * 60_000,
  swipeThresholdPx: 45,
  swipeDominanceRatio: 1.2,
  crossfadeDurationMs: 750,
} as const;

export const LAST_VERIFIED_PUBLISHED: Record<
  string,
  {
    file: string;
    path: string;
    background: string;
    heading: string;
    body: string;
    outline: string;
  }
> = {
  intro: {
    file: 'banner-intro.jpg',
    path: 'banners/intro/c6bd8f1e-611d-4691-932f-9b6812f46085.jpg',
    background: '#F7F5E6',
    heading: '#65531B',
    body: '#6D5F31',
    outline: '#7A651F',
  },
  return: {
    file: 'banner-return.png',
    path: 'banners/return/ffa907f6-1ee0-4ebb-86a1-f75392849905.png',
    background: '#ECF8FC',
    heading: '#1B4D65',
    body: '#315A6D',
    outline: '#1F5D7A',
  },
  advance: {
    file: 'banner-advance.png',
    path: 'banners/advance/4ecafe03-442a-4b58-9da8-ca577d34b3a1.png',
    background: '#FAF1DD',
    heading: '#65501B',
    body: '#6D5C31',
    outline: '#7A611F',
  },
  withholding: {
    file: 'banner-withholding.png',
    path: 'banners/withholding/1affb273-1f0e-4cdf-bcb4-e06d5c1e15e8.png',
    background: '#F8E7F6',
    heading: '#651B63',
    body: '#6D316C',
    outline: '#7A1F78',
  },
  travel: {
    file: 'banner-travel.png',
    path: 'banners/travel/5a02e106-bcc0-4aba-8021-6520d289c009.png',
    background: '#ECF8FC',
    heading: '#07516B',
    body: '#316078',
    outline: '#0C6D8D',
  },
};

export function getBaseUrl(): string {
  try {
    return typeof import.meta !== 'undefined' &&
      import.meta.env &&
      typeof import.meta.env.BASE_URL === 'string'
      ? import.meta.env.BASE_URL
      : '/';
  } catch {
    return '/';
  }
}
