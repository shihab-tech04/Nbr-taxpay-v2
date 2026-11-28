import React from 'react';
import { useTranslation } from 'react-i18next';
import { Star } from 'lucide-react';
import { AppButton, AppCardButton } from '../../../design-system/buttons';
import type { TaxHeadCategory } from '../../../types/tax';
import { ALL_TAX_CATEGORIES, getAllTaxCategorySpec } from '../allTaxCatalogue';

interface AllTaxCategoryStepProps {
  selectedCategory: TaxHeadCategory;
  frequentCategories?: readonly TaxHeadCategory[];
  onSelectCategory: (category: TaxHeadCategory) => void;
}

export const AllTaxCategoryStep: React.FC<AllTaxCategoryStepProps> = ({
  selectedCategory,
  frequentCategories = [],
  onSelectCategory,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      {frequentCategories.length > 0 && (
        <section data-testid="frequent-tax-categories" className="space-y-3 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400">
            <Star size={14} />
            <span>{isBn ? 'সচরাচর ব্যবহৃত বিভাগসমূহ (সর্বোচ্চ ৫টি)' : 'Frequently Used Categories (Up to 5)'}</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {frequentCategories.slice(0, 5).map((catId) => {
              const spec = getAllTaxCategorySpec(catId);
              return (
                <AppButton
                  key={catId}
                  actionType="secondary"
                  surface="soft"
                  size="small"
                  onClick={() => onSelectCategory(catId)}
                >
                  {isBn ? spec.titleBn : spec.titleEn}
                </AppButton>
              );
            })}
          </div>
        </section>
      )}

      <div className="space-y-1">
        <h3 className="text-lg font-bold">
          {isBn ? 'কর প্রদানের বিভাগ নির্বাচন করুন (৭টি নির্দিষ্ট বিভাগ)' : 'Select Tax Payment Category'}
        </h3>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'একটি বিভাগ বেছে নিয়ে টিআইএন, কর খাত, মন্তব্য এবং পেমেন্ট মাধ্যম নির্ধারণ করুন।'
            : 'Choose a tax category to configure taxpayer TIN(s), payment heads, and challan notes.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="all-tax-category-grid">
        {ALL_TAX_CATEGORIES.map((cat) => {
          const active = selectedCategory === cat.id;
          return (
            <AppCardButton
              key={cat.id}
              data-testid={`all-tax-category-${cat.id}`}
              selected={active}
              onClick={() => onSelectCategory(cat.id)}
              className="transition-all text-left"
              sx={(theme) => ({
                width: '100%',
                flexDirection: 'column',
                alignItems: 'flex-start',
                p: 2.5,
                borderRadius: '16px',
                border: '2px solid',
                borderColor: active ? theme.palette.primary.main : theme.palette.divider,
                bgcolor: active ? (theme.palette.mode === 'dark' ? 'rgba(15, 118, 110, 0.16)' : 'rgba(240, 253, 250, 0.85)') : 'background.paper',
                '&:hover': {
                  borderColor: theme.palette.primary.main,
                },
              })}
            >
              <div className="w-9 h-9 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-xs mb-3">
                {cat.code}
              </div>
              <h4 className="font-bold text-base mb-1 text-slate-900 dark:text-white">
                {isBn ? cat.titleBn : cat.titleEn}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {isBn ? cat.descriptionBn : cat.descriptionEn}
              </p>
            </AppCardButton>
          );
        })}
      </div>
    </div>
  );
};
