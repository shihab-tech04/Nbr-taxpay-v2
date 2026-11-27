import React, { useState } from 'react';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useSharedDateControlState, type AppDateControlProps } from './dateFieldShared';

export type AppDatePickerProps = AppDateControlProps;

export const AppDatePicker: React.FC<AppDatePickerProps> = ({
  format = 'DD/MM/YYYY',
  clearable = true,
  required = false,
  size = 'small',
  fullWidth = true,
  label,
  ...rest
}) => {
  const [open, setOpen] = useState(false);
  const state = useSharedDateControlState({ required, ...rest });
  const resolvedOpen = !state.effectiveDisabled && !state.effectiveReadOnly && open;

  return (
    <DatePicker
      label={label}
      open={resolvedOpen}
      onOpen={() => {
        if (!state.effectiveDisabled && !state.effectiveReadOnly) setOpen(true);
      }}
      onClose={() => setOpen(false)}
      value={state.pickerValue}
      onChange={state.handlePickerChange}
      minDate={state.effectiveMinDayjs}
      maxDate={state.effectiveMaxDayjs}
      format={format}
      disabled={state.effectiveDisabled}
      readOnly={state.effectiveReadOnly}
      desktopModeMediaQuery="@media (min-width: 640px)"
      closeOnSelect
      slotProps={{
        field: {
          clearable: clearable && !state.effectiveDisabled && !state.effectiveReadOnly,
          readOnly: state.effectiveReadOnly,
        },
        textField: {
          id: state.id,
          size,
          fullWidth,
          required,
          error: state.effectiveError,
          helperText: state.effectiveHelperText,
          className: state.effectiveReadOnly && !state.effectiveDisabled ? 'Mui-readOnly' : undefined,
          slotProps:
            state.effectiveError || state.htmlInputSlot
              ? {
                  ...(state.effectiveError ? { input: { 'aria-invalid': true } } : {}),
                  ...(state.htmlInputSlot ? { htmlInput: state.htmlInputSlot } : {}),
                }
              : undefined,
        },
        popper: {
          placement: 'bottom-start',
          onKeyDown: (event) => {
            if (event.key === 'Escape') {
              event.stopPropagation();
              setOpen(false);
            }
          },
          sx: { zIndex: (theme) => theme.zIndex.modal + 10 },
          modifiers: [
            { name: 'flip', enabled: true },
            { name: 'preventOverflow', enabled: true, options: { padding: 8 } },
          ],
        },
      }}
    />
  );
};
