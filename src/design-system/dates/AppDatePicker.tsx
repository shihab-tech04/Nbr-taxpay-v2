import React from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { AppDateLocalizationProvider } from './AppDateLocalizationProvider';
import { formatDayjsToYmd, getDhakaTodayYmd, parseYmdToDayjs } from './dateUtils';

export interface AppDatePickerProps {
  id?: string;
  label: React.ReactNode;
  value: string;
  onChange: (nextValue: string) => void;
  minDate?: string;
  maxDate?: string;
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

export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  id,
  label,
  value,
  onChange,
  minDate,
  maxDate,
  disableFuture = false,
  format = 'DD/MM/YYYY',
  clearable = true,
  required = false,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  size = 'small',
  fullWidth = true,
  ariaLabel,
  testId,
  publicCapability = 'none',
  previewRestricted = false,
}) => {
  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly || previewLocked);
  const effectiveMaxYmd = maxDate ?? (disableFuture ? getDhakaTodayYmd() : undefined);

  return (
    <AppDateLocalizationProvider>
      <DatePicker
        label={label}
        value={parseYmdToDayjs(value)}
        onChange={(nextDayjs) => {
          if (effectiveDisabled || effectiveReadOnly) return;
          if (nextDayjs === null) {
            onChange('');
            return;
          }
          if (nextDayjs.isValid()) {
            onChange(formatDayjsToYmd(nextDayjs));
          }
        }}
        minDate={parseYmdToDayjs(minDate) ?? undefined}
        maxDate={parseYmdToDayjs(effectiveMaxYmd) ?? undefined}
        format={format}
        disabled={effectiveDisabled}
        readOnly={effectiveReadOnly}
        desktopModeMediaQuery="@media (min-width: 640px)"
        closeOnSelect
        slotProps={{
          field: {
            clearable: clearable && !effectiveDisabled && !effectiveReadOnly,
            readOnly: effectiveReadOnly,
          },
          textField: {
            id,
            size,
            fullWidth,
            required,
            error,
            helperText,
            className: effectiveReadOnly && !effectiveDisabled ? 'Mui-readOnly' : undefined,
            slotProps:
              ariaLabel || testId
                ? {
                    htmlInput: {
                      ...(ariaLabel ? { 'aria-label': ariaLabel } : {}),
                      ...(testId ? { 'data-testid': testId } : {}),
                    },
                  }
                : undefined,
          },
          popper: {
            placement: 'bottom-start',
            sx: { zIndex: (theme) => theme.zIndex.modal + 10 },
            modifiers: [
              { name: 'flip', enabled: true },
              { name: 'preventOverflow', enabled: true, options: { padding: 8 } },
            ],
          },
        }}
      />
    </AppDateLocalizationProvider>
  );
};
