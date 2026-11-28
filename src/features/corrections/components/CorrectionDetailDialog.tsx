import React from 'react';
import { useTranslation } from 'react-i18next';
import { formatCorrectionChanges } from '../../../shared/correctionLogic';
import type { CorrectionRequest } from '../../../types/tax';
import { AppButton } from '../../../design-system/buttons';
import { AppDialog } from '../../../design-system/modals';

interface CorrectionDetailDialogProps {
  correction: CorrectionRequest | null;
  onClose: () => void;
  disablePortal?: boolean;
}

export const CorrectionDetailDialog: React.FC<CorrectionDetailDialogProps> = ({ correction, onClose, disablePortal = false }) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <AppDialog
      open={Boolean(correction)}
      onClose={onClose}
      title={correction?.ticketNumber || correction?.challanNumber || t('corrections')}
      subtitle={correction ? `${correction.challanNumber} · ${correction.status}` : undefined}
      maxWidth="sm"
      disablePortal={disablePortal}
      id="correction-detail-dialog"
      actions={<AppButton actionType="secondary" size="small" onClick={onClose}>{t('close')}</AppButton>}
    >
      {correction && (
        <div className="space-y-4 text-xs" data-testid="correction-detail-body">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800">
            <div><span className="text-slate-500 block">{t('correctionTicketLabel')}</span><strong className="font-mono">{correction.ticketNumber || correction.id}</strong></div>
            <div><span className="text-slate-500 block">{t('status')}</span><strong>{correction.status}</strong></div>
            <div><span className="text-slate-500 block">{t('challanNumberLabel')}</span><strong className="font-mono">{correction.challanNumber}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'পেমেন্ট রেফারেন্স' : 'Payment Reference'}</span><strong className="font-mono">{correction.transactionRef || correction.transactionId}</strong></div>
            {correction.taxpayerTin && <div><span className="text-slate-500 block">{t('taxpayerTin')}</span><strong className="font-mono">{correction.taxpayerTin}</strong></div>}
            <div><span className="text-slate-500 block">{t('submissionDateLabel')}</span><strong className="font-mono">{correction.createdAt}</strong></div>
          </div>

          <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="font-semibold text-slate-900 dark:text-white">{t('requestedChangesLabel')}</div>
            <div className="text-teal-700 dark:text-teal-400 font-medium">{formatCorrectionChanges(correction, isBn)}</div>
            {(correction.currentHeadCode || correction.proposedHeadCode) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700 text-[11px]">
                <div>
                  <span className="text-slate-500 block">{isBn ? 'বর্তমান তথ্য' : 'Current Values'}</span>
                  <div>AY: <span className="font-mono">{correction.currentAssessmentYear || '—'}</span></div>
                  <div>{correction.currentCircle || '—'}</div>
                  <div>[{correction.currentHeadCode || '—'}] {correction.currentHeadName || ''}</div>
                </div>
                <div>
                  <span className="text-slate-500 block">{isBn ? 'প্রস্তাবিত তথ্য' : 'Proposed Values'}</span>
                  <div>AY: <span className="font-mono">{correction.proposedAssessmentYear || '—'}</span></div>
                  <div>{correction.proposedCircle || '—'}</div>
                  <div>[{correction.proposedHeadCode || '—'}] {correction.proposedHeadName || ''}</div>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="text-slate-500 mb-1">{isBn ? 'আবেদনের বিস্তারিত কারণ' : 'Reason & Explanation'}</div>
            <p className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 whitespace-pre-line">{correction.description}</p>
          </div>
        </div>
      )}
    </AppDialog>
  );
};
