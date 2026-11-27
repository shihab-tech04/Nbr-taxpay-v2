import React from 'react';
import TextField, { OutlinedTextFieldProps } from '@mui/material/TextField';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { AppSlotProps, mergeSlotEntry } from './fieldUtils';

export type AppTextFieldProps = Omit<OutlinedTextFieldProps, 'variant'> & {
  variant?: 'outlined';
  readOnly?: boolean;
  allowPublicLookup?: boolean;
};

export const AppTextField: React.FC<AppTextFieldProps> = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  disabled = false,
  readOnly = false,
  allowPublicLookup = false,
  slotProps,
  select,
  ...props
}) => {
  const previewLocked = Boolean(PUBLIC_PREVIEW && !allowPublicLookup);
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
