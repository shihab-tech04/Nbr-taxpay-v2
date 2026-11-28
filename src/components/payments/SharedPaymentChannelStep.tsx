import React from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import { CheckCircle, ShieldCheck } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppCheckbox, AppRadioCard, AppRadioGroup } from '../../design-system/selection';
import {
  ACTIVE_PAYMENT_CHANNEL_OPTIONS,
  type ActivePaymentChannel,
} from './paymentChannels';

export interface SharedPaymentChannelStepProps {
  paymentChannel: ActivePaymentChannel;
  totalAmount: number;
  itemCount: number;
  itemCountLabel?: string;
  testId?: string;
  requireAcknowledgement?: boolean;
  acknowledged?: boolean;
  acknowledgementLabel?: string;
  acknowledgementError?: string;
  submitError?: string;
  isSubmitting?: boolean;
  onChangeAcknowledged?: (checked: boolean) => void;
  onChangeChannel: (channel: ActivePaymentChannel) => void;
  onBack: () => void;
  onConfirmPayment: () => void;
}

export const SharedPaymentChannelStep: React.FC<SharedPaymentChannelStepProps> = ({
  paymentChannel,
  totalAmount,
  itemCount,
  itemCountLabel,
  testId = 'all-tax-channel-step',
  requireAcknowledgement = false,
  acknowledged = false,
  acknowledgementLabel,
  acknowledgementError,
  submitError,
  isSubmitting = false,
  onChangeAcknowledged,
  onChangeChannel,
  onBack,
  onConfirmPayment,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <div
      data-testid={testId}
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 flex flex-col gap-6"
    >
      <div>
        <h3 className="text-lg font-bold">
          {isBn ? 'পেমেন্ট মাধ্যম নির্বাচন' : 'Select Payment Channel'}
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {itemCountLabel ??
            (isBn
              ? `${itemCount}টি কর খাতের সমন্বিত পরিশোধের জন্য একটি মাধ্যম বেছে নিন।`
              : `Choose an illustrative payment gateway for ${itemCount} configured tax head(s).`)}
        </p>
      </div>

      {submitError && (
        <Alert severity="error" data-testid="payment-submit-error">
          {submitError}
        </Alert>
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

      {requireAcknowledgement && onChangeAcknowledged && (
        <div className="space-y-2">
          <AppCheckbox
            data-testid="channel-acknowledgement-checkbox"
            checked={acknowledged}
            previewRestricted
            onChange={(_, checked) => onChangeAcknowledged(checked)}
            label={
              acknowledgementLabel ??
              (isBn
                ? 'আমি উপরের করের বিবরণ, ক্রেডিট প্রাপক ও উদাহরণমূলক প্রিভিউ শর্তাবলি নিশ্চিত করছি।'
                : 'I confirm the tax attribution, preview details, and understand this is an illustrative prototype payment.')
            }
          />
          {acknowledgementError && (
            <Alert severity="error" data-testid="channel-acknowledgement-error">
              {acknowledgementError}
            </Alert>
          )}
        </div>
      )}

      <div className="flex gap-4 pt-2">
        <AppButton actionType="secondary" onClick={onBack} disabled={isSubmitting} sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}>
          {t('back')}
        </AppButton>
        <AppButton
          actionType="primary"
          intent="confirm"
          previewRestricted
          disabled={isSubmitting}
          endIcon={<CheckCircle size={16} />}
          onClick={onConfirmPayment}
          data-testid="confirm-channel-payment-btn"
          sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem', boxShadow: 2 }}
        >
          {submitError ? (isBn ? 'আবার চেষ্টা করুন' : 'Retry Payment') : t('confirmPayment')}
        </AppButton>
      </div>
    </div>
  );
};
