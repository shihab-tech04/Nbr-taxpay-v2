import React from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import { ArrowRight, CheckCircle, Edit3 } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppTextField } from '../../../design-system/forms';
import {
  TRAVEL_TAX_ECONOMIC_CODE,
  TRAVEL_TAX_YEAR,
  type ConfirmedPassenger,
  type TravelDetailsInput,
} from '../travelTaxTypes';

interface TravelTaxPreviewStepProps {
  passengers: ReadonlyArray<ConfirmedPassenger & { ageOnTravelDate: number; amount: number }>;
  details: TravelDetailsInput;
  totalAmount: number;
  receiptMobile: string;
  mobileError?: string;
  submitError?: string;
  isAuthenticated: boolean;
  onChangeReceiptMobile: (val: string) => void;
  onEditPassengers: () => void;
  onEditDetails: () => void;
  onSaveDraft: () => void;
  onProceed: () => void;
}

export const TravelTaxPreviewStep: React.FC<TravelTaxPreviewStepProps> = ({
  passengers, details, totalAmount, receiptMobile, mobileError, submitError, isAuthenticated,
  onChangeReceiptMobile, onEditPassengers, onEditDetails, onSaveDraft, onProceed,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div data-testid="travel-stage-3" className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-lg font-bold">{isBn ? 'ধাপ ৩: চূড়ান্ত ভ্রমণ কর প্রিভিউ' : 'Stage 3: Final Travel Tax Preview'}</h2>
        <span className="text-xs font-mono text-slate-500">
          {t('travelTaxYearLabel')}: {TRAVEL_TAX_YEAR} · {t('travelEconomicCodeLabel')}: {TRAVEL_TAX_ECONOMIC_CODE}
        </span>
      </div>

      {submitError && <Alert severity="error" data-testid="travel-presubmit-error">{submitError}</Alert>}

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <strong className="text-slate-900 dark:text-white">{isBn ? 'ভ্রমণের পথ ও তারিখ' : 'Route & Travel Date'}</strong>
          <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<Edit3 size={13} />} onClick={onEditDetails}>{t('edit')}</AppButton>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-slate-600 dark:text-slate-300">
          <div>Mode: <strong>{details.travelMode}</strong></div>
          <div>Port: <strong>{details.departurePort}</strong></div>
          <div>Destination: <strong>{details.destination}</strong></div>
          <div>Date: <strong>{details.travelDate}</strong></div>
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <strong className="text-xs text-slate-700 dark:text-slate-200">{isBn ? 'যাত্রীভিত্তিক বিবরণ' : 'Passenger-Wise Tax Breakdown'}</strong>
          <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<Edit3 size={13} />} onClick={onEditPassengers}>{t('edit')}</AppButton>
        </div>
        {passengers.map((p, idx) => (
          <div key={p.id} className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-xl flex flex-wrap justify-between items-center gap-2 text-xs font-mono">
            <div>
              <strong className="text-slate-900 dark:text-white">#{idx + 1} {p.passengerName}</strong>
              <div className="text-[11px] text-slate-500">
                {p.passportType} · {p.passportMasked} · DOB {p.dob} · {isBn ? `বয়স ${p.ageOnTravelDate}` : `Age ${p.ageOnTravelDate}`}
              </div>
            </div>
            <strong className="text-teal-700 dark:text-teal-300">৳ {p.amount.toLocaleString()}</strong>
          </div>
        ))}
      </div>

      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 flex justify-between items-center">
        <span className="text-sm font-bold">{isBn ? 'সমন্বিত মোট ভ্রমণ কর:' : 'Combined Illustrative Travel Tax:'}</span>
        <strong className="text-xl font-mono text-teal-700 dark:text-teal-300">৳ {totalAmount.toLocaleString()}</strong>
      </div>

      <AppTextField
        label={isBn ? 'রসিদের জন্য মোবাইল নম্বর' : 'Receipt Mobile Number'}
        value={receiptMobile}
        previewRestricted
        required={totalAmount > 0}
        onChange={(e) => onChangeReceiptMobile(e.target.value)}
        placeholder="01XXXXXXXXX"
        error={Boolean(mobileError)}
        helperText={mobileError || (totalAmount > 0 ? (isBn ? 'পরিশোধযোগ্য চালানের জন্য ১১ ডিজিটের মোবাইল নম্বর বাধ্যতামূলক (ইমেইল বাধ্যতামূলক নয়)।' : 'Required 11-digit BD mobile (01XXXXXXXXX) for payable challan. Email not required.') : (isBn ? 'শূন্য-কর মূল্যায়নের জন্য ঐচ্ছিক।' : 'Optional for zero-tax assessments.'))}
        slotProps={{ htmlInput: { inputMode: 'tel', maxLength: 15 } }}
      />

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {isAuthenticated ? <AppButton type="button" actionType="secondary" previewRestricted onClick={onSaveDraft}>{t('saveDraft')}</AppButton> : <span />}
        <AppButton type="button" actionType="primary" intent="confirm" previewRestricted endIcon={totalAmount > 0 ? <ArrowRight size={16} /> : <CheckCircle size={16} />} onClick={onProceed}>
          {totalAmount > 0 ? (isBn ? 'পেমেন্ট মাধ্যমে এগিয়ে যান' : 'Proceed to Payment Channel') : (isBn ? 'শূন্য-কর মূল্যায়ন সম্পন্ন করুন' : 'Complete Zero-Tax Assessment')}
        </AppButton>
      </div>
    </div>
  );
};
