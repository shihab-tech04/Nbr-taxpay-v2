import React from 'react';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import { Search, X } from 'lucide-react';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { AppIconButton } from '../buttons';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import { mergeSlotEntry } from './fieldUtils';

export type AppSearchFieldProps = Omit<AppTextFieldProps, 'type'> & {
  onClear?: () => void;
  clearAriaLabel?: string;
  trailingAction?: React.ReactNode;
};

export const AppSearchField: React.FC<AppSearchFieldProps> = ({
  value,
  onClear,
  clearAriaLabel,
  trailingAction,
  disabled = false,
  readOnly = false,
  allowPublicLookup = false,
  slotProps,
  ...props
}) => {
  const { t } = useTranslation();
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const previewLocked = Boolean(PUBLIC_PREVIEW && !allowPublicLookup);
  const isActionDisabled = Boolean(disabled || readOnly || previewLocked);

  const handleClear = () => {
    if (isActionDisabled || !onClear) return;
    onClear();
  };

  const handleMouseDownClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const resolvedClearLabel =
    clearAriaLabel || t('clearSearch', { defaultValue: 'Clear search' });

  const hasEndAdornment = (hasValue && onClear) || trailingAction;

  const mergedInputSlot = mergeSlotEntry(
    'input',
    {
      startAdornment: (
        <InputAdornment position="start">
          <Search className="w-4 h-4 text-[#5d697e] dark:text-slate-500" aria-hidden="true" />
        </InputAdornment>
      ),
      endAdornment: hasEndAdornment ? (
        <InputAdornment position="end" sx={{ gap: 0.75 }}>
          {hasValue && onClear && (
            <AppIconButton
              tone="homeClear"
              aria-label={resolvedClearLabel}
              onClick={handleClear}
              onMouseDown={handleMouseDownClear}
              disabled={isActionDisabled}
              edge={trailingAction ? false : 'end'}
              size="small"
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </AppIconButton>
          )}
          {trailingAction}
        </InputAdornment>
      ) : undefined,
    },
    slotProps?.input
  );

  const mergedHtmlInputSlot = mergeSlotEntry(
    'htmlInput',
    {
      enterKeyHint: 'search',
    },
    slotProps?.htmlInput
  );

  return (
    <AppTextField
      type="text"
      value={value}
      disabled={disabled}
      readOnly={readOnly}
      allowPublicLookup={allowPublicLookup}
      slotProps={{
        ...slotProps,
        input: mergedInputSlot,
        htmlInput: mergedHtmlInputSlot,
      }}
      {...props}
    />
  );
};
