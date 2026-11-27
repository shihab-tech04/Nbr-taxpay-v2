import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, ShieldCheck } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppSelectField, AppTextField, sanitizePassport } from '../../../design-system/forms';
import { calculateTravelDisplayTotal, type TravelClass, type TravelFormErrors } from '../travelTaxLogic';

interface TravelTaxFormStepProps {
  passportNumber: string;
  passengerName: string;
  destination: string;
  travelClass: TravelClass;
  baseAmount: number;
  errors: TravelFormErrors;
  onChangePassport: (val: string) => void;
  onChangePassengerName: (val: string) => void;
  onChangeDestination: (dest: string) => void;
  onChangeTravelClass: (cls: TravelClass) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const TravelTaxFormStep: React.FC<TravelTaxFormStepProps> = ({
  passportNumber,
  passengerName,
  destination,
  travelClass,
  baseAmount,
  errors,
  onChangePassport,
  onChangePassengerName,
  onChangeDestination,
  onChangeTravelClass,
  onSubmit,
}) => {
  const { t } = useTranslation();
  const totalDisplay = calculateTravelDisplayTotal(baseAmount, travelClass);

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AppTextField
          label={t('passportNumber')}
          value={passportNumber}
          onChange={(e) => onChangePassport(sanitizePassport(e.target.value, 12))}
          placeholder={t('passportPlaceholder')}
          error={Boolean(errors.passport)}
          helperText={errors.passport || t('passportHelper')}
          required
          slotProps={{
            htmlInput: {
              maxLength: 12,
              autoCapitalize: 'characters',
              className: 'font-mono uppercase',
            },
          }}
        />
        <AppTextField
          label={t('passengerName')}
          value={passengerName}
          onChange={(e) => onChangePassengerName(e.target.value)}
          placeholder={t('passengerNamePlaceholder')}
          error={Boolean(errors.passengerName)}
          helperText={errors.passengerName || t('passengerNameHelper')}
          required
        />
        <AppSelectField
          label={t('travelDestination')}
          value={destination}
          onChange={(e) => onChangeDestination(e.target.value)}
          helperText={t('travelDestinationHelper')}
          options={[
            { value: 'India (By Air)', label: t('destIndiaAir') },
            { value: 'India (By Land/Water)', label: t('destIndiaLandWater') },
            { value: 'SAARC Countries', label: t('destSaarc') },
            { value: 'Other International', label: t('destOtherIntl') },
          ]}
        />
        <AppSelectField
          label={t('travelClass')}
          value={travelClass}
          onChange={(e) => onChangeTravelClass(e.target.value as TravelClass)}
          helperText={t('travelClassHelper')}
          options={[
            { value: 'Economy', label: t('classEconomy') },
            { value: 'Business', label: t('classBusiness') },
          ]}
        />
      </div>

      <div className="p-4 bg-teal-50 dark:bg-teal-950/40 rounded-xl border border-teal-200 dark:border-teal-800 flex items-center justify-between">
        <div>
          <span className="text-xs text-teal-800 dark:text-teal-200 font-medium">
            Calculated Travel Tax
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
        Proceed to Preview
      </AppButton>
    </form>
  );
};
