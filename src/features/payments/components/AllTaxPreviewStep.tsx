import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppRadioCard, AppRadioGroup } from '../../../design-system/selection';
import type { TaxHeadCategory } from '../../../types/tax';
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
  totalAmount,
  onChangeChannel,
  onBack,
  onConfirmPayment,
}) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 flex flex-col gap-6">
      <h3 className="text-lg font-bold">Final Payment Preview & Gateway Selection</h3>

      <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs">
        <div className="flex justify-between">
          <span className="text-slate-500">Taxpayer TIN:</span>
          <strong className="font-mono">
            {userTin} ({userName})
          </strong>
        </div>
        {isForBeneficiary && (
          <div className="flex justify-between">
            <span className="text-slate-500">Beneficiary TIN:</span>
            <strong className="font-mono">{beneficiaryTin}</strong>
          </div>
        )}
        <div className="flex justify-between">
          <span className="text-slate-500">Category:</span>
          <span className="capitalize font-semibold">{selectedCategory.replace(/_/g, ' ')}</span>
        </div>
      </div>

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
            Total Amount to Settle
          </span>
          <div className="text-2xl font-bold font-mono text-emerald-900 dark:text-emerald-100">
            ৳ {totalAmount.toLocaleString()}
          </div>
        </div>
        <ShieldCheck className="text-emerald-600" size={32} />
      </div>

      <div className="flex gap-4 pt-4">
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
          onClick={onConfirmPayment}
          sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem', boxShadow: 2 }}
        >
          {t('confirmPayment')}
        </AppButton>
      </div>
    </div>
  );
};
