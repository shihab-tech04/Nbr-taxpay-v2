import React from 'react';
import type { PublicCapability } from '../../shared/previewPolicy';

export interface AppTinInputProps {
  id?: string;
  name?: string;
  label?: React.ReactNode;
  value: string;
  onChange: (nextValue: string) => void;
  onClear?: () => void;
  maxLength?: number;
  segmented?: boolean;
  directDigitEdit?: boolean;
  masked?: boolean;
  showClearButton?: boolean;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  error?: boolean;
  helperText?: React.ReactNode;
  placeholder?: string;
  autoFocus?: boolean;
  inputTestId?: string;
  segmentsTestId?: string;
  ariaDescribedBy?: string;
  ariaRole?: React.AriaRole;
  ariaAutocomplete?: 'none' | 'list' | 'inline' | 'both';
  ariaControls?: string;
  ariaExpanded?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  publicCapability?: PublicCapability;
  previewRestricted?: boolean;
  className?: string;
}

type SharedTinProps = Pick<
  AppTinInputProps,
  | 'id'
  | 'label'
  | 'value'
  | 'onChange'
  | 'onClear'
  | 'maxLength'
  | 'segmented'
  | 'directDigitEdit'
  | 'masked'
  | 'showClearButton'
  | 'required'
  | 'disabled'
  | 'readOnly'
  | 'error'
  | 'helperText'
  | 'placeholder'
  | 'inputTestId'
  | 'segmentsTestId'
  | 'publicCapability'
  | 'previewRestricted'
  | 'className'
>;

export interface AppTinLookupFieldProps extends SharedTinProps {
  heading?: React.ReactNode;
  searchLabel?: string;
  onSearch: () => void;
  canSearch: boolean;
  loading?: boolean;
  statusNode?: React.ReactNode;
  suggestedTins?: readonly string[];
  submitOnEnter?: boolean;
  card?: boolean;
}

export interface AppTinDigitGridProps {
  fieldId: string;
  name?: string;
  value: string;
  onChange: (nextValue: string) => void;
  maxLength: number;
  directDigitEdit: boolean;
  masked: boolean;
  required: boolean;
  autoFocus: boolean;
  disabled: boolean;
  readOnly: boolean;
  error: boolean;
  placeholder: string;
  inputTestId?: string;
  segmentsTestId?: string;
  describedBy?: string;
  ariaRole?: React.AriaRole;
  ariaAutocomplete?: 'none' | 'list' | 'inline' | 'both';
  ariaControls?: string;
  ariaExpanded?: boolean;
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
