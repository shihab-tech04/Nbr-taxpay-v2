import type { BannerPaymentService, BannerSlide } from './home.types';
import { LAST_VERIFIED_PUBLISHED, getBaseUrl } from './home.manifest';

export const FALLBACK_SLIDES: readonly BannerSlide[] = [
  {
    id: 'intro',
    serviceCode: undefined,
    headingEn: 'Tax payments, without the confusion',
    headingBn: 'কর পরিশোধে আর বিভ্রান্তি নয়।',
    mobileHeadingEn: 'Pay tax with confidence',
    mobileHeadingBn: 'কর পরিশোধ সহজ করুন',
    descriptionEn:
      'Choose the payment you need, see what happens next, and keep the payment reference handy when you need it.',
    descriptionBn:
      'যে কর পরিশোধ করতে চান, সেই সেবাটি বেছে নিন। ধাপে ধাপে এগিয়ে পেমেন্টের তথ্য সংরক্ষণ করুন।',
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
    descriptionEn:
      'Filing an income tax return and still have tax to pay? Make that payment here and keep its reference with your return.',
    descriptionBn:
      'রিটার্ন জমা দেওয়ার সময় কর পরিশোধ বাকি আছে? এখান থেকে সেই কর দিন এবং পেমেন্টের তথ্য রিটার্নের সঙ্গে রাখুন।',
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
    descriptionEn:
      'Making an advance income tax payment? Select the assessment year, enter the amount and review the details before paying.',
    descriptionBn:
      'অগ্রিম আয়কর দিতে চান? করবর্ষ ও টাকার পরিমাণ নির্বাচন করে পরিশোধের আগে তথ্য মিলিয়ে নিন।',
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
    descriptionEn:
      'Deducted tax from a salary or supplier bill, or collected tax on a transaction? Deposit that tax under the applicable payment category.',
    descriptionBn:
      'বেতন বা সরবরাহকারীর বিল থেকে কর কেটেছেন, কিংবা কোনো লেনদেনে কর আদায় করেছেন? প্রযোজ্য খাতে সেই কর জমা দিন।',
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
    descriptionEn:
      'Travelling abroad? Choose the journey details and enter passenger information to check and pay the applicable travel tax.',
    descriptionBn:
      'বিদেশ ভ্রমণ করছেন? ভ্রমণ ও যাত্রীর তথ্য দিয়ে প্রযোজ্য ভ্রমণ কর যাচাই করে পরিশোধ করুন।',
    mobileDescriptionEn: 'Check travel tax before departure.',
    mobileDescriptionBn: 'ভ্রমণের কর যাচাই ও পরিশোধ করুন।',
    actionEn: 'Pay Travel Tax',
    actionBn: 'ভ্রমণ কর পরিশোধ',
    image: 'branding/published/banner-travel.png',
  },
] as const;

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
