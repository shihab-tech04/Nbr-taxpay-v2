import React from 'react';
import { ArrowRight, CircleHelp, Globe, House, ShieldAlert, type LucideIcon } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
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
    <AppButton
      actionType="secondary"
      palette="home"
      surface="ghost"
      size="small"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      startIcon={<Icon className="size-4" aria-hidden="true" />}
      sx={{
        minHeight: 36,
        height: 36,
        px: 1.75,
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: 600,
        bgcolor: active ? '#f4f7fc' : 'transparent',
        color: active ? '#1c3d70' : '#3e4b62',
        '&:hover': {
          bgcolor: active ? '#f4f7fc' : '#f4f6fa',
          color: active ? '#1c3d70' : '#0f1d34',
        },
      }}
    >
      {label}
    </AppButton>
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
          <AppButton
            actionType="secondary"
            palette="home"
            surface="ghost"
            size="small"
            onClick={onToggleLang}
            aria-label={c.langSwitchLabel}
            startIcon={<Globe className="size-[15px] text-[#5d697e]" aria-hidden="true" />}
            sx={{
              minHeight: 36,
              height: 36,
              px: 1.25,
              borderRadius: '8px',
              fontSize: '12.5px',
              fontWeight: 600,
              color: '#0f1d34',
              minWidth: 'auto',
            }}
          >
            {c.langSwitch}
          </AppButton>
          <AppButton
            actionType="secondary"
            palette="home"
            surface="outlined"
            size="small"
            onClick={() => onAction('login')}
            endIcon={<ArrowRight className="size-[15px]" aria-hidden="true" />}
            className="home2-press"
            sx={{
              minHeight: 36,
              height: 36,
              pl: 1.5,
              pr: 1.25,
              fontSize: '12.5px',
            }}
          >
            {signedIn ? c.dashboard : c.login}
          </AppButton>
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
          <AppButton
            actionType="secondary"
            palette="home"
            surface="ghost"
            size="medium"
            onClick={onToggleLang}
            aria-label={c.langSwitchLabel}
            startIcon={<Globe className="size-4 text-[#5d697e]" aria-hidden="true" />}
            sx={{
              minHeight: 40,
              height: 40,
              px: 1.5,
              borderRadius: '8px',
              fontSize: '13.5px',
              fontWeight: 600,
              color: '#0f1d34',
              '&:hover': { bgcolor: '#f4f6fa' },
            }}
          >
            {c.langSwitch}
          </AppButton>
          <AppButton
            actionType="secondary"
            palette="home"
            surface="outlined"
            size="medium"
            onClick={() => onAction('login')}
            endIcon={<ArrowRight className="size-4" aria-hidden="true" />}
            className="home2-press"
            sx={{
              minHeight: 40,
              height: 40,
              pl: 2,
              pr: 1.75,
              fontSize: '13.5px',
            }}
          >
            {signedIn ? c.dashboard : c.login}
          </AppButton>
        </div>
      </div>
    </header>
  );
}
