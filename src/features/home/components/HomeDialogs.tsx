import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, IconButton } from '@mui/material';
import { ArrowRight, Gift, MessageCircle, PhoneCall, Plane, Search, WalletCards, X } from 'lucide-react';
import { ReceiptModal } from '../../../components/ReceiptModal';
import type { PaymentTransaction } from '../../../types/tax';
import type { LookupOutcome } from '../hooks/useHomeNavigation';
import type { HomeCopy } from '../model/home.types';

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
      <Dialog
        open={otherTaxOpen}
        onClose={onCloseOtherTax}
        maxWidth="sm"
        fullWidth
        aria-labelledby="home2-other-tax-dialog-title"
      >
        <DialogTitle
          id="home2-other-tax-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}
        >
          <span className="text-[18px] font-bold text-[#0f1d34]">{c.dialogs.otherTaxTitle}</span>
          <IconButton onClick={onCloseOtherTax} aria-label={c.dialogs.close} size="small">
            <X className="size-4" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <p className="mb-4 text-[13.5px] text-[#3e4b62]">{c.dialogs.otherTaxSubtitle}</p>
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => {
                onCloseOtherTax();
                onNavigate('/travel-tax');
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-[#dfe5ee] bg-[#f8fafd] p-4 text-left transition hover:border-[#2f55a4] hover:bg-white"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#e6edf8] text-[#1c3d70]">
                <Plane className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-bold text-[#0f1d34]">
                  {c.dialogs.otherTaxChoices.travelTitle}
                </div>
                <div className="text-[12.5px] text-[#3e4b62]">
                  {c.dialogs.otherTaxChoices.travelBody}
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-[#5d697e]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                onCloseOtherTax();
                onNavigate('/gift-tax');
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-[#dfe5ee] bg-[#f8fafd] p-4 text-left transition hover:border-[#2f55a4] hover:bg-white"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#e6edf8] text-[#1c3d70]">
                <Gift className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-bold text-[#0f1d34]">
                  {c.dialogs.otherTaxChoices.giftTitle}
                </div>
                <div className="text-[12.5px] text-[#3e4b62]">
                  {c.dialogs.otherTaxChoices.giftBody}
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-[#5d697e]" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => {
                onCloseOtherTax();
                onNavigate('/all-taxes');
              }}
              className="flex w-full items-center gap-3 rounded-xl border border-[#dfe5ee] bg-[#f8fafd] p-4 text-left transition hover:border-[#2f55a4] hover:bg-white"
            >
              <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-[#e6edf8] text-[#1c3d70]">
                <WalletCards className="size-5" aria-hidden="true" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[14.5px] font-bold text-[#0f1d34]">
                  {c.dialogs.otherTaxChoices.allTitle}
                </div>
                <div className="text-[12.5px] text-[#3e4b62]">
                  {c.dialogs.otherTaxChoices.allBody}
                </div>
              </div>
              <ArrowRight className="size-4 shrink-0 text-[#5d697e]" aria-hidden="true" />
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={helpOpen}
        onClose={onCloseHelp}
        maxWidth="sm"
        fullWidth
        aria-labelledby="home2-help-dialog-title"
      >
        <DialogTitle
          id="home2-help-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}
        >
          <span className="flex items-center gap-2 text-[18px] font-bold text-[#0f1d34]">
            <MessageCircle className="size-5 text-[#1c3d70]" aria-hidden="true" />
            {c.dialogs.helpTitle}
          </span>
          <IconButton onClick={onCloseHelp} aria-label={c.dialogs.close} size="small">
            <X className="size-4" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <p className="mb-4 text-[13.5px] text-[#3e4b62]">{c.dialogs.helpSubtitle}</p>
          <div className="space-y-3">
            {c.dialogs.helpTopics.map((topic) => (
              <div
                key={topic.title}
                className="rounded-xl border border-[#dfe5ee] bg-[#f8fafd] p-4"
              >
                <h4 className="text-[14px] font-bold text-[#0f1d34]">{topic.title}</h4>
                <p className="mt-1 text-[12.5px] text-[#3e4b62]">{topic.summary}</p>
                <button
                  type="button"
                  onClick={() => {
                    onCloseHelp();
                    onNavigate(topic.route);
                  }}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1c3d70] hover:underline"
                >
                  {topic.cta} <ArrowRight className="size-3.5" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#e6edf8] px-4 py-3 text-[13px] font-semibold text-[#1c3d70]">
            <PhoneCall className="size-4 shrink-0" aria-hidden="true" />
            <span>{c.dialogs.helplineLabel}</span>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={lookupOutcome !== null}
        onClose={onCloseLookup}
        maxWidth="sm"
        fullWidth
        aria-labelledby="home2-lookup-dialog-title"
      >
        <DialogTitle
          id="home2-lookup-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}
        >
          <span className="flex items-center gap-2 text-[18px] font-bold text-[#0f1d34]">
            <Search className="size-5 text-[#1c3d70]" aria-hidden="true" />
            {c.dialogs.lookupTitle}
          </span>
          <IconButton onClick={onCloseLookup} aria-label={c.dialogs.lookupClose} size="small">
            <X className="size-4" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {lookupOutcome?.kind === 'too_short' && (
            <div className="space-y-3">
              <p className="text-[14px] font-medium text-[#d0353b]">{c.find.tooShort}</p>
            </div>
          )}
          {lookupOutcome?.kind === 'preview_blocked' && (
            <div className="space-y-3">
              <p className="text-[14px] font-semibold text-[#0f1d34]">
                {c.find.noRecord(lookupOutcome.reference)}
              </p>
              <p className="text-[13px] text-[#3e4b62]">{c.find.previewLookupNotice}</p>
            </div>
          )}
          {lookupOutcome?.kind === 'not_found' && (
            <div className="space-y-3">
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
              <div className="rounded-xl border border-[#dfe5ee] bg-[#f8fafd] p-4 text-[13px] space-y-1">
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
              <button
                type="button"
                onClick={() => {
                  const tx = lookupOutcome.transaction;
                  onCloseLookup();
                  setSelectedReceipt(tx);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2f55a4] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1f3c7a]"
              >
                {c.dialogs.viewHistory}
                <ArrowRight className="size-4" aria-hidden="true" />
              </button>
            </div>
          )}

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onCloseLookup();
                onNavigate('/login');
              }}
              className="rounded-lg bg-[#e6edf8] px-4 py-2 text-[13px] font-semibold text-[#1c3d70] hover:bg-[#cad8ef]"
            >
              {c.dialogs.goToLogin}
            </button>
            <button
              type="button"
              onClick={() => {
                onCloseLookup();
                onNavigate('/history');
              }}
              className="rounded-lg border border-[#dfe5ee] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f1d34] hover:bg-[#f4f6fa]"
            >
              {c.dialogs.viewHistory}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={unavailableKind !== null}
        onClose={onCloseUnavailable}
        maxWidth="xs"
        fullWidth
        aria-labelledby="home2-unavailable-dialog-title"
      >
        <DialogTitle
          id="home2-unavailable-dialog-title"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}
        >
          <span className="text-[17px] font-bold text-[#0f1d34]">{c.dialogs.unavailableTitle}</span>
          <IconButton onClick={onCloseUnavailable} aria-label={c.dialogs.close} size="small">
            <X className="size-4" />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <p className="text-[13.5px] leading-relaxed text-[#3e4b62]">
            {unavailableKind === 'certificates'
              ? c.dialogs.certificatesUnavailable
              : c.dialogs.statusUnavailable}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                onCloseUnavailable();
                onNavigate('/history');
              }}
              className="rounded-lg bg-[#2f55a4] px-4 py-2 text-[13px] font-semibold text-white hover:bg-[#1f3c7a]"
            >
              {c.dialogs.viewHistory}
            </button>
            <button
              type="button"
              onClick={onCloseUnavailable}
              className="rounded-lg border border-[#dfe5ee] bg-white px-4 py-2 text-[13px] font-semibold text-[#0f1d34] hover:bg-[#f4f6fa]"
            >
              {c.dialogs.close}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <ReceiptModal
        open={Boolean(selectedReceipt)}
        onClose={() => setSelectedReceipt(null)}
        transaction={selectedReceipt}
      />
    </>
  );
}
