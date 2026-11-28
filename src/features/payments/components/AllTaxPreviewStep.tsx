import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppRadioCard, AppRadioGroup } from '../../../design-system/selection';
import type { PaymentLineItem, TaxHeadCategory } from '../../../types/tax';
import { getAllTaxCategorySpec } from '../allTaxCatalogue';
import {
  ACTIVE_PAYMENT_CHANNEL_OPTIONS,
  type ActivePaymentChannel,
} from '../paymentChannels';

interface AllTaxPreviewStepProps {
  userTin: string;
  userName: string;
  isForBeneficiary: boolean;
  beneficiaryTin: string;
  selectedCategory: TaxHeadCategory;
  paymentChannel: ActivePaymentChannel;
  items?: readonly PaymentLineItem[];
  totalAmount: number;
  onChangeChannel: (channel: ActivePaymentChannel) => void;
  onBack: () => void;
  onConfirmPayment: () => void;
}

export const AllTaxPreviewStep: React.FC<AllTaxPreviewStepProps> = ({
  userTin,
  userName,
  isForBeneficiary,
  beneficiaryTin,
  selectedCategory,
  paymentChannel,
  items = [],
  totalAmount,
  onChangeChannel,
  onBack,
  onConfirmPayment,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const catSpec = getAllTaxCategorySpec(selectedCategory);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col gap-6">
      <h3 className="text-lg font-bold">
        {isBn ? 'চূড়ান্ত পেমেন্ট প্রিভিউ ও মাধ্যম নির্বাচন' : 'Final Payment Preview & Gateway Selection'}
      </h3>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
        <div className="flex justify-between gap-2">
          <span className="text-slate-500">{isBn ? 'প্রাথমিক প্রদানকারী:' : 'Payer:'}</span>
          <strong className="font-mono text-right">
            {userTin || 'Walk-In'} ({userName})
          </strong>
        </div>
        {isForBeneficiary && beneficiaryTin && (
          <div className="flex justify-between gap-2">
            <span className="text-slate-500">{isBn ? 'প্রাপকের টিআইএন:' : 'Beneficiary TIN:'}</span>
            <strong className="font-mono">{beneficiaryTin}</strong>
          </div>
        )}
        <div className="flex justify-between gap-2">
          <span className="text-slate-500">{isBn ? 'বিভাগ:' : 'Category:'}</span>
          <span className="font-semibold">{isBn ? catSpec.titleBn : catSpec.titleEn}</span>
        </div>
      </div>

      {items.length > 0 && (
        <div className="border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-800 text-xs">
          {items.map((item, idx) => (
            <div key={`${item.headId}-${idx}`} className="p-3.5 flex items-start justify-between gap-3">
              <div className="min-w-0 space-y-0.5">
                <div className="font-semibold text-slate-900 dark:text-white break-words">
                  [{item.headCode}] {isBn ? item.headNameBn : item.headNameEn}
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  AY: {item.assessmentYear}
                  {item.taxpayerTin ? ` · ${item.taxpayerName ?? ''} (${item.taxpayerTin})` : ''}
                </div>
                {item.remarks && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-300 whitespace-pre-wrap break-words pt-1">
                    {item.remarks}
                  </p>
                )}
              </div>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400 shrink-0">
                ৳ {item.amount.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      )}

      <AppRadioGroup
        label={t('selectPaymentChannel')}
        helperText={t('selectPaymentChannelHelper')}
        value={paymentChannel}
        onChange={(_, value) => onChangeChannel(value as ActivePaymentChannel)}
        columns={3}
        palette="brand"
      >
        {ACTIVE_PAYMENT_CHANNEL_OPTIONS.map((channel) => (
          <AppRadioCard
            key={channel.value}
            value={channel.value}
            title={channel.title}
            description={channel.description}
            palette="brand"
          />
        ))}
      </AppRadioGroup>

      <div className="p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-emerald-800 dark:text-emerald-300 font-medium">
            {isBn ? 'সমন্বিত নমুনা মোট' : 'Total Amount to Settle'}
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-100">
            ৳ {totalAmount.toLocaleString()}
          </div>
        </div>
        <ShieldCheck className="text-emerald-600" size={32} />
      </div>

      <div className="flex gap-4 pt-2">
        <AppButton actionType="secondary" onClick={onBack} sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}>
          {t('back')}
        </AppButton>
        <AppButton actionType="primary" intent="confirm" previewRestricted endIcon={<CheckCircle size={16} />} onClick={onConfirmPayment} sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem', boxShadow: 2 }}>
          {t('confirmPayment')}
        </AppButton>
      </div>
    </div>
  );
};
