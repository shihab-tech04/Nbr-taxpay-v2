import React from 'react';
import { CircleHelp, House, MessageCircle, ShieldAlert, Wallet, type LucideIcon } from 'lucide-react';
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
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? 'page' : undefined}
      className={`flex min-w-14 flex-col items-center gap-1 rounded-lg px-1.5 py-1 text-[10.5px] font-semibold transition ${
        active ? 'text-[#1c3d70]' : 'text-[#5d697e]'
      }`}
    >
      <span
        className={`grid h-7 w-11 place-items-center rounded-full ${
          active ? 'bg-[#e6edf8]' : ''
        }`}
      >
        <Icon className="size-[19px]" strokeWidth={active ? 2.2 : 1.8} aria-hidden="true" />
      </span>
      {label}
    </button>
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
        <MobileNavItem icon={ShieldAlert} label={c.nav.report} onClick={() => onAction('report')} />
        <MobileNavItem icon={MessageCircle} label={c.nav.help} onClick={() => onAction('help')} />
      </div>
    </nav>
  );
}
