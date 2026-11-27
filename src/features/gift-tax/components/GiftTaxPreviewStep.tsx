import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { formatYmdDisplay } from '../../../design-system/forms';

interface GiftTaxPreviewStepProps {
  donorName: string;
  donorTin: string;
  doneeName: string;
  doneeTin: string;
  relationship: string;
  giftAmount: number;
  giftDate: string;
  calculatedTax: number;
  onBack: () => void;
  onPay: () => void;
}

export const GiftTaxPreviewStep: React.FC<GiftTaxPreviewStepProps> = ({
  donorName,
  donorTin,
  doneeName,
  doneeTin,
  relationship,
  giftAmount,
  giftDate,
  calculatedTax,
  onBack,
  onPay,
}) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith('bn') ? 'bn' : 'en';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
      <h3 className="text-lg font-bold">Stage 3: Final Payment Preview</h3>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs font-mono">
        <div className="flex justify-between">
          <span className="text-slate-500 font-sans">Donor:</span>
          <strong>
            {donorName} (TIN: {donorTin})
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 font-sans">Donee:</span>
          <strong>
            {doneeName} (TIN: {doneeTin} - {relationship})
          </strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 font-sans">{t('giftDate')}:</span>
          <strong>{formatYmdDisplay(giftDate, lang)}</strong>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-500 font-sans">Gift Amount:</span>
          <strong>৳ {giftAmount.toLocaleString()}</strong>
        </div>
        <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
          <span className="text-slate-500 font-sans font-semibold">Total Gift Tax Taxable:</span>
          <strong className="text-teal-700 text-base font-bold">
            ৳ {calculatedTax.toLocaleString()}
          </strong>
        </div>
      </div>

      <div className="flex gap-4">
        <AppButton
          actionType="secondary"
          onClick={onBack}
          sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
        >
          {t('back')}
        </AppButton>
        <AppButton
          actionType="primary"
          intent="confirm"
          previewRestricted
          endIcon={<CheckCircle size={16} />}
          onClick={onPay}
          sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem', boxShadow: 2 }}
        >
          {t('confirmPayment')}
        </AppButton>
      </div>
    </div>
  );
};
