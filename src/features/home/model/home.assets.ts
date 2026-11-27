import heroPaymentIllustration from '../../../assets/taxpay-hero-intro-v9.webp';
import returnTaxIllustration from '../../../assets/taxpay-hero-return-v9.webp';
import advanceTaxIllustration from '../../../assets/taxpay-hero-advance-v9.webp';
import withholdingTaxIllustration from '../../../assets/taxpay-hero-withholding-v9.webp';
import travelTaxIllustration from '../../../assets/taxpay-hero-travel-v9.webp';
import type { BannerPaymentService } from './home.types';

export const BUNDLED_HERO_ASSETS: Record<'intro' | BannerPaymentService, string> = {
  intro: heroPaymentIllustration,
  TAX_WITH_RETURN: returnTaxIllustration,
  ADVANCE_TAX: advanceTaxIllustration,
  SOURCE_TAX_DEPOSIT: withholdingTaxIllustration,
  TRAVEL_TAX: travelTaxIllustration,
};

export function resolveBundledHeroAsset(serviceCode?: BannerPaymentService | null): string {
  return BUNDLED_HERO_ASSETS[serviceCode ?? 'intro'] ?? heroPaymentIllustration;
}
