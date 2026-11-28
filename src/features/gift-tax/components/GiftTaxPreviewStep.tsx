import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, CheckCircle, Pencil, Save } from 'lucide-react';
import { ACTIVE_PAYMENT_CHANNEL_OPTIONS, type ActivePaymentChannel } from '../../../components/payments/paymentChannels';
import { AppButton } from '../../../design-system/buttons';
import { formatYmdDisplay, maskTinForDisplay } from '../../../design-system/forms';
import { AppRadioCard, AppRadioGroup } from '../../../design-system/selection';
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
  paymentChannel: ActivePaymentChannel;
  isAuthenticated: boolean;
  onChangeChannel: (ch: ActivePaymentChannel) => void;
  onEditParties: () => void;
  onEditValuation: () => void;
  onSaveDraft: () => void;
  onBack: () => void;
  onPay: () => void;
}

export const GiftTaxPreviewStep: React.FC<GiftTaxPreviewStepProps> = (p) => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'bn' ? 'bn' : 'en';
  const isBn = lang === 'bn';

  return (
    <div className="space-y-5" data-testid="gift-stage-3">
      <h3 className="text-base font-bold text-slate-900 dark:text-white">
        {isBn ? 'ধাপ ৩: চূড়ান্ত প্রিভিউ ও পেমেন্ট মাধ্যম' : 'Stage 3 — Final Preview & Payment Channel'}
      </h3>

      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 space-y-2.5 text-xs">
        <div className="flex items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
          <strong className="text-teal-700 dark:text-teal-300">{isBn ? 'দাতা, গ্রহীতা ও ক্রেডিট নির্ধারণ' : 'Donor, Donee & Attribution'}</strong>
          <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<Pencil size={13} />} onClick={p.onEditParties} data-testid="gift-edit-parties-btn">{t('edit')}</AppButton>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div><span className="text-slate-500 block">{isBn ? 'দাতা (কর ক্রেডিট ও পক্ষভুক্তি / On Behalf Of)' : 'Donor (Credit Attribution & On Behalf Of)'}</span><strong>{p.donor.name} ({maskTinForDisplay(p.donor.tin)})</strong></div>
          <div><span className="text-slate-500 block">{isBn ? 'গ্রহীতা (যার মাধ্যমে / Through)' : 'Donee (Through)'}</span><strong>{p.donee.name} ({maskTinForDisplay(p.donee.tin)})</strong></div>
          <div><span className="text-slate-500 block">{t('relationship')}</span><strong>{getRelationshipLabel(p.relationship, lang)} · {p.relationshipTag}</strong></div>
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

      <AppRadioGroup label={t('selectPaymentChannel')} helperText={t('selectPaymentChannelHelper')} value={p.paymentChannel} onChange={(_, value) => p.onChangeChannel(value as ActivePaymentChannel)} columns={3} palette="brand">
        {ACTIVE_PAYMENT_CHANNEL_OPTIONS.map((channel) => (
          <AppRadioCard key={channel.value} value={channel.value} title={channel.title} description={channel.description} palette="brand" />
        ))}
      </AppRadioGroup>

      <div className="flex flex-wrap justify-between items-center gap-3 pt-2">
        <div className="flex items-center gap-2">
          <AppButton actionType="secondary" startIcon={<ArrowLeft size={15} />} onClick={p.onBack}>{t('back')}</AppButton>
          {p.isAuthenticated && <AppButton actionType="secondary" surface="outlined" startIcon={<Save size={15} />} onClick={p.onSaveDraft} previewRestricted>{t('saveDraft')}</AppButton>}
        </div>
        <AppButton actionType="primary" intent="confirm" previewRestricted endIcon={<CheckCircle size={16} />} onClick={p.onPay} data-testid="gift-confirm-payment-btn">
          {t('confirmPayment')}
        </AppButton>
      </div>
    </div>
  );
};
