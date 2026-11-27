import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';

export type AppTextFieldProps = TextFieldProps & {
  inputProps?: any;
  slotProps?: any;
};

export const AppTextField: React.FC<AppTextFieldProps> = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'small',
  ...props
}) => {
  return (
    <TextField
      variant={variant}
      fullWidth={fullWidth}
      size={size}
      {...(props as any)}
    />
  );
};
