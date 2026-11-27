import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import {
  AppCurrencyField,
  AppDatePicker,
  AppTextArea,
  getDhakaTodayYmd,
} from '../../../design-system/forms';
import type { GiftFormErrors } from '../giftTaxLogic';

interface GiftTaxValuationStepProps {
  giftAmountInput: string;
  giftDate: string;
  description: string;
  calculatedTax: number;
  errors: GiftFormErrors;
  onChangeAmount: (val: string) => void;
  onChangeGiftDate: (val: string) => void;
  onChangeDescription: (val: string) => void;
  onBack: () => void;
  onNext: () => void;
}

export const GiftTaxValuationStep: React.FC<GiftTaxValuationStepProps> = ({
  giftAmountInput,
  giftDate,
  description,
  calculatedTax,
  errors,
  onChangeAmount,
  onChangeGiftDate,
  onChangeDescription,
  onBack,
  onNext,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
      <h3 className="text-lg font-bold">Stage 2: Gift & Valuation Information</h3>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <AppCurrencyField
            label={t('giftAmountBdt')}
            value={giftAmountInput}
            minAmount={1000}
            decimalScale={2}
            onChange={(e) => onChangeAmount(e.target.value)}
            error={Boolean(errors.giftAmount)}
            helperText={errors.giftAmount || t('amountMinHelper', { amount: '1,000' })}
            required
          />

          <AppDatePicker
            label={t('giftDate')}
            value={giftDate}
            onChange={onChangeGiftDate}
            maxDate={getDhakaTodayYmd()}
            error={Boolean(errors.giftDate)}
            helperText={errors.giftDate || t('giftDateHelper')}
            required
            testId="gift-date-input"
          />
        </div>

        <AppTextArea
          label={t('giftDescription')}
          value={description}
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder={t('giftDescriptionPlaceholder')}
          error={Boolean(errors.description)}
          helperText={errors.description || t('giftDescriptionHelper')}
          rows={3}
          required
        />

        <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
          <div>
            <span className="text-xs text-teal-800 dark:text-teal-200 font-medium">
              Calculated Gift Tax (5%)
            </span>
            <div className="text-2xl font-bold font-mono text-teal-900 dark:text-teal-100">
              ৳ {calculatedTax.toLocaleString()}
            </div>
          </div>
          <ShieldCheck className="text-teal-600" size={32} />
        </div>
      </div>

      <div className="flex gap-4">
        <AppButton
          type="button"
          actionType="secondary"
          onClick={onBack}
          sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
        >
          {t('back')}
        </AppButton>
        <AppButton
          type="button"
          actionType="primary"
          previewRestricted
          endIcon={<ArrowRight size={16} />}
          onClick={onNext}
          sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
        >
          Proceed to Preview
        </AppButton>
      </div>
    </div>
  );
};
