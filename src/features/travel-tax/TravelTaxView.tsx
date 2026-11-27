import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { Plane, ShieldCheck, CheckCircle, ArrowRight } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentTransaction } from '../../types/tax';
import {
  AppTextField,
  AppSelectField,
  sanitizePassport,
  validatePassport,
} from '../../design-system/forms';

export const TravelTaxView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, addTransaction } = useApp();

  const [passportNumber, setPassportNumber] = useState('A06829102');
  const [passengerName, setPassengerName] = useState(user.name);
  const [destination, setDestination] = useState('India (By Air)');
  const [travelClass, setTravelClass] = useState<'Economy' | 'Business'>('Economy');
  const [amount, setAmount] = useState<number>(2000);
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [errors, setErrors] = useState<{ passport?: string; passengerName?: string }>({});

  const handleDestinationChange = (dest: string) => {
    setDestination(dest);
    if (dest.includes('India')) {
      setAmount(2000);
    } else if (dest.includes('SAARC')) {
      setAmount(3000);
    } else {
      setAmount(5000);
    }
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { passport?: string; passengerName?: string } = {};
    if (!validatePassport(passportNumber)) {
      nextErrors.passport = t('invalidPassportError');
    }
    if (!passengerName.trim()) {
      nextErrors.passengerName = t('requiredPassengerNameError');
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep('preview');
  };

  const handlePay = () => {
    const tx = addTransaction({
      taxpayerTin: user.tin,
      taxpayerName: user.name,
      category: 'travel_tax',
      items: [
        {
          headId: 'h5',
          headCode: '0120',
          headNameEn: `Travel Tax - ${destination} (${passportNumber})`,
          headNameBn: `ভ্রমণ কর - ${destination}`,
          assessmentYear: '2025-2026',
          amount,
          remarks: `Passport: ${passportNumber}, Class: ${travelClass}`
        }
      ],
      totalAmount: amount,
      paymentChannel: 'bKash',
      status: 'Completed'
    });
    setCompletedTx(tx);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Plane className="text-teal-700" size={28} /> {t('travelTax')}
            </h1>
            <p className="text-xs text-slate-500">Departure tax assessment for international air, land, and water travel.</p>
          </div>
        </div>

        {step === 'form' && (
          <form onSubmit={handleProceed} noValidate className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <AppTextField
                  label={t('passportNumber')}
                  value={passportNumber}
                  onChange={e => {
                    setPassportNumber(sanitizePassport(e.target.value, 12));
                    if (errors.passport) setErrors(prev => ({ ...prev, passport: undefined }));
                  }}
                  placeholder={t('passportPlaceholder')}
                  error={Boolean(errors.passport)}
                  helperText={errors.passport || t('passportHelper')}
                  required
                  slotProps={{
                    htmlInput: {
                      maxLength: 12,
                      autoCapitalize: 'characters',
                      className: 'font-mono uppercase'
                    }
                  }}
                />
              </div>

              <div>
                <AppTextField
                  label={t('passengerName')}
                  value={passengerName}
                  onChange={e => {
                    setPassengerName(e.target.value);
                    if (errors.passengerName) setErrors(prev => ({ ...prev, passengerName: undefined }));
                  }}
                  placeholder={t('passengerNamePlaceholder')}
                  error={Boolean(errors.passengerName)}
                  helperText={errors.passengerName || t('passengerNameHelper')}
                  required
                />
              </div>

              <div>
                <AppSelectField
                  label={t('travelDestination')}
                  value={destination}
                  onChange={e => handleDestinationChange(e.target.value)}
                  helperText={t('travelDestinationHelper')}
                  options={[
                    { value: 'India (By Air)', label: t('destIndiaAir') },
                    { value: 'India (By Land/Water)', label: t('destIndiaLandWater') },
                    { value: 'SAARC Countries', label: t('destSaarc') },
                    { value: 'Other International', label: t('destOtherIntl') }
                  ]}
                />
              </div>

              <div>
                <AppSelectField
                  label={t('travelClass')}
                  value={travelClass}
                  onChange={e => setTravelClass(e.target.value as 'Economy' | 'Business')}
                  helperText={t('travelClassHelper')}
                  options={[
                    { value: 'Economy', label: t('classEconomy') },
                    { value: 'Business', label: t('classBusiness') }
                  ]}
                />
              </div>
            </div>

            <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
              <div>
                <span className="text-xs text-teal-800 dark:text-teal-200 font-medium">Calculated Travel Tax</span>
                <div className="text-2xl font-bold font-mono text-teal-900 dark:text-teal-100">
                  ৳ {(travelClass === 'Business' ? amount + 1000 : amount).toLocaleString()}
                </div>
              </div>
              <ShieldCheck className="text-teal-600" size={32} />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl font-semibold text-xs flex items-center justify-center gap-2 transition-colors shadow-sm"
            >
              Proceed to Preview <ArrowRight size={16} />
            </button>
          </form>
        )}

        {step === 'preview' && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6">
            <h3 className="text-lg font-bold">Travel Tax Payment Preview</h3>

            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Passenger Name:</span>
                <strong>{passengerName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Passport Number:</span>
                <strong>{passportNumber}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <strong>{destination}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Travel Class:</span>
                <strong>{travelClass}</strong>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 font-sans">Total Travel Tax:</span>
                <strong className="text-teal-700 text-base">৳ {(travelClass === 'Business' ? amount + 1000 : amount).toLocaleString()}</strong>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                onClick={() => setStep('form')}
                className="w-1/3 py-3 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold hover:bg-slate-50 transition-colors"
              >
                {t('back')}
              </button>
              <button
                onClick={handlePay}
                className="w-2/3 py-3 bg-emerald-500 hover:bg-emerald-600 text-slate-950 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-colors"
              >
                {t('confirmPayment')} <CheckCircle size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 'success' && completedTx && (
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle size={36} />
            </div>
            <h2 className="text-2xl font-bold">Travel Tax Paid Successfully!</h2>
            <p className="text-xs text-slate-500">Departure challan generated for passport {passportNumber}.</p>

            <div className="flex justify-center gap-4 pt-4">
              <button
                onClick={() => setCompletedTx(completedTx)}
                className="px-6 py-3 bg-teal-700 text-white rounded-xl text-xs font-semibold shadow-sm"
              >
                View Official Receipt
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 border border-slate-300 rounded-xl text-xs font-semibold"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      <ReceiptModal
        open={Boolean(completedTx && step === 'success')}
        onClose={() => navigate('/dashboard')}
        transaction={completedTx}
      />
    </div>
  );
};
