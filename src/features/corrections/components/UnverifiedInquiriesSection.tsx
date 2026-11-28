import React from 'react';
import { useTranslation } from 'react-i18next';
import type { UnverifiedCorrectionInquiry } from '../../../types/tax';

interface UnverifiedInquiriesSectionProps {
  inquiries: UnverifiedCorrectionInquiry[];
}

export const UnverifiedInquiriesSection: React.FC<UnverifiedInquiriesSectionProps> = ({ inquiries }) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  if (inquiries.length === 0) return null;

  return (
    <section className="space-y-3" data-testid="unverified-inquiries-section">
      <div>
        <h2 className="text-base font-bold text-slate-900 dark:text-white">{t('unverifiedInquiryAction')}</h2>
        <p className="text-xs text-slate-500">
          {isBn
            ? 'অযাচাইকৃত অনুসন্ধানসমূহ কর ক্রেডিট, পরিমাণ বা মালিকানা পরিবর্তন করে না।'
            : 'Read-only inquiry intake logs; tax credit, paid amount, and ownership remain unchanged.'}
        </p>
      </div>
      <div className="space-y-2">
        {inquiries.map((inq) => (
          <div key={inq.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <strong className="font-mono text-slate-900 dark:text-white">{inq.ticketNumber}</strong>
                <span className="font-mono text-teal-700 dark:text-teal-400">Ref: {inq.originalReference}</span>
              </div>
              <p className="text-slate-600 dark:text-slate-300">{inq.reason}</p>
              <p className="text-[11px] text-slate-500">{isBn ? 'প্রত্যাশিত ফলাফল:' : 'Requested outcome:'} {inq.requestedOutcome}</p>
            </div>
            <div className="flex sm:flex-col items-end justify-between gap-1 shrink-0">
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-medium">
                {inq.status}
              </span>
              <span className="font-mono text-[11px] text-slate-500">{inq.createdAt}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
