import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { ArrowRight, UserCheck } from 'lucide-react';
import { AppNumberField, AppTextField } from '../../design-system/forms';

export const LoginView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { setIsAuthenticated, setUser } = useApp();

  const [tin, setTin] = useState('882349102384');
  const [otp, setOtp] = useState('123456');
  const [step, setStep] = useState<'tin' | 'otp'>('tin');
  const [error, setError] = useState('');

  const handleTinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tin.length !== 12 || !/^\d+$/.test(tin)) {
      setError('Please enter a valid 12-digit numeric TIN');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP code');
      return;
    }
    setIsAuthenticated(true);
    setUser(prev => ({ ...prev, tin }));
    navigate('/dashboard');
  };

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

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg text-xs text-rose-700">
            {error}
          </div>
        )}

        {step === 'tin' ? (
          <form onSubmit={handleTinSubmit} className="space-y-4">
            <div>
              <AppNumberField
                label={t('taxpayerTin')}
                maxLength={12}
                value={tin}
                onChange={e => setTin(e.target.value)}
                placeholder="e.g., 882349102384"
                required
                helperText="Enter exactly 12 numeric digits assigned by NBR."
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
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-lg text-xs text-teal-800 dark:text-teal-200">
              OTP sent to registered mobile linked with TIN <strong className="font-mono">{tin}</strong>. (Simulation code: <span className="font-mono font-bold">123456</span>)
            </div>
            <div>
              <AppTextField
                label="Enter 6-Digit OTP Verification Code"
                inputProps={{ maxLength: 6 }}
                value={otp}
                onChange={e => setOtp(e.target.value)}
                required
                slotProps={{
                  htmlInput: {
                    className: 'text-center font-mono tracking-widest text-lg'
                  }
                }}
              />
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setStep('tin')}
                className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
              >
                Back
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
