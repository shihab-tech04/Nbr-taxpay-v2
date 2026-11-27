import React from 'react';
import { AppButton } from '../../../../design-system/buttons';
import type { HomeCopy } from '../../model/home.types';
import { HomeDialogShell } from './HomeDialogShell';

export function UnavailableServiceDialog({
  unavailableKind,
  onClose,
  c,
  onNavigate,
}: {
  unavailableKind: 'certificates' | 'status' | null;
  onClose: () => void;
  c: HomeCopy;
  onNavigate: (path: string) => void;
}) {
  return (
    <HomeDialogShell
      open={unavailableKind !== null}
      onClose={onClose}
      titleId="home2-unavailable-dialog-title"
      title={c.dialogs.unavailableTitle}
      closeLabel={c.dialogs.close}
      maxWidth="xs"
    >
      <p className="text-[13.5px] leading-relaxed text-[#3e4b62]">
        {unavailableKind === 'certificates'
          ? c.dialogs.certificatesUnavailable
          : c.dialogs.statusUnavailable}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <AppButton
          actionType="secondary"
          palette="home"
          surface="soft"
          size="small"
          onClick={() => {
            onClose();
            onNavigate('/history');
          }}
        >
          {c.dialogs.viewHistory}
        </AppButton>
        <AppButton
          actionType="secondary"
          palette="home"
          surface="outlined"
          size="small"
          onClick={onClose}
        >
          {c.dialogs.close}
        </AppButton>
      </div>
    </HomeDialogShell>
  );
}
