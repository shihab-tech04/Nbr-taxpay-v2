import React from 'react';
import { DateField } from '@mui/x-date-pickers/DateField';
import { useSharedDateControlState, type AppDateControlProps } from './dateFieldShared';

export type AppDateFieldProps = AppDateControlProps;

export const AppDateField: React.FC<AppDateFieldProps> = ({
  format = 'DD/MM/YYYY',
  clearable = true,
  required = false,
  size = 'small',
  fullWidth = true,
  label,
  ...rest
}) => {
  const state = useSharedDateControlState({ required, ...rest });

  return (
    <DateField
      label={label}
      value={state.pickerValue}
      onChange={state.handlePickerChange}
      minDate={state.effectiveMinDayjs}
      maxDate={state.effectiveMaxDayjs}
      format={format}
      clearable={clearable && !state.effectiveDisabled && !state.effectiveReadOnly}
      required={required}
      disabled={state.effectiveDisabled}
      readOnly={state.effectiveReadOnly}
      size={size}
      fullWidth={fullWidth}
      slotProps={{
        textField: {
          id: state.id,
          error: state.effectiveError,
          helperText: state.effectiveHelperText,
          className: state.effectiveReadOnly && !state.effectiveDisabled ? 'Mui-readOnly' : undefined,
          slotProps: state.htmlInputSlot ? { htmlInput: state.htmlInputSlot } : undefined,
        },
      }}
    />
  );
};
