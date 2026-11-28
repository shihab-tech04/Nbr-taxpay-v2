import type { CorrectionRequest, Language, PaymentTransaction } from '../types/tax';
import { TAX_HEADS } from './mockData';

export const CORRECTION_ASSESSMENT_YEARS = ['2024-2025', '2025-2026', '2026-2027'] as const;
const ACTIVE_CORRECTION_STATUSES = new Set<CorrectionRequest['status']>(['Submitted', 'Under Review']);

export function isTransactionCorrectionEligible(
  tx: PaymentTransaction | null | undefined,
  activeScope: string,
  isAuthenticated: boolean
): boolean {
  if (!isAuthenticated || !activeScope || activeScope === 'walkin' || !tx) return false;
  if (tx.status !== 'Completed' || !Array.isArray(tx.items) || tx.items.length === 0) return false;
  if (tx.ownerScope === 'walkin' || (tx.originMode === 'walk_in' && !tx.claimedByTin)) return false;
  if (tx.ownerScope && tx.ownerScope !== activeScope) return false;
  return true;
}

export interface VerifiedCorrectionInput {
  transaction: PaymentTransaction | null | undefined;
  allocationIndex: number;
  currentCircle: string;
  proposedAssessmentYear: string;
  proposedCircle: string;
  proposedHeadId: string;
  reason: string;
  activeScope: string;
  isAuthenticated: boolean;
  existingCorrections: readonly CorrectionRequest[];
  lang?: Language;
}

export type VerifiedCorrectionResult =
  | { ok: true; payload: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'> }
  | { ok: false; error: string; code: 'unauthorized' | 'invalid_allocation' | 'invalid_head' | 'no_change' | 'reason_length' | 'duplicate' };

export function validateVerifiedCorrection(input: VerifiedCorrectionInput): VerifiedCorrectionResult {
  const isBn = input.lang === 'bn';
  if (!isTransactionCorrectionEligible(input.transaction, input.activeScope, input.isAuthenticated)) {
    return { ok: false, code: 'unauthorized', error: isBn ? 'শুধুমাত্র আপনার নিজের সম্পন্ন লেনদেনের জন্য সংশোধনের আবেদন করা যাবে।' : 'Only signed-in, completed transactions belonging to your account are eligible for correction.' };
  }
  const tx = input.transaction!;
  const item = tx.items[input.allocationIndex];
  if (!item) {
    return { ok: false, code: 'invalid_allocation', error: isBn ? 'একটি বৈধ কর খাত বরাদ্দ নির্বাচন করুন।' : 'Please select a valid payment allocation item.' };
  }
  const proposedHead = TAX_HEADS.find((h) => h.id === input.proposedHeadId);
  if (!proposedHead) {
    return { ok: false, code: 'invalid_head', error: isBn ? 'একটি বৈধ প্রস্তাবিত কর খাত নির্বাচন করুন।' : 'Please select a valid proposed payment head.' };
  }
  const cleanCurrentCircle = input.currentCircle.trim() || 'Circle-112 (Company)';
  const cleanProposedCircle = input.proposedCircle.trim() || cleanCurrentCircle;
  const cleanProposedAy = input.proposedAssessmentYear.trim() || item.assessmentYear;
  const ayChanged = cleanProposedAy !== item.assessmentYear;
  const circleChanged = cleanProposedCircle !== cleanCurrentCircle;
  const headChanged = proposedHead.code !== item.headCode;

  if (!ayChanged && !circleChanged && !headChanged) {
    return { ok: false, code: 'no_change', error: isBn ? 'অন্তত একটি ক্ষেত্র (কর বর্ষ, সার্কেল বা কর খাত) পরিবর্তন করুন।' : 'Change at least one field (Assessment Year, Tax Circle, or Payment Head) before submitting.' };
  }
  const cleanReason = input.reason.replace(/\r\n/g, '\n').trim();
  if (cleanReason.length < 10 || cleanReason.length > 1000) {
    return { ok: false, code: 'reason_length', error: isBn ? 'সংশোধনের কারণ কমপক্ষে ১০ অক্ষরের (সর্বোচ্চ ১,০০০) হতে হবে।' : 'Reason for correction must be between 10 and 1,000 characters.' };
  }
  const duplicate = input.existingCorrections.some(
    (c) =>
      ACTIVE_CORRECTION_STATUSES.has(c.status) &&
      c.challanNumber === tx.challanNumber &&
      (c.allocationIndex ?? 0) === input.allocationIndex &&
      (!c.ownerScope || c.ownerScope === input.activeScope)
  );
  if (duplicate) {
    return { ok: false, code: 'duplicate', error: isBn ? 'এই চালান ও বরাদ্দের জন্য একটি সক্রিয় সংশোধন আবেদন ইতিমধ্যেই জমা রয়েছে।' : 'An active correction request is already pending for this challan and allocation.' };
  }

  const changes: string[] = [];
  if (ayChanged) changes.push(`AY ${item.assessmentYear} -> ${cleanProposedAy}`);
  if (circleChanged) changes.push(`Circle ${cleanCurrentCircle} -> ${cleanProposedCircle}`);
  if (headChanged) changes.push(`Head ${item.headCode} -> ${proposedHead.code}`);

  return {
    ok: true,
    payload: {
      ownerScope: input.activeScope,
      transactionId: tx.id,
      transactionRef: tx.transactionRef,
      challanNumber: tx.challanNumber,
      allocationIndex: input.allocationIndex,
      taxpayerTin: item.taxpayerTin || tx.taxpayerTin,
      currentAssessmentYear: item.assessmentYear,
      currentCircle: cleanCurrentCircle,
      currentHeadCode: item.headCode,
      currentHeadName: isBn ? item.headNameBn : item.headNameEn,
      proposedAssessmentYear: cleanProposedAy,
      proposedCircle: cleanProposedCircle,
      proposedHeadCode: proposedHead.code,
      proposedHeadName: isBn ? proposedHead.nameBn : proposedHead.nameEn,
      reason: changes.join(' · '),
      description: cleanReason,
    },
  };
}

export interface UnverifiedInquiryValidationErrors {
  originalReference?: string;
  reason?: string;
  requestedOutcome?: string;
  evidenceNote?: string;
}

export function validateUnverifiedInquiry(input: {
  originalReference: string;
  reason: string;
  requestedOutcome: string;
  evidenceNote: string;
  lang?: Language;
}): { ok: true; normalized: { originalReference: string; reason: string; requestedOutcome: string; evidenceNote: string } } | { ok: false; errors: UnverifiedInquiryValidationErrors } {
  const isBn = input.lang === 'bn';
  const originalReference = input.originalReference.trim();
  const reason = input.reason.replace(/\r\n/g, '\n').trim();
  const requestedOutcome = input.requestedOutcome.replace(/\r\n/g, '\n').trim();
  const evidenceNote = input.evidenceNote.replace(/\r\n/g, '\n').trim();
  const errors: UnverifiedInquiryValidationErrors = {};

  if (originalReference.length < 6 || originalReference.length > 80) {
    errors.originalReference = isBn ? 'মূল রেফারেন্স ৬ থেকে ৮০ অক্ষরের মধ্যে হতে হবে।' : 'Original reference must be between 6 and 80 characters.';
  }
  if (reason.length < 10 || reason.length > 1000) {
    errors.reason = isBn ? 'অনুসন্ধানের কারণ ১০ থেকে ১,০০০ অক্ষরের মধ্যে হতে হবে।' : 'Reason must be between 10 and 1,000 characters.';
  }
  if (requestedOutcome.length < 10 || requestedOutcome.length > 600) {
    errors.requestedOutcome = isBn ? 'প্রত্যাশিত ফলাফল ১০ থেকে ৬০০ অক্ষরের মধ্যে হতে হবে।' : 'Requested outcome must be between 10 and 600 characters.';
  }
  if (evidenceNote.length > 2000) {
    errors.evidenceNote = isBn ? 'প্রমাণ নোট সর্বোচ্চ ২,০০০ অক্ষরের মধ্যে হতে হবে।' : 'Optional evidence note cannot exceed 2,000 characters.';
  }

  return Object.keys(errors).length > 0
    ? { ok: false, errors }
    : { ok: true, normalized: { originalReference, reason, requestedOutcome, evidenceNote } };
}

export function formatCorrectionChanges(c: CorrectionRequest, isBn = false): string {
  const parts: string[] = [];
  if (c.currentAssessmentYear && c.proposedAssessmentYear && c.currentAssessmentYear !== c.proposedAssessmentYear) {
    parts.push(`${isBn ? 'কর বর্ষ' : 'AY'}: ${c.currentAssessmentYear} → ${c.proposedAssessmentYear}`);
  }
  if (c.currentCircle && c.proposedCircle && c.currentCircle !== c.proposedCircle) {
    parts.push(`${isBn ? 'সার্কেল' : 'Circle'}: ${c.currentCircle} → ${c.proposedCircle}`);
  }
  if (c.currentHeadCode && c.proposedHeadCode && c.currentHeadCode !== c.proposedHeadCode) {
    parts.push(`${isBn ? 'খাত' : 'Head'}: ${c.currentHeadCode} → ${c.proposedHeadCode}`);
  }
  return parts.length > 0 ? parts.join(' | ') : c.reason;
}
