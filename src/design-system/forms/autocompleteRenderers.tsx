import React from 'react';
import type { AutocompleteRenderGroupParams } from '@mui/material/Autocomplete';
import { Check } from 'lucide-react';
import type { AppAutocompleteOption } from './autocompleteUtils';

export function renderAutocompleteGroup(params: AutocompleteRenderGroupParams): React.ReactNode {
  return (
    <li key={params.key}>
      {params.group ? (
        <div className="MuiAutocomplete-groupLabel" role="presentation">
          {params.group}
        </div>
      ) : null}
      <ul className="MuiAutocomplete-groupUl">{params.children}</ul>
    </li>
  );
}

export function renderAutocompleteOption(
  optionProps: React.HTMLAttributes<HTMLLIElement> & { key: React.Key },
  option: AppAutocompleteOption,
  selected: boolean
): React.ReactNode {
  const { key: _key, ...restOptionProps } = optionProps;
  return (
    <li
      key={option.value}
      {...restOptionProps}
      data-option-value={option.value}
      className={`${restOptionProps.className ?? ''} flex items-center justify-between gap-2`.trim()}
    >
      <span className="min-w-0 flex-1">
        <span className="block break-words whitespace-normal">{option.label}</span>
        {option.secondary && (
          <span className="block text-xs text-slate-600 dark:text-slate-400 break-words whitespace-normal">
            {option.secondary}
          </span>
        )}
      </span>
      {selected && (
        <Check size={16} className="shrink-0 text-teal-700 dark:text-teal-400" aria-hidden="true" />
      )}
    </li>
  );
}
