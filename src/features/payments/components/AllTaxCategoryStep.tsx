import React from 'react';
import { useTranslation } from 'react-i18next';
import { AppCardButton } from '../../../design-system/buttons';
import type { TaxHeadCategory } from '../../../types/tax';

interface AllTaxCategoryStepProps {
  selectedCategory: TaxHeadCategory;
  onSelectCategory: (category: TaxHeadCategory) => void;
}

export const AllTaxCategoryStep: React.FC<AllTaxCategoryStepProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
      <h3 className="text-lg font-bold">Select Tax Payment Category</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AppCardButton
          selected={selectedCategory === 'tax_with_return'}
          onClick={() => onSelectCategory('tax_with_return')}
          className={`p-6 rounded-2xl border-2 transition-all ${
            selectedCategory === 'tax_with_return'
              ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-teal-400'
          }`}
          sx={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start', p: 3, borderRadius: '16px' }}
        >
          <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold mb-4">
            01
          </div>
          <h4 className="font-bold text-lg mb-2">{t('taxWithReturn')}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Mandatory annual tax submission along with your income tax return for individuals and companies.
          </p>
        </AppCardButton>

        <AppCardButton
          selected={selectedCategory === 'other_tax'}
          onClick={() => onSelectCategory('other_tax')}
          className={`p-6 rounded-2xl border-2 transition-all ${
            selectedCategory === 'other_tax'
              ? 'border-teal-600 bg-teal-50/50 dark:bg-teal-950/20'
              : 'border-slate-200 dark:border-slate-800 hover:border-teal-400'
          }`}
          sx={{ width: '100%', flexDirection: 'column', alignItems: 'flex-start', p: 3, borderRadius: '16px' }}
        >
          <div className="w-10 h-10 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold mb-4">
            02
          </div>
          <h4 className="font-bold text-lg mb-2">{t('otherTax')}</h4>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Advance Income Tax (AIT), Source Tax (TDS), Capital Gains, and property transfer tax heads.
          </p>
        </AppCardButton>
      </div>
    </div>
  );
};
