import React from 'react';
import { useTranslation } from 'react-i18next';
import InputAdornment from '@mui/material/InputAdornment';
import { Search, X } from 'lucide-react';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
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
  publicCapability = 'none' as PublicCapability,
  slotProps,
  ...props
}) => {
  const { t } = useTranslation();
  const hasValue = value !== undefined && value !== null && String(value).length > 0;
  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability });
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
              surface="clear"
              palette="home"
              aria-label={resolvedClearLabel}
              onClick={handleClear}
              onMouseDown={handleMouseDownClear}
              disabled={isActionDisabled}
              publicCapability={publicCapability}
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
      publicCapability={publicCapability}
      slotProps={{
        ...slotProps,
        input: mergedInputSlot,
        htmlInput: mergedHtmlInputSlot,
      }}
      {...props}
    />
  );
};
