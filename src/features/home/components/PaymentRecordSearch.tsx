import React, { useId, useState, type FormEvent } from 'react';
import { ArrowRight, Search, X } from 'lucide-react';
import type { HomeCopy } from '../model/home.types';
import { LineArt } from './LineArt';

type SearchState = { status: 'idle' } | { status: 'error' };

export function sanitizeReferenceQuery(value: string): string {
  return value.trim();
}

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
          <div
            className={`flex h-[52px] items-center gap-2 rounded-2xl bg-white pr-1.5 pl-4 ring-1 transition focus-within:ring-2 focus-within:ring-[#7497cd]/60 shadow-[0_1px_2px_rgba(21,32,51,0.04)] ${
              state.status === 'error' ? 'ring-[#e5484d]/60' : 'ring-[#dfe5ee]'
            }`}
          >
            <Search className="size-[18px] shrink-0 text-[#5d697e]" aria-hidden="true" />
            <input
              id={id}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (state.status !== 'idle') setState({ status: 'idle' });
              }}
              placeholder={c.find.placeholder}
              aria-invalid={state.status === 'error'}
              aria-describedby={state.status === 'error' ? `${id}-error` : undefined}
              autoComplete="off"
              spellCheck={false}
              type="search"
              maxLength={120}
              data-testid="home2-reference"
              className="min-w-0 flex-1 bg-transparent text-[14px] text-[#0f1d34] outline-none placeholder:text-[#9aa1b4] [&::-webkit-search-cancel-button]:hidden"
            />
            {query && (
              <button
                type="button"
                onClick={() => {
                  setQuery('');
                  setState({ status: 'idle' });
                }}
                className="grid size-7 shrink-0 place-items-center rounded-full text-[#5f6880] transition hover:bg-[#e7e9ef]/60 hover:text-[#141b2d]"
                aria-label={c.find.clear}
              >
                <X className="size-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={!query.trim()}
              className="home2-press grid size-10 shrink-0 place-items-center rounded-xl bg-[#e6edf8] text-[#1c3d70] ring-1 ring-[#cad8ef] hover:bg-[#cad8ef] disabled:cursor-not-allowed disabled:opacity-80"
              aria-label={c.find.search}
            >
              <ArrowRight className="size-[18px]" />
            </button>
          </div>
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
