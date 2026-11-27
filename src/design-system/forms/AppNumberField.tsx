import React from 'react';
import { AppTextField, AppTextFieldProps } from './AppTextField';

export type AppNumberFieldProps = AppTextFieldProps & {
  maxLength?: number;
};

export const AppNumberField: React.FC<AppNumberFieldProps> = (allProps) => {
  const { inputProps, maxLength, ...props } = allProps as any;
  return (
    <AppTextField
      type="text"
      inputMode="numeric"
      inputProps={{
        maxLength,
        ...inputProps,
      }}
      {...props}
    />
  );
};
