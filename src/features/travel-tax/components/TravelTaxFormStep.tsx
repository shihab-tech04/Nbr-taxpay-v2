import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Plus, ShieldCheck } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { calculateTotalTravelTax, type TravelFormErrors, type TravelPassenger } from '../travelTaxLogic';
import { TravelPassengerCard } from './TravelPassengerCard';

interface TravelTaxFormStepProps {
  passengers: readonly TravelPassenger[];
  errors: TravelFormErrors;
  onChangePassenger: (index: number, updated: TravelPassenger) => void;
  onAddPassenger: () => void;
  onRemovePassenger: (index: number) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TravelTaxFormStep: React.FC<TravelTaxFormStepProps> = ({
  passengers,
  errors,
  onChangePassenger,
  onAddPassenger,
  onRemovePassenger,
  onSubmit,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const totalDisplay = calculateTotalTravelTax(passengers);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 lg:p-8 space-y-6"
    >
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold">
            {isBn ? 'যাত্রী ও ভ্রমণের তথ্য (বহু-যাত্রী সমর্থিত)' : 'Passenger & Journey Details (Multi-Passenger)'}
          </h2>
          <p className="text-xs text-slate-500">
            {isBn ? 'বায়ু, স্থল ও জলপথ ভ্রমণ এবং ব্যক্তিগত চিকিৎসা বা কূটনৈতিক অব্যাহতি পর্যালোচনা।' : 'Air, land, and water travel modes with individual medical/diplomatic review.'}
          </p>
        </div>
        <AppButton
          type="button"
          actionType="secondary"
          size="small"
          startIcon={<Plus size={15} />}
          onClick={onAddPassenger}
        >
          {isBn ? 'যাত্রী যোগ করুন' : 'Add Passenger'}
        </AppButton>
      </div>

      <div className="space-y-6">
        {passengers.map((p, idx) => {
          const pErrors = errors.passengers?.[p.id || String(idx)] || {};
          return (
            <TravelPassengerCard
              key={p.id || idx}
              passenger={p}
              index={idx}
              errors={pErrors}
              canRemove={passengers.length > 1}
              onChange={(updated) => onChangePassenger(idx, updated)}
              onRemove={() => onRemovePassenger(idx)}
            />
          );
        })}
      </div>

      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-teal-800 dark:text-teal-200 font-medium">
            {isBn ? 'মোট ভ্রমণ কর (নমুনা)' : 'Total Sample Travel Tax Preview'}
          </span>
          <div className="text-2xl font-bold font-mono text-teal-900 dark:text-teal-100">
            ৳ {totalDisplay.toLocaleString()}
          </div>
        </div>
        <ShieldCheck className="text-teal-600" size={32} />
      </div>

      <AppButton
        type="submit"
        actionType="primary"
        size="large"
        fullWidth
        previewRestricted
        endIcon={<ArrowRight size={16} />}
        sx={{ fontSize: '0.75rem' }}
      >
        {isBn ? 'প্রিভিউ দেখতে এগিয়ে যান' : 'Proceed to Preview'}
      </AppButton>
    </form>
  );
};
