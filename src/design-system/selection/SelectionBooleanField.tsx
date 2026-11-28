import React, { useId, useState } from 'react';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormHelperText from '@mui/material/FormHelperText';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { SELECTION_TOKENS } from '../theme';
import {
  createBlockedSelectionHandlers,
  isSelectionInteractionBlocked,
  type SelectionSize,
} from './selectionContext';

export interface SelectionBooleanBaseProps {
  id?: string;
  name?: string;
  value?: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  checked?: boolean;
  defaultChecked?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  size?: SelectionSize;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
  className?: string;
  'data-testid'?: string;
}

export interface SelectionBooleanControlRenderProps {
  id: string;
  name?: string;
  value?: string;
  checked: boolean;
  required: boolean;
  disabled: boolean;
  size: SelectionSize;
  className?: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => void;
  onClick: (event: React.MouseEvent<HTMLElement>) => void;
  onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => void;
  inputSlotProps: {
    readOnly: boolean;
    'aria-readonly'?: true;
    'aria-invalid'?: true;
    'aria-describedby'?: string;
    'data-testid'?: string;
  };
}

interface SelectionBooleanFieldProps extends SelectionBooleanBaseProps {
  idSuffix: 'checkbox' | 'switch';
  labelPlacement?: 'end' | 'start' | 'top' | 'bottom';
  alignCenter?: boolean;
  renderControl: (props: SelectionBooleanControlRenderProps) => React.ReactElement;
}

export const SelectionBooleanField: React.FC<SelectionBooleanFieldProps> = ({
  id,
  idSuffix,
  name,
  value,
  label,
  description,
  checked,
  defaultChecked,
  onChange,
  required = false,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  size = 'small',
  labelPlacement = 'end',
  alignCenter = false,
  publicCapability = 'none',
  previewRestricted = false,
  className = '',
  'data-testid': dataTestId,
  renderControl,
}) => {
  const generatedId = useId();
  const inputId = id ?? `${generatedId}-${idSuffix}`;
  const descriptionId = description ? `${inputId}-description` : undefined;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const describedBy = [descriptionId, helperId].filter(Boolean).join(' ') || undefined;

  const isControlled = checked !== undefined;
  const [uncontrolledChecked, setUncontrolledChecked] = useState<boolean>(Boolean(defaultChecked));
  const resolvedChecked = isControlled ? Boolean(checked) : uncontrolledChecked;

  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly && !effectiveDisabled);
  const blocked = isSelectionInteractionBlocked(effectiveDisabled, effectiveReadOnly);
  const { handleClick, handleKeyDown } = createBlockedSelectionHandlers(blocked);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>, nextChecked: boolean) => {
    if (blocked) {
      event.preventDefault();
      return;
    }
    if (!isControlled) setUncontrolledChecked(nextChecked);
    onChange?.(event, nextChecked);
  };

  const labelFontSize =
    size === 'small' ? SELECTION_TOKENS.labelFontSizeSmall : SELECTION_TOKENS.labelFontSizeMedium;

  const labelContent = description ? (
    <span className="grid gap-0.5 min-w-0">
      <span className="font-semibold leading-snug" style={{ fontSize: labelFontSize }}>
        {label}
      </span>
      <span
        id={descriptionId}
        className="text-slate-600 dark:text-slate-400 leading-snug"
        style={{ fontSize: SELECTION_TOKENS.descriptionFontSize }}
      >
        {description}
      </span>
    </span>
  ) : (
    <span className="font-semibold leading-snug" style={{ fontSize: labelFontSize }}>
      {label}
    </span>
  );

  const stateClass =
    [effectiveReadOnly ? 'Mui-readOnly' : '', error ? 'Mui-error' : ''].filter(Boolean).join(' ') ||
    undefined;

  return (
    <FormControl required={required} error={error} disabled={effectiveDisabled} className={className}>
      <FormControlLabel
        className={effectiveReadOnly ? 'Mui-readOnly' : undefined}
        labelPlacement={labelPlacement}
        label={labelContent}
        sx={alignCenter ? { alignItems: 'center' } : undefined}
        onClick={handleClick}
        control={renderControl({
          id: inputId,
          name,
          value,
          checked: resolvedChecked,
          required,
          disabled: effectiveDisabled,
          size,
          className: stateClass,
          onChange: handleChange,
          onClick: handleClick,
          onKeyDown: handleKeyDown,
          inputSlotProps: {
            readOnly: effectiveReadOnly,
            'aria-readonly': effectiveReadOnly || undefined,
            'aria-invalid': error || undefined,
            'aria-describedby': describedBy,
            'data-testid': dataTestId,
          },
        })}
      />
      {helperText && <FormHelperText id={helperId}>{helperText}</FormHelperText>}
    </FormControl>
  );
};
