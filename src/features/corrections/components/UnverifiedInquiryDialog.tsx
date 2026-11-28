import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Info } from 'lucide-react';
import { useApp } from '../../../shared/AppContext';
import { validateUnverifiedInquiry, type UnverifiedInquiryValidationErrors } from '../../../shared/correctionLogic';
import type { UnverifiedCorrectionInquiry } from '../../../types/tax';
import { AppButton } from '../../../design-system/buttons';
import { AppTextArea, AppTextField } from '../../../design-system/forms';
import { AppDialog } from '../../../design-system/modals';

interface UnverifiedInquiryDialogProps {
  open: boolean;
  onClose: () => void;
  disablePortal?: boolean;
}

export const UnverifiedInquiryDialog: React.FC<UnverifiedInquiryDialogProps> = ({ open, onClose, disablePortal = false }) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const { addUnverifiedInquiry } = useApp();

  const [originalReference, setOriginalReference] = useState('');
  const [reason, setReason] = useState('');
  const [requestedOutcome, setRequestedOutcome] = useState('');
  const [evidenceNote, setEvidenceNote] = useState('');
  const [errors, setErrors] = useState<UnverifiedInquiryValidationErrors>({});
  const [submitted, setSubmitted] = useState<UnverifiedCorrectionInquiry | null>(null);
  const submitLockRef = useRef(false);

  const isDirty = Boolean(!submitted && (originalReference.trim() || reason.trim() || requestedOutcome.trim() || evidenceNote.trim()));

  const handleClose = () => {
    submitLockRef.current = false;
    setOriginalReference('');
    setReason('');
    setRequestedOutcome('');
    setEvidenceNote('');
    setErrors({});
    setSubmitted(null);
    onClose();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (submitLockRef.current || submitted) return;
    const res = validateUnverifiedInquiry({
      originalReference,
      reason,
      requestedOutcome,
      evidenceNote,
      lang: isBn ? 'bn' : 'en',
    });
    if (!res.ok) {
      setErrors(res.errors);
      return;
    }
    submitLockRef.current = true;
    const created = addUnverifiedInquiry(res.normalized);
    if (!created) {
      submitLockRef.current = false;
      return;
    }
    setErrors({});
    setSubmitted(created);
  };

  return (
    <AppDialog
      open={open}
      onClose={handleClose}
      title={t('unverifiedInquiryAction')}
      subtitle={isBn ? 'অযাচাইকৃত / ওয়াক-ইন / অজানা রেফারেন্স অনুসন্ধান (শুধু পঠনযোগ্য লগ)' : 'Guest, walk-in, or unrecognized reference intake · Read-only inquiry'}
      maxWidth="sm"
      responsiveBottomSheet
      disablePortal={disablePortal}
      isDirty={isDirty}
      id="unverified-inquiry-dialog"
      actions={
        submitted ? (
          <div className="flex justify-end w-full">
            <AppButton actionType="primary" size="small" onClick={handleClose}>{t('close')}</AppButton>
          </div>
        ) : (
          <div className="flex justify-end gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={handleClose}>{t('cancel')}</AppButton>
            <AppButton actionType="primary" size="small" previewRestricted onClick={() => handleSubmit()}>{t('submit')}</AppButton>
          </div>
        )
      }
    >
      {submitted ? (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-start gap-3 text-xs" data-testid="unverified-inquiry-confirmation">
          <CheckCircle size={20} className="text-emerald-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-sm text-emerald-900 dark:text-emerald-200 block">{isBn ? 'অযাচাইকৃত অনুসন্ধান নথিভুক্ত হয়েছে' : 'Unverified Inquiry Logged'}</strong>
            <p>{isBn ? 'অনুসন্ধান টিকিট:' : 'Inquiry Ticket:'} <strong className="font-mono" data-testid="inquiry-ticket-number">{submitted.ticketNumber}</strong></p>
            <p className="text-slate-600 dark:text-slate-300">
              {isBn ? 'এটি কোনো কর ক্রেডিট, পরিমাণ বা মালিকানা পরিবর্তন করে না।' : 'This inquiry never modifies tax credit, paid amount, or transaction ownership.'}
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 flex items-start gap-2">
            <Info size={16} className="shrink-0 mt-0.5" />
            <span>
              {isBn
                ? 'এটি একটি অযাচাইকৃত সংশোধন অনুসন্ধান; এটি যাচাইকৃত সংশোধন হিসেবে গণ্য হবে না এবং কর ক্রেডিট, পরিমাণ বা মালিকানা পরিবর্তন করবে না।'
                : 'Unverified inquiry intake for unverified references. It never creates a verified correction and never alters tax credit, amount, or ownership.'}
            </span>
          </div>
          <AppTextField
            label={isBn ? 'মূল রেফারেন্স (৬–৮০ অক্ষর)' : 'Original Reference (6–80 chars)'}
            value={originalReference}
            onChange={(e) => { setOriginalReference(e.target.value); if (errors.originalReference) setErrors((p) => ({ ...p, originalReference: undefined })); }}
            error={Boolean(errors.originalReference)}
            helperText={errors.originalReference || (isBn ? 'বর্ণ বা সংখ্যা দিয়ে শুরু; শুধুমাত্র A-Z, 0-9, ., _, /, - ব্যবহারযোগ্য' : 'Starts with letter/digit; allowed: A-Z, 0-9, ., _, /, - (6–80 chars)')}
            required
            slotProps={{ htmlInput: { maxLength: 80, className: 'font-mono' } }}
          />
          <AppTextArea
            label={isBn ? 'অনুসন্ধানের কারণ (১০–১,০০০ অক্ষর)' : 'Reason (10–1,000 chars)'}
            value={reason}
            onChange={(e) => { setReason(e.target.value); if (errors.reason) setErrors((p) => ({ ...p, reason: undefined })); }}
            rows={3}
            error={Boolean(errors.reason)}
            helperText={errors.reason || `${reason.trim().length}/10–1000`}
            required
          />
          <AppTextArea
            label={isBn ? 'প্রত্যাশিত ফলাফল (১০–৬০০ অক্ষর)' : 'Requested Outcome (10–600 chars)'}
            value={requestedOutcome}
            onChange={(e) => { setRequestedOutcome(e.target.value); if (errors.requestedOutcome) setErrors((p) => ({ ...p, requestedOutcome: undefined })); }}
            rows={2}
            error={Boolean(errors.requestedOutcome)}
            helperText={errors.requestedOutcome || `${requestedOutcome.trim().length}/10–600`}
            required
          />
          <AppTextArea
            label={isBn ? 'প্রমাণ সংক্রান্ত নোট (ঐচ্ছিক, সর্বোচ্চ ২,০০০ অক্ষর)' : 'Optional Evidence Note (max 2,000 chars)'}
            value={evidenceNote}
            onChange={(e) => { setEvidenceNote(e.target.value); if (errors.evidenceNote) setErrors((p) => ({ ...p, evidenceNote: undefined })); }}
            rows={2}
            error={Boolean(errors.evidenceNote)}
            helperText={errors.evidenceNote || `${evidenceNote.trim().length}/2000`}
          />
        </form>
      )}
    </AppDialog>
  );
};
