import React from 'react';
import Switch from '@mui/material/Switch';
import {
  SelectionBooleanField,
  type SelectionBooleanBaseProps,
} from './SelectionBooleanField';

export interface AppSwitchProps extends SelectionBooleanBaseProps {
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
}

export const AppSwitch: React.FC<AppSwitchProps> = ({
  labelPlacement = 'end',
  ...props
}) => {
  return (
    <SelectionBooleanField
      {...props}
      idSuffix="switch"
      labelPlacement={labelPlacement}
      alignCenter
      renderControl={({
        id,
        name,
        value,
        checked,
        required,
        disabled,
        size,
        className,
        onChange,
        onClick,
        onKeyDown,
        inputSlotProps,
      }) => (
        <Switch
          id={id}
          name={name}
          value={value}
          checked={checked}
          onChange={onChange}
          onClick={onClick}
          onKeyDown={onKeyDown}
          required={required}
          disabled={disabled}
          size={size}
          className={className}
          slotProps={{ input: inputSlotProps }}
        />
      )}
    />
  );
};
