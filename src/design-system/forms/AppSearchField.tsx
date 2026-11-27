import React from 'react';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { Search, X } from 'lucide-react';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import { mergeSlotEntry } from './fieldUtils';

export type AppSearchFieldProps = Omit<AppTextFieldProps, 'type'> & {
  onClear?: () => void;
  clearAriaLabel?: string;
};

export const AppSearchField: React.FC<AppSearchFieldProps> = ({
  value,
  onClear,
  clearAriaLabel,
  disabled = false,
  readOnly = false,
  slotProps,
  ...props
}) => {
  const { t } = useTranslation();
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const isActionDisabled = Boolean(disabled || readOnly || PUBLIC_PREVIEW);

  const handleClear = () => {
    if (isActionDisabled || !onClear) return;
    onClear();
  };

  const handleMouseDownClear = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const resolvedClearLabel =
    clearAriaLabel || t('clearSearch', { defaultValue: 'Clear search' });

  const mergedInputSlot = mergeSlotEntry(
    'input',
    {
      startAdornment: (
        <InputAdornment position="start">
          <Search className="w-4 h-4 text-slate-400 dark:text-slate-500" aria-hidden="true" />
        </InputAdornment>
      ),
      endAdornment:
        hasValue && onClear ? (
          <InputAdornment position="end">
            <IconButton
              type="button"
              aria-label={resolvedClearLabel}
              onClick={handleClear}
              onMouseDown={handleMouseDownClear}
              disabled={isActionDisabled}
              edge="end"
              size="small"
              sx={{ color: 'text.secondary' }}
            >
              <X className="w-4 h-4" aria-hidden="true" />
            </IconButton>
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
      slotProps={{
        ...slotProps,
        input: mergedInputSlot,
        htmlInput: mergedHtmlInputSlot,
      }}
      {...props}
    />
  );
};
