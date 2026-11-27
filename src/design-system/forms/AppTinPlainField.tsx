import React from 'react';
import { X } from 'lucide-react';
import type { PublicCapability } from '../../shared/previewPolicy';
import { AppIconButton } from '../buttons';
import { AppTextField } from './AppTextField';
import { sanitizeIdentifierDigits } from './tinInputUtils';

export interface AppTinPlainFieldProps {
  fieldId: string;
  name?: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
  label: React.ReactNode;
  value: string;
  masked: boolean;
  readOnly: boolean;
  disabled: boolean;
  locked: boolean;
  maxLength: number;
  placeholder: string;
  required: boolean;
  error: boolean;
  helperText?: React.ReactNode;
  showClearButton: boolean;
  clearAriaLabel: string;
  onClear: () => void;
  onChange: (nextValue: string) => void;
  inputTestId?: string;
  ariaRole?: React.AriaRole;
  ariaAutocomplete?: 'none' | 'list' | 'inline' | 'both';
  ariaControls?: string;
  ariaExpanded?: boolean;
  describedBy?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  publicCapability: PublicCapability;
  previewRestricted: boolean;
}

export const AppTinPlainField: React.FC<AppTinPlainFieldProps> = ({
  fieldId,
  name,
  inputRef,
  label,
  value,
  masked,
  readOnly,
  disabled,
  locked,
  maxLength,
  placeholder,
  required,
  error,
  helperText,
  showClearButton,
  clearAriaLabel,
  onClear,
  onChange,
  inputTestId,
  ariaRole,
  ariaAutocomplete,
  ariaControls,
  ariaExpanded,
  describedBy,
  onFocus,
  onBlur,
  onKeyDown,
  publicCapability,
  previewRestricted,
}) => (
  <AppTextField
    id={fieldId}
    name={name}
    inputRef={inputRef}
    label={label}
    value={masked && readOnly ? value.replace(/\d/g, '•') : value}
    onChange={(e) => {
      if (!locked) onChange(sanitizeIdentifierDigits(e.target.value, maxLength));
    }}
    placeholder={placeholder}
    required={required}
    disabled={disabled}
    readOnly={readOnly}
    error={error}
    helperText={helperText}
    publicCapability={publicCapability}
    previewRestricted={previewRestricted}
    onFocus={onFocus}
    onBlur={onBlur}
    onKeyDown={onKeyDown}
    slotProps={{
      htmlInput: {
        'data-testid': inputTestId,
        inputMode: 'numeric',
        pattern: '[0-9]*',
        autoComplete: 'off',
        maxLength,
        role: ariaRole,
        'aria-autocomplete': ariaAutocomplete,
        'aria-controls': ariaControls,
        'aria-expanded': ariaExpanded,
        'aria-describedby': describedBy,
      },
      input: {
        endAdornment:
          showClearButton && value && !locked ? (
            <AppIconButton size="small" aria-label={clearAriaLabel} onClick={onClear}>
              <X size={16} aria-hidden="true" />
            </AppIconButton>
          ) : undefined,
      },
    }}
  />
);
