import React, { useId } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { SELECTION_TOKENS } from '../theme';
import { RADIO_GROUP_COLUMN_SX } from './radioCardStyle';
import {
  AppRadioGroupContext,
  type SelectionPalette,
  type SelectionSize,
} from './selectionContext';

export interface AppRadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

export interface AppRadioGroupProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string) => void;
  options?: readonly AppRadioOption[];
  children?: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  columns?: 1 | 2 | 3;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  size?: SelectionSize;
  palette?: SelectionPalette;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
  className?: string;
  groupClassName?: string;
}

export const AppRadioGroup: React.FC<AppRadioGroupProps> = ({
  id,
  name,
  label,
  value,
  defaultValue,
  onChange,
  options,
  children,
  orientation = 'vertical',
  columns,
  required = false,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  size = 'small',
  palette = 'brand',
  publicCapability = 'none',
  previewRestricted = false,
  className = '',
  groupClassName = '',
}) => {
  const generatedId = useId();
  const groupId = id ?? `${generatedId}-radiogroup`;
  const labelId = label ? `${groupId}-label` : undefined;
  const helperId = helperText ? `${groupId}-helper` : undefined;

  const previewLocked = isFieldLockedByPreviewPolicy({
    publicCapability,
    previewRestricted,
  });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly && !effectiveDisabled);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, nextValue: string) => {
    if (effectiveDisabled || effectiveReadOnly) {
      event.preventDefault();
      return;
    }
    onChange?.(event, nextValue);
  };

  const layoutClass =
    groupClassName ||
    (columns ? '' : orientation === 'horizontal' ? 'flex flex-wrap gap-3' : 'grid gap-3');

  return (
    <FormControl
      component="fieldset"
      required={required}
      error={error}
      disabled={effectiveDisabled}
      className={`w-full ${className}`.trim()}
    >
      {label && (
        <FormLabel id={labelId} component="legend">
          {label}
        </FormLabel>
      )}
      <AppRadioGroupContext.Provider
        value={{
          name,
          disabled: effectiveDisabled,
          readOnly: effectiveReadOnly,
          error,
          size,
          palette,
          errorId: helperId,
          publicCapability,
          previewRestricted,
        }}
      >
        <RadioGroup
          id={groupId}
          name={name}
          value={value}
          defaultValue={defaultValue}
          onChange={handleChange}
          row={!columns && orientation === 'horizontal'}
          aria-labelledby={labelId}
          aria-describedby={helperId}
          aria-invalid={error || undefined}
          className={layoutClass || undefined}
          sx={columns ? RADIO_GROUP_COLUMN_SX[columns] : undefined}
        >
          {children ??
            options?.map((option) => {
              const optionDisabled = effectiveDisabled || Boolean(option.disabled);
              return (
                <FormControlLabel
                  key={option.value}
                  value={option.value}
                  disabled={optionDisabled}
                  className={effectiveReadOnly ? 'Mui-readOnly' : undefined}
                  label={
                    option.description ? (
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
                          {option.label}
                        </span>
                        <span
                          className="text-slate-600 dark:text-slate-400 leading-snug"
                          style={{ fontSize: SELECTION_TOKENS.descriptionFontSize }}
                        >
                          {option.description}
                        </span>
                      </span>
                    ) : (
                      option.label
                    )
                  }
                  control={
                    <Radio
                      size={size}
                      disabled={optionDisabled}
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
                        },
                      }}
                    />
                  }
                />
              );
            })}
        </RadioGroup>
      </AppRadioGroupContext.Provider>
      {helperText && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
