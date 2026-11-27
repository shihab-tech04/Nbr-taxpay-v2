import React from 'react';
import { ArrowRight, Gift, Plane } from 'lucide-react';
import { AppCardButton } from '../../../../design-system/buttons';
import type { HomeCopy } from '../../model/home.types';
import { HomeDialogShell } from './HomeDialogShell';

export function OtherTaxDialog({
  open,
  onClose,
  c,
  onNavigate,
  disablePortal = false,
}: {
  open: boolean;
  onClose: () => void;
  c: HomeCopy;
  onNavigate: (path: string) => void;
  disablePortal?: boolean;
}) {
  const choices = [
    {
      key: 'travel',
      path: '/travel-tax',
      Icon: Plane,
      title: c.dialogs.otherTaxChoices.travelTitle,
      body: c.dialogs.otherTaxChoices.travelBody,
    },
    {
      key: 'gift',
      path: '/gift-tax',
      Icon: Gift,
      title: c.dialogs.otherTaxChoices.giftTitle,
      body: c.dialogs.otherTaxChoices.giftBody,
    },
  ] as const;

  return (
    <HomeDialogShell
      open={open}
      onClose={onClose}
      titleId="home2-other-tax-dialog-title"
      title={c.dialogs.otherTaxTitle}
      closeLabel={c.dialogs.close}
      disablePortal={disablePortal}
    >
      <p className="mb-4 text-[13.5px] text-[#3e4b62]">{c.dialogs.otherTaxSubtitle}</p>
      <div className="space-y-2.5" data-testid="other-tax-chooser">
        {choices.map(({ key, path, Icon, title, body }) => (
          <AppCardButton
            key={key}
            onClick={() => {
              onClose();
              onNavigate(path);
            }}
            sx={{
              width: '100%',
              gap: 1.5,
              borderRadius: '12px',
              border: '1px solid #dfe5ee',
              bgcolor: '#f8fafd',
              p: 2,
              alignItems: 'center',
              transition: 'border-color 150ms ease, background-color 150ms ease',
              '&:hover': {
                borderColor: '#2f55a4',
                bgcolor: '#ffffff',
              },
            }}
          >
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#e6edf8] text-[#1c3d70]">
              <Icon className="size-5" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[14.5px] font-bold text-[#0f1d34]">{title}</div>
              <div className="text-[12.5px] text-[#3e4b62]">{body}</div>
            </div>
            <ArrowRight className="size-4 shrink-0 text-[#5d697e]" aria-hidden="true" />
          </AppCardButton>
        ))}
      </div>
    </HomeDialogShell>
  );
}
