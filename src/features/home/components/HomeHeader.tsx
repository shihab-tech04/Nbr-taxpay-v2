import React from 'react';
import { ArrowRight, CircleHelp, Globe, House, ShieldAlert, type LucideIcon } from 'lucide-react';
import type { HomeAction, HomeCopy } from '../model/home.types';
import { HomeLogo } from './HomeBrand';

function DesktopNavLink({
  icon: Icon,
  label,
  active,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex h-9 items-center gap-2 rounded-lg px-3.5 text-[14px] font-semibold transition ${
        active
          ? 'bg-[#f4f7fc] text-[#1c3d70]'
          : 'text-[#3e4b62] hover:bg-[#f4f6fa] hover:text-[#0f1d34]'
      }`}
    >
      <Icon className="size-4" aria-hidden="true" /> {label}
    </button>
  );
}

export function HomeHeader({
  c,
  variant,
  signedIn,
  onToggleLang,
  onAction,
}: {
  c: HomeCopy;
  variant: 'desktop' | 'mobile';
  signedIn: boolean;
  onToggleLang: () => void;
  onAction: (action: HomeAction) => void;
}) {
  if (variant === 'mobile') {
    return (
      <header
        role="banner"
        className="home2-v2-type sticky top-0 z-30 flex items-center justify-between border-b border-[#dfe5ee] bg-white/90 px-4 py-2.5 backdrop-blur-xl"
      >
        <HomeLogo />
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={c.langSwitchLabel}
            className="flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-[12.5px] font-semibold text-[#0f1d34]"
          >
            <Globe className="size-[15px] text-[#5d697e]" aria-hidden="true" /> {c.langSwitch}
          </button>
          <button
            type="button"
            onClick={() => onAction('login')}
            className="home2-press flex h-9 items-center gap-1 rounded-lg bg-white pr-2.5 pl-3 text-[12.5px] font-semibold text-[#1c3d70] ring-1 ring-[#cad8ef]"
          >
            {signedIn ? c.dashboard : c.login}
            <ArrowRight className="size-[15px]" aria-hidden="true" />
          </button>
        </div>
      </header>
    );
  }

  return (
    <header
      role="banner"
      className="home2-v2-type sticky top-0 z-30 border-b border-[#dfe5ee] bg-white/90 backdrop-blur-xl"
    >
      <div className="mx-auto grid h-16 w-full max-w-[1240px] grid-cols-[1fr_auto_1fr] items-center px-8">
        <HomeLogo />
        <nav aria-label="Primary" className="flex items-center gap-1">
          <DesktopNavLink
            icon={House}
            label={c.nav.home}
            active
            onClick={() => onAction('home')}
          />
          <DesktopNavLink
            icon={CircleHelp}
            label={c.nav.guide}
            onClick={() => onAction('guide')}
          />
          <DesktopNavLink
            icon={ShieldAlert}
            label={c.nav.report}
            onClick={() => onAction('report')}
          />
        </nav>
        <div className="flex items-center gap-2 justify-self-end">
          <button
            type="button"
            onClick={onToggleLang}
            aria-label={c.langSwitchLabel}
            className="flex h-10 items-center gap-2 rounded-lg px-3 text-[13.5px] font-semibold text-[#0f1d34] transition hover:bg-[#f4f6fa]"
          >
            <Globe className="size-4 text-[#5d697e]" aria-hidden="true" /> {c.langSwitch}
          </button>
          <button
            type="button"
            onClick={() => onAction('login')}
            className="home2-press flex h-10 items-center gap-1.5 rounded-lg bg-white pr-3.5 pl-4 text-[13.5px] font-semibold text-[#1c3d70] ring-1 ring-[#cad8ef] hover:bg-[#f4f7fc]"
          >
            {signedIn ? c.dashboard : c.login}
            <ArrowRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  );
}
