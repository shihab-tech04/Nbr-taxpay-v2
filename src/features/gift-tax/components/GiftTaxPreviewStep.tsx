import React from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import { ArrowLeft, ArrowRight, CheckCircle, Pencil, Save } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { formatYmdDisplay, maskTinForDisplay } from '../../../design-system/forms';
import { AppCheckbox } from '../../../design-system/selection';
import { getRelationshipLabel } from '../giftTaxLogic';
import type { GiftPartyRecord, GiftRelationship, GiftTaxCalculation } from '../giftTaxTypes';

interface GiftTaxPreviewStepProps {
  donor: GiftPartyRecord;
  donee: GiftPartyRecord;
  relationship: GiftRelationship;
  relationshipTag: string;
  giftDate: string;
  description: string;
  remarks: string;
  calculation: GiftTaxCalculation;
  acknowledged: boolean;
  ackError?: string;
  submitError?: string;
  isAuthenticated: boolean;
  onChangeAcknowledged: (checked: boolean) => void;
  onEditParties: () => void;
  onEditValuation: () => void;
  onSaveDraft: () => void;
  onBack: () => void;
  onProceed: () => void;
}

export const GiftTaxPreviewStep: React.FC<GiftTaxPreviewStepProps> = (p) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const isBn = lang === 'bn';
  const isZeroTax = p.calculation.calculatedTax === 0;
  const relSummary =
    p.relationship === 'Others' && p.relationshipTag.trim()
      ? `${getRelationshipLabel(p.relationship, lang)} · ${p.relationshipTag.trim()}`
      : getRelationshipLabel(p.relationship, lang);

  return (
    <div className="space-y-5" data-testid="gift-stage-3">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {isBn ? 'ধাপ ৩: চূড়ান্ত দানকর প্রিভিউ' : 'Stage 3 — Final Gift Tax Preview'}
      </h3>

      {p.submitError && <Alert severity="error" data-testid="payment-submit-error">{p.submitError}</Alert>}

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <strong className="text-teal-700 dark:text-teal-300">{isBn ? 'দাতা, গ্রহীতা ও ক্রেডিট নির্ধারণ' : 'Donor, Donee & Attribution'}</strong>
          <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<Pencil size={13} />} onClick={p.onEditParties} data-testid="gift-edit-parties-btn">{t('edit')}</AppButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div><span className="text-slate-500 block">{isBn ? 'দাতা (কর ক্রেডিট ও পক্ষভুক্তি / On Behalf Of)' : 'Donor (Credit Attribution & On Behalf Of)'}</span><strong>{p.donor.name} ({maskTinForDisplay(p.donor.tin)})</strong></div>
          <div><span className="text-slate-500 block">{isBn ? 'গ্রহীতা (যার মাধ্যমে / Through)' : 'Donee (Through)'}</span><strong>{p.donee.name} ({maskTinForDisplay(p.donee.tin)})</strong></div>
          <div><span className="text-slate-500 block">{t('relationship')}</span><strong>{relSummary}</strong></div>
          <div className="text-teal-700 dark:text-teal-300 font-medium flex items-end">{t('giftTaxDonorCreditNote')}</div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <strong className="text-teal-700 dark:text-teal-300">{isBn ? 'দান ও প্রগতিশীল কর প্রাক্কলন' : 'Gift Valuation & Estimate'}</strong>
          <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<Pencil size={13} />} onClick={p.onEditValuation} data-testid="gift-edit-valuation-btn">{t('edit')}</AppButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div><span className="text-slate-500 block">{t('giftValueBdt')}</span><strong className="font-mono">৳ {p.calculation.giftAmount.toLocaleString()}</strong></div>
          <div><span className="text-slate-500 block">{t('giftDate')}</span><strong className="font-mono">{formatYmdDisplay(p.giftDate, lang)}</strong></div>
          <div><span className="text-slate-500 block">{t('giftDescription')}</span><strong>{p.description}</strong></div>
          <div><span className="text-slate-500 block">{t('giftRemarksOptional')}</span><strong>{p.remarks.trim() || '—'}</strong></div>
        </div>
        <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
          <span className="font-semibold text-slate-600 dark:text-slate-300">{isBn ? 'উদাহরণমূলক প্রাক্কলন (সরকারি দায় নয়):' : 'Illustrative Gift Tax Estimate (Not Official):'}</span>
          <strong className="text-lg font-mono text-teal-700 dark:text-teal-300">৳ {p.calculation.calculatedTax.toLocaleString()}</strong>
        </div>
      </div>

      {isZeroTax && (
        <div className="space-y-3">
          <Alert severity="info" data-testid="gift-zero-tax-notice">
            {isBn
              ? 'ঘোষিত দানের মূল্য ২০,০০০ টাকার অব্যাহতি সীমার মধ্যে রয়েছে (প্রাক্কলিত কর ৳ ০)। কোনো পেমেন্ট মাধ্যম ছাড়াই শূন্য-কর ঘোষণা সম্পন্ন করা যাবে।'
              : 'Declared gift value falls within the ৳20,000 exempt allowance (৳0 estimated tax). No payment channel is needed to record this zero-tax declaration.'}
          </Alert>
          <AppCheckbox
            data-testid="gift-preview-ack-checkbox"
            checked={p.acknowledged}
            previewRestricted
            onChange={(_, checked) => p.onChangeAcknowledged(checked)}
            label={isBn
              ? 'আমি নিশ্চিত করছি যে দাতার ক্রেডিট, গ্রহীতার (Through) তথ্য ও শূন্য-কর প্রাক্কলন সঠিক এবং এটি কেবল একটি নমুনা ঘোষণা।'
              : 'I confirm Donor credit attribution (On Behalf Of), Donee (Through), and understand this zero-tax summary is an illustrative non-statutory preview.'}
          />
          {p.ackError && <Alert severity="error" data-testid="gift-ack-error">{p.ackError}</Alert>}
        </div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
        <div className="flex items-center gap-2">
          <AppButton actionType="secondary" startIcon={<ArrowLeft size={15} />} onClick={p.onBack}>{t('back')}</AppButton>
          {p.isAuthenticated && <AppButton actionType="secondary" surface="outlined" startIcon={<Save size={15} />} onClick={p.onSaveDraft} previewRestricted>{t('saveDraft')}</AppButton>}
        </div>
        <AppButton
          actionType="primary"
          intent={isZeroTax ? 'confirm' : undefined}
          previewRestricted
          endIcon={isZeroTax ? <CheckCircle size={16} /> : <ArrowRight size={16} />}
          onClick={p.onProceed}
          data-testid="gift-proceed-channel-btn"
        >
          {isZeroTax
            ? (isBn ? 'শূন্য-কর ঘোষণা সম্পন্ন করুন' : 'Complete Zero-Tax Declaration')
            : (isBn ? 'পেমেন্ট মাধ্যমে এগিয়ে যান' : 'Proceed to Payment Channel')}
        </AppButton>
      </div>
    </div>
  );
};
