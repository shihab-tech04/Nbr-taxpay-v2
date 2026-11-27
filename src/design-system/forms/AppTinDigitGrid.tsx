import React, { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import { getThemeColors, TIN_TOKENS } from '../theme';
import { AppTinDigitCell } from './AppTinDigitCell';
import {
  findDigitCellIndexAtPoint,
  replaceDigitAtFullLength,
  resolveTinPasteUpdate,
  sanitizeIdentifierDigits,
} from './tinInputUtils';

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

export const AppTinDigitGrid: React.FC<AppTinDigitGridProps> = ({
  fieldId,
  name,
  value,
  onChange,
  maxLength,
  directDigitEdit,
  masked,
  required,
  autoFocus,
  disabled,
  readOnly,
  error,
  placeholder,
  inputTestId,
  segmentsTestId,
  describedBy,
  ariaRole,
  ariaAutocomplete,
  ariaControls,
  ariaExpanded,
  inputRef,
  onFocus,
  onBlur,
  onKeyDown,
}) => {
  const theme = useTheme();
  const colors = getThemeColors(theme.palette.mode);
  const pointerDigitRef = useRef<number | null>(null);
  const [activeDigit, setActiveDigit] = useState<number | null>(null);
  const locked = disabled || readOnly;

  const selectDigitIndex = (input: HTMLInputElement, index: number) => {
    input.setSelectionRange(index, index < value.length ? index + 1 : index);
    setActiveDigit(Math.min(index, maxLength - 1));
  };

  return (
    <div
      data-testid={segmentsTestId ?? 'taxpayer-tin-digits'}
      className="relative grid w-full min-w-0"
      style={{
        gridTemplateColumns: `repeat(${maxLength}, minmax(0, 1fr))`,
        gap: `${TIN_TOKENS.cellGapDesktop}px`,
        height: `${TIN_TOKENS.heightDesktop}px`,
      }}
      onPointerDown={(event) => {
        if (!directDigitEdit || locked || event.button !== 0 || !inputRef.current) return;
        event.preventDefault();
        const index = findDigitCellIndexAtPoint(
          event.currentTarget,
          event.clientX,
          event.clientY,
          maxLength,
          value.length
        );
        pointerDigitRef.current = index;
        inputRef.current.focus();
        selectDigitIndex(inputRef.current, index);
      }}
      onPointerUp={() => {
        const index = pointerDigitRef.current;
        pointerDigitRef.current = null;
        if (directDigitEdit && !locked && index !== null && inputRef.current) {
          selectDigitIndex(inputRef.current, index);
        }
      }}
      onPointerCancel={() => {
        pointerDigitRef.current = null;
      }}
    >
      {Array.from({ length: maxLength }, (_, index) => (
        <AppTinDigitCell
          key={index}
          digit={value[index] ?? ''}
          isFilled={index < value.length}
          isActive={directDigitEdit && !locked && activeDigit === index}
          masked={masked}
          disabled={disabled}
          readOnly={readOnly}
          error={error}
          colors={colors}
        />
      ))}

      <input
        ref={inputRef}
        id={fieldId}
        name={name}
        data-testid={inputTestId}
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        maxLength={maxLength}
        value={value}
        required={required}
        autoFocus={autoFocus}
        readOnly={readOnly}
        disabled={disabled}
        aria-readonly={readOnly || undefined}
        aria-invalid={error || undefined}
        aria-describedby={describedBy}
        role={ariaRole}
        aria-autocomplete={ariaAutocomplete}
        aria-controls={ariaControls}
        aria-expanded={ariaExpanded}
        placeholder={placeholder}
        className="absolute inset-0 z-[1] w-full h-full min-h-0 p-0 border-0 outline-none opacity-0 disabled:cursor-not-allowed"
        style={{ cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text' }}
        onFocus={(event) => {
          if (directDigitEdit && !locked) {
            setActiveDigit(Math.min(event.currentTarget.selectionStart ?? value.length, maxLength - 1));
          }
          onFocus?.(event);
        }}
        onBlur={(event) => {
          if (directDigitEdit) setActiveDigit(null);
          onBlur?.(event);
        }}
        onKeyUp={(event) => {
          if (directDigitEdit && !locked) {
            setActiveDigit(Math.min(event.currentTarget.selectionStart ?? value.length, maxLength - 1));
          }
        }}
        onPaste={(event) => {
          if (locked) return;
          event.preventDefault();
          const el = event.currentTarget;
          const result = resolveTinPasteUpdate(value, event.clipboardData.getData('text'), el.selectionStart, el.selectionEnd, maxLength);
          if (!result) return;
          onChange(result.nextValue);
          setActiveDigit(result.activeDigit);
        }}
        onKeyDown={(event) => {
          const el = event.currentTarget;
          const start = el.selectionStart ?? value.length;
          const end = el.selectionEnd ?? start;
          if (directDigitEdit && !locked && !event.ctrlKey && !event.metaKey && !event.altKey && /^[0-9]$/.test(event.key) && start === end && value.length >= maxLength && start < maxLength) {
            const replaced = replaceDigitAtFullLength(value, start, event.key, maxLength);
            if (replaced) {
              event.preventDefault();
              onChange(replaced.nextValue);
              setActiveDigit(Math.min(replaced.nextCaretIndex, maxLength - 1));
              queueMicrotask(() => el.setSelectionRange(replaced.nextCaretIndex, replaced.nextCaretIndex));
            }
          }
          onKeyDown?.(event);
        }}
        onChange={(event) => {
          if (locked) return;
          const next = sanitizeIdentifierDigits(event.target.value, maxLength);
          onChange(next);
          if (directDigitEdit) {
            setActiveDigit(Math.min(event.target.selectionStart ?? next.length, maxLength - 1));
          }
        }}
      />
    </div>
  );
};
