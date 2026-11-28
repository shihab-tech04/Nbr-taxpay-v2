import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppDatePicker, getDhakaTodayYmd } from '../../../design-system/dates';
import { AppAutocomplete, AppTextField } from '../../../design-system/forms';
import { AppRadioCard, AppRadioGroup } from '../../../design-system/selection';
import { calculateTravelBreakdown } from '../travelTaxLogic';
import {
  LAND_PORTS,
  type ConfirmedPassenger,
  type TravelDetailsErrors,
  type TravelDetailsInput,
  type TravelMode,
} from '../travelTaxTypes';

interface TravelDetailsStepProps {
  passengers: readonly ConfirmedPassenger[];
  details: TravelDetailsInput;
  errors: TravelDetailsErrors;
  isAuthenticated: boolean;
  onChangeDetails: (next: TravelDetailsInput) => void;
  onBack: () => void;
  onSaveDraft: () => void;
  onProceed: () => void;
}

export const TravelDetailsStep: React.FC<TravelDetailsStepProps> = ({
  passengers, details, errors, isAuthenticated,
  onChangeDetails, onBack, onSaveDraft, onProceed,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const todayDhaka = getDhakaTodayYmd();

  const handleModeChange = (mode: TravelMode) => {
    onChangeDetails({
      ...details,
      travelMode: mode,
      departurePort: '',
    });
  };

  const hasValidRoute =
    (details.travelMode === 'Land' ? LAND_PORTS.includes(details.departurePort.trim()) : Boolean(details.departurePort.trim())) &&
    Boolean(details.destination.trim()) &&
    Boolean(details.travelDate) &&
    details.travelDate >= todayDhaka;
  const breakdown = hasValidRoute
    ? calculateTravelBreakdown(passengers, details.travelDate)
    : { items: [], totalAmount: 0, valid: false };

  return (
    <div data-testid="travel-stage-2" className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold">{isBn ? 'ধাপ ২: ভ্রমণের তথ্য' : 'Stage 2: Travel Details'}</h2>
          <p className="text-xs text-slate-500">
            {isBn ? 'স্থল বা জলপথ, বন্দর, গন্তব্য এবং ভ্রমণের তারিখ নির্বাচন করুন (ঢাকা সময়)।' : 'Choose Land or Water mode, departure port, destination, and planned travel date (Dhaka timezone).'}
          </p>
        </div>
        <AppButton actionType="secondary" surface="ghost" size="small" startIcon={<ArrowLeft size={14} />} onClick={onBack}>
          {isBn ? 'যাত্রী তথ্য' : 'Passengers'}
        </AppButton>
      </div>

      <AppRadioGroup label={isBn ? 'ভ্রমণের মাধ্যম' : 'Travel Mode'} value={details.travelMode} onChange={(_, val) => handleModeChange(val as TravelMode)} columns={2}>
        <AppRadioCard value="Land" title={isBn ? 'স্থলপথ (By Land)' : 'By Land'} description={isBn ? 'অনুমোদিত স্থলবন্দর (নমুনা প্রাপ্তবয়স্ক হার ৳ ১,০০০)' : 'Approved land ports (Illustrative adult rate ৳ 1,000)'} />
        <AppRadioCard value="Water" title={isBn ? 'জলপথ (By Water)' : 'By Water'} description={isBn ? 'নৌ ও সমুদ্র বন্দর (নমুনা প্রাপ্তবয়স্ক হার ৳ ১,০০০)' : 'Water departure ports (Illustrative adult rate ৳ 1,000)'} />
      </AppRadioGroup>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {details.travelMode === 'Land' ? (
          <AppAutocomplete
            label={isBn ? 'স্থল বন্দর' : 'Land Port'}
            value={details.departurePort || null}
            previewRestricted
            onChange={(val) => onChangeDetails({ ...details, departurePort: val })}
            options={LAND_PORTS.map((port) => ({ value: port, label: port }))}
            error={Boolean(errors.departurePort)}
            helperText={errors.departurePort}
            required
          />
        ) : (
          <AppTextField
            label={isBn ? 'জল বন্দর' : 'Water Port'}
            value={details.departurePort}
            previewRestricted
            onChange={(e) => onChangeDetails({ ...details, departurePort: e.target.value })}
            placeholder={isBn ? 'যেমন: টেকনাফ জেটি / চট্টগ্রাম বন্দর' : 'e.g., Teknaf Jetty / Chattogram Port'}
            error={Boolean(errors.departurePort)}
            helperText={errors.departurePort}
            required
          />
        )}

        <AppTextField
          label={t('travelDestination')}
          value={details.destination}
          previewRestricted
          onChange={(e) => onChangeDetails({ ...details, destination: e.target.value })}
          placeholder={isBn ? 'যেমন: কলকাতা, ভারত' : 'e.g., Kolkata, India'}
          error={Boolean(errors.destination)}
          helperText={errors.destination}
          required
        />

        <div className="md:col-span-2">
          <AppDatePicker
            label={isBn ? 'ভ্রমণের তারিখ' : 'Planned Travel Date'}
            value={details.travelDate}
            minDate={todayDhaka}
            previewRestricted
            onChange={(travelDate) => onChangeDetails({ ...details, travelDate })}
            error={Boolean(errors.travelDate)}
            helperText={errors.travelDate || (isBn ? 'আজ বা ভবিষ্যতের তারিখ নির্বাচন করুন (ঢাকা সময়)।' : 'Select today or a future date (Asia/Dhaka). Ages 0–5: ৳0, 6–12: ৳500, 13+: ৳1,000.')}
            required
          />
        </div>
      </div>

      {breakdown.valid && (
        <div data-testid="travel-calculated-breakdown" className="p-4 rounded-xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-teal-800 dark:text-teal-200">
              {isBn ? 'ভ্রমণের তারিখে বয়সভিত্তিক নমুনা হিসাব' : 'Age-on-Travel-Date Illustrative Calculation'}
            </span>
            <ShieldCheck className="text-teal-600" size={22} />
          </div>
          <div className="space-y-1 text-xs font-mono">
            {breakdown.items.map((item) => (
              <div key={item.id} className="flex justify-between">
                <span>{item.passengerName} ({isBn ? `বয়স ${item.ageOnTravelDate}` : `Age ${item.ageOnTravelDate}`})</span>
                <strong>৳ {item.amount.toLocaleString()}</strong>
              </div>
            ))}
          </div>
          <div className="flex justify-between pt-2 border-t border-teal-200 dark:border-teal-800 text-sm font-bold font-mono text-teal-900 dark:text-teal-100">
            <span>{isBn ? 'সমন্বিত নমুনা মোট' : 'Combined Illustrative Total'}</span>
            <span>৳ {breakdown.totalAmount.toLocaleString()}</span>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {isAuthenticated ? (
          <AppButton type="button" actionType="secondary" previewRestricted onClick={onSaveDraft}>{t('saveDraft')}</AppButton>
        ) : <span />}
        <AppButton type="button" actionType="primary" previewRestricted endIcon={<ArrowRight size={16} />} onClick={onProceed}>
          {t('proceedToPreview')}
        </AppButton>
      </div>
    </div>
  );
};
