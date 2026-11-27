import React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import { useRadioGroup } from '@mui/material/RadioGroup';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { getThemeColors } from '../theme';
import { resolveRadioCardSx } from './radioCardStyle';
import {
  useAppRadioGroupContext,
  type SelectionPalette,
  type SelectionSize,
} from './selectionContext';

export interface AppRadioCardProps {
  id?: string;
  name?: string;
  value: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  disabled?: boolean;
  readOnly?: boolean;
  invalid?: boolean;
  errorId?: string;
  size?: SelectionSize;
  palette?: SelectionPalette;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
  className?: string;
}

export const AppRadioCard: React.FC<AppRadioCardProps> = ({
  id,
  name,
  value,
  title,
  description,
  checked,
  onChange,
  disabled = false,
  readOnly = false,
  invalid,
  errorId,
  size,
  palette,
  publicCapability,
  previewRestricted,
  className = '',
}) => {
  const muiGroup = useRadioGroup();
  const groupCtx = useAppRadioGroupContext();

  const resolvedPalette = palette ?? groupCtx?.palette ?? 'brand';
  const resolvedSize = size ?? groupCtx?.size ?? 'small';
  const resolvedError = invalid ?? groupCtx?.error ?? false;
  const resolvedErrorId = errorId ?? groupCtx?.errorId;
  const resolvedName = name ?? groupCtx?.name ?? muiGroup?.name;

  const previewLocked = isFieldLockedByPreviewPolicy({
    publicCapability: publicCapability ?? groupCtx?.publicCapability ?? 'none',
    previewRestricted: Boolean(previewRestricted || groupCtx?.previewRestricted),
  });
  const effectiveDisabled = Boolean(disabled || groupCtx?.disabled || previewLocked);
  const effectiveReadOnly = Boolean((readOnly || groupCtx?.readOnly) && !effectiveDisabled);

  const isSelected =
    checked !== undefined ? checked : muiGroup ? muiGroup.value === value : false;

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, nextChecked: boolean) => {
    if (effectiveDisabled || effectiveReadOnly) {
      event.preventDefault();
      return;
    }
    onChange?.(event, nextChecked);
  };

  return (
    <FormControlLabel
      value={value}
      disabled={effectiveDisabled}
      className={[effectiveReadOnly ? 'Mui-readOnly' : '', className].filter(Boolean).join(' ') || undefined}
      sx={resolveRadioCardSx({
        palette: resolvedPalette,
        isSelected,
        resolvedError,
        effectiveDisabled,
        effectiveReadOnly,
      })}
      label={
        <span className="grid gap-0.5 min-w-0">
          <strong className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
            {title}
          </strong>
          {description && (
            <small className="text-[13px] font-normal leading-snug text-slate-600 dark:text-slate-400">
              {description}
            </small>
          )}
        </span>
      }
      control={
        <Radio
          id={id}
          name={resolvedName}
          value={value}
          checked={checked !== undefined ? checked : undefined}
          onChange={handleChange}
          disabled={effectiveDisabled}
          size={resolvedSize}
          className={[
            effectiveReadOnly ? 'Mui-readOnly' : '',
            resolvedError ? 'Mui-error' : '',
          ]
            .filter(Boolean)
            .join(' ') || undefined}
          sx={(theme) => {
            const colors = getThemeColors(theme.palette.mode);
            if (resolvedPalette !== 'home') return { p: 0, mt: 0 };
            return {
              p: 0,
              mt: 0,
              '&.Mui-checked': {
                color: colors.home.radioSelectedBorder,
              },
            };
          }}
          slotProps={{
            input: {
              readOnly: effectiveReadOnly,
              'aria-readonly': effectiveReadOnly || undefined,
              'aria-invalid': resolvedError || undefined,
              'aria-describedby': resolvedError ? resolvedErrorId : undefined,
            },
          }}
        />
      }
    />
  );
};
