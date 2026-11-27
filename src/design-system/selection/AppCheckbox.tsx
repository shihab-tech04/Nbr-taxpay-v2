import React from 'react';
import Checkbox from '@mui/material/Checkbox';
import {
  SelectionBooleanField,
  type SelectionBooleanBaseProps,
} from './SelectionBooleanField';

export interface AppCheckboxProps extends SelectionBooleanBaseProps {
  indeterminate?: boolean;
}

export const AppCheckbox: React.FC<AppCheckboxProps> = ({
  indeterminate = false,
  ...props
}) => {
  return (
    <SelectionBooleanField
      {...props}
      idSuffix="checkbox"
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
        <Checkbox
          id={id}
          name={name}
          value={value}
          checked={checked}
          indeterminate={indeterminate}
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
