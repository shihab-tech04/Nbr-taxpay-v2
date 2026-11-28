import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, Info, Save } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppCurrencyField, AppDatePicker, AppTextField, getDhakaTodayYmd } from '../../../design-system/forms';
import { GIFT_EXEMPT_ALLOWANCE } from '../giftTaxLogic';
import type { GiftFormErrors, GiftTaxCalculation } from '../giftTaxTypes';

interface GiftTaxValuationStepProps {
  giftAmountInput: string;
  description: string;
  giftDate: string;
  remarks: string;
  calculation: GiftTaxCalculation;
  errors: GiftFormErrors;
  isAuthenticated: boolean;
  onChangeAmount: (val: string) => void;
  onChangeDescription: (val: string) => void;
  onChangeGiftDate: (val: string) => void;
  onChangeRemarks: (val: string) => void;
  onSaveDraft: () => void;
  onBack: () => void;
  onNext: () => void;
}

export const GiftTaxValuationStep: React.FC<GiftTaxValuationStepProps> = ({
  giftAmountInput,
  description,
  giftDate,
  remarks,
  calculation,
  errors,
  isAuthenticated,
  onChangeAmount,
  onChangeDescription,
  onChangeGiftDate,
  onChangeRemarks,
  onSaveDraft,
  onBack,
  onNext,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div className="space-y-5" data-testid="gift-stage-2">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {isBn ? 'ধাপ ২: দান ও কর সংক্রান্ত তথ্য' : 'Stage 2 — Gift & Tax Information'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start" data-testid="gift-stage-2-fields">
        <AppCurrencyField
          label={t('giftValueBdt')}
          value={giftAmountInput}
          minAmount={1}
          decimalScale={2}
          fullWidth
          onChange={(e) => onChangeAmount(e.target.value)}
          error={Boolean(errors.giftAmount)}
          helperText={errors.giftAmount || (isBn ? 'সর্বনিম্ন ২০,০০০ টাকা অব্যাহতি সীমা প্রযোজ্য' : '৳20,000 exempt allowance applies')}
          required
        />

        <AppTextField
          label={t('giftDescription')}
          value={description}
          fullWidth
          onChange={(e) => onChangeDescription(e.target.value)}
          placeholder={t('giftDescriptionPlaceholder')}
          error={Boolean(errors.description)}
          helperText={errors.description || t('giftDescriptionHelper')}
          slotProps={{ htmlInput: { maxLength: 300 } }}
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

        <AppTextField
          label={t('giftRemarksOptional')}
          value={remarks}
          fullWidth
          onChange={(e) => onChangeRemarks(e.target.value)}
          placeholder={t('giftRemarksPlaceholder')}
          error={Boolean(errors.remarks)}
          helperText={errors.remarks || `${remarks.trim().length}/300`}
          slotProps={{ htmlInput: { maxLength: 300 } }}
        />
      </div>

      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 space-y-2.5 text-xs" data-testid="gift-illustrative-estimate">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="font-semibold text-teal-900 dark:text-teal-200 block">
              {isBn ? 'উদাহরণমূলক প্রগতিশীল কর প্রাক্কলন' : 'Illustrative Progressive Gift Tax Estimate'}
            </span>
            <span className="text-[11px] text-teal-800/80 dark:text-teal-300/80">
              {isBn ? `অব্যাহতি সীমা: ৳ ${GIFT_EXEMPT_ALLOWANCE.toLocaleString()} · করযোগ্য মূল্য: ৳ ${calculation.taxableAmount.toLocaleString()}` : `Exempt Allowance: ৳ ${GIFT_EXEMPT_ALLOWANCE.toLocaleString()} · Taxable Excess: ৳ ${calculation.taxableAmount.toLocaleString()}`}
            </span>
          </div>
          <strong className="text-xl font-bold font-mono text-teal-900 dark:text-teal-100 whitespace-nowrap" data-testid="gift-calculated-tax">
            ৳ {calculation.calculatedTax.toLocaleString()}
          </strong>
        </div>

        {calculation.brackets.length > 0 && (
          <div className="pt-2 border-t border-teal-200/70 dark:border-teal-800/70 space-y-1 font-mono text-[11px]">
            {calculation.brackets.map((b) => (
              <div key={b.id} className="flex justify-between gap-2 text-slate-700 dark:text-slate-300">
                <span>{isBn ? b.labelBn : b.labelEn} (৳ {b.taxableSlice.toLocaleString()})</span>
                <strong>৳ {b.taxAmount.toLocaleString()}</strong>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 border-t border-teal-200/70 dark:border-teal-800/70 flex items-start gap-2 text-[11px] text-amber-800 dark:text-amber-200">
          <Info size={14} className="shrink-0 mt-0.5" />
          <span>{t('giftTaxNonStatutoryDisclaimer')}</span>
        </div>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
        <div className="flex items-center gap-2">
          <AppButton actionType="secondary" startIcon={<ArrowLeft size={15} />} onClick={onBack}>{t('back')}</AppButton>
          {isAuthenticated && <AppButton actionType="secondary" surface="outlined" startIcon={<Save size={15} />} onClick={onSaveDraft} previewRestricted>{t('saveDraft')}</AppButton>}
        </div>
        <AppButton actionType="primary" endIcon={<ArrowRight size={16} />} onClick={onNext} previewRestricted>
          {isBn ? 'পরবর্তী: চূড়ান্ত প্রিভিউ' : 'Next: Final Preview'}
        </AppButton>
      </div>
    </div>
  );
};
