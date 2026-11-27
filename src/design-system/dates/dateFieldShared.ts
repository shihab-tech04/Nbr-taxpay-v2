import React, { useState } from 'react';
import { type Dayjs } from 'dayjs';
import { useTranslation } from 'react-i18next';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import {
  formatDayjsToYmd,
  getLocalTodayYmd,
  INVALID_YMD_VALUE,
  isValidYmd,
  parseYmdToDayjs,
  validateYmdDate,
  type DateValidationReason,
} from './dateUtils';

export interface DateInputValidity {
  status: 'empty' | 'valid' | 'invalid';
  reason?: DateValidationReason;
}

export interface AppDateControlProps {
  id?: string;
  label: React.ReactNode;
  value: string;
  onChange: (nextValue: string) => void;
  onValidityChange?: (validity: DateInputValidity) => void;
  minDate?: string;
  maxDate?: string;
  disablePast?: boolean;
  disableFuture?: boolean;
  format?: string;
  clearable?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  ariaLabel?: string;
  testId?: string;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
}

export function resolveEffectiveMinYmd(minDate?: string, disablePast?: boolean): string | undefined {
  const validMin = minDate && isValidYmd(minDate) ? minDate : undefined;
  if (!disablePast) return validMin;
  const localToday = getLocalTodayYmd();
  if (!validMin) return localToday;
  return validMin > localToday ? validMin : localToday;
}

export function resolveEffectiveMaxYmd(maxDate?: string, disableFuture?: boolean): string | undefined {
  const validMax = maxDate && isValidYmd(maxDate) ? maxDate : undefined;
  if (!disableFuture) return validMax;
  const localToday = getLocalTodayYmd();
  if (!validMax) return localToday;
  return validMax < localToday ? validMax : localToday;
}

export function useSharedDateControlState({
  id,
  value,
  onChange,
  onValidityChange,
  minDate,
  maxDate,
  disablePast = false,
  disableFuture = false,
  required = false,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  ariaLabel,
  testId,
  publicCapability = 'none',
  previewRestricted = false,
}: Pick<
  AppDateControlProps,
  | 'id'
  | 'value'
  | 'onChange'
  | 'onValidityChange'
  | 'minDate'
  | 'maxDate'
  | 'disablePast'
  | 'disableFuture'
  | 'required'
  | 'disabled'
  | 'readOnly'
  | 'error'
  | 'helperText'
  | 'ariaLabel'
  | 'testId'
  | 'publicCapability'
  | 'previewRestricted'
>) {
  const { t } = useTranslation();
  const [invalidDraft, setInvalidDraft] = useState<{
    externalValue: string;
    dayjsValue: Dayjs;
  } | null>(null);

  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly || previewLocked);

  const effectiveMinYmd = resolveEffectiveMinYmd(minDate, disablePast);
  const effectiveMaxYmd = resolveEffectiveMaxYmd(maxDate, disableFuture);
  const pickerValue =
    invalidDraft && invalidDraft.externalValue === value
      ? invalidDraft.dayjsValue
      : parseYmdToDayjs(value);

  const validation = validateYmdDate(value, {
    required: false,
    minDate,
    maxDate,
    disablePast,
    disableFuture,
  });

  const computedInvalid = Boolean(value.trim() && !validation.valid);
  const effectiveError = Boolean(error || computedInvalid);

  const getComputedErrorMessage = (reason?: DateValidationReason): string => {
    if (reason === 'min' && effectiveMinYmd) {
      return t('dateMinError', { minDate: effectiveMinYmd });
    }
    if (reason === 'max' && effectiveMaxYmd) {
      return t('dateMaxError', { maxDate: effectiveMaxYmd });
    }
    if (reason === 'past') return t('datePastError');
    if (reason === 'future') return t('dateFutureError');
    if (reason === 'required') return t('dateRequiredError');
    return t('dateInvalidError');
  };

  const effectiveHelperText = error
    ? helperText
    : computedInvalid
      ? getComputedErrorMessage(validation.reason)
      : helperText;

  const handlePickerChange = (nextDayjs: Dayjs | null) => {
    if (effectiveDisabled || effectiveReadOnly) return;
    if (nextDayjs === null) {
      setInvalidDraft(null);
      onChange('');
      onValidityChange?.({ status: 'empty', reason: required ? 'required' : undefined });
      return;
    }
    const nextYmd = formatDayjsToYmd(nextDayjs);
    if (!nextDayjs.isValid() || !nextYmd) {
      setInvalidDraft({ externalValue: INVALID_YMD_VALUE, dayjsValue: nextDayjs });
      onChange(INVALID_YMD_VALUE);
      onValidityChange?.({ status: 'invalid', reason: 'invalid' });
      return;
    }
    setInvalidDraft(null);
    onChange(nextYmd);
    const nextCheck = validateYmdDate(nextYmd, {
      required,
      minDate,
      maxDate,
      disablePast,
      disableFuture,
    });
    onValidityChange?.(
      nextCheck.valid ? { status: 'valid' } : { status: 'invalid', reason: nextCheck.reason }
    );
  };

  const htmlInputSlot =
    ariaLabel || testId
      ? {
          ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
          ...(testId ? { 'data-testid': testId } : {}),
        }
      : undefined;

  return {
    id,
    effectiveDisabled,
    effectiveReadOnly,
    effectiveMinDayjs: parseYmdToDayjs(effectiveMinYmd) ?? undefined,
    effectiveMaxDayjs: parseYmdToDayjs(effectiveMaxYmd) ?? undefined,
    pickerValue,
    effectiveError,
    effectiveHelperText,
    htmlInputSlot,
    handlePickerChange,
  };
}
