import React from 'react';
import TextField, { OutlinedTextFieldProps } from '@mui/material/TextField';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { AppSlotProps, mergeSlotEntry } from './fieldUtils';

export type AppTextFieldProps = Omit<OutlinedTextFieldProps, 'variant'> & {
  variant?: 'outlined';
  readOnly?: boolean;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
};

export const AppTextField: React.FC<AppTextFieldProps> = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  disabled = false,
  readOnly = false,
  publicCapability = 'none',
  previewRestricted = false,
  slotProps,
  select,
  ...props
}) => {
  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly || previewLocked);

  const readOnlyClass =
    effectiveReadOnly && !effectiveDisabled ? 'Mui-readOnly' : undefined;

  const baseInputSlot: AppSlotProps['input'] = effectiveReadOnly
    ? {
        readOnly: true,
        className: readOnlyClass,
      }
    : undefined;

  const mergedInputSlot = (() => {
    const combined = mergeSlotEntry('input', baseInputSlot, slotProps?.input);
    if (!readOnlyClass || !slotProps?.input || typeof slotProps.input === 'function') {
      return combined;
    }
    const existingClassName =
      typeof slotProps.input.className === 'string' ? slotProps.input.className : '';
    return {
      ...slotProps.input,
      readOnly: effectiveReadOnly || Boolean(slotProps.input.readOnly),
      className: existingClassName ? `${readOnlyClass} ${existingClassName}` : readOnlyClass,
    };
  })();

  const mergedHtmlInputSlot = mergeSlotEntry(
    'htmlInput',
    effectiveReadOnly ? { readOnly: true } : undefined,
    slotProps?.htmlInput
  );

  const mergedSelectSlot = select
    ? mergeSlotEntry(
        'select',
        {
          readOnly: effectiveReadOnly,
          disabled: effectiveDisabled,
        },
        slotProps?.select
      )
    : slotProps?.select;

  const mergedSlotProps: AppSlotProps = {
    ...slotProps,
    ...(mergedInputSlot ? { input: mergedInputSlot } : {}),
    ...(mergedHtmlInputSlot ? { htmlInput: mergedHtmlInputSlot } : {}),
    ...(mergedSelectSlot ? { select: mergedSelectSlot } : {}),
  };

  return (
    <TextField
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      disabled={effectiveDisabled}
      select={select}
      slotProps={mergedSlotProps}
      {...props}
    />
  );
};
