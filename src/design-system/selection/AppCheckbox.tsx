import React, { useId } from 'react';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { SELECTION_TOKENS } from '../theme';
import type { SelectionSize } from './selectionContext';

export interface AppCheckboxProps {
  id?: string;
  name?: string;
  value?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  indeterminate?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  size?: SelectionSize;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
  className?: string;
}

export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  id,
  name,
  value,
  label,
  description,
  checked,
  defaultChecked,
  indeterminate = false,
  onChange,
  required = false,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  size = 'small',
  publicCapability = 'none',
  previewRestricted = false,
  className = '',
}) => {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-checkbox`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [descriptionId, helperId].filter(Boolean).join(' ') || undefined;

  const previewLocked = isFieldLockedByPreviewPolicy({
    publicCapability,
    previewRestricted,
  });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly && !effectiveDisabled);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, nextChecked: boolean) => {
    if (effectiveDisabled || effectiveReadOnly) {
      event.preventDefault();
      return;
    }
    onChange?.(event, nextChecked);
  };

  const labelContent = description ? (
    <span className="grid gap-0.5 min-w-0">
      <span
        className="font-semibold leading-snug"
        style={{
          fontSize:
            size === 'small'
              ? SELECTION_TOKENS.labelFontSizeSmall
              : SELECTION_TOKENS.labelFontSizeMedium,
        }}
      >
        {label}
      </span>
      <span
        id={descriptionId}
        className="text-slate-600 dark:text-slate-400 leading-snug"
        style={{ fontSize: SELECTION_TOKENS.descriptionFontSize }}
      >
        {description}
      </span>
    </span>
  ) : (
    <span
      className="font-semibold leading-snug"
      style={{
        fontSize:
          size === 'small'
            ? SELECTION_TOKENS.labelFontSizeSmall
            : SELECTION_TOKENS.labelFontSizeMedium,
      }}
    >
      {label}
    </span>
  );

  return (
    <FormControl
      required={required}
      error={error}
      disabled={effectiveDisabled}
      className={className}
    >
      <FormControlLabel
        className={effectiveReadOnly ? 'Mui-readOnly' : undefined}
        label={labelContent}
        control={
          <Checkbox
            id={inputId}
            name={name}
            value={value}
            checked={checked}
            defaultChecked={defaultChecked}
            indeterminate={indeterminate}
            onChange={handleChange}
            required={required}
            disabled={effectiveDisabled}
            size={size}
            className={[
              effectiveReadOnly ? 'Mui-readOnly' : '',
              error ? 'Mui-error' : '',
            ]
              .filter(Boolean)
              .join(' ') || undefined}
            slotProps={{
              input: {
                readOnly: effectiveReadOnly,
                'aria-readonly': effectiveReadOnly || undefined,
                'aria-invalid': error || undefined,
                'aria-describedby': describedBy,
              },
            }}
          />
        }
      />
      {helperText && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
