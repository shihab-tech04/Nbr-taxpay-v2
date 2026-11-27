import React, { useId, useMemo, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import CircularProgress from '@mui/material/CircularProgress';
import { useTranslation } from 'react-i18next';
import {
  isFieldLockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { AppTextField } from './AppTextField';
import { renderAutocompleteGroup, renderAutocompleteOption } from './autocompleteRenderers';
import {
  findSelectedAutocompleteOption,
  groupAutocompleteOptionsPreserveOrder,
  matchAutocompleteOptions,
  type AppAutocompleteOption,
} from './autocompleteUtils';

export type { AppAutocompleteOption };

export interface AppAutocompleteProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  ariaLabel?: string;
  value: string | null;
  onChange: (value: string, option: AppAutocompleteOption | null) => void;
  options: readonly AppAutocompleteOption[];
  placeholder?: string;
  noOptionsText?: React.ReactNode;
  loadingText?: React.ReactNode;
  loading?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  disableClearable?: boolean;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
  className?: string;
}

export const AppAutocomplete: React.FC<AppAutocompleteProps> = ({
  id,
  name,
  label,
  ariaLabel,
  value,
  onChange,
  options,
  placeholder,
  noOptionsText,
  loadingText,
  loading = false,
  required = false,
  disabled = false,
  readOnly = false,
  error = false,
  helperText,
  size = 'small',
  fullWidth = true,
  disableClearable = false,
  publicCapability = 'none',
  previewRestricted = false,
  className = '',
}) => {
  const generatedId = useId();
  const fieldId = id ?? `${generatedId}-autocomplete`;
  const { i18n } = useTranslation();
  const bn = i18n.language === 'bn';
  const [popupOpen, setPopupOpen] = useState(false);

  const previewLocked = isFieldLockedByPreviewPolicy({ publicCapability, previewRestricted });
  const effectiveDisabled = Boolean(disabled || previewLocked);
  const effectiveReadOnly = Boolean(readOnly && !effectiveDisabled);

  const groupedOptions = useMemo(() => groupAutocompleteOptionsPreserveOrder(options), [options]);
  const hasGroups = useMemo(() => groupedOptions.some((option) => Boolean(option.group)), [groupedOptions]);
  const selectedOption = useMemo(
    () => findSelectedAutocompleteOption(groupedOptions, value),
    [groupedOptions, value]
  );

  const resolvedNoOptionsText = noOptionsText ?? (bn ? 'কোনো মিল পাওয়া যায়নি' : 'No matching options');
  const resolvedLoadingText = loadingText ?? (bn ? 'লোড হচ্ছে...' : 'Loading...');
  const resolvedOpen = effectiveDisabled || effectiveReadOnly ? false : popupOpen;

  return (
    <Autocomplete<AppAutocompleteOption, false, boolean, false>
      id={fieldId}
      className={className || undefined}
      fullWidth={fullWidth}
      size={size}
      open={resolvedOpen}
      onOpen={() => {
        if (!effectiveDisabled && !effectiveReadOnly) setPopupOpen(true);
      }}
      onClose={() => setPopupOpen(false)}
      options={groupedOptions}
      value={selectedOption as AppAutocompleteOption}
      onChange={(_event, nextValue) => {
        if (effectiveDisabled || effectiveReadOnly) return;
        if (!nextValue) {
          onChange('', null);
          return;
        }
        onChange(nextValue.value, nextValue);
      }}
      groupBy={hasGroups ? (option) => option.group ?? '' : undefined}
      filterOptions={(opts, state) => matchAutocompleteOptions(opts, state.inputValue)}
      getOptionLabel={(option) => option.label}
      getOptionKey={(option) => option.value}
      isOptionEqualToValue={(option, candidate) => option.value === candidate.value}
      getOptionDisabled={(option) => Boolean(option.disabled)}
      loading={loading}
      disabled={effectiveDisabled}
      readOnly={effectiveReadOnly}
      disableClearable={Boolean(disableClearable || effectiveReadOnly)}
      clearText={bn ? 'মুছুন' : 'Clear'}
      openText={bn ? 'তালিকা খুলুন' : 'Open'}
      closeText={bn ? 'বন্ধ করুন' : 'Close'}
      noOptionsText={resolvedNoOptionsText}
      loadingText={resolvedLoadingText}
      openOnFocus={!effectiveReadOnly}
      onKeyDown={(event) => {
        if (resolvedOpen && event.key === 'Escape') {
          event.stopPropagation();
        }
      }}
      slotProps={{
        popper: {
          placement: 'bottom-start',
          sx: {
            zIndex: (theme) => theme.zIndex.modal + 10,
            maxWidth: 'calc(100vw - 16px)',
          },
          modifiers: [
            { name: 'flip', enabled: true },
            { name: 'preventOverflow', enabled: true, options: { boundary: 'viewport', padding: 8 } },
          ],
        },
      }}
      renderGroup={renderAutocompleteGroup}
      renderOption={(optionProps, option, { selected }) =>
        renderAutocompleteOption(optionProps, option, selected)
      }
      renderInput={(params) => (
        <AppTextField
          id={params.id}
          fullWidth={params.fullWidth}
          size={params.size ?? size}
          name={name}
          label={label}
          placeholder={placeholder}
          required={required}
          error={error}
          helperText={helperText}
          disabled={effectiveDisabled}
          readOnly={effectiveReadOnly}
          publicCapability={publicCapability}
          previewRestricted={previewRestricted}
          slotProps={{
            input: {
              ...params.slotProps.input,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={16} /> : null}
                  {params.slotProps.input.endAdornment}
                </>
              ),
            },
            htmlInput: {
              ...params.slotProps.htmlInput,
              readOnly: effectiveReadOnly,
              'aria-label': ariaLabel,
              'aria-readonly': effectiveReadOnly || undefined,
            },
            inputLabel: params.slotProps.inputLabel,
          }}
        />
      )}
    />
  );
};
