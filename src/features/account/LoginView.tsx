import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowRight, RotateCw, ShieldAlert, UserCheck } from 'lucide-react';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppButton } from '../../design-system/buttons';
import { AppNumberField, validateTin } from '../../design-system/forms';
import { AppRadioGroup } from '../../design-system/selection';
import {
  lookupTinIdentity,
  sanitizeReturnPath,
  verifySimulationOtp,
  type OtpDeliveryChannel,
  type TinLookupResult,
} from './accountAdapter';

export const LoginView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeOtpSignIn } = useApp();

  const [tin, setTin] = useState('882349102384');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'tin' | 'otp'>('tin');
  const [channel, setChannel] = useState<OtpDeliveryChannel>('sms');
  const [lookupResult, setLookupResult] = useState<TinLookupResult | null>(() => lookupTinIdentity('882349102384'));
  const [tinError, setTinError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendCount, setResendCount] = useState(0);
  const [cooldownSec, setCooldownSec] = useState(0);

  const returnTarget = sanitizeReturnPath(searchParams.get('returnTo'));

  useEffect(() => {
    if (cooldownSec <= 0) return;
    const id = setTimeout(() => setCooldownSec((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearTimeout(id);
  }, [cooldownSec]);

  const handleTinChange = (nextTin: string) => {
    setTin(nextTin);
    if (tinError) setTinError('');
    setLookupResult(lookupTinIdentity(nextTin));
  };

  const handleTinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('sign_in')) return;
    const validation = validateTin(tin);
    const resolved = lookupTinIdentity(tin);
    if (!validation.valid || !resolved) {
      setTinError(t('invalidTinError'));
      return;
    }
    setLookupResult(resolved);
    setTinError('');
    setOtpError('');
    setStep('otp');
  };

  const handleResendOtp = () => {
    if (!isRestrictedOperationAllowed('sign_in') || cooldownSec > 0) return;
    setResendCount((prev) => prev + 1);
    setCooldownSec(5);
    setOtpError('');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('sign_in')) return;
    const check = verifySimulationOtp(otp);
    if (!check.valid) {
      setOtpError(
        check.reason === 'format'
          ? t('invalidOtpError')
          : isBn
          ? 'ওটিপি মেলেনি। প্রদর্শনী কোড 123456 ব্যবহার করুন।'
          : 'Incorrect OTP code. Use demo code 123456 to continue.'
      );
      return;
    }
    const targetProfile = (lookupResult ?? lookupTinIdentity(tin))?.profile;
    if (!targetProfile) return;
    setOtpError('');
    completeOtpSignIn(targetProfile);
    navigate(returnTarget);
  };

  const activeError = step === 'tin' ? tinError : otpError;
  const activeChannelMask = lookupResult ? (channel === 'sms' ? lookupResult.maskedSms : lookupResult.maskedEmail) : '—';

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-5">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center mx-auto font-bold text-lg">সহ</div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{isBn ? 'করদাতা সাইন ইন' : 'Citizen Taxpayer Sign In'}</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {isBn ? '১২-অঙ্কের টিআইএন এবং গোপনীয় ওটিপি দিয়ে সাইন ইন করুন' : 'Verify identity with 12-digit TIN and masked OTP channel'}
          </p>
        </div>

        {activeError && (
          <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
            {activeError}
          </div>
        )}

        {step === 'tin' ? (
          <form onSubmit={handleTinSubmit} noValidate className="space-y-4">
            <AppNumberField
              label={t('taxpayerTin')}
              maxLength={12}
              value={tin}
              onChange={(e) => handleTinChange(e.target.value)}
              placeholder={t('tinPlaceholder')}
              required
              error={Boolean(tinError)}
              helperText={tinError || t('tinHelperText')}
              slotProps={{ htmlInput: { autoComplete: 'username' } }}
            />
            {lookupResult && (
              <div data-testid="login-masked-contacts" className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                <div className="font-semibold text-slate-700 dark:text-slate-200">{lookupResult.maskedNameHint}</div>
                <AppRadioGroup
                  orientation="horizontal"
                  name="otp-channel"
                  label={isBn ? 'ওটিপি পাঠানোর মাধ্যম' : 'Select masked contact'}
                  value={channel}
                  onChange={(_, val) => setChannel(val as OtpDeliveryChannel)}
                  options={[
                    { value: 'sms', label: `SMS (${lookupResult.maskedSms})` },
                    { value: 'email', label: `Email (${lookupResult.maskedEmail})` },
                  ]}
                />
              </div>
            )}
            <AppButton type="submit" actionType="primary" size="large" fullWidth previewRestricted endIcon={<ArrowRight size={16} />}>
              Continue with OTP
            </AppButton>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} noValidate className="space-y-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg text-xs text-teal-800 dark:text-teal-200 space-y-1">
              <div>
                OTP sent via <strong className="uppercase">{channel}</strong> to <strong className="font-mono">{activeChannelMask}</strong> (Simulation: <span className="font-mono font-bold">123456</span>)
              </div>
              {resendCount > 0 && (
                <div data-testid="otp-resent-status" className="font-semibold text-emerald-700 dark:text-emerald-300">
                  {isBn ? `পুনরায় ওটিপি পাঠানো হয়েছে (#${resendCount})` : `OTP resent (#${resendCount})`}
                </div>
              )}
            </div>
            <AppNumberField
              label={t('otpLabel')}
              maxLength={6}
              value={otp}
              onChange={(e) => { setOtp(e.target.value); if (otpError) setOtpError(''); }}
              placeholder={t('otpPlaceholder')}
              required
              error={Boolean(otpError)}
              helperText={otpError || t('otpHelperText')}
              slotProps={{ htmlInput: { autoComplete: 'one-time-code', className: 'text-center font-mono tracking-widest text-lg' } }}
            />
            <div className="flex items-center justify-between text-xs">
              <AppButton type="button" actionType="secondary" surface="ghost" size="small" previewRestricted disabled={cooldownSec > 0} startIcon={<RotateCw size={14} />} onClick={handleResendOtp}>
                {cooldownSec > 0 ? (isBn ? `${cooldownSec}সে পরে` : `Resend (${cooldownSec}s)`) : isBn ? 'পুনরায় পাঠান' : 'Resend OTP'}
              </AppButton>
              <AppButton type="button" actionType="secondary" surface="ghost" size="small" onClick={() => { setOtpError(''); setStep('tin'); }}>
                {isBn ? 'টিআইএন পরিবর্তন' : 'Change TIN'}
              </AppButton>
            </div>
            <div className="flex gap-3">
              <AppButton type="button" actionType="secondary" onClick={() => { setOtpError(''); setStep('tin'); }} sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}>
                {t('back')}
              </AppButton>
              <AppButton type="submit" actionType="primary" previewRestricted endIcon={<UserCheck size={16} />} sx={{ width: '66.667%', borderRadius: '12px', py: 1.5 }}>
                Verify & Sign In
              </AppButton>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldAlert size={13} className="text-amber-600 shrink-0" />
            <span>{isBn ? 'শুধু টিআইএন লিখলে কোনো ব্যক্তিগত তথ্য উন্মুক্ত হয় না।' : 'Entering a TIN never grants access without OTP verification.'}</span>
          </div>
          <AppButton actionType="secondary" surface="outlined" size="small" fullWidth onClick={() => navigate('/all-taxes')}>
            {isBn ? 'সাইন-ইন ছাড়া ওয়াক-ইন হিসেবে পেমেন্ট করুন' : 'Continue as Walk-In Taxpayer'}
          </AppButton>
        </div>
      </div>
    </div>
  );
};
