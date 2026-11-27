import React from 'react';
import { AppTextField, AppTextFieldProps } from './AppTextField';

export type AppTextAreaProps = AppTextFieldProps & {
  rows?: number;
  maxRows?: number;
};

export const AppTextArea: React.FC<AppTextAreaProps> = ({
  rows = 4,
  maxRows,
  ...props
}) => {
  return (
    <AppTextField
      multiline
      rows={rows}
      maxRows={maxRows}
      {...(props as any)}
    />
  );
};
