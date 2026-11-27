import React, { useEffect, useMemo, useRef, useState } from 'react';
import { filterMatchingTinSuggestions, isValidNumericSuggestion } from './tinInputUtils';

interface UseTinLookupPopperArgs {
  value: string;
  maxLength: number;
  suggestedTins?: readonly string[];
  locked: boolean;
  searchReady: boolean;
  submitOnEnter: boolean;
  onSearch: () => void;
}

export function useTinLookupPopper({
  value,
  maxLength,
  suggestedTins,
  locked,
  searchReady,
  submitOnEnter,
  onSearch,
}: UseTinLookupPopperArgs) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const searchRowRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const suggestionsRef = useRef<HTMLDivElement | null>(null);
  const suppressNextFocusOpen = useRef(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const validSuggestions = useMemo(
    () => (suggestedTins ?? []).filter((option) => isValidNumericSuggestion(option, maxLength)),
    [suggestedTins, maxLength]
  );

  const matchingSuggestions = useMemo(
    () => filterMatchingTinSuggestions(validSuggestions, value, maxLength),
    [validSuggestions, value, maxLength]
  );

  useEffect(() => {
    if (!validSuggestions.length || !showSuggestions) return;
    const handleOutside = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!rootRef.current?.contains(target) && !suggestionsRef.current?.contains(target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('pointerdown', handleOutside);
    return () => document.removeEventListener('pointerdown', handleOutside);
  }, [showSuggestions, validSuggestions.length]);

  const dismissToInput = () => {
    setShowSuggestions(false);
    if (document.activeElement !== inputRef.current) {
      suppressNextFocusOpen.current = true;
      inputRef.current?.focus();
    }
  };

  const hasSuggestions = Boolean(validSuggestions.length && showSuggestions && value && !locked);

  const handleInputFocus = () => {
    if (suppressNextFocusOpen.current) suppressNextFocusOpen.current = false;
  };

  const handleInputKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape' && showSuggestions) {
      event.preventDefault();
      event.stopPropagation();
      setShowSuggestions(false);
    } else if (event.key === 'ArrowDown' && showSuggestions) {
      event.preventDefault();
      suggestionsRef.current?.querySelector<HTMLButtonElement>('[role="option"]')?.focus();
    } else if (event.key === 'Enter' && submitOnEnter && searchReady) {
      event.preventDefault();
      setShowSuggestions(false);
      onSearch();
    }
  };

  return {
    rootRef,
    searchRowRef,
    inputRef,
    suggestionsRef,
    validSuggestions,
    matchingSuggestions,
    hasSuggestions,
    setShowSuggestions,
    dismissToInput,
    handleInputFocus,
    handleInputKeyDown,
  };
}
