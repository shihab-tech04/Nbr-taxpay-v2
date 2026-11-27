import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';

export interface OptionItem {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export type AppSelectFieldProps = TextFieldProps & {
  options: OptionItem[];
};

export const AppSelectField: React.FC<AppSelectFieldProps> = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  options,
  children,
  ...props
}) => {
  return (
    <TextField
      select
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      {...(props as any)}
    >
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value} disabled={option.disabled}>
          {option.label}
        </MenuItem>
      ))}
      {children}
    </TextField>
  );
};
