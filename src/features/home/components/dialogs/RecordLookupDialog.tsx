import React from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { AppButton } from '../../../../design-system/buttons';
import type { PaymentTransaction } from '../../../../types/tax';
import type { LookupOutcome } from '../../hooks/useHomeNavigation';
import type { HomeCopy } from '../../model/home.types';
import { HomeDialogShell } from './HomeDialogShell';

export function RecordLookupDialog({
  lookupOutcome,
  onClose,
  c,
  onNavigate,
  onSelectReceipt,
  disablePortal = false,
}: {
  lookupOutcome: LookupOutcome | null;
  onClose: () => void;
  c: HomeCopy;
  onNavigate: (path: string) => void;
  onSelectReceipt: (tx: PaymentTransaction) => void;
  disablePortal?: boolean;
}) {
  return (
    <HomeDialogShell
      open={lookupOutcome !== null}
      onClose={onClose}
      titleId="home2-lookup-dialog-title"
      title={
        <>
          <Search className="size-5 text-[#1c3d70]" aria-hidden="true" />
          <span>{c.dialogs.lookupTitle}</span>
        </>
      }
      closeLabel={c.dialogs.lookupClose}
      disablePortal={disablePortal}
    >
      {lookupOutcome?.kind === 'too_short' && (
        <div className="space-y-3">
          <p className="text-[14px] font-medium text-[#d0353b]">{c.find.tooShort}</p>
        </div>
      )}

      {lookupOutcome?.kind === 'invalid' && (
        <div className="space-y-3">
          <p className="text-[14px] font-medium text-[#d0353b]">{c.find.invalidFormat}</p>
        </div>
      )}

      {lookupOutcome?.kind === 'service_unavailable' && (
        <div className="space-y-2.5" role="status">
          <p className="text-[14px] font-semibold text-[#0f1d34]">
            {c.find.serviceUnavailableTitle}
          </p>
          <p className="text-[13px] leading-relaxed text-[#3e4b62]">
            {c.find.previewLookupNotice}
          </p>
        </div>
      )}

      {lookupOutcome?.kind === 'unauthorized' && (
        <div className="space-y-2.5">
          <p className="text-[14px] font-semibold text-[#0f1d34]">{c.find.unauthorizedTitle}</p>
          <p className="text-[13px] leading-relaxed text-[#3e4b62]">{c.find.unauthorizedHint}</p>
        </div>
      )}

      {lookupOutcome?.kind === 'not_found' && (
        <div className="space-y-2.5">
          <p className="text-[14px] font-semibold text-[#0f1d34]">
            {c.find.noRecord(lookupOutcome.reference)}
          </p>
          <p className="text-[13px] text-[#3e4b62]">{c.find.noRecordHint}</p>
        </div>
      )}

      {lookupOutcome?.kind === 'matched_sample' && (
        <div className="space-y-3">
          <div className="inline-block rounded-md bg-amber-100 px-2.5 py-1 text-[11.5px] font-semibold text-amber-900">
            {c.find.sampleMatchBadge}
          </div>
          <div className="space-y-1 rounded-xl border border-[#dfe5ee] bg-[#f8fafd] p-4 text-[13px]">
            <div>
              <span className="text-[#5d697e]">Ref:</span>{' '}
              <strong className="font-mono text-[#0f1d34]">
                {lookupOutcome.transaction.transactionRef}
              </strong>
            </div>
            <div>
              <span className="text-[#5d697e]">Challan:</span>{' '}
              <strong className="font-mono text-[#0f1d34]">
                {lookupOutcome.transaction.challanNumber}
              </strong>
            </div>
            <div>
              <span className="text-[#5d697e]">Amount:</span>{' '}
              <strong className="text-[#0f1d34]">
                ৳ {lookupOutcome.transaction.totalAmount.toLocaleString()}
              </strong>
            </div>
          </div>
          <AppButton
            actionType="primary"
            palette="home"
            geometry="hero"
            size="medium"
            endIcon={<ArrowRight className="size-4" aria-hidden="true" />}
            onClick={() => {
              const tx = lookupOutcome.transaction;
              onClose();
              onSelectReceipt(tx);
            }}
          >
            {c.dialogs.viewHistory}
          </AppButton>
        </div>
      )}

      <div className="mt-5 flex flex-wrap gap-2">
        <AppButton
          actionType="secondary"
          palette="home"
          surface="soft"
          size="small"
          onClick={() => {
            onClose();
            onNavigate('/login');
          }}
        >
          {c.dialogs.goToLogin}
        </AppButton>
        <AppButton
          actionType="secondary"
          palette="home"
          surface="outlined"
          size="small"
          onClick={() => {
            onClose();
            onNavigate('/history');
          }}
        >
          {c.dialogs.viewHistory}
        </AppButton>
      </div>
    </HomeDialogShell>
  );
}
