import React from 'react';
import { AppTextField, AppTextFieldProps } from './AppTextField';
import InputAdornment from '@mui/material/InputAdornment';

export type AppCurrencyFieldProps = AppTextFieldProps & {
  currencySymbol?: string;
  inputProps?: any;
};

export const AppCurrencyField: React.FC<AppCurrencyFieldProps> = (allProps) => {
  const { currencySymbol = '৳', InputProps, ...props } = allProps as any;
  return (
    <AppTextField
      type="text"
      inputMode="decimal"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <span className="font-semibold text-emerald-700 dark:text-emerald-400">{currencySymbol}</span>
          </InputAdornment>
        ),
        ...InputProps,
      }}
      {...props}
    />
  );
};
