import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, HelpCircle } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppPasswordField, AppTextField } from '../../design-system/forms';
import { AppRadioGroup } from '../../design-system/selection';
import type { OtpDeliveryChannel, TinLookupResult } from './accountAdapter';

interface LoginCredentialsPanelProps {
  identifier: string;
  password: string;
  showRecovery: boolean;
  lookupResult: TinLookupResult | null;
  channel: OtpDeliveryChannel;
  fieldError: string;
  isAuthenticated: boolean;
  onChangeIdentifier: (val: string) => void;
  onChangePassword: (val: string) => void;
  onToggleRecovery: () => void;
  onSelectChannel: (channel: OtpDeliveryChannel) => void;
  onFillDemo: (userId: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const LoginCredentialsPanel: React.FC<LoginCredentialsPanelProps> = ({
  identifier,
  password,
  showRecovery,
  lookupResult,
  channel,
  fieldError,
  isAuthenticated,
  onChangeIdentifier,
  onChangePassword,
  onToggleRecovery,
  onSelectChannel,
  onFillDemo,
  onSubmit,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <span>{isBn ? 'দ্রুত ডেমো অ্যাকাউন্ট:' : 'Demo accounts:'}</span>
        <div className="flex items-center gap-1.5">
          <AppButton type="button" actionType="secondary" surface="soft" geometry="compact" size="small" onClick={() => onFillDemo('user1')}>
            user1
          </AppButton>
          <AppButton type="button" actionType="secondary" surface="soft" geometry="compact" size="small" onClick={() => onFillDemo('user2')}>
            user2
          </AppButton>
        </div>
      </div>

      <AppTextField
        label={isBn ? 'টিআইএন বা ইউজার আইডি' : 'TIN or User ID'}
        value={identifier}
        onChange={(e) => onChangeIdentifier(e.target.value)}
        placeholder={isBn ? 'যেমন: user1 বা 882349102384' : 'e.g., user1 or 882349102384'}
        required
        error={Boolean(fieldError)}
        helperText={
          isBn
            ? 'অনুমোদিত ১২-অঙ্কের টিআইএন অথবা ডেমো ইউজার আইডি (user1 / user2) লিখুন।'
            : 'Enter an approved 12-digit TIN or demo User ID (user1 / user2).'
        }
        slotProps={{ htmlInput: { autoComplete: 'username' } }}
      />

      <AppPasswordField
        label={isBn ? 'পাসওয়ার্ড' : 'Password'}
        value={password}
        onChange={(e) => onChangePassword(e.target.value)}
        placeholder={isBn ? 'আপনার পাসওয়ার্ড লিখুন' : 'Enter your password'}
        required
        slotProps={{ htmlInput: { autoComplete: 'current-password' } }}
      />

      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-500">{isBn ? 'আপনার তথ্য ভুলে গেছেন?' : 'Forgot your details?'}</span>
        <AppButton
          type="button"
          actionType="secondary"
          surface="ghost"
          size="small"
          startIcon={<HelpCircle size={14} />}
          aria-expanded={showRecovery}
          aria-controls="taxpayer-login-recovery"
          onClick={onToggleRecovery}
          sx={{ whiteSpace: 'nowrap', flexShrink: 0 }}
        >
          {isBn ? 'অ্যাকাউন্ট পুনরুদ্ধার' : 'Recover Account'}
        </AppButton>
      </div>

      {showRecovery && (
        <div
          id="taxpayer-login-recovery"
          role="status"
          className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200"
        >
          {isBn
            ? 'বর্তমান user1 এবং user2 অ্যাকাউন্টের পাসওয়ার্ড তাদের ইউজার আইডির সমান।'
            : 'For the current user1 and user2 demo accounts, the password is the same as the User ID.'}
        </div>
      )}

      {lookupResult && (
        <div
          data-testid="login-masked-contacts"
          className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
        >
          <div className="font-semibold text-slate-700 dark:text-slate-200">{lookupResult.maskedNameHint}</div>
          <AppRadioGroup
            orientation="horizontal"
            name="otp-channel"
            label={isBn ? 'ওটিপি পাঠানোর মাধ্যম' : 'Select masked contact'}
            value={channel}
            onChange={(_, val) => onSelectChannel(val as OtpDeliveryChannel)}
            options={[
              { value: 'sms', label: `SMS (${lookupResult.maskedSms})` },
              { value: 'email', label: `Email (${lookupResult.maskedEmail})` },
            ]}
          />
        </div>
      )}

      <AppButton
        type="submit"
        actionType="primary"
        size="large"
        fullWidth
        previewRestricted
        disabled={isAuthenticated}
        endIcon={<ArrowRight size={16} />}
      >
        Continue with OTP
      </AppButton>
    </form>
  );
};
