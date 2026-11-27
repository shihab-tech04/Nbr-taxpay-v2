import React, { useState } from 'react';
import { ReceiptModal } from '../../../components/ReceiptModal';
import type { PaymentTransaction } from '../../../types/tax';
import type { LookupOutcome } from '../hooks/useHomeNavigation';
import type { HomeCopy } from '../model/home.types';
import { HelpChatDialog } from './dialogs/HelpChatDialog';
import { OtherTaxDialog } from './dialogs/OtherTaxDialog';
import { RecordLookupDialog } from './dialogs/RecordLookupDialog';
import { UnavailableServiceDialog } from './dialogs/UnavailableServiceDialog';

export function HomeDialogs({
  c,
  otherTaxOpen,
  onCloseOtherTax,
  helpOpen,
  onCloseHelp,
  lookupOutcome,
  onCloseLookup,
  unavailableKind,
  onCloseUnavailable,
  onNavigate,
}: {
  c: HomeCopy;
  otherTaxOpen: boolean;
  onCloseOtherTax: () => void;
  helpOpen: boolean;
  onCloseHelp: () => void;
  lookupOutcome: LookupOutcome | null;
  onCloseLookup: () => void;
  unavailableKind: 'certificates' | 'status' | null;
  onCloseUnavailable: () => void;
  onNavigate: (path: string) => void;
}) {
  const [selectedReceipt, setSelectedReceipt] = useState<PaymentTransaction | null>(null);

  return (
    <>
      <OtherTaxDialog
        open={otherTaxOpen}
        onClose={onCloseOtherTax}
        c={c}
        onNavigate={onNavigate}
      />

      <HelpChatDialog open={helpOpen} onClose={onCloseHelp} c={c} onNavigate={onNavigate} />

      <RecordLookupDialog
        lookupOutcome={lookupOutcome}
        onClose={onCloseLookup}
        c={c}
        onNavigate={onNavigate}
        onSelectReceipt={setSelectedReceipt}
      />

      <UnavailableServiceDialog
        unavailableKind={unavailableKind}
        onClose={onCloseUnavailable}
        c={c}
        onNavigate={onNavigate}
      />

      <ReceiptModal
        open={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />
    </>
  );
}
