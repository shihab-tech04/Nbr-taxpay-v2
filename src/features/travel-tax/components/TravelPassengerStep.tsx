import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Alert from '@mui/material/Alert';
import Paper from '@mui/material/Paper';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { ArrowRight, CheckCircle2, Edit3, Plus, SearchCheck, Trash2 } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../design-system/buttons';
import { AppDatePicker, getDhakaTodayYmd } from '../../../design-system/dates';
import { AppAutocomplete, AppTextField, sanitizePassport } from '../../../design-system/forms';
import { AppCheckbox } from '../../../design-system/selection';
import { getBdPassportSuggestions, maskPassport } from '../travelTaxLogic';
import {
  FOREIGN_NATIONALITIES,
  type ConfirmedPassenger,
  type DraftPassengerInput,
  type TravelPassengerErrors,
} from '../travelTaxTypes';

interface TravelPassengerStepProps {
  confirmedPassengers: readonly ConfirmedPassenger[];
  draft: DraftPassengerInput;
  entryOpen: boolean;
  editingId: string | null;
  errors: TravelPassengerErrors;
  isAuthenticated: boolean;
  onChangeDraft: (next: DraftPassengerInput) => void;
  onCheckBdPassport: () => void;
  onConfirmPassenger: () => void;
  onOpenAddAnother: () => void;
  onCancelEntry: () => void;
  onEditConfirmed: (id: string) => void;
  onRemoveConfirmed: (id: string) => void;
  onSaveDraft: () => void;
  onProceed: () => void;
}

export const TravelPassengerStep: React.FC<TravelPassengerStepProps> = ({
  confirmedPassengers, draft, entryOpen, editingId, errors, isAuthenticated,
  onChangeDraft, onCheckBdPassport, onConfirmPassenger, onOpenAddAnother,
  onCancelEntry, onEditConfirmed, onRemoveConfirmed, onSaveDraft, onProceed,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [suggestOpen, setSuggestOpen] = useState(false);
  const suggestions = draft.passportType === 'BD' ? getBdPassportSuggestions(draft.passportNumber) : [];
  const todayDhaka = getDhakaTodayYmd();

  return (
    <div data-testid="travel-stage-1" className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-bold">{isBn ? 'ধাপ ১: যাত্রীর তথ্য' : 'Stage 1: Passenger Information'}</h2>
          <p className="text-xs text-slate-500">{isBn ? 'পরবর্তী ধাপে যেতে প্রতিটি যাত্রী নিশ্চিত করুন। চূড়ান্ত কর পরবর্তী ধাপে দেখানো হবে।' : 'Confirm each passenger before adding another or continuing.'}</p>
        </div>
        <AppButton actionType="secondary" size="small" previewRestricted startIcon={<Plus size={14} />} disabled={entryOpen} onClick={onOpenAddAnother}>
          {isBn ? 'আরেকজন যাত্রী যোগ করুন' : 'Add Another Passenger'}
        </AppButton>
      </div>

      {confirmedPassengers.length > 0 && (
        <div data-testid="confirmed-passengers-list" className="space-y-2">
          <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">{isBn ? `নিশ্চিত যাত্রী (${confirmedPassengers.length})` : `Confirmed Passengers (${confirmedPassengers.length})`}</p>
          <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800">
            {confirmedPassengers.map((p, idx) => (
              <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 px-4 py-3 text-xs">
                <div>
                  <strong className="text-slate-900 dark:text-white">#{idx + 1} {p.passengerName}</strong>
                  <span className="ml-2 font-mono text-slate-500">{p.passportType} · {p.passportMasked}</span>
                  <span className="ml-2 font-mono text-slate-500">DOB: {p.dob}</span>
                  {p.nationality && <span className="ml-2 text-slate-500">({p.nationality})</span>}
                  {p.needsRevalidation && <span className="ml-2 text-amber-700 font-semibold">{isBn ? 'পাসপোর্ট পুনঃযাচাই প্রয়োজন' : 'Revalidate Passport'}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <AppIconButton size="small" aria-label={`Edit passenger ${p.passengerName}`} onClick={() => onEditConfirmed(p.id)}><Edit3 size={14} /></AppIconButton>
                  <AppIconButton size="small" intent="destructive" aria-label={`Remove passenger ${p.passengerName}`} onClick={() => onRemoveConfirmed(p.id)}><Trash2 size={14} /></AppIconButton>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {entryOpen && (
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-4">
          <Tabs
            value={draft.passportType}
            onChange={(_, val: 'BD' | 'Foreign') => {
              setSuggestOpen(false);
              onChangeDraft({ ...draft, passportType: val, passportNumber: '', passengerName: '', dob: '', nationality: '', bdChecked: false });
            }}
            aria-label="Passport Nationality Type"
          >
            <Tab value="BD" label={isBn ? 'বাংলাদেশি পাসপোর্ট' : 'Bangladeshi'} />
            <Tab value="Foreign" label={isBn ? 'বিদেশি পাসপোর্ট' : 'Foreign'} />
          </Tabs>

          {draft.passportType === 'BD' ? (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 items-start">
                <div className="relative flex-1 w-full">
                  <AppTextField
                    label={t('passportNumber')}
                    value={draft.passportNumber}
                    previewRestricted
                    onFocus={() => setSuggestOpen(true)}
                    onBlur={() => setTimeout(() => setSuggestOpen(false), 120)}
                    onKeyDown={(e) => { if (e.key === 'Escape') setSuggestOpen(false); }}
                    onChange={(e) => {
                      setSuggestOpen(true);
                      onChangeDraft({ ...draft, passportNumber: sanitizePassport(e.target.value, 12), bdChecked: false, passengerName: '', dob: '' });
                    }}
                    placeholder="e.g., TEST123456 or TEST230001"
                    error={Boolean(errors.passport)}
                    helperText={errors.passport || (isBn ? 'নমুনা: TEST123456 অথবা TEST230001–TEST230009' : 'Sample IDs: TEST123456, TEST230001–TEST230009')}
                    required
                  />
                  {suggestOpen && suggestions.length > 0 && (
                    <Paper role="listbox" elevation={6} className="absolute left-0 right-0 top-full z-20 mt-1 max-h-52 overflow-y-auto border border-slate-200 dark:border-slate-700 p-1">
                      {suggestions.map((s) => (
                        <AppButton
                          key={s.passportNumber}
                          type="button"
                          actionType="secondary"
                          surface="ghost"
                          size="small"
                          fullWidth
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSuggestOpen(false);
                            onChangeDraft({ ...draft, passportNumber: s.passportNumber, bdChecked: false, passengerName: '', dob: '' });
                          }}
                          sx={{ justifyContent: 'space-between', textTransform: 'none', fontSize: '0.75rem' }}
                        >
                          <span className="font-mono font-bold">{s.passportNumber}</span>
                          <span className="text-slate-500">{maskPassport(s.passportNumber)} · {s.passengerName}</span>
                        </AppButton>
                      ))}
                    </Paper>
                  )}
                </div>
                <AppButton type="button" actionType="secondary" surface="soft" previewRestricted startIcon={<SearchCheck size={16} />} onClick={onCheckBdPassport} sx={{ mt: { sm: 0.25 }, height: 40 }}>
                  {isBn ? 'পাসপোর্ট যাচাই' : 'Check Passport'}
                </AppButton>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <AppTextField label={t('passengerName')} value={draft.passengerName} readOnly previewRestricted placeholder={isBn ? 'যাচাইয়ের পর স্বয়ংক্রিয়ভাবে পূরণ হবে' : 'Populated after Check Passport'} />
                <AppTextField label={isBn ? 'জন্ম তারিখ' : 'Date of Birth'} value={draft.dob} readOnly previewRestricted placeholder="YYYY-MM-DD" />
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <AppTextField label={t('passportNumber')} value={draft.passportNumber} previewRestricted onChange={(e) => onChangeDraft({ ...draft, passportNumber: sanitizePassport(e.target.value, 12) })} error={Boolean(errors.passport)} helperText={errors.passport} required />
              <AppTextField label={isBn ? 'পাসপোর্টে উল্লেখিত নাম' : 'Passport Name'} value={draft.passengerName} previewRestricted onChange={(e) => onChangeDraft({ ...draft, passengerName: e.target.value })} error={Boolean(errors.passengerName)} helperText={errors.passengerName} required />
              <AppDatePicker label={isBn ? 'জন্ম তারিখ' : 'Date of Birth'} value={draft.dob} maxDate={todayDhaka} previewRestricted onChange={(dob) => onChangeDraft({ ...draft, dob })} error={Boolean(errors.dob)} helperText={errors.dob} required />
              <AppAutocomplete label={isBn ? 'জাতীয়তা' : 'Nationality'} value={draft.nationality || null} previewRestricted onChange={(val) => onChangeDraft({ ...draft, nationality: val })} options={FOREIGN_NATIONALITIES.map((c) => ({ value: c, label: c }))} error={Boolean(errors.nationality)} helperText={errors.nationality} required />
            </div>
          )}

          <div className="pt-1 space-y-2">
            <AppCheckbox
              checked={draft.medicalAssessment}
              previewRestricted
              onChange={(event) => onChangeDraft({ ...draft, medicalAssessment: event.target.checked })}
              label={isBn ? 'চিকিৎসাজনিত অব্যাহতি মূল্যায়নের আবেদন (বহির্গমন বন্দরে ব্যক্তিগত যাচাই)' : 'Request individual medical exemption assessment at departure port'}
            />
            {draft.medicalAssessment && (
              <Alert severity="warning" data-testid="medical-assessment-block">
                {isBn
                  ? 'চিকিৎসাজনিত অব্যাহতি অনলাইনে দেওয়া হয় না। ব্যক্তিগত মূল্যায়নের জন্য অনুগ্রহ করে বহির্গমন বন্দরের কর ডেস্কে নথিপত্রসহ যোগাযোগ করুন — এই ধাপ থেকে অনলাইনে এগিয়ে যাওয়া যাবে না।'
                  : 'Medical exemptions are not granted automatically online. Report to the departure port tax desk for individual manual assessment — online continuation is blocked while checked.'}
              </Alert>
            )}
          </div>

          <div className="flex flex-wrap justify-end gap-2 pt-2">
            {confirmedPassengers.length > 0 && (
              <AppButton type="button" actionType="secondary" size="small" onClick={onCancelEntry}>{t('cancel')}</AppButton>
            )}
            <AppButton type="button" actionType="primary" size="small" previewRestricted disabled={draft.medicalAssessment} startIcon={<CheckCircle2 size={15} />} onClick={onConfirmPassenger}>
              {editingId ? (isBn ? 'যাত্রী হালনাগাদ ও নিশ্চিত' : 'Update & Confirm Passenger') : (isBn ? 'যাত্রী নিশ্চিত করুন' : 'Confirm Passenger')}
            </AppButton>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {isAuthenticated ? (
          <AppButton type="button" actionType="secondary" previewRestricted onClick={onSaveDraft}>{t('saveDraft')}</AppButton>
        ) : <span />}
        <AppButton type="button" actionType="primary" previewRestricted disabled={confirmedPassengers.length === 0 || draft.medicalAssessment || entryOpen} endIcon={<ArrowRight size={16} />} onClick={onProceed}>
          {isBn ? 'ভ্রমণের তথ্যে যান' : 'Proceed to Travel Details'}
        </AppButton>
      </div>
    </div>
  );
};
