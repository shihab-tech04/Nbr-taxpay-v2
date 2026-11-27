import type { BannerPaymentService, BannerSlide } from './home.types';

export const HOME_COLORS = {
  background: '#F4F6FA',
  textPrimary: '#0F1D34',
  textSecondary: '#3E4B62',
  textMuted: '#5D697E',
  border: '#DFE5EE',
  primaryHeroButton: '#2F55A4',
  primaryHeroHover: '#1F3C7A',
  bentoAllTax: '#A5BCE1',
  bentoHistory: '#E3DDD4',
  bentoCertificates: '#CECFEB',
  bentoCorrections: '#E3D2D4',
  bentoPayAgainDesktop: '#E3DDD4',
  bentoPayAgainMobile: '#CCE4EB',
  bentoDrafts: '#D5E6D4',
  bentoSecurity: '#CAD8EF',
  bentoHelp: '#CCE4EB',
} as const;

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

export const SLIDER2_FALLBACK_THEMES: Record<string, readonly [string, string, string, string]> = {
  intro: ['#EAF2FF', '#172033', '#5F6B7A', '#2C5EAD'],
  TAX_WITH_RETURN: ['#EEF4FF', '#214887', '#4D6486', '#315DAA'],
  ADVANCE_TAX: ['#FFF6EC', '#80420D', '#765334', '#A65B19'],
  SOURCE_TAX_DEPOSIT: ['#F6F1FC', '#4E327B', '#5A4673', '#6D4BA8'],
  TRAVEL_TAX: ['#ECF8FC', '#07516B', '#316078', '#0C6D8D'],
};

export const FALLBACK_SLIDES: readonly BannerSlide[] = [
  {
    id: 'intro',
    serviceCode: undefined,
    headingEn: 'Tax payments, without the confusion',
    headingBn: 'কর পরিশোধে আর বিভ্রান্তি নয়।',
    mobileHeadingEn: 'Pay tax with confidence',
    mobileHeadingBn: 'কর পরিশোধ সহজ করুন',
    descriptionEn: 'Choose the payment you need, see what happens next, and keep the payment reference handy when you need it.',
    descriptionBn: 'যে কর পরিশোধ করতে চান, সেই সেবাটি বেছে নিন। ধাপে ধাপে এগিয়ে পেমেন্টের তথ্য সংরক্ষণ করুন।',
    mobileDescriptionEn: 'Choose, pay and keep your record.',
    mobileDescriptionBn: 'কর দিন, পেমেন্টের তথ্য রাখুন।',
    actionEn: 'Pay Tax',
    actionBn: 'কর পরিশোধ',
    image: 'branding/published/banner-intro.jpg',
  },
  {
    id: 'return',
    serviceCode: 'TAX_WITH_RETURN',
    headingEn: 'Tax with Return',
    headingBn: 'রিটার্নের সঙ্গে কর',
    mobileHeadingEn: 'Tax with Return',
    mobileHeadingBn: 'রিটার্নের সঙ্গে কর',
    descriptionEn: 'Filing an income tax return and still have tax to pay? Make that payment here and keep its reference with your return.',
    descriptionBn: 'রিটার্ন জমা দেওয়ার সময় কর পরিশোধ বাকি আছে? এখান থেকে সেই কর দিন এবং পেমেন্টের তথ্য রিটার্নের সঙ্গে রাখুন।',
    mobileDescriptionEn: 'Pay tax due with your return.',
    mobileDescriptionBn: 'রিটার্নের বাকি কর দিন।',
    actionEn: 'Pay Tax with Return',
    actionBn: 'রিটার্নের সঙ্গে কর পরিশোধ',
    image: 'branding/published/banner-return.png',
  },
  {
    id: 'advance',
    serviceCode: 'ADVANCE_TAX',
    headingEn: 'Advance Income Tax',
    headingBn: 'অগ্রিম আয়কর',
    mobileHeadingEn: 'Advance Income Tax',
    mobileHeadingBn: 'অগ্রিম আয়কর',
    descriptionEn: 'Making an advance income tax payment? Select the assessment year, enter the amount and review the details before paying.',
    descriptionBn: 'অগ্রিম আয়কর দিতে চান? করবর্ষ ও টাকার পরিমাণ নির্বাচন করে পরিশোধের আগে তথ্য মিলিয়ে নিন।',
    mobileDescriptionEn: 'Pay ahead for your tax year.',
    mobileDescriptionBn: 'করবর্ষ বেছে অগ্রিম কর দিন।',
    actionEn: 'Pay Advance Income Tax',
    actionBn: 'অগ্রিম আয়কর পরিশোধ',
    image: 'branding/published/banner-advance.png',
  },
  {
    id: 'withholding',
    serviceCode: 'SOURCE_TAX_DEPOSIT',
    headingEn: 'Source Tax Deposit (TDS/TCS)',
    headingBn: 'উৎসে কর জমা (টিডিএস/টিসিএস)',
    mobileHeadingEn: 'Source Tax (TDS/TCS)',
    mobileHeadingBn: 'উৎসে কর জমা',
    descriptionEn: 'Deducted tax from a salary or supplier bill, or collected tax on a transaction? Deposit that tax under the applicable payment category.',
    descriptionBn: 'বেতন বা সরবরাহকারীর বিল থেকে কর কেটেছেন, কিংবা কোনো লেনদেনে কর আদায় করেছেন? প্রযোজ্য খাতে সেই কর জমা দিন।',
    mobileDescriptionEn: 'Deposit tax deducted at source.',
    mobileDescriptionBn: 'উৎসে কাটা বা আদায় করা কর দিন।',
    actionEn: 'Deposit Source Tax',
    actionBn: 'উৎসে কর জমা দিন',
    image: 'branding/published/banner-withholding.png',
  },
  {
    id: 'travel',
    serviceCode: 'TRAVEL_TAX',
    headingEn: 'Travel Tax',
    headingBn: 'ভ্রমণ কর',
    mobileHeadingEn: 'Travel Tax',
    mobileHeadingBn: 'ভ্রমণ কর',
    descriptionEn: 'Travelling abroad? Choose the journey details and enter passenger information to check and pay the applicable travel tax.',
    descriptionBn: 'বিদেশ ভ্রমণ করছেন? ভ্রমণ ও যাত্রীর তথ্য দিয়ে প্রযোজ্য ভ্রমণ কর যাচাই করে পরিশোধ করুন।',
    mobileDescriptionEn: 'Check travel tax before departure.',
    mobileDescriptionBn: 'ভ্রমণের কর যাচাই ও পরিশোধ করুন।',
    actionEn: 'Pay Travel Tax',
    actionBn: 'ভ্রমণ কর পরিশোধ',
    image: 'branding/published/banner-travel.png',
  },
] as const;

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
    return typeof import.meta !== 'undefined' && import.meta.env && typeof import.meta.env.BASE_URL === 'string'
      ? import.meta.env.BASE_URL
      : '/';
  } catch {
    return '/';
  }
}

export function buildPublishedBackupSlides(baseUrl = getBaseUrl()): BannerSlide[] {
  return FALLBACK_SLIDES.map((slide) => {
    const verified = LAST_VERIFIED_PUBLISHED[slide.id];
    return {
      ...slide,
      image: `${baseUrl}branding/published/${verified.file}`,
      backgroundColor: verified.background,
      headingColor: verified.heading,
      bodyColor: verified.body,
      outlineColor: verified.outline,
    };
  });
}

export function findCategoryFallbackImage(
  serviceCode?: BannerPaymentService | null,
  baseUrl = getBaseUrl()
): string {
  const slide = FALLBACK_SLIDES.find((item) => (item.serviceCode || null) === (serviceCode || null));
  const rel = slide?.image || 'branding/published/banner-intro.jpg';
  return `${baseUrl}${rel}`;
}
