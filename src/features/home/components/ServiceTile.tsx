import React from 'react';
import { ArrowUpRight, ChevronRight } from 'lucide-react';
import { HomeTile } from './HomeBrand';
import { LineArt, type LineArtName } from './LineArt';

const surface = 'rounded-[20px] ring-1 ring-black/[0.05]';
const desktopHover =
  'transition duration-200 hover:ring-black/10 hover:shadow-[0_12px_28px_-18px_rgba(15,29,52,0.35)]';

export interface ServiceTileProps {
  art: LineArtName;
  title: string;
  body: string;
  onClick: () => void;
  tone: string;
  accent: string;
  delay: number;
}

export function DesktopMiniTile({ art, title, body, onClick, tone, accent, delay }: ServiceTileProps) {
  return (
    <HomeTile delay={delay} className="col-span-3">
      <button
        type="button"
        onClick={onClick}
        className={`home2-press group relative flex h-full w-full flex-col overflow-hidden p-5 text-left ${surface} ${tone} ${desktopHover}`}
      >
        <div className="flex items-start justify-between">
          <LineArt name={art} accent={accent} className="-mt-1 -ml-1 size-14 text-[#162d53]" />
          <ArrowUpRight
            className="size-4 text-[#5d697e] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0f1d34]"
            aria-hidden="true"
          />
        </div>
        <h3 className="mt-auto pt-3 text-[16px] leading-tight font-bold tracking-[-0.015em]">
          {title}
        </h3>
        <p className="mt-1 text-[12.5px] leading-snug text-[#3e4b62]">{body}</p>
      </button>
    </HomeTile>
  );
}

export function DesktopWideTile({ art, title, body, onClick, tone, accent, delay }: ServiceTileProps) {
  return (
    <HomeTile delay={delay} className="col-span-4">
      <button
        type="button"
        onClick={onClick}
        className={`home2-press group relative flex h-full w-full items-center gap-4 overflow-hidden py-5 pr-5 pl-6 text-left ${surface} ${desktopHover} ${tone}`}
      >
        <div className="min-w-0 flex-1">
          <h3 className="flex items-center gap-1.5 text-[16px] leading-tight font-bold tracking-[-0.015em]">
            {title}
            <ArrowUpRight
              className="size-4 shrink-0 text-[#5d697e] transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#0f1d34]"
              aria-hidden="true"
            />
          </h3>
          <p className="mt-1 text-[12.5px] leading-snug text-[#3e4b62]">{body}</p>
        </div>
        <LineArt name={art} accent={accent} className="size-[68px] shrink-0 text-[#162d53]" />
      </button>
    </HomeTile>
  );
}

export function MobileMiniTile({ art, title, body, onClick, tone, accent, delay }: ServiceTileProps) {
  return (
    <HomeTile delay={delay}>
      <button
        type="button"
        onClick={onClick}
        className={`home2-press relative flex h-full w-full flex-col overflow-hidden p-4 text-left ${surface} ${tone}`}
      >
        <div className="flex items-start justify-between">
          <LineArt name={art} accent={accent} className="-mt-1 -ml-1 size-12 text-[#162d53]" />
          <ArrowUpRight className="size-4 text-[#5d697e]" aria-hidden="true" />
        </div>
        <h3 className="mt-2.5 text-[14px] leading-tight font-bold tracking-[-0.01em]">{title}</h3>
        <p className="mt-0.5 text-[11.5px] text-[#3e4b62]">{body}</p>
      </button>
    </HomeTile>
  );
}

export function MobileSecurityTile({
  title,
  body,
  onClick,
  delay,
}: {
  title: string;
  body: string;
  onClick: () => void;
  delay: number;
}) {
  return (
    <HomeTile delay={delay} className="col-span-2">
      <button
        type="button"
        onClick={onClick}
        className={`home2-press relative flex w-full items-center gap-3 overflow-hidden bg-[#cad8ef] p-4 text-left ${surface}`}
      >
        <LineArt name="shield" accent="#a5bce1" className="size-12 shrink-0 text-[#162d53]" />
        <div className="min-w-0 flex-1">
          <h3 className="text-[14.5px] leading-tight font-bold">{title}</h3>
          <p className="mt-0.5 text-[12px] leading-snug text-[#3e4b62]">{body}</p>
        </div>
        <ChevronRight className="size-4 shrink-0 text-[#5d697e]" aria-hidden="true" />
      </button>
    </HomeTile>
  );
}
