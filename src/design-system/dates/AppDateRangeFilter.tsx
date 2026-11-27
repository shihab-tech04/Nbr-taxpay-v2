import React from 'react';
import { useTranslation } from 'react-i18next';
import { RotateCcw } from 'lucide-react';
import type { PublicCapability } from '../../shared/previewPolicy';
import { AppButton } from '../buttons';
import { AppDatePicker } from './AppDatePicker';
import {
  validateDateRangeFilter,
  type DateRangeFilterValue,
} from './dateUtils';

export interface AppDateRangeFilterProps {
  value: DateRangeFilterValue;
  onChange: (nextValue: DateRangeFilterValue) => void;
  fromLabel?: string;
  toLabel?: string;
  clearLabel?: string;
  invalidRangeMessage?: string;
  minDate?: string;
  maxDate?: string;
  disableFuture?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
  fromTestId?: string;
  toTestId?: string;
  clearTestId?: string;
}

export const AppDateRangeFilter: React.FC<AppDateRangeFilterProps> = ({
  value,
  onChange,
  fromLabel,
  toLabel,
  clearLabel,
  invalidRangeMessage,
  minDate,
  maxDate,
  disableFuture = false,
  disabled = false,
  readOnly = false,
  publicCapability = 'none',
  previewRestricted = false,
  fromTestId = 'date-range-from',
  toTestId = 'date-range-to',
  clearTestId = 'date-range-clear',
}) => {
  const { t } = useTranslation();
  const rangeCheck = validateDateRangeFilter(value);
  const isInverted = !rangeCheck.valid && rangeCheck.reason === 'inverted';
  const hasSelection = Boolean(value.from || value.to);

  const resolvedFromLabel = fromLabel ?? t('dateFromLabel');
  const resolvedToLabel = toLabel ?? t('dateToLabel');
  const resolvedClearLabel = clearLabel ?? t('dateRangeClear');
  const resolvedError = isInverted
    ? invalidRangeMessage ?? t('dateRangeInvalidError')
    : undefined;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] gap-3 items-start w-full">
      <AppDatePicker
        label={resolvedFromLabel}
        value={value.from}
        onChange={(from) => onChange({ ...value, from })}
        minDate={minDate}
        maxDate={maxDate}
        disableFuture={disableFuture}
        disabled={disabled}
        readOnly={readOnly}
        error={isInverted}
        publicCapability={publicCapability}
        previewRestricted={previewRestricted}
        testId={fromTestId}
      />
      <AppDatePicker
        label={resolvedToLabel}
        value={value.to}
        onChange={(to) => onChange({ ...value, to })}
        minDate={minDate}
        maxDate={maxDate}
        disableFuture={disableFuture}
        disabled={disabled}
        readOnly={readOnly}
        error={isInverted}
        helperText={resolvedError}
        publicCapability={publicCapability}
        previewRestricted={previewRestricted}
        testId={toTestId}
      />
      <div className="flex items-center sm:pt-0.5">
        <AppButton
          type="button"
          actionType="secondary"
          surface="soft"
          size="small"
          startIcon={<RotateCcw size={14} />}
          disabled={disabled || readOnly || !hasSelection}
          onClick={() => onChange({ from: '', to: '' })}
          data-testid={clearTestId}
          sx={{ minHeight: 40, px: 1.75, whiteSpace: 'nowrap' }}
        >
          {resolvedClearLabel}
        </AppButton>
      </div>
    </div>
  );
};
