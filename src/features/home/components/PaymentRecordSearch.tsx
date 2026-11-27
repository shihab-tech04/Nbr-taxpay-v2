import React, { useId, useState, type FormEvent } from 'react';
import { ArrowRight } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import { AppSearchField } from '../../../design-system/forms';
import { sanitizeReferenceQuery } from '../hooks/useHomeNavigation';
import type { HomeCopy } from '../model/home.types';
import { LineArt } from './LineArt';

type SearchState = { status: 'idle' } | { status: 'error' };

export function PaymentRecordSearch({
  c,
  variant = 'desktop',
  onSearch,
}: {
  c: HomeCopy;
  variant?: 'desktop' | 'mobile';
  onSearch: (reference: string) => void;
}) {
  const id = useId();
  const [query, setQuery] = useState('');
  const [state, setState] = useState<SearchState>({ status: 'idle' });
  const isMobile = variant === 'mobile';

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const ref = sanitizeReferenceQuery(query);
    if (!ref) {
      setState({ status: 'error' });
      return;
    }
    onSearch(ref);
  };

  return (
    <div
      className={`home2-v2-type relative overflow-hidden rounded-[20px] bg-white ring-1 ring-[#dfe5ee] ${
        isMobile ? 'p-5' : 'p-6'
      }`}
    >
      <LineArt
        name="search"
        accent="#cad8ef"
        className={`absolute top-4 right-4 text-[#162d53] ${isMobile ? 'size-14' : 'size-16'}`}
      />
      <div
        className={`relative ${isMobile ? 'pr-16' : 'pr-20'}`}
        data-testid="home2-record-heading"
      >
        <h2
          className={`leading-tight font-bold tracking-[-0.015em] ${
            isMobile ? 'text-[17px]' : 'text-[18px]'
          }`}
        >
          {c.find.title}
        </h2>
        <p
          className={`leading-snug text-[#3e4b62] ${
            isMobile ? 'mt-1 text-[12.5px]' : 'mt-1.5 text-[13px]'
          }`}
        >
          {c.find.body}
        </p>
      </div>
      <div className={`relative ${isMobile ? 'mt-4' : 'mt-5'}`}>
        <form onSubmit={submit} noValidate role="search">
          <label htmlFor={id} className="sr-only">
            {c.find.title}
          </label>
          <AppSearchField
            id={id}
            allowPublicLookup
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (state.status !== 'idle') setState({ status: 'idle' });
            }}
            onClear={() => {
              setQuery('');
              setState({ status: 'idle' });
            }}
            clearAriaLabel={c.find.clear}
            placeholder={c.find.placeholder}
            error={state.status === 'error'}
            trailingAction={
              <AppIconButton
                type="submit"
                tone="homeSubmit"
                disabled={!query.trim()}
                aria-label={c.find.search}
              >
                <ArrowRight className="size-[18px]" aria-hidden="true" />
              </AppIconButton>
            }
            slotProps={{
              input: {
                className: 'h-[52px]',
              },
              htmlInput: {
                maxLength: 120,
                autoComplete: 'off',
                spellCheck: false,
                'data-testid': 'home2-reference',
                'aria-invalid': state.status === 'error',
                'aria-describedby': state.status === 'error' ? `${id}-error` : undefined,
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                height: 52,
                minHeight: 52,
                borderRadius: '16px',
                backgroundColor: '#FFFFFF',
                paddingLeft: '14px',
                paddingRight: '6px',
                boxShadow: '0 1px 2px rgba(21,32,51,0.04)',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: state.status === 'error' ? 'rgba(229, 72, 77, 0.6)' : '#DFE5EE',
                  borderWidth: '1px',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: state.status === 'error' ? '#E5484D' : '#CAD8EF',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: state.status === 'error' ? '#E5484D' : '#7497CD',
                  borderWidth: '2px',
                },
                '&.Mui-focused': {
                  boxShadow:
                    state.status === 'error'
                      ? '0 0 0 3px rgba(229, 72, 77, 0.14)'
                      : '0 0 0 3px rgba(116, 151, 205, 0.25)',
                },
              },
              '& .MuiOutlinedInput-input': {
                padding: '10px 0',
                fontSize: '14px',
                color: '#0F1D34',
                '&::placeholder': {
                  color: '#9AA1B4',
                  opacity: 1,
                },
              },
            }}
          />
          <div aria-live="polite">
            {state.status === 'error' && (
              <p id={`${id}-error`} className="mt-2 pl-1 text-[12px] font-medium text-[#d0353b]">
                {c.find.emptyError}
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
