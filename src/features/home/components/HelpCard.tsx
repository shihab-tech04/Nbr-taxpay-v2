import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import type { HomeAction, HomeCopy } from '../model/home.types';
import { LineArt } from './LineArt';

export function HelpCard({
  c,
  variant = 'desktop',
  onAction,
}: {
  c: HomeCopy;
  variant?: 'desktop' | 'mobile';
  onAction: (action: HomeAction) => void;
}) {
  const isMobile = variant === 'mobile';

  return (
    <div
      className={`relative overflow-hidden rounded-[20px] bg-[#cce4eb] ring-1 ring-black/[0.05] ${
        isMobile ? 'p-5' : 'flex flex-1 flex-col justify-between gap-5 p-6'
      }`}
    >
      <LineArt
        name="guide"
        accent="#acd0dc"
        className={`absolute top-4 right-4 text-[#162d53] ${isMobile ? 'size-14' : 'size-16'}`}
      />
      <div className={`relative ${isMobile ? 'pr-16' : 'pr-20'}`}>
        <h3
          className={`leading-tight font-bold tracking-[-0.015em] ${
            isMobile ? 'text-[16px]' : 'text-[18px]'
          }`}
        >
          {c.help.title}
        </h3>
        <p
          className={`leading-snug text-[#3e4b62] ${
            isMobile ? 'mt-1 text-[12.5px]' : 'mt-1.5 text-[13px]'
          }`}
        >
          {c.help.body}
        </p>
      </div>
      <div className={`relative grid grid-cols-2 gap-2 ${isMobile ? 'mt-4' : ''}`}>
        <button
          type="button"
          data-testid="home2-guide-action"
          onClick={() => onAction('guide')}
          className={`home2-press flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-white text-[13px] font-semibold ring-1 ring-black/5 hover:bg-white/80 ${
            isMobile ? '' : 'px-3'
          }`}
        >
          {c.help.guide} <ArrowRight className="size-4 shrink-0" />
        </button>
        <button
          type="button"
          data-testid="home2-chat-action"
          onClick={() => onAction('help')}
          className={`home2-press flex min-h-10 items-center justify-center gap-1.5 rounded-lg bg-white/50 text-[13px] font-semibold ring-1 ring-black/5 hover:bg-white/80 ${
            isMobile ? '' : 'px-3'
          }`}
        >
          <MessageCircle className="size-4 shrink-0" /> {c.help.chat}
        </button>
      </div>
    </div>
  );
}
