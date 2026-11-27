import React from 'react';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import { mergeSlotEntry, sanitizeCurrencyInput, sanitizeDigits } from './fieldUtils';

export type AppNumberFieldProps = Omit<AppTextFieldProps, 'type'> & {
  maxLength?: number;
  allowDecimal?: boolean;
  digitsOnly?: boolean;
};

export const AppNumberField: React.FC<AppNumberFieldProps> = ({
  maxLength,
  allowDecimal = false,
  digitsOnly = !allowDecimal,
  slotProps,
  onChange,
  ...props
}) => {
  const handleChange: NonNullable<AppTextFieldProps['onChange']> = (event) => {
    const rawValue = event.target.value;
    let sanitized = rawValue;

    if (digitsOnly) {
      sanitized = sanitizeDigits(rawValue, maxLength);
    } else if (allowDecimal) {
      const cleaned = sanitizeCurrencyInput(rawValue, 2);
      sanitized = typeof maxLength === 'number' ? cleaned.slice(0, maxLength) : cleaned;
    } else if (typeof maxLength === 'number') {
      sanitized = rawValue.slice(0, maxLength);
    }

    if (sanitized !== rawValue) {
      event.target.value = sanitized;
    }

    onChange?.(event);
  };

  const mergedHtmlInput = mergeSlotEntry(
    'htmlInput',
    {
      inputMode: allowDecimal ? 'decimal' : 'numeric',
      ...(digitsOnly ? { pattern: '[0-9]*' } : {}),
      ...(typeof maxLength === 'number' ? { maxLength } : {}),
    },
    slotProps?.htmlInput
  );

  return (
    <AppTextField
      type="text"
      onChange={handleChange}
      slotProps={{
        ...slotProps,
        htmlInput: mergedHtmlInput,
      }}
      {...props}
    />
  );
};
