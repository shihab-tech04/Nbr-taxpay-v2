import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { calculatePassengerTax, calculateTotalTravelTax, type TravelPassenger } from '../travelTaxLogic';

interface TravelTaxPreviewStepProps {
  passengers: readonly TravelPassenger[];
  onBack: () => void;
  onPay: () => void;
}

export const TravelTaxPreviewStep: React.FC<TravelTaxPreviewStepProps> = ({
  passengers,
  onBack,
  onPay,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const totalDisplay = calculateTotalTravelTax(passengers);

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 space-y-6">
      <h3 className="text-lg font-bold">
        {isBn ? 'ভ্রমণ কর পেমেন্ট প্রিভিউ (বহু-যাত্রী)' : 'Travel Tax Payment Preview (Multi-Passenger)'}
      </h3>

      <div className="space-y-4">
        {passengers.map((p, idx) => {
          const subtotal = calculatePassengerTax(p);
          return (
            <div key={p.id || idx} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-2 text-xs font-mono">
              <div className="flex justify-between font-bold text-slate-800 dark:text-slate-200 border-b border-slate-200 dark:border-slate-700 pb-2">
                <span>{isBn ? `যাত্রী #${idx + 1}: ${p.passengerName}` : `Passenger #${idx + 1}: ${p.passengerName}`}</span>
                <span>৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 dark:text-slate-400">
                <div>Passport: <strong className="uppercase">{p.passportNumber}</strong> ({p.passportType})</div>
                <div>Mode / Zone: <strong>{p.travelMode}</strong> / <strong>{p.destinationZone}</strong></div>
                <div>Class: <strong>{p.travelClass}</strong></div>
                <div>Category: <strong>{p.passengerCategory}</strong></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 flex justify-between items-center">
        <span className="text-sm font-bold">{isBn ? 'মোট প্রদেয় কর:' : 'Total Payable Tax:'}</span>
        <strong className="text-xl font-mono text-teal-700 dark:text-teal-300">৳ {totalDisplay.toLocaleString()}</strong>
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
