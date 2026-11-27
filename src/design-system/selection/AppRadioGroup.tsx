import React, { useId, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import FormLabel from '@mui/material/FormLabel';
import RadioGroup from '@mui/material/RadioGroup';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { AppRadioOptionItem, type AppRadioOption } from './AppRadioOptionItem';
import { RADIO_GROUP_COLUMN_SX } from './radioCardStyle';
import {
  AppRadioGroupContext,
  createBlockedSelectionHandlers,
  isSelectionInteractionBlocked,
  type SelectionPalette,
  type SelectionSize,
} from './selectionContext';

export type { AppRadioOption };

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

const RADIO_BLOCKED_KEYS = [' ', 'Enter', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'] as const;

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

  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly && !effectiveDisabled);
  const isBlocked = isSelectionInteractionBlocked(effectiveDisabled, effectiveReadOnly);
  const { handleClick, handleKeyDown } = createBlockedSelectionHandlers(isBlocked, RADIO_BLOCKED_KEYS);

  const isControlled = value !== undefined;
  const [uncontrolledValue, setUncontrolledValue] = useState<string>(defaultValue ?? '');
  const resolvedValue = isControlled ? value : uncontrolledValue;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, nextValue: string) => {
    if (isBlocked) {
      event.preventDefault();
      return;
    }
    if (!isControlled) setUncontrolledValue(nextValue);
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
          value={resolvedValue}
          onChange={handleChange}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          row={!columns && orientation === 'horizontal'}
          aria-labelledby={labelId}
          aria-describedby={helperId}
          aria-invalid={error || undefined}
          className={layoutClass || undefined}
          sx={columns ? RADIO_GROUP_COLUMN_SX[columns] : undefined}
        >
          {children ??
            options?.map((option) => (
              <AppRadioOptionItem
                key={option.value}
                option={option}
                groupDisabled={effectiveDisabled}
                readOnly={effectiveReadOnly}
                error={error}
                size={size}
                onBlockedClick={handleClick}
                onBlockedKeyDown={handleKeyDown}
              />
            ))}
        </RadioGroup>
      </AppRadioGroupContext.Provider>
      {helperText && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
