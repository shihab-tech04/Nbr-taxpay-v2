import React from 'react';
import {
  ArrowUpRight,
  CalendarCheck,
  ChevronRight,
  FilePen,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react';
import { AppButton, AppCardButton } from '../../../design-system/buttons';
import { NBR_PUBLICATIONS_URL } from '../model/routeContract';
import type { HomeAction, HomeCopy } from '../model/home.types';
import { HomeLogo, HomeTile } from './HomeBrand';

interface FooterLinkItem {
  action: HomeAction;
  label: string;
  icon: LucideIcon;
  external?: boolean;
}

function buildFooterLinks(c: HomeCopy): FooterLinkItem[] {
  return [
    { action: 'status', label: c.links.status, icon: CalendarCheck },
    { action: 'receipts', label: c.links.receipts, icon: FilePen },
    { action: 'security', label: c.links.security, icon: ShieldCheck },
    { action: 'nbr', label: c.links.nbr, icon: ArrowUpRight, external: true },
  ];
}

export function MobileQuickLinks({
  c,
  onAction,
}: {
  c: HomeCopy;
  onAction: (action: HomeAction) => void;
}) {
  const links = buildFooterLinks(c);

  return (
    <HomeTile delay={500} className="overflow-hidden rounded-[20px] bg-white ring-1 ring-[#dfe5ee]">
      {links.map((l, i) => {
        const divider = i ? 'border-t border-[#dfe5ee]' : '';
        if (l.external) {
          return (
            <a
              key={l.label}
              href={NBR_PUBLICATIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[#f4f6fa] ${divider}`}
            >
              <l.icon className="size-[18px] text-[#5d697e]" aria-hidden="true" />
              <span className="flex-1 text-[13.5px] font-semibold text-[#0f1d34]">{l.label}</span>
              <ArrowUpRight className="size-4 text-[#5d697e]/70" aria-hidden="true" />
            </a>
          );
        }
        return (
          <AppCardButton
            key={l.label}
            onClick={() => onAction(l.action)}
            className={`w-full items-center gap-3 px-4 py-3.5 text-left transition active:bg-[#f4f6fa] ${divider}`}
          >
            <l.icon className="size-[18px] text-[#5d697e]" aria-hidden="true" />
            <span className="flex-1 text-[13.5px] font-semibold text-[#0f1d34]">{l.label}</span>
            <ChevronRight className="size-4 text-[#5d697e]/70" aria-hidden="true" />
          </AppCardButton>
        );
      })}
    </HomeTile>
  );
}

export function HomeFooter({
  c,
  variant,
  onAction,
}: {
  c: HomeCopy;
  variant: 'desktop' | 'mobile';
  onAction: (action: HomeAction) => void;
}) {
  if (variant === 'mobile') {
    return (
      <footer
        role="contentinfo"
        className="home2-v2-type flex flex-col items-center gap-2 pt-4 pb-1 text-center"
      >
        <HomeLogo />
        <p className="text-[11.5px] text-[#5d697e]">
          {c.footer.tagline} · {c.footer.copyright}
        </p>
      </footer>
    );
  }

  const links = buildFooterLinks(c);

  return (
    <footer role="contentinfo" className="home2-v2-type border-t border-[#dfe5ee] bg-white">
      <div className="mx-auto flex w-full max-w-[1240px] flex-wrap items-center justify-between gap-x-8 gap-y-3 px-8 py-5">
        <div className="flex items-center gap-4">
          <HomeLogo />
          <span className="h-8 w-px bg-[#dfe5ee]" aria-hidden="true" />
          <p className="max-w-[130px] text-[12px] leading-snug text-[#5d697e]">
            {c.footer.tagline}
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-1">
          {links.map((l) =>
            l.external ? (
              <a
                key={l.label}
                href={NBR_PUBLICATIONS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-[13px] font-medium text-[#3e4b62] transition hover:bg-[#f4f6fa] hover:text-[#0f1d34]"
              >
                {l.label}
                <ArrowUpRight className="size-3.5" aria-hidden="true" />
              </a>
            ) : (
              <AppButton
                key={l.label}
                tone="ghost"
                size="small"
                onClick={() => onAction(l.action)}
                sx={{
                  minHeight: 32,
                  px: 1.5,
                  py: 0.75,
                  borderRadius: '6px',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                {l.label}
              </AppButton>
            )
          )}
        </nav>
        <div className="text-[12px] text-[#5f6880]">
          <p>{c.footer.copyright}</p>
        </div>
      </div>
    </footer>
  );
}
