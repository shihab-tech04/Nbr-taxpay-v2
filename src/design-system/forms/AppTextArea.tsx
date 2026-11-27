import React from 'react';
import { AppTextField, AppTextFieldProps } from './AppTextField';

export type AppTextAreaProps = AppTextFieldProps & {
  rows?: number;
  minRows?: number;
  maxRows?: number;
};

export const AppTextArea: React.FC<AppTextAreaProps> = ({
  rows = 4,
  minRows,
  maxRows,
  ...props
}) => {
  const usesDynamicRows = minRows !== undefined || maxRows !== undefined;

  return (
    <AppTextField
      multiline
      rows={usesDynamicRows ? undefined : rows}
      minRows={minRows}
      maxRows={maxRows}
      {...props}
    />
  );
};
