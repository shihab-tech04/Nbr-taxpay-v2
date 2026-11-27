import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { AppCardButton } from '../../../design-system/buttons';
import type { HomeAction, HomeCopy } from '../model/home.types';
import { LineArt } from './LineArt';

const surface = 'rounded-[20px] ring-1 ring-black/[0.05]';
const desktopHover =
  'transition duration-200 hover:ring-black/10 hover:shadow-[0_12px_28px_-18px_rgba(15,29,52,0.35)]';

export function AllTaxPaymentsCard({
  c,
  variant,
  onAction,
}: {
  c: HomeCopy;
  variant: 'desktop' | 'mobile';
  onAction: (action: HomeAction) => void;
}) {
  const f = c.features.all;

  if (variant === 'mobile') {
    return (
      <AppCardButton
        onClick={() => onAction('pay')}
        className={`home2-press relative block w-full overflow-hidden bg-[#a5bce1] p-5 text-left ${surface}`}
        sx={{
          display: 'block',
          width: '100%',
          borderRadius: '20px',
          p: 2.5,
          textAlign: 'left',
        }}
      >
        <LineArt
          name="wallet"
          accent="#cad8ef"
          className="absolute top-4 right-4 size-20 text-[#162d53]"
        />
        <div data-testid="home2-all-payments-copy" className="relative min-h-20 pr-20">
          <h3 className="relative flex items-center gap-1.5 text-[20px] leading-tight font-bold tracking-[-0.02em]">
            {f.title} <ArrowUpRight className="size-4 text-[#162d53]/50" aria-hidden="true" />
          </h3>
          <p className="relative mt-1 max-w-[230px] text-[12.5px] leading-snug text-[#0f1d34]/75">
            {f.body}
          </p>
        </div>
        <div className="relative mt-3 flex flex-wrap gap-1.5">
          {f.chips.map((x) => (
            <span key={x} className="rounded-md bg-white/70 px-2 py-0.5 text-[11.5px] font-medium">
              {x}
            </span>
          ))}
        </div>
        <ol className="relative mt-4 grid grid-cols-3 gap-1.5">
          {f.steps.map((step, i) => (
            <li key={step} className="rounded-xl bg-white/75 p-2.5">
              <span className="grid size-5 place-items-center rounded-full bg-[#162d53] text-[10px] font-bold text-white">
                {i + 1}
              </span>
              <span className="mt-2 block text-[11.5px] leading-tight font-semibold">{step}</span>
            </li>
          ))}
        </ol>
      </AppCardButton>
    );
  }

  return (
    <AppCardButton
      onClick={() => onAction('pay')}
      className={`home2-press group relative flex h-full w-full flex-col overflow-hidden bg-[#a5bce1] p-7 text-left ${surface} ${desktopHover}`}
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: '20px',
        p: 3.5,
      }}
    >
      <LineArt
        name="wallet"
        accent="#cad8ef"
        className="absolute top-6 right-6 size-28 text-[#162d53]"
      />
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div data-testid="home2-all-payments-copy" className="min-h-28 pr-28">
          <h3 className="flex items-center gap-2 text-[26px] leading-tight font-bold tracking-[-0.025em]">
            {f.title}{' '}
            <ArrowUpRight
              className="size-5 text-[#162d53]/50 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0f1d34]"
              aria-hidden="true"
            />
          </h3>
          <p className="mt-1.5 max-w-[320px] text-[14px] leading-snug text-[#0f1d34]/75">
            {f.body}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
          {f.chips.map((x) => (
            <span key={x} className="rounded-md bg-white/70 px-2.5 py-1 text-[12px] font-medium">
              {x}
            </span>
          ))}
        </div>
        <ol className="mt-5 grid grid-cols-3 gap-2">
          {f.steps.map((step, i) => (
            <li key={step} className="rounded-xl bg-white/75 p-3.5">
              <span className="grid size-6 place-items-center rounded-full bg-[#162d53] text-[11px] font-bold text-white">
                {i + 1}
              </span>
              <span className="mt-2.5 block text-[13px] leading-tight font-semibold">{step}</span>
            </li>
          ))}
        </ol>
      </div>
    </AppCardButton>
  );
}
