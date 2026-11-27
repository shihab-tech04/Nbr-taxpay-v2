import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { ArrowRight, UserCheck } from 'lucide-react';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppNumberField, validateOtp, validateTin } from '../../design-system/forms';
import { AppButton } from '../../design-system/buttons';

export const LoginView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useApp();

  const [tin, setTin] = useState('882349102384');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'tin' | 'otp'>('tin');
  const [tinError, setTinError] = useState('');
  const [otpError, setOtpError] = useState('');

  const handleTinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('sign_in')) return;
    const validation = validateTin(tin);
    if (!validation.valid) {
      setTinError(t('invalidTinError'));
      return;
    }
    setTinError('');
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('sign_in')) return;
    const validation = validateOtp(otp);
    if (!validation.valid) {
      setOtpError(t('invalidOtpError'));
      return;
    }
    setOtpError('');
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, tin }));
    navigate('/dashboard');
  };

  const activeError = step === 'tin' ? tinError : otpError;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center px-6 py-12">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-teal-700 text-white flex items-center justify-center mx-auto font-bold text-lg">
            সহ
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Citizen Taxpayer Sign In</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Authenticate securely using your 12-digit National TIN</p>
        </div>

        {activeError && (
          <div role="alert" className="p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-lg text-xs text-rose-700 dark:text-rose-300">
            {activeError}
          </div>
        )}

        {step === 'tin' ? (
          <form onSubmit={handleTinSubmit} noValidate className="space-y-4">
            <div>
              <AppNumberField
                label={t('taxpayerTin')}
                maxLength={12}
                value={tin}
                onChange={e => {
                  setTin(e.target.value);
                  if (tinError) setTinError('');
                }}
                placeholder={t('tinPlaceholder')}
                required
                error={Boolean(tinError)}
                helperText={tinError || t('tinHelperText')}
                slotProps={{
                  htmlInput: {
                    autoComplete: 'username'
                  }
                }}
              />
            </div>

            <AppButton
              type="submit"
              actionType="primary"
              size="large"
              fullWidth
              previewRestricted
              endIcon={<ArrowRight size={16} />}
            >
              Continue with OTP
            </AppButton>
          </form>
        ) : (
          <form onSubmit={handleOtpSubmit} noValidate className="space-y-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg text-xs text-teal-800 dark:text-teal-200">
              OTP sent to registered mobile linked with TIN <strong className="font-mono">{tin}</strong>. (Simulation code: <span className="font-mono font-bold">123456</span>)
            </div>
            <div>
              <AppNumberField
                label={t('otpLabel')}
                maxLength={6}
                value={otp}
                onChange={e => {
                  setOtp(e.target.value);
                  if (otpError) setOtpError('');
                }}
                placeholder={t('otpPlaceholder')}
                required
                error={Boolean(otpError)}
                helperText={otpError || t('otpHelperText')}
                slotProps={{
                  htmlInput: {
                    autoComplete: 'one-time-code',
                    className: 'text-center font-mono tracking-widest text-lg'
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <AppButton
                type="button"
                actionType="secondary"
                onClick={() => {
                  setOtpError('');
                  setStep('tin');
                }}
                sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
              >
                {t('back')}
              </AppButton>
              <AppButton
                type="submit"
                actionType="primary"
                previewRestricted
                endIcon={<UserCheck size={16} />}
                sx={{ width: '66.667%', borderRadius: '12px', py: 1.5 }}
              >
                Verify & Sign In
              </AppButton>
            </div>
          </form>
        )}

        <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center text-xs text-slate-500">
          Protected by NBR Secure Gateway Protocol.
        </div>
      </div>
    </div>
  );
};
