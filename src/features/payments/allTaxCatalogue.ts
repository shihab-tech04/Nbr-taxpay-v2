import { TAX_HEADS } from '../../shared/mockData';
import type { TaxHeadCategory, TaxHeadItem } from '../../types/tax';

export interface AllTaxCategorySpec {
  id: TaxHeadCategory;
  code: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
  allowsCombinedWithSameTaxpayerReturn: boolean;
}

export const ALL_TAX_CATEGORIES: readonly AllTaxCategorySpec[] = [
  {
    id: 'tax_with_return',
    code: '01',
    titleEn: 'Tax with Return',
    titleBn: 'রিটার্নসহ কর',
    descriptionEn: 'Annual income tax return submission (single Assessment Year per taxpayer).',
    descriptionBn: 'বার্ষিক আয়কর রিটার্ন দাখিলের কর (প্রতি করদাতার জন্য একটি কর বর্ষ)।',
    allowsCombinedWithSameTaxpayerReturn: false,
  },
  {
    id: 'advance_tax',
    code: '02',
    titleEn: 'Advance Tax',
    titleBn: 'অগ্রিম কর',
    descriptionEn: 'Quarterly or installment advance income tax payments.',
    descriptionBn: 'ত্রৈমাসিক বা কিস্তিভিত্তিক অগ্রিম আয়কর পরিশোধ।',
    allowsCombinedWithSameTaxpayerReturn: true,
  },
  {
    id: 'assessed_demand',
    code: '03',
    titleEn: 'Tax against Demand',
    titleBn: 'দাবি অনুযায়ী কর',
    descriptionEn: 'Payments settled against an assessed NBR demand notice.',
    descriptionBn: 'নির্ধারিত এনবিআর দাবি নোটিশের বিপরীতে কর পরিশোধ।',
    allowsCombinedWithSameTaxpayerReturn: true,
  },
  {
    id: 'penalty',
    code: '04',
    titleEn: 'Penalty',
    titleBn: 'জরিমানা',
    descriptionEn: 'Statutory delay interest, penalty, or surcharge obligations.',
    descriptionBn: 'বিলম্ব সুদ, জরিমানা বা অতিরিক্ত সারচার্জ পরিশোধ।',
    allowsCombinedWithSameTaxpayerReturn: true,
  },
  {
    id: 'source_tax',
    code: '05',
    titleEn: 'Source Tax',
    titleBn: 'উৎসে কর',
    descriptionEn: 'Withholding and Tax Deducted at Source (TDS) deposits.',
    descriptionBn: 'উৎসে কর কর্তন (টিডিএস) ও সংগৃহীত কর জমা।',
    allowsCombinedWithSameTaxpayerReturn: true,
  },
  {
    id: 'appellate_tribunal',
    code: '06',
    titleEn: 'Appellate Tribunal',
    titleBn: 'আপিল ট্রাইব্যুনাল',
    descriptionEn: 'Taxes Appellate Tribunal filing fees and disputed deposits.',
    descriptionBn: 'ট্যাক্সেস আপিলাত ট্রাইব্যুনাল ফি ও জমা।',
    allowsCombinedWithSameTaxpayerReturn: true,
  },
  {
    id: 'other_tax',
    code: '07',
    titleEn: 'Others',
    titleBn: 'অন্যান্য কর',
    descriptionEn: 'Capital gains, property registration, and residual NBR heads.',
    descriptionBn: 'মূলধনী মুনাফা, সম্পত্তি ও অন্যান্য এনবিআর কর খাত।',
    allowsCombinedWithSameTaxpayerReturn: true,
  },
];

export function getAllTaxCategorySpec(category: TaxHeadCategory): AllTaxCategorySpec {
  return ALL_TAX_CATEGORIES.find((c) => c.id === category) ?? ALL_TAX_CATEGORIES[0];
}

export function getHeadsForCategory(category: TaxHeadCategory, includeAllOther = false): TaxHeadItem[] {
  if (category === 'other_tax' || includeAllOther) {
    return TAX_HEADS.filter((h) => h.category !== 'gift_tax' && h.category !== 'travel_tax');
  }
  const exact = TAX_HEADS.filter((h) => h.category === category);
  return exact.length > 0 ? exact : TAX_HEADS.filter((h) => h.category !== 'gift_tax' && h.category !== 'travel_tax');
}
