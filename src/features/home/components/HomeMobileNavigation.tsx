import React from 'react';
import {
  CircleHelp,
  House,
  MessageCircle,
  ShieldAlert,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import { AppCardButton } from '../../../design-system/buttons';
import type { HomeAction, HomeCopy } from '../model/home.types';

function MobileNavItem({
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
    <AppCardButton
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      sx={{
        minWidth: 56,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 0.5,
        borderRadius: '8px',
        px: 0.75,
        py: 0.5,
        fontSize: '10.5px',
        fontWeight: 600,
        color: active ? '#1c3d70' : '#5d697e',
        textAlign: 'center',
      }}
    >
      <span
        className={`grid h-7 w-11 place-items-center rounded-full ${
          active ? 'bg-[#e6edf8]' : ''
        }`}
      >
        <Icon className="size-[19px]" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
      </span>
      {label}
    </AppCardButton>
  );
}

export function HomeMobileNavigation({
  c,
  onAction,
}: {
  c: HomeCopy;
  onAction: (action: HomeAction) => void;
}) {
  return (
    <nav
      aria-label={c.nav.home}
      className="home2-v2-type fixed inset-x-0 bottom-0 z-30 mx-auto max-w-[430px] border-t border-[#dfe5ee] bg-white/95 px-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-xl"
    >
      <div className="flex h-[58px] items-center justify-around">
        <MobileNavItem icon={House} label={c.nav.home} active onClick={() => onAction('home')} />
        <MobileNavItem icon={Wallet} label={c.payTax} onClick={() => onAction('pay')} />
        <MobileNavItem
          icon={CircleHelp}
          label={c.nav.guideShort}
          onClick={() => onAction('guide')}
        />
        <MobileNavItem
          icon={ShieldAlert}
          label={c.nav.report}
          onClick={() => onAction('report')}
        />
        <MobileNavItem icon={MessageCircle} label={c.nav.help} onClick={() => onAction('help')} />
      </div>
    </nav>
  );
}
