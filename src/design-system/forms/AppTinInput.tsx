import React, { useId, useRef } from 'react';
import { useTheme } from '@mui/material/styles';
import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isFieldLockedByPreviewPolicy } from '../../shared/previewPolicy';
import { AppIconButton } from '../buttons';
import { getThemeColors } from '../theme';
import { AppTinDigitGrid } from './AppTinDigitGrid';
import { AppTinPlainField } from './AppTinPlainField';
import type { AppTinInputProps } from './tinInputTypes';
import { DEFAULT_TIN_LENGTH } from './tinInputUtils';

export type { AppTinInputProps };

export const AppTinInput: React.FC<AppTinInputProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  onClear,
  maxLength = DEFAULT_TIN_LENGTH,
  segmented = true,
  directDigitEdit = true,
  masked = false,
  showClearButton = true,
  required = false,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  placeholder,
  autoFocus = false,
  inputTestId,
  segmentsTestId,
  ariaDescribedBy,
  ariaRole,
  ariaAutocomplete,
  ariaControls,
  ariaExpanded,
  inputRef: externalRef,
  onFocus,
  onBlur,
  onKeyDown,
  publicCapability = 'none',
  previewRestricted = false,
  className = '',
}) => {
  const generatedId = useId();
  const fieldId = id ?? `${generatedId}-tin`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;
  const describedBy = [ariaDescribedBy, helperId].filter(Boolean).join(' ') || undefined;

  const { i18n } = useTranslation();
  const bn = i18n.language === 'bn';
  const theme = useTheme();
  const colors = getThemeColors(theme.palette.mode);

  const internalRef = useRef<HTMLInputElement | null>(null);
  const inputRef = externalRef ?? internalRef;

  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly && !effectiveDisabled);
  const locked = effectiveDisabled || effectiveReadOnly;

  const resolvedLabel = label ?? (bn ? 'করদাতার টিআইএন' : 'Taxpayer TIN');
  const resolvedPlaceholder = placeholder ?? (bn ? `${maxLength} সংখ্যার নম্বর` : `${maxLength}-digit TIN`);
  const clearAriaLabel = bn ? 'টিআইএন অনুসন্ধান মুছুন' : 'Clear TIN input';

  const handleClear = () => {
    if (locked) return;
    if (onClear) onClear();
    else onChange('');
    inputRef.current?.focus();
  };

  if (!segmented) {
    return (
      <div className={`grid gap-1.5 min-w-0 w-full ${className}`.trim()}>
        <AppTinPlainField
          fieldId={fieldId}
          name={name}
          inputRef={inputRef}
          label={resolvedLabel}
          value={value}
          masked={masked}
          readOnly={effectiveReadOnly}
          disabled={effectiveDisabled}
          locked={locked}
          maxLength={maxLength}
          placeholder={resolvedPlaceholder}
          required={required}
          error={error}
          helperText={helperText}
          showClearButton={showClearButton}
          clearAriaLabel={clearAriaLabel}
          onClear={handleClear}
          onChange={onChange}
          inputTestId={inputTestId}
          ariaRole={ariaRole}
          ariaAutocomplete={ariaAutocomplete}
          ariaControls={ariaControls}
          ariaExpanded={ariaExpanded}
          describedBy={describedBy}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
          publicCapability={publicCapability}
          previewRestricted={previewRestricted}
        />
      </div>
    );
  }

  return (
    <div className={`grid gap-1.5 min-w-0 w-full ${className}`.trim()}>
      <div className="flex items-center justify-between gap-2 min-w-0 min-h-[28px]">
        <label
          htmlFor={fieldId}
          className="min-w-0 text-sm font-semibold leading-snug"
          style={{ color: error ? colors.error.main : colors.tin.label }}
        >
          {resolvedLabel}
          {required ? <span aria-hidden="true"> *</span> : null}
        </label>
        {showClearButton && Boolean(value) && !locked && (
          <AppIconButton
            size="small"
            aria-label={clearAriaLabel}
            title={clearAriaLabel}
            onClick={handleClear}
            sx={{ width: 28, height: 28 }}
          >
            <X size={16} aria-hidden="true" />
          </AppIconButton>
        )}
      </div>

      <AppTinDigitGrid
        fieldId={fieldId}
        name={name}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        directDigitEdit={directDigitEdit}
        masked={masked}
        required={required}
        autoFocus={autoFocus}
        disabled={effectiveDisabled}
        readOnly={effectiveReadOnly}
        error={error}
        placeholder={resolvedPlaceholder}
        inputTestId={inputTestId}
        segmentsTestId={segmentsTestId}
        describedBy={describedBy}
        ariaRole={ariaRole}
        ariaAutocomplete={ariaAutocomplete}
        ariaControls={ariaControls}
        ariaExpanded={ariaExpanded}
        inputRef={inputRef}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
      />

      {helperText && (
        <p
          id={helperId}
          className="m-0 text-xs leading-snug"
          style={{ color: error ? colors.error.main : colors.text.secondary }}
        >
          {helperText}
        </p>
      )}
    </div>
  );
};
