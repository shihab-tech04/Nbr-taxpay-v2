import React from 'react';
import { ArrowRight, MessageCircle } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
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
        <AppButton
          actionType="secondary"
          palette="home"
          surface="ghost"
          size="medium"
          data-testid="home2-guide-action"
          onClick={() => onAction('guide')}
          endIcon={<ArrowRight className="size-4 shrink-0" aria-hidden="true" />}
          className="home2-press"
          sx={{
            minHeight: 40,
            px: isMobile ? 1 : 1.5,
            borderRadius: '8px',
            bgcolor: '#ffffff',
            color: '#0f1d34',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
          }}
        >
          {c.help.guide}
        </AppButton>
        <AppButton
          actionType="secondary"
          palette="home"
          surface="ghost"
          size="medium"
          data-testid="home2-chat-action"
          onClick={() => onAction('help')}
          startIcon={<MessageCircle className="size-4 shrink-0" aria-hidden="true" />}
          className="home2-press"
          sx={{
            minHeight: 40,
            px: isMobile ? 1 : 1.5,
            borderRadius: '8px',
            bgcolor: 'rgba(255,255,255,0.5)',
            color: '#0f1d34',
            fontSize: '13px',
            fontWeight: 600,
            boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
            '&:hover': { bgcolor: 'rgba(255,255,255,0.8)' },
          }}
        >
          {c.help.chat}
        </AppButton>
      </div>
    </div>
  );
}
