import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, RotateCw, ShieldAlert, UserCheck } from 'lucide-react';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppButton } from '../../design-system/buttons';
import { AppNumberField } from '../../design-system/forms';
import {
  lookupTinIdentity,
  sanitizeReturnPath,
  verifyDemoCredentials,
  verifySimulationOtp,
  type OtpDeliveryChannel,
  type TinLookupResult,
} from './accountAdapter';
import { LoginCredentialsPanel } from './LoginCredentialsPanel';

export const LoginView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user, isAuthenticated, completeOtpSignIn, signOutClean } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'tin' | 'otp'>('tin');
  const [channel, setChannel] = useState<OtpDeliveryChannel>('sms');
  const [lookupResult, setLookupResult] = useState<TinLookupResult | null>(null);
  const [showRecovery, setShowRecovery] = useState(false);
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

  const handleIdentifierChange = (nextId: string) => {
    setIdentifier(nextId);
    if (tinError) setTinError('');
    setLookupResult(lookupTinIdentity(nextId));
  };

  const handleFillDemo = (userId: string) => {
    setIdentifier(userId);
    setPassword(userId);
    setTinError('');
    setLookupResult(lookupTinIdentity(userId));
  };

  const handleCredentialsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('sign_in')) return;
    if (isAuthenticated) {
      setTinError(isBn ? 'আগে বর্তমান অ্যাকাউন্ট থেকে সাইন আউট করুন।' : 'Sign out of the current account before switching users.');
      return;
    }
    const matchedDirectory = lookupTinIdentity(identifier);
    if (!matchedDirectory) {
      setTinError(isBn ? 'টিআইএন বা ইউজার আইডি পাওয়া যায়নি। অনুমোদিত ডেমো আইডি দিন।' : 'Unknown TIN or User ID. Enter an approved demo TIN or User ID (user1 / user2).');
      return;
    }
    const verified = verifyDemoCredentials(identifier, password);
    if (!verified) {
      setTinError(isBn ? 'ইউজার আইডি/টিআইএন অথবা পাসওয়ার্ড সঠিক নয়।' : 'Incorrect User ID/TIN or password.');
      return;
    }
    setLookupResult(verified);
    setTinError('');
    setOtpError('');
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('sign_in')) return;
    const check = verifySimulationOtp(otp);
    if (!check.valid) {
      setOtpError(
        check.reason === 'format'
          ? t('invalidOtpError')
          : isBn ? 'ওটিপি মেলেনি। প্রদর্শনী কোড 111111 বা 123456 ব্যবহার করুন।' : 'Incorrect OTP code. Use demo code 111111 or 123456 to continue.'
      );
      return;
    }
    const targetProfile = (lookupResult ?? verifyDemoCredentials(identifier, password))?.profile;
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
            {isBn ? 'ইউজার আইডি/টিআইএন, পাসওয়ার্ড ও ওটিপি দিয়ে সাইন ইন করুন' : 'Sign in using approved User ID or 12-digit TIN, password, and OTP'}
          </p>
        </div>

        {isAuthenticated && (
          <div role="status" className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg text-xs text-amber-900 dark:text-amber-200 flex items-center justify-between gap-3">
            <span>{isBn ? `${user.name} হিসেবে সাইন ইন করা আছে।` : `Signed in as ${user.name}. Sign out first to switch users.`}</span>
            <AppButton type="button" actionType="secondary" size="small" startIcon={<LogOut size={14} />} onClick={signOutClean}>{t('signOut')}</AppButton>
          </div>
        )}

        {activeError && (
          <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">{activeError}</div>
        )}

        {step === 'tin' ? (
          <LoginCredentialsPanel
            identifier={identifier}
            password={password}
            showRecovery={showRecovery}
            lookupResult={lookupResult}
            channel={channel}
            fieldError={tinError}
            isAuthenticated={isAuthenticated}
            onChangeIdentifier={handleIdentifierChange}
            onChangePassword={(val) => { setPassword(val); if (tinError) setTinError(''); }}
            onToggleRecovery={() => setShowRecovery((prev) => !prev)}
            onSelectChannel={setChannel}
            onFillDemo={handleFillDemo}
            onSubmit={handleCredentialsSubmit}
          />
        ) : (
          <form onSubmit={handleOtpSubmit} noValidate className="space-y-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg text-xs text-teal-800 dark:text-teal-200 space-y-1">
              <div>OTP sent via <strong className="uppercase">{channel}</strong> to <strong className="font-mono">{activeChannelMask}</strong> (Demo: <span className="font-mono font-bold">111111</span> / <span className="font-mono font-bold">123456</span>)</div>
              {resendCount > 0 && <div data-testid="otp-resent-status" className="font-semibold text-emerald-700 dark:text-emerald-300">{isBn ? `পুনরায় ওটিপি পাঠানো হয়েছে (#${resendCount})` : `OTP resent (#${resendCount})`}</div>}
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
              <AppButton type="button" actionType="secondary" surface="ghost" size="small" previewRestricted disabled={cooldownSec > 0} startIcon={<RotateCw size={14} />} onClick={() => { if (!isRestrictedOperationAllowed('sign_in') || cooldownSec > 0) return; setResendCount((p) => p + 1); setCooldownSec(5); setOtpError(''); }}>
                {cooldownSec > 0 ? (isBn ? `${cooldownSec}সে পরে` : `Resend (${cooldownSec}s)`) : isBn ? 'পুনরায় পাঠান' : 'Resend OTP'}
              </AppButton>
              <AppButton type="button" actionType="secondary" surface="ghost" size="small" onClick={() => { setOtpError(''); setStep('tin'); }}>
                {isBn ? 'টিআইএন পরিবর্তন' : 'Change TIN'}
              </AppButton>
            </div>
            <div className="flex gap-3">
              <AppButton type="button" actionType="secondary" onClick={() => { setOtpError(''); setStep('tin'); }} sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}>{t('back')}</AppButton>
              <AppButton type="submit" actionType="primary" previewRestricted endIcon={<UserCheck size={16} />} sx={{ width: '66.667%', borderRadius: '12px', py: 1.5 }}>Verify & Sign In</AppButton>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2.5 text-center text-xs text-slate-500">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
            <ShieldAlert size={13} className="text-amber-600 shrink-0" />
            <span>{isBn ? 'এটি একটি ফ্রন্টএন্ড প্রোটোটাইপ সিমুলেশন; প্রকৃত এনবিআর সাইন-ইন নয়।' : 'Frontend prototype simulation only — not live NBR authentication.'}</span>
          </div>
          <AppButton actionType="secondary" surface="outlined" size="small" fullWidth onClick={() => navigate('/all-taxes')}>
            {isBn ? 'সাইন-ইন ছাড়া ওয়াক-ইন হিসেবে পেমেন্ট করুন' : 'Continue as Walk-In Taxpayer'}
          </AppButton>
        </div>
      </div>
    </div>
  );
};
