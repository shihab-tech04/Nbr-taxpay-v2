import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import type { PaymentTransaction } from '../../types/tax';

interface HistoryBannersProps {
  linkedRef: string;
  linkedRefTx: PaymentTransaction | null;
  onSelectTx: (tx: PaymentTransaction) => void;
  onClearParams: () => void;
  claimRef: string | null;
  isAuthenticated: boolean;
  pendingWalkInTx: PaymentTransaction | null;
  claimError: string | null;
  onClearClaimError: () => void;
  onExplicitClaim: () => void;
}

export const HistoryBanners: React.FC<HistoryBannersProps> = ({
  linkedRef,
  linkedRefTx,
  onSelectTx,
  onClearParams,
  claimRef,
  isAuthenticated,
  pendingWalkInTx,
  claimError,
  onClearClaimError,
  onExplicitClaim,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <>
      {linkedRef && !linkedRefTx && (
        <div role="alert" data-testid="history-ref-inaccessible" className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-center justify-between gap-2">
          <span>{isBn ? `সংযুক্ত লেনদেন (${linkedRef}) বর্তমান অ্যাকাউন্টে উপলব্ধ নয় বা অনুমোদিত নয়।` : `Linked record (${linkedRef}) is unavailable or does not belong to the active account.`}</span>
          <AppButton actionType="secondary" size="small" onClick={onClearParams}>{isBn ? 'সকল দেখুন' : 'Show All'}</AppButton>
        </div>
      )}
      {linkedRef && linkedRefTx && (
        <div data-testid="history-deeplink-banner" className="p-3 rounded-xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <span>{isBn ? `বিজ্ঞপ্তি থেকে সংযুক্ত রেকর্ড: ${linkedRefTx.transactionRef}` : `Opened from notification: ${linkedRefTx.transactionRef}`}</span>
          <div className="flex items-center gap-2">
            <AppButton actionType="secondary" size="small" onClick={() => onSelectTx(linkedRefTx)}>{isBn ? 'রসিদ দেখুন' : 'Open Receipt'}</AppButton>
            <AppButton actionType="secondary" size="small" onClick={onClearParams}>{isBn ? 'ফিল্টার সরান' : 'Clear Filter'}</AppButton>
          </div>
        </div>
      )}
      {(claimError || (isAuthenticated && Boolean(claimRef) && !pendingWalkInTx)) && (
        <div role="alert" data-testid="walkin-claim-error" className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-300 flex items-center justify-between gap-2">
          <span>{claimError || (isBn ? 'ভুল, মেয়াদোত্তীর্ণ বা ইতিমধ্যে দাবিকৃত ওয়াক-ইন রেফারেন্স।' : 'Claim rejected: invalid, stale, or already claimed walk-in reference.')}</span>
          <AppButton actionType="secondary" size="small" onClick={onClearClaimError}>{t('cancel')}</AppButton>
        </div>
      )}
      {pendingWalkInTx && (
        <div data-testid="walkin-claim-banner" className="p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200 dark:border-teal-800 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div>
            <strong className="text-slate-900 dark:text-white block">{isBn ? 'ওয়াক-ইন লেনদেন অ্যাকাউন্টে যুক্ত করবেন?' : `Claim Walk-In Challan ${pendingWalkInTx.transactionRef}?`}</strong>
            <span className="text-slate-600 dark:text-slate-300">{pendingWalkInTx.challanNumber} · ৳ {pendingWalkInTx.totalAmount.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <AppButton actionType="secondary" size="small" onClick={onClearParams}>{t('cancel')}</AppButton>
            <AppButton actionType="primary" size="small" startIcon={<CheckCircle size={14} />} onClick={onExplicitClaim}>{isBn ? 'অ্যাকাউন্টে যুক্ত করুন' : 'Claim Payment'}</AppButton>
          </div>
        </div>
      )}
    </>
  );
};
