import React from 'react';
import { Download, Receipt } from 'lucide-react';
import { AppCardButton } from '../../../design-system/buttons';
import type { HomeAction, HomeCopy } from '../model/home.types';
import { LineArt } from './LineArt';

const surface = 'rounded-[20px] ring-1 ring-black/[0.05]';
const desktopHover =
  'transition duration-200 hover:ring-black/10 hover:shadow-[0_12px_28px_-18px_rgba(15,29,52,0.35)]';

export function PaymentHistoryCard({
  c,
  variant,
  onAction,
}: {
  c: HomeCopy;
  variant: 'desktop' | 'mobile';
  onAction: (action: HomeAction) => void;
}) {
  const f = c.features.history;

  if (variant === 'mobile') {
    return (
      <AppCardButton
        onClick={() => onAction('history')}
        className={`home2-press relative flex h-full w-full flex-col overflow-hidden bg-[#e3ddd4] p-4 text-left ${surface}`}
        sx={{
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          borderRadius: '20px',
          p: 2,
        }}
      >
        <LineArt
          name="receipts"
          accent="#cfc6b9"
          className="-mt-1 -ml-1 size-14 text-[#162d53]"
        />
        <h3 className="mt-2.5 text-[15px] leading-tight font-bold tracking-[-0.015em]">
          {f.title}
        </h3>
        <p className="mt-1 text-[11.5px] leading-snug text-[#3e4b62]">{f.body}</p>
        <div className="mt-auto space-y-1.5 pt-3">
          {c.taxYears.slice(0, 3).map((y) => (
            <div
              key={y}
              aria-hidden="true"
              className="flex items-center justify-between rounded-lg bg-white/75 px-2.5 py-1.5"
            >
              <span className="text-[11.5px] font-semibold">{y}</span>
              <Download className="size-3.5 shrink-0 text-[#5d697e]" aria-hidden="true" />
            </div>
          ))}
        </div>
      </AppCardButton>
    );
  }

  return (
    <AppCardButton
      onClick={() => onAction('history')}
      className={`home2-press group relative flex h-full w-full flex-col overflow-hidden bg-[#e3ddd4] p-6 text-left ${surface} ${desktopHover}`}
      sx={{
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        borderRadius: '20px',
        p: 3,
      }}
    >
      <LineArt
        name="receipts"
        accent="#cfc6b9"
        className="absolute top-5 right-5 size-16 text-[#162d53]"
      />
      <div className="relative pr-20">
        <h3 className="text-[18px] leading-tight font-bold tracking-[-0.015em]">{f.title}</h3>
        <p className="mt-1.5 text-[13px] leading-snug text-[#3e4b62]">{f.body}</p>
      </div>
      <div className="relative mt-auto w-full space-y-1.5 pt-5">
        {c.taxYears.map((y) => (
          <div
            key={y}
            aria-hidden="true"
            className="flex items-center gap-2.5 rounded-lg bg-white/75 px-3 py-2.5"
          >
            <Receipt className="size-4 shrink-0 text-[#5d697e]" aria-hidden="true" />
            <span className="min-w-0 flex-1 truncate text-[12.5px] text-[#3e4b62]">
              {f.taxYear} <span className="font-semibold text-[#0f1d34]">{y}</span>
            </span>
            <Download className="size-3.5 shrink-0 text-[#5d697e]" aria-hidden="true" />
          </div>
        ))}
      </div>
    </AppCardButton>
  );
}
