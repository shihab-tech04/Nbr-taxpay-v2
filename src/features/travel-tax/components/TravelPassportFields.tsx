import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Paper from '@mui/material/Paper';
import { SearchCheck } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { AppDatePicker, getDhakaTodayYmd } from '../../../design-system/dates';
import { AppAutocomplete, AppTextField, sanitizePassport } from '../../../design-system/forms';
import { getBdPassportSuggestions, maskPassport } from '../travelTaxLogic';
import {
  FOREIGN_NATIONALITIES,
  type DraftPassengerInput,
  type SamplePassportEntry,
  type TravelPassengerErrors,
} from '../travelTaxTypes';

interface TravelPassportFieldsProps {
  draft: DraftPassengerInput;
  errors: TravelPassengerErrors;
  onChangeDraft: (next: DraftPassengerInput) => void;
  onCheckBdPassport: () => void;
}

export const TravelPassportFields: React.FC<TravelPassportFieldsProps> = ({
  draft,
  errors,
  onChangeDraft,
  onCheckBdPassport,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  const suggestions = draft.passportType === 'BD' ? getBdPassportSuggestions(draft.passportNumber) : [];
  const todayDhaka = getDhakaTodayYmd();
  const cleanPassport = sanitizePassport(draft.passportNumber, 12);

  const selectSuggestion = (s: SamplePassportEntry) => {
    setSuggestOpen(false);
    setActiveIndex(-1);
    onChangeDraft({ ...draft, passportNumber: s.passportNumber, bdChecked: false, passengerName: '', dob: '' });
  };

  const handlePassportKeyDown = (e: React.KeyboardEvent) => {
    if (!suggestOpen || suggestions.length === 0) {
      if (e.key === 'ArrowDown' && suggestions.length > 0) {
        e.preventDefault();
        e.stopPropagation();
        setSuggestOpen(true);
        setActiveIndex(0);
      }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Home') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(0);
    } else if (e.key === 'End') {
      e.preventDefault();
      e.stopPropagation();
      setActiveIndex(suggestions.length - 1);
    } else if (e.key === 'Enter' && activeIndex >= 0 && suggestions[activeIndex]) {
      e.preventDefault();
      e.stopPropagation();
      selectSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setSuggestOpen(false);
      setActiveIndex(-1);
    }
  };

  if (draft.passportType === 'Foreign') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppTextField label={t('passportNumber')} value={draft.passportNumber} previewRestricted onChange={(e) => onChangeDraft({ ...draft, passportNumber: sanitizePassport(e.target.value, 12) })} error={Boolean(errors.passport)} helperText={errors.passport} required />
        <AppTextField label={isBn ? 'পাসপোর্টে উল্লেখিত নাম' : 'Passport Name'} value={draft.passengerName} previewRestricted onChange={(e) => onChangeDraft({ ...draft, passengerName: e.target.value })} error={Boolean(errors.passengerName)} helperText={errors.passengerName} required />
        <AppDatePicker label={isBn ? 'জন্ম তারিখ' : 'Date of Birth'} value={draft.dob} maxDate={todayDhaka} previewRestricted onChange={(dob) => onChangeDraft({ ...draft, dob })} error={Boolean(errors.dob)} helperText={errors.dob} required />
        <AppAutocomplete label={isBn ? 'জাতীয়তা' : 'Nationality'} value={draft.nationality || null} previewRestricted onChange={(val) => onChangeDraft({ ...draft, nationality: val })} options={FOREIGN_NATIONALITIES.map((c) => ({ value: c, label: c }))} error={Boolean(errors.nationality)} helperText={errors.nationality} required />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start">
        <div
          ref={containerRef}
          className="relative flex-1 w-full"
          onBlur={(e) => {
            if (!containerRef.current?.contains(e.relatedTarget as Node)) {
              setSuggestOpen(false);
              setActiveIndex(-1);
            }
          }}
        >
          <AppTextField
            label={t('passportNumber')}
            value={draft.passportNumber}
            previewRestricted
            onFocus={() => setSuggestOpen(true)}
            onKeyDown={handlePassportKeyDown}
            onChange={(e) => {
              setSuggestOpen(true);
              setActiveIndex(-1);
              onChangeDraft({ ...draft, passportNumber: sanitizePassport(e.target.value, 12), bdChecked: false, passengerName: '', dob: '' });
            }}
            placeholder="e.g., TEST123456 or TEST230001"
            error={Boolean(errors.passport)}
            helperText={errors.passport || (isBn ? 'নমুনা: TEST123456 অথবা TEST230001–TEST230009' : 'Sample IDs: TEST123456, TEST230001–TEST230009')}
            slotProps={{
              htmlInput: {
                role: 'combobox',
                'aria-expanded': suggestOpen && suggestions.length > 0,
                'aria-controls': 'bd-passport-suggestions',
                'aria-activedescendant': activeIndex >= 0 && suggestions[activeIndex] ? `bd-suggest-${suggestions[activeIndex].passportNumber}` : undefined,
              },
            }}
            required
          />
          {suggestOpen && suggestions.length > 0 && (
            <Paper id="bd-passport-suggestions" role="listbox" elevation={6} className="absolute left-0 right-0 top-full z-30 mt-1 max-h-52 overflow-y-auto border border-slate-200 dark:border-slate-700 p-1">
              {suggestions.map((s, idx) => (
                <AppButton
                  key={s.passportNumber}
                  id={`bd-suggest-${s.passportNumber}`}
                  role="option"
                  aria-selected={idx === activeIndex}
                  type="button"
                  actionType="secondary"
                  surface={idx === activeIndex ? 'soft' : 'ghost'}
                  size="small"
                  fullWidth
                  onPointerDown={(e) => e.preventDefault()}
                  onClick={() => selectSuggestion(s)}
                  sx={{ justifyContent: 'space-between', textTransform: 'none', fontSize: '0.75rem' }}
                >
                  <span className="font-mono font-bold">{s.passportNumber}</span>
                  <span className="text-slate-500">{maskPassport(s.passportNumber)} · {s.passengerName}</span>
                </AppButton>
              ))}
            </Paper>
          )}
        </div>
        <AppButton
          type="button"
          actionType="secondary"
          surface="soft"
          previewRestricted
          disabled={!cleanPassport || draft.medicalAssessment}
          startIcon={<SearchCheck size={16} />}
          onClick={onCheckBdPassport}
          sx={{ mt: { sm: 0.25 }, height: 40 }}
        >
          {isBn ? 'পাসপোর্ট যাচাই' : 'Check Passport'}
        </AppButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <AppTextField label={t('passengerName')} value={draft.passengerName} readOnly previewRestricted placeholder={isBn ? 'যাচাইয়ের পর স্বয়ংক্রিয়ভাবে পূরণ হবে' : 'Populated after Check Passport'} />
        <AppTextField label={isBn ? 'জন্ম তারিখ' : 'Date of Birth'} value={draft.dob} readOnly previewRestricted placeholder="YYYY-MM-DD" />
      </div>
    </div>
  );
};
