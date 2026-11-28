import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Plus, ShieldCheck, Trash2 } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppSelectField, AppTextField, sanitizePassport } from '../../../design-system/forms';
import { AppCheckbox } from '../../../design-system/selection';
import {
  calculatePassengerTax,
  calculateTotalTravelTax,
  type DestinationZone,
  type PassengerCategory,
  type PassportType,
  type TravelClass,
  type TravelFormErrors,
  type TravelMode,
  type TravelPassenger,
} from '../travelTaxLogic';

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
  const { t, i18n } = useTranslation();
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
          const passengerTax = calculatePassengerTax(p);

          return (
            <div
              key={p.id || idx}
              className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-teal-700 dark:text-teal-400">
                  {isBn ? `যাত্রী #${idx + 1}` : `Passenger #${idx + 1}`}
                </span>
                {passengers.length > 1 && (
                  <AppButton
                    type="button"
                    actionType="secondary"
                    intent="destructive"
                    size="small"
                    onClick={() => onRemovePassenger(idx)}
                    aria-label={isBn ? `যাত্রী ${idx + 1} মুছুন` : `Remove passenger ${idx + 1}`}
                  >
                    <Trash2 size={14} />
                  </AppButton>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <AppTextField
                  label={t('passengerName')}
                  value={p.passengerName}
                  onChange={(e) => onChangePassenger(idx, { ...p, passengerName: e.target.value })}
                  placeholder={t('passengerNamePlaceholder')}
                  error={Boolean(pErrors.passengerName)}
                  helperText={pErrors.passengerName}
                  required
                />
                <AppTextField
                  label={t('passportNumber')}
                  value={p.passportNumber}
                  onChange={(e) => onChangePassenger(idx, { ...p, passportNumber: sanitizePassport(e.target.value, 12) })}
                  placeholder={t('passportPlaceholder')}
                  error={Boolean(pErrors.passport)}
                  helperText={pErrors.passport || t('passportHelper')}
                  required
                  slotProps={{
                    htmlInput: {
                      maxLength: 12,
                      autoCapitalize: 'characters',
                      className: 'font-mono uppercase',
                    },
                  }}
                />
                <AppSelectField
                  label={isBn ? 'পাসপোর্টের ধরন' : 'Passport Type'}
                  value={p.passportType}
                  onChange={(e) => onChangePassenger(idx, { ...p, passportType: e.target.value as PassportType })}
                  options={[
                    { value: 'BD', label: isBn ? 'বাংলাদেশি পাসপোর্ট' : 'Bangladeshi Passport' },
                    { value: 'Foreign', label: isBn ? 'বিদেশি পাসপোর্ট' : 'Foreign Passport' },
                  ]}
                />
                <AppSelectField
                  label={isBn ? 'ভ্রমণের মাধ্যম' : 'Travel Mode'}
                  value={p.travelMode}
                  onChange={(e) => onChangePassenger(idx, { ...p, travelMode: e.target.value as TravelMode })}
                  options={[
                    { value: 'Air', label: isBn ? 'বায়ুপথ (Air)' : 'Air' },
                    { value: 'Land', label: isBn ? 'স্থলপথ (Land)' : 'Land' },
                    { value: 'Water', label: isBn ? 'জলপথ (Water)' : 'Water' },
                  ]}
                />
                <AppSelectField
                  label={t('travelDestination')}
                  value={p.destinationZone}
                  onChange={(e) => onChangePassenger(idx, { ...p, destinationZone: e.target.value as DestinationZone })}
                  options={[
                    { value: 'India', label: isBn ? 'ভারত (India)' : 'India' },
                    { value: 'SAARC', label: isBn ? 'সার্কভুক্ত দেশসমূহ (SAARC)' : 'SAARC Countries' },
                    { value: 'Other', label: isBn ? 'অন্যান্য আন্তর্জাতিক (Other Intl)' : 'Other International' },
                  ]}
                />
                <AppSelectField
                  label={t('travelClass')}
                  value={p.travelClass}
                  onChange={(e) => onChangePassenger(idx, { ...p, travelClass: e.target.value as TravelClass })}
                  options={[
                    { value: 'Economy', label: t('classEconomy') },
                    { value: 'Business', label: t('classBusiness') },
                  ]}
                />
                <AppSelectField
                  label={isBn ? 'যাত্রীর শ্রেণি / বিভাগ' : 'Passenger Category'}
                  value={p.passengerCategory}
                  onChange={(e) => onChangePassenger(idx, { ...p, passengerCategory: e.target.value as PassengerCategory })}
                  options={[
                    { value: 'Adult', label: isBn ? 'প্রাপ্তবয়স্ক (Adult)' : 'Adult' },
                    { value: 'Child', label: isBn ? 'শিশু (Child - 50%)' : 'Child (50% Tax)' },
                    { value: 'Medical Exempt', label: isBn ? 'চিকিৎসা অব্যাহতি (Medical Exempt - 0%)' : 'Medical Exempt (0%)' },
                    { value: 'Diplomat', label: isBn ? 'কূটনীতিক (Diplomat - 0%)' : 'Diplomat (0%)' },
                  ]}
                />
                <div className="flex items-center pt-6">
                  <AppCheckbox
                    label={isBn ? 'চিকিৎসা বা শূন্য-কর অব্যাহতি প্রযোজ্য' : 'Medical Treatment Zero-Tax Eligibility'}
                    checked={p.medicalExempt || p.passengerCategory === 'Medical Exempt'}
                    onChange={(checked) => onChangePassenger(idx, { ...p, medicalExempt: checked, passengerCategory: checked ? 'Medical Exempt' : p.passengerCategory })}
                    description={isBn ? 'বৈধ নথিপত্র সাপেক্ষে ব্যক্তিগত চিকিৎসা পর্যালোচনা।' : 'Subject to individual medical document review.'}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
                <span className="text-slate-500">{isBn ? 'এই যাত্রীর কর:' : 'Passenger Tax Subtotal:'}</span>
                <strong className="text-teal-700 dark:text-teal-400">৳ {passengerTax.toLocaleString()}</strong>
              </div>
            </div>
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
