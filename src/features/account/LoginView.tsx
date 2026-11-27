import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { ArrowRight, UserCheck } from 'lucide-react';
import { AppNumberField, validateOtp, validateTin } from '../../design-system/forms';

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

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Continue with OTP <ArrowRight size={16} />
            </button>
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
              <button
                type="button"
                onClick={() => {
                  setOtpError('');
                  setStep('tin');
                }}
                className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                {t('back')}
              </button>
              <button
                type="submit"
                className="w-2/3 py-3 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                Verify & Sign In <UserCheck size={16} />
              </button>
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
