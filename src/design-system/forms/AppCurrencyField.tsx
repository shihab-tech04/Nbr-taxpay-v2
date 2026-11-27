import React from 'react';
import InputAdornment from '@mui/material/InputAdornment';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import { mergeSlotEntry, sanitizeCurrencyInput } from './fieldUtils';

export type AppCurrencyFieldProps = Omit<AppTextFieldProps, 'type'> & {
  currencySymbol?: string;
  minAmount?: number;
  maxAmount?: number;
  decimalScale?: number;
};

export const AppCurrencyField: React.FC<AppCurrencyFieldProps> = ({
  currencySymbol = '৳',
  minAmount,
  maxAmount,
  decimalScale = 2,
  slotProps,
  value,
  onChange,
  ...props
}) => {
  const safeValue =
    typeof value === 'number' && Number.isNaN(value) ? '' : value;

  const handleChange: NonNullable<AppTextFieldProps['onChange']> = (event) => {
    const rawValue = event.target.value;
    const sanitized = sanitizeCurrencyInput(rawValue, decimalScale);
    if (sanitized !== rawValue) {
      event.target.value = sanitized;
    }
    onChange?.(event);
  };

  const stepValue =
    decimalScale > 0 ? (1 / Math.pow(10, decimalScale)).toFixed(decimalScale) : '1';

  const mergedInputSlot = mergeSlotEntry(
    'input',
    {
      startAdornment: (
        <InputAdornment position="start">
          <span
            aria-hidden="true"
            className="font-semibold text-emerald-700 dark:text-emerald-400 select-none leading-none"
          >
            {currencySymbol}
          </span>
        </InputAdornment>
      ),
    },
    slotProps?.input
  );

  const mergedHtmlInputSlot = mergeSlotEntry(
    'htmlInput',
    {
      inputMode: 'decimal',
      ...(typeof minAmount === 'number' ? { min: minAmount } : {}),
      ...(typeof maxAmount === 'number' ? { max: maxAmount } : {}),
      step: stepValue,
    },
    slotProps?.htmlInput
  );

  return (
    <AppTextField
      type="text"
      value={safeValue}
      onChange={handleChange}
      slotProps={{
        ...slotProps,
        input: mergedInputSlot,
        htmlInput: mergedHtmlInputSlot,
      }}
      {...props}
    />
  );
};
