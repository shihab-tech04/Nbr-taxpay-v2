import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { ReceiptModal } from '../../components/ReceiptModal';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import type { PaymentTransaction } from '../../types/tax';
import { PaymentStepHeader } from '../../components/payments/PaymentStepHeader';
import { PaymentSuccessCard } from '../../components/payments/PaymentSuccessCard';
import { TravelTaxFormStep } from './components/TravelTaxFormStep';
import { TravelTaxPreviewStep } from './components/TravelTaxPreviewStep';
import {
  resolveDestinationBaseTax,
  validateTravelFormStep,
  type TravelClass,
  type TravelFormErrors,
} from './travelTaxLogic';

export const TravelTaxView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, activeScope, addTransaction } = useApp();

  const [passportNumber, setPassportNumber] = useState('A06829102');
  const [passengerName, setPassengerName] = useState(isAuthenticated ? user.name : '');
  const [destination, setDestination] = useState('India (By Air)');
  const [travelClass, setTravelClass] = useState<TravelClass>('Economy');
  const [amount, setAmount] = useState<number>(2000);
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [certOpen, setCertOpen] = useState(false);
  const [errors, setErrors] = useState<TravelFormErrors>({});

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const nextErrors = validateTravelFormStep(
      { passportNumber, passengerName },
      {
        invalidPassport: t('invalidPassportError'),
        requiredPassengerName: t('requiredPassengerNameError'),
      }
    );
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep('preview');
  };

  const handlePay = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const tx = addTransaction({
      taxpayerTin: isAuthenticated ? user.tin : '',
      taxpayerName: isAuthenticated ? user.name : passengerName,
      ownerScope: activeScope,
      originMode: isAuthenticated ? 'signed_in' : 'walk_in',
      category: 'travel_tax',
      travelDetails: {
        passportNumber,
        passengerName,
        destination,
        travelClass,
      },
      items: [
        {
          headId: 'h5',
          headCode: '0120',
          headNameEn: `Travel Tax - ${destination} (${passportNumber})`,
          headNameBn: `ভ্রমণ কর - ${destination}`,
          assessmentYear: '2025-2026',
          amount,
          remarks: `Passport: ${passportNumber}, Class: ${travelClass}`,
        },
      ],
      totalAmount: amount,
      paymentChannel: 'bKash',
      status: 'Completed',
    });
    setCompletedTx(tx);
    setStep('success');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-3xl mx-auto space-y-8">
        <PaymentStepHeader
          title={
            <>
              <Plane className="text-teal-700" size={28} /> {t('travelTax')}
            </>
          }
          subtitle="Departure tax assessment for international air, land, and water travel."
        />

        {step === 'form' && (
          <TravelTaxFormStep
            passportNumber={passportNumber}
            passengerName={passengerName}
            destination={destination}
            travelClass={travelClass}
            baseAmount={amount}
            errors={errors}
            onChangePassport={(val) => {
              setPassportNumber(val);
              if (errors.passport) setErrors((p) => ({ ...p, passport: undefined }));
            }}
            onChangePassengerName={(val) => {
              setPassengerName(val);
              if (errors.passengerName) setErrors((p) => ({ ...p, passengerName: undefined }));
            }}
            onChangeDestination={(dest) => {
              setDestination(dest);
              setAmount(resolveDestinationBaseTax(dest));
            }}
            onChangeTravelClass={setTravelClass}
            onSubmit={handleProceed}
          />
        )}

        {step === 'preview' && (
          <TravelTaxPreviewStep
            passengerName={passengerName}
            passportNumber={passportNumber}
            destination={destination}
            travelClass={travelClass}
            baseAmount={amount}
            onBack={() => setStep('form')}
            onPay={handlePay}
          />
        )}

        {step === 'success' && completedTx && (
          <PaymentSuccessCard
            title="Sample Travel Tax Preview Recorded"
            subtitle={`Illustrative prototype record for passport ${passportNumber} (not an official departure challan).`}
            onViewReceipt={() => setCompletedTx(completedTx)}
            onViewCertificate={() => setCertOpen(true)}
            onReturnDashboard={() => navigate('/dashboard')}
          />
        )}
      </div>

      <ReceiptModal
        open={Boolean(completedTx && step === 'success' && !certOpen)}
        onClose={() => navigate('/dashboard')}
        transaction={completedTx}
        isAuthenticated={isAuthenticated}
      />
      <PaymentCertificateDialog
        open={certOpen}
        onClose={() => setCertOpen(false)}
        transaction={completedTx}
        isAuthenticated={isAuthenticated}
      />
    </div>
  );
};
