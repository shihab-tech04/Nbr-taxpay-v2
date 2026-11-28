import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import type { CorrectionRequest, PaymentTransaction } from '../../types/tax';
import { useApp } from '../../shared/AppContext';
import { TAX_HEADS } from '../../shared/mockData';
import { CORRECTION_ASSESSMENT_YEARS, deriveActualCurrentCircle, isTransactionCorrectionEligible, validateVerifiedCorrection } from '../../shared/correctionLogic';
import { AppButton } from '../../design-system/buttons';
import { AppSelectField, AppTextArea, AppTextField } from '../../design-system/forms';
import { AppDialog } from '../../design-system/modals';

interface CorrectionRequestModalProps {
  open: boolean;
  onClose: () => void;
  initialTransaction?: PaymentTransaction | null;
  disablePortal?: boolean;
}

export const CorrectionRequestModal: React.FC<CorrectionRequestModalProps> = ({ open, onClose, initialTransaction, disablePortal = false }) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const { user, activeScope, isAuthenticated, transactions, corrections, addCorrection } = useApp();

  const eligibleTxs = useMemo(() => transactions.filter((tx) => isTransactionCorrectionEligible(tx, activeScope, isAuthenticated)), [activeScope, isAuthenticated, transactions]);
  const [selectedTxId, setSelectedTxId] = useState('');
  const activeTx = useMemo(() => {
    if (initialTransaction) return eligibleTxs.find((tx) => tx.id === initialTransaction.id || tx.transactionRef === initialTransaction.transactionRef) ?? null;
    return eligibleTxs.find((tx) => tx.id === selectedTxId) ?? eligibleTxs[0] ?? null;
  }, [eligibleTxs, initialTransaction, selectedTxId]);

  const [allocationIndexStr, setAllocationIndexStr] = useState('');
  const isMultiAllocation = Boolean(activeTx && activeTx.items.length > 1);
  const resolvedAllocationIndex: number | null = !activeTx ? null : !isMultiAllocation ? 0 : allocationIndexStr !== '' && Number.isInteger(Number(allocationIndexStr)) ? Number(allocationIndexStr) : null;
  const currentItem = activeTx && resolvedAllocationIndex !== null ? activeTx.items[resolvedAllocationIndex] ?? null : null;
  const currentCircle = useMemo(
    () => (currentItem ? deriveActualCurrentCircle({ transaction: activeTx, allocationIndex: resolvedAllocationIndex, userCircle: user.circle, userTin: user.tin }) : ''),
    [activeTx, currentItem, resolvedAllocationIndex, user.circle, user.tin]
  );
  const currentAy = currentItem?.assessmentYear || '';
  const currentHeadId = currentItem?.headId || '';

  const [proposedAy, setProposedAy] = useState('');
  const [proposedCircle, setProposedCircle] = useState('');
  const [proposedHeadId, setProposedHeadId] = useState('');
  const [reason, setReason] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedTicket, setSubmittedTicket] = useState<CorrectionRequest | null>(null);
  const submitLockRef = useRef(false);

  const effectiveProposedAy = proposedAy || currentAy;
  const effectiveProposedHeadId = proposedHeadId || currentHeadId;
  const isDirty = Boolean(!submittedTicket && (reason.trim() || proposedAy || proposedCircle || proposedHeadId || (isMultiAllocation && allocationIndexStr !== '')));

  const resetProposedFields = () => {
    setProposedAy('');
    setProposedCircle('');
    setProposedHeadId('');
    setFormError(null);
  };

  const resetForm = () => {
    submitLockRef.current = false;
    setSelectedTxId('');
    setAllocationIndexStr('');
    resetProposedFields();
    setReason('');
    setSubmittedTicket(null);
  };

  const handleClose = () => { resetForm(); onClose(); };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitLockRef.current || submittedTicket) return;
    const res = validateVerifiedCorrection({
      transaction: activeTx, trustedTransactions: transactions, allocationIndex: resolvedAllocationIndex, currentCircle,
      proposedAssessmentYear: effectiveProposedAy, proposedCircle, proposedHeadId: effectiveProposedHeadId, reason,
      activeScope, isAuthenticated, existingCorrections: corrections, lang: isBn ? 'bn' : 'en',
    });
    if (!res.ok) { setFormError(res.error); return; }
    submitLockRef.current = true;
    const created = addCorrection(res.payload);
    if (!created) {
      submitLockRef.current = false;
      setFormError(isBn ? 'আবেদন জমা দেওয়া যায়নি। সেশন বা পূর্ববর্তী সক্রিয় আবেদন যাচাই করুন।' : 'Could not submit correction request. Verify account session and pending requests.');
      return;
    }
    setFormError(null);
    setSubmittedTicket(created);
  };

  const ayOptions = useMemo(() => {
    const base = [...CORRECTION_ASSESSMENT_YEARS] as string[];
    if (currentAy && !base.includes(currentAy)) base.unshift(currentAy);
    return base.map((ay) => ({ value: ay, label: ay }));
  }, [currentAy]);

  return (
    <AppDialog
      open={open} onClose={handleClose} title={t('applyForCorrection')} maxWidth="sm" responsiveBottomSheet disablePortal={disablePortal} isDirty={isDirty} id="correction-request-modal"
      subtitle={activeTx ? `${activeTx.challanNumber} · ${activeTx.transactionRef}` : undefined}
      actions={
        submittedTicket ? (
          <div className="flex justify-end gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={handleClose}>{t('close')}</AppButton>
            <AppButton actionType="primary" size="small" onClick={() => { const id = submittedTicket.id; handleClose(); navigate(`/corrections?ticketId=${encodeURIComponent(id)}`); }}>{t('viewCorrectionRequests')}</AppButton>
          </div>
        ) : (
          <div className="flex justify-end gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={handleClose}>{t('cancel')}</AppButton>
            <AppButton actionType="primary" size="small" previewRestricted disabled={!activeTx || (isMultiAllocation && !currentItem)} onClick={() => handleSubmit()}>{t('submit')}</AppButton>
          </div>
        )
      }
    >
      {submittedTicket ? (
        <div className="space-y-4 py-2" data-testid="correction-confirmation">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-xs">
            <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <strong className="text-sm text-emerald-900 dark:text-emerald-200 block">{isBn ? 'সংশোধন আবেদন জমা হয়েছে' : 'Correction Request Submitted'}</strong>
              <p>{isBn ? 'টিকিট নম্বর:' : 'Confirmation Ticket:'} <strong className="font-mono" data-testid="correction-ticket-number">{submittedTicket.ticketNumber}</strong></p>
              <p className="text-slate-600 dark:text-slate-300">{submittedTicket.challanNumber} · {submittedTicket.reason}</p>
            </div>
          </div>
        </div>
      ) : !activeTx ? (
        <div role="alert" data-testid="correction-unavailable-alert" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200">
          {isBn ? 'সংশোধনের জন্য আপনার অ্যাকাউন্টে কোনো সম্পন্ন লেনদেন পাওয়া যায়নি।' : 'No completed account-owned transactions are available for correction.'}
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {formError && <div role="alert" data-testid="correction-form-error" className="p-3 rounded-lg bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300">{formError}</div>}
          {!initialTransaction && eligibleTxs.length > 0 && (
            <AppSelectField label={isBn ? 'পেমেন্ট / চালান রেফারেন্স' : 'Payment / Challan Reference'} value={activeTx.id} onChange={(e) => { setSelectedTxId(String(e.target.value)); setAllocationIndexStr(''); resetProposedFields(); }} options={eligibleTxs.map((tx) => ({ value: tx.id, label: `${tx.challanNumber} (${tx.transactionRef} · ৳ ${tx.totalAmount.toLocaleString()})` }))} />
          )}
          {isMultiAllocation && (
            <AppSelectField
              label={isBn ? 'সমন্বিত পেমেন্ট বরাদ্দ নির্বাচন করুন' : 'Combined Payment Allocation'} value={allocationIndexStr} required
              onChange={(e) => { setAllocationIndexStr(String(e.target.value)); resetProposedFields(); }}
              options={[{ value: '', label: isBn ? '— একটি নির্দিষ্ট বরাদ্দ বেছে নিন —' : '— Select an allocation item —' }, ...activeTx.items.map((item, idx) => ({ value: String(idx), label: `#${idx + 1}: [${item.headCode}] ${isBn ? item.headNameBn : item.headNameEn} · AY ${item.assessmentYear} · ৳ ${item.amount.toLocaleString()}` }))]}
            />
          )}
          {currentItem && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-xs" data-testid="correction-readonly-summary">
                <div><span className="text-slate-500 block">{t('taxpayerTin')}</span><strong className="font-mono">{currentItem.taxpayerTin || activeTx.taxpayerTin}</strong></div>
                <div><span className="text-slate-500 block">{isBn ? 'বর্তমান কর বর্ষ' : 'Current Assessment Year'}</span><strong className="font-mono">{currentAy}</strong></div>
                <div><span className="text-slate-500 block">{isBn ? 'বর্তমান সার্কেল' : 'Current Tax Circle'}</span><strong>{currentCircle || (isBn ? 'নথিভুক্ত নয়' : 'Not recorded')}</strong></div>
                <div><span className="text-slate-500 block">{isBn ? 'বর্তমান কর খাত' : 'Current Payment Head'}</span><strong>[{currentItem.headCode}] {isBn ? currentItem.headNameBn : currentItem.headNameEn}</strong></div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <AppSelectField label={isBn ? 'প্রস্তাবিত কর বর্ষ' : 'Proposed Assessment Year'} value={effectiveProposedAy} onChange={(e) => { setProposedAy(String(e.target.value)); setFormError(null); }} options={ayOptions} />
                <AppTextField label={isBn ? 'প্রস্তাবিত সার্কেল' : 'Proposed Tax Circle'} value={proposedCircle} placeholder={currentCircle || (isBn ? 'যেমন: Circle-118 (Dhaka)' : 'e.g., Circle-118 (Dhaka)')} onChange={(e) => { setProposedCircle(e.target.value); setFormError(null); }} slotProps={{ htmlInput: { maxLength: 60 } }} />
              </div>
              <AppSelectField label={isBn ? 'প্রস্তাবিত কর খাত' : 'Proposed Payment Head'} value={effectiveProposedHeadId} onChange={(e) => { setProposedHeadId(String(e.target.value)); setFormError(null); }} options={TAX_HEADS.map((h) => ({ value: h.id, label: `[${h.code}] ${isBn ? h.nameBn : h.nameEn}` }))} />
              <AppTextArea label={isBn ? 'সংশোধনের কারণ (কমপক্ষে ১০ অক্ষর)' : 'Reason for Correction (min 10 chars)'} value={reason} onChange={(e) => { setReason(e.target.value); if (formError) setFormError(null); }} rows={3} required placeholder={isBn ? 'কেন এই পরিবর্তন প্রয়োজন তা স্পষ্টভাবে লিখুন...' : 'Explain clearly why this assessment year, circle, or tax head adjustment is requested...'} helperText={isBn ? `${reason.trim().length}/১০+ অক্ষর` : `${reason.trim().length} characters (minimum 10 required)`} />
            </>
          )}
        </form>
      )}
    </AppDialog>
  );
};
