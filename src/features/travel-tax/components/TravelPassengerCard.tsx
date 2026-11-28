import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppSelectField, AppTextField, sanitizePassport } from '../../../design-system/forms';
import { AppCheckbox } from '../../../design-system/selection';
import {
  calculatePassengerTax,
  type DestinationZone,
  type PassengerCategory,
  type PassportType,
  type TravelClass,
  type TravelMode,
  type TravelPassenger,
} from '../travelTaxLogic';

interface TravelPassengerCardProps {
  passenger: TravelPassenger;
  index: number;
  errors?: { passport?: string; passengerName?: string };
  canRemove: boolean;
  onChange: (updated: TravelPassenger) => void;
  onRemove: () => void;
}

export const TravelPassengerCard: React.FC<TravelPassengerCardProps> = ({
  passenger: p,
  index: idx,
  errors = {},
  canRemove,
  onChange,
  onRemove,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const passengerTax = calculatePassengerTax(p);

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase text-teal-700 dark:text-teal-400">
          {isBn ? `যাত্রী #${idx + 1}` : `Passenger #${idx + 1}`}
        </span>
        {canRemove && (
          <AppButton
            type="button"
            actionType="secondary"
            intent="destructive"
            size="small"
            onClick={onRemove}
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
          onChange={(e) => onChange({ ...p, passengerName: e.target.value })}
          placeholder={t('passengerNamePlaceholder')}
          error={Boolean(errors.passengerName)}
          helperText={errors.passengerName}
          required
        />
        <AppTextField
          label={t('passportNumber')}
          value={p.passportNumber}
          onChange={(e) => onChange({ ...p, passportNumber: sanitizePassport(e.target.value, 12) })}
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
        <AppSelectField
          label={isBn ? 'পাসপোর্টের ধরন' : 'Passport Type'}
          value={p.passportType}
          onChange={(e) => onChange({ ...p, passportType: e.target.value as PassportType })}
          options={[
            { value: 'BD', label: isBn ? 'বাংলাদেশি পাসপোর্ট' : 'Bangladeshi Passport' },
            { value: 'Foreign', label: isBn ? 'বিদেশি পাসপোর্ট' : 'Foreign Passport' },
          ]}
        />
        <AppSelectField
          label={isBn ? 'ভ্রমণের মাধ্যম' : 'Travel Mode'}
          value={p.travelMode}
          onChange={(e) => onChange({ ...p, travelMode: e.target.value as TravelMode })}
          options={[
            { value: 'Air', label: isBn ? 'বায়ুপথ (Air)' : 'Air' },
            { value: 'Land', label: isBn ? 'স্থলপথ (Land)' : 'Land' },
            { value: 'Water', label: isBn ? 'জলপথ (Water)' : 'Water' },
          ]}
        />
        <AppSelectField
          label={t('travelDestination')}
          value={p.destinationZone}
          onChange={(e) => onChange({ ...p, destinationZone: e.target.value as DestinationZone })}
          options={[
            { value: 'India', label: isBn ? 'ভারত (India)' : 'India' },
            { value: 'SAARC', label: isBn ? 'সার্কভুক্ত দেশসমূহ (SAARC)' : 'SAARC Countries' },
            { value: 'Other', label: isBn ? 'অন্যান্য আন্তর্জাতিক (Other Intl)' : 'Other International' },
          ]}
        />
        <AppSelectField
          label={t('travelClass')}
          value={p.travelClass}
          onChange={(e) => onChange({ ...p, travelClass: e.target.value as TravelClass })}
          options={[
            { value: 'Economy', label: t('classEconomy') },
            { value: 'Business', label: t('classBusiness') },
          ]}
        />
        <AppSelectField
          label={isBn ? 'যাত্রীর শ্রেণি / বিভাগ' : 'Passenger Category'}
          value={p.passengerCategory}
          onChange={(e) => onChange({ ...p, passengerCategory: e.target.value as PassengerCategory })}
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
            checked={p.medicalExempt}
            onChange={(checked) => onChange({ ...p, medicalExempt: checked })}
            description={isBn ? 'ব্যক্তিগত চিকিৎসা মূল্যায়ন ও নথিপত্র পর্যালোচনা।' : 'Individual medical review and document verification.'}
          />
        </div>
      </div>

      <div className="flex justify-between items-center pt-2 border-t border-slate-200 dark:border-slate-700 text-xs font-mono">
        <span className="text-slate-500">{isBn ? 'এই যাত্রীর কর:' : 'Passenger Tax Subtotal:'}</span>
        <strong className="text-teal-700 dark:text-teal-400">৳ {passengerTax.toLocaleString()}</strong>
      </div>
    </div>
  );
};
