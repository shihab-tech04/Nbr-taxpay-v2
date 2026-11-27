import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { SELECTION_TOKENS } from '../theme';
import type { SelectionSize } from './selectionContext';

export interface AppRadioOption {
  value: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  disabled?: boolean;
}

interface AppRadioOptionItemProps {
  option: AppRadioOption;
  groupDisabled: boolean;
  readOnly: boolean;
  error: boolean;
  size: SelectionSize;
  onBlockedClick: (event: React.MouseEvent<HTMLElement>) => void;
  onBlockedKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
}

export const AppRadioOptionItem: React.FC<AppRadioOptionItemProps> = ({
  option,
  groupDisabled,
  readOnly,
  error,
  size,
  onBlockedClick,
  onBlockedKeyDown,
}) => {
  const optionDisabled = groupDisabled || Boolean(option.disabled);
  const labelFontSize =
    size === 'small' ? SELECTION_TOKENS.labelFontSizeSmall : SELECTION_TOKENS.labelFontSizeMedium;

  return (
    <FormControlLabel
      value={option.value}
      disabled={optionDisabled}
      onClick={onBlockedClick}
      className={readOnly ? 'Mui-readOnly' : undefined}
      label={
        option.description ? (
          <span className="grid gap-0.5 min-w-0">
            <span className="font-semibold leading-snug" style={{ fontSize: labelFontSize }}>
              {option.label}
            </span>
            <span
              className="text-slate-600 dark:text-slate-400 leading-snug"
              style={{ fontSize: SELECTION_TOKENS.descriptionFontSize }}
            >
              {option.description}
            </span>
          </span>
        ) : (
          option.label
        )
      }
      control={
        <Radio
          size={size}
          disabled={optionDisabled}
          onClick={onBlockedClick}
          onKeyDown={onBlockedKeyDown}
          className={[readOnly ? 'Mui-readOnly' : '', error ? 'Mui-error' : ''].filter(Boolean).join(' ') || undefined}
          slotProps={{
            input: {
              readOnly,
              'aria-readonly': readOnly || undefined,
              'aria-invalid': error || undefined,
            },
          }}
        />
      }
    />
  );
};
