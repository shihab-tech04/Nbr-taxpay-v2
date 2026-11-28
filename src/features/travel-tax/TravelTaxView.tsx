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
  calculatePassengerTax,
  calculateTotalTravelTax,
  validateTravelFormStep,
  type TravelFormErrors,
  type TravelPassenger,
} from './travelTaxLogic';

export const TravelTaxView: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user, isAuthenticated, activeScope, addTransaction } = useApp();

  const [passengers, setPassengers] = useState<TravelPassenger[]>([
    {
      id: 'p-1',
      passengerName: isAuthenticated ? user.name : '',
      passportNumber: 'A06829102',
      passportType: 'BD',
      travelMode: 'Air',
      destinationZone: 'India',
      travelClass: 'Economy',
      passengerCategory: 'Adult',
      medicalExempt: false,
    },
  ]);
  const [step, setStep] = useState<'form' | 'preview' | 'success'>('form');
  const [completedTx, setCompletedTx] = useState<PaymentTransaction | null>(null);
  const [certOpen, setCertOpen] = useState(false);
  const [errors, setErrors] = useState<TravelFormErrors>({});

  const handleAddPassenger = () => {
    setPassengers((prev) => [
      ...prev,
      {
        id: `p-${Date.now()}`,
        passengerName: '',
        passportNumber: '',
        passportType: 'BD',
        travelMode: 'Air',
        destinationZone: 'India',
        travelClass: 'Economy',
        passengerCategory: 'Adult',
        medicalExempt: false,
      },
    ]);
  };

  const handleRemovePassenger = (index: number) => {
    if (passengers.length <= 1) return;
    setPassengers((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdatePassenger = (index: number, updated: TravelPassenger) => {
    setPassengers((prev) => prev.map((item, idx) => (idx === index ? updated : item)));
    if (errors.passengers) {
      setErrors({});
    }
  };

  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const nextErrors = validateTravelFormStep(passengers, {
      invalidPassport: t('invalidPassportError'),
      requiredPassengerName: t('requiredPassengerNameError'),
    });
    if (nextErrors.passengers && Object.keys(nextErrors.passengers).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setStep('preview');
  };

  const handlePay = () => {
    if (!isRestrictedOperationAllowed('payment_submit')) return;
    const totalAmount = calculateTotalTravelTax(passengers);
    const items = passengers.map((p) => ({
      headId: 'h5',
      headCode: '0120',
      headNameEn: `Travel Tax - ${p.travelMode} / ${p.destinationZone} (${p.passportNumber})`,
      headNameBn: `ভ্রমণ কর - ${p.travelMode} (${p.passengerName})`,
      assessmentYear: '2025-2026',
      amount: calculatePassengerTax(p),
      remarks: `Passport: ${p.passportNumber}, Mode: ${p.travelMode}, Class: ${p.travelClass}, Cat: ${p.passengerCategory}`,
    }));

    const tx = addTransaction({
      taxpayerTin: isAuthenticated ? user.tin : '',
      taxpayerName: isAuthenticated ? user.name : (passengers[0]?.passengerName || 'Walk-in Passenger'),
      ownerScope: activeScope,
      originMode: isAuthenticated ? 'signed_in' : 'walk_in',
      category: 'travel_tax',
      travelDetails: {
        passportNumber: passengers[0]?.passportNumber || '',
        passengerName: passengers[0]?.passengerName || '',
        destination: `${passengers[0]?.travelMode} - ${passengers[0]?.destinationZone}`,
        travelClass: passengers[0]?.travelClass || 'Economy',
      },
      items,
      totalAmount,
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
          subtitle="Departure tax assessment for international air, land, and water travel with multi-passenger allocation."
        />

        {step === 'form' && (
          <TravelTaxFormStep
            passengers={passengers}
            errors={errors}
            onChangePassenger={handleUpdatePassenger}
            onAddPassenger={handleAddPassenger}
            onRemovePassenger={handleRemovePassenger}
            onSubmit={handleProceed}
          />
        )}

        {step === 'preview' && (
          <TravelTaxPreviewStep
            passengers={passengers}
            onBack={() => setStep('form')}
            onPay={handlePay}
          />
        )}

        {step === 'success' && completedTx && (
          <PaymentSuccessCard
            title="Sample Travel Tax Preview Recorded"
            subtitle={`Illustrative prototype record for ${passengers.length} passenger(s) (not an official departure challan).`}
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
