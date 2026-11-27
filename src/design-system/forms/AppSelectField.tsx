import React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import { mergeSlotEntry } from './fieldUtils';

export interface OptionItem {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type AppSelectFieldProps = Omit<AppTextFieldProps, 'select'> & {
  options: OptionItem[];
};

export const AppSelectField: React.FC<AppSelectFieldProps> = ({
  options,
  children,
  slotProps,
  ...props
}) => {
  const hasEmptyOption = options.some((option) => option.value === '');

  const mergedSelectSlot = mergeSlotEntry(
    'select',
    hasEmptyOption ? { displayEmpty: true } : undefined,
    slotProps?.select
  );

  const mergedInputLabelSlot = mergeSlotEntry(
    'inputLabel',
    hasEmptyOption ? { shrink: true } : undefined,
    slotProps?.inputLabel
  );

  return (
    <AppTextField
      select
      slotProps={{
        ...slotProps,
        ...(mergedSelectSlot ? { select: mergedSelectSlot } : {}),
        ...(mergedInputLabelSlot ? { inputLabel: mergedInputLabelSlot } : {}),
      }}
      {...props}
    >
      {options.map((option) => (
        <MenuItem key={String(option.value)} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
      {children}
    </AppTextField>
  );
};
