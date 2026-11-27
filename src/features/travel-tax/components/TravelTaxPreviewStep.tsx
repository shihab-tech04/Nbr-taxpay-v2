import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { calculateTravelDisplayTotal, type TravelClass } from '../travelTaxLogic';

interface TravelTaxPreviewStepProps {
  passengerName: string;
  passportNumber: string;
  destination: string;
  travelClass: TravelClass;
  baseAmount: number;
  onBack: () => void;
  onPay: () => void;
}

export const TravelTaxPreviewStep: React.FC<TravelTaxPreviewStepProps> = ({
  passengerName,
  passportNumber,
  destination,
  travelClass,
  baseAmount,
  onBack,
  onPay,
}) => {
  const { t } = useTranslation();
  const totalDisplay = calculateTravelDisplayTotal(baseAmount, travelClass);

  return (
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
          <strong className="text-teal-700 text-base">৳ {totalDisplay.toLocaleString()}</strong>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <AppButton
          actionType="secondary"
          onClick={onBack}
          sx={{ width: '33.333%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem' }}
        >
          {t('back')}
        </AppButton>
        <AppButton
          actionType="primary"
          intent="confirm"
          previewRestricted
          endIcon={<CheckCircle size={16} />}
          onClick={onPay}
          sx={{ width: '66.667%', borderRadius: '12px', py: 1.5, fontSize: '0.75rem', boxShadow: 2 }}
        >
          {t('confirmPayment')}
        </AppButton>
      </div>
    </div>
  );
};
