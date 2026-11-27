import React, { useId } from 'react';
import { useTheme } from '@mui/material/styles';
import { Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { isFieldLockedByPreviewPolicy } from '../../shared/previewPolicy';
import { AppButton } from '../buttons';
import { getThemeColors, TIN_TOKENS } from '../theme';
import { AppTinInput } from './AppTinInput';
import { AppTinSuggestionsPopper } from './AppTinSuggestionsPopper';
import type { AppTinLookupFieldProps } from './tinInputTypes';
import { DEFAULT_TIN_LENGTH } from './tinInputUtils';
import { useTinLookupPopper } from './useTinLookupPopper';

export type { AppTinLookupFieldProps };

export const AppTinLookupField: React.FC<AppTinLookupFieldProps> = ({
  id,
  heading,
  label,
  searchLabel,
  value,
  onChange,
  onSearch,
  onClear,
  canSearch,
  loading = false,
  maxLength = DEFAULT_TIN_LENGTH,
  segmented = true,
  directDigitEdit = true,
  masked = false,
  showClearButton = true,
  required = true,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  statusNode,
  placeholder,
  suggestedTins,
  submitOnEnter = false,
  card = false,
  inputTestId,
  segmentsTestId,
  publicCapability = 'none',
  previewRestricted = false,
  className = '',
}) => {
  const generatedId = useId();
  const fieldId = id ?? `${generatedId}-tin-lookup`;
  const suggestionsId = `${fieldId}-suggestions`;
  const helperId = helperText ? `${fieldId}-helper` : undefined;

  const { i18n } = useTranslation();
  const bn = i18n.language === 'bn';
  const theme = useTheme();
  const colors = getThemeColors(theme.palette.mode);

  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly && !effectiveDisabled);
  const locked = effectiveDisabled || effectiveReadOnly;
  const searchReady = Boolean(canSearch && !locked && !loading);

  const popper = useTinLookupPopper({
    value,
    maxLength,
    suggestedTins,
    locked,
    searchReady,
    submitOnEnter,
    onSearch,
  });

  return (
    <div
      ref={popper.rootRef}
      data-testid="shared-taxpayer-tin-lookup"
      className={`grid gap-3 min-w-0 w-full ${className}`.trim()}
      style={
        card
          ? {
              backgroundColor: colors.surface.paper,
              border: `1px solid ${colors.tin.cardBorder}`,
              borderRadius: `${TIN_TOKENS.cardRadius}px`,
              padding: '14px',
            }
          : undefined
      }
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if (!event.currentTarget.contains(next) && !popper.suggestionsRef.current?.contains(next)) {
          popper.setShowSuggestions(false);
        }
      }}
    >
      {heading && (
        <h3 className="m-0 text-sm font-bold leading-snug" style={{ color: colors.tin.heading }}>
          {heading}
        </h3>
      )}

      <div
        ref={popper.searchRowRef}
        className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_max-content] items-end gap-2.5 min-w-0 w-full"
      >
        <AppTinInput
          id={fieldId}
          inputRef={popper.inputRef}
          label={label}
          value={value}
          onChange={(next) => {
            onChange(next);
            popper.setShowSuggestions(
              Boolean(next && popper.validSuggestions.length && next.length < maxLength)
            );
          }}
          onClear={() => {
            if (onClear) onClear();
            else onChange('');
            popper.dismissToInput();
          }}
          maxLength={maxLength}
          segmented={segmented}
          directDigitEdit={directDigitEdit}
          masked={masked}
          showClearButton={showClearButton}
          required={required}
          disabled={effectiveDisabled}
          readOnly={effectiveReadOnly}
          error={error}
          placeholder={placeholder}
          inputTestId={inputTestId}
          segmentsTestId={segmentsTestId}
          ariaDescribedBy={helperId}
          publicCapability={publicCapability}
          previewRestricted={previewRestricted}
          ariaRole={popper.validSuggestions.length ? 'combobox' : undefined}
          ariaAutocomplete={popper.validSuggestions.length ? 'list' : undefined}
          ariaControls={popper.validSuggestions.length ? suggestionsId : undefined}
          ariaExpanded={popper.validSuggestions.length ? popper.hasSuggestions : undefined}
          onFocus={popper.handleInputFocus}
          onKeyDown={popper.handleInputKeyDown}
        />

        <AppButton
          actionType="secondary"
          palette="home"
          surface="outlined"
          loading={loading}
          disabled={!searchReady}
          aria-label={searchLabel}
          publicCapability={publicCapability}
          previewRestricted={previewRestricted}
          startIcon={<Search size={17} aria-hidden="true" />}
          onClick={() => {
            popper.setShowSuggestions(false);
            onSearch();
          }}
          sx={{ minHeight: TIN_TOKENS.heightDesktop, minWidth: 102 }}
        >
          {bn ? 'খুঁজুন' : 'Search'}
        </AppButton>

        <AppTinSuggestionsPopper
          id={suggestionsId}
          open={popper.hasSuggestions}
          anchorEl={popper.searchRowRef.current}
          value={value}
          options={popper.matchingSuggestions}
          onSelect={(option) => {
            onChange(option);
            popper.dismissToInput();
          }}
          onDismiss={popper.dismissToInput}
          listRef={popper.suggestionsRef}
          inputRef={popper.inputRef}
        />
      </div>

      {helperText && (
        <p
          id={helperId}
          role={error ? 'alert' : undefined}
          className="m-0 text-xs leading-snug"
          style={{ color: error ? colors.error.main : colors.text.secondary }}
        >
          {helperText}
        </p>
      )}
      {statusNode}
    </div>
  );
};
