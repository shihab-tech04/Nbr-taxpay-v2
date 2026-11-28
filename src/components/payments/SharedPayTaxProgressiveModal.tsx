import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AppButton } from '../../design-system/buttons';
import { AppDialog } from '../../design-system/modals';

export interface ProgressiveSummaryLine {
  id: string;
  label: string;
  meta?: string;
  amountText: string;
}

export interface SharedPayTaxProgressiveModalProps {
  open: boolean;
  onClose: () => void;
  onBack?: () => void;
  backLabel?: string;
  closeLabel?: string;
  disablePortal?: boolean;
  isDirty?: boolean;
  confirmCloseMessage?: string;
  onSaveDraft?: () => void;
  dirtyCancelLabel?: string;
  icon?: React.ReactNode;
  title: string;
  subtitle: string;
  stepIndicator: string;
  summaryTitle: string;
  summaryMetaBadges?: readonly string[];
  summaryLines: readonly ProgressiveSummaryLine[];
  summaryEmptyText: string;
  summaryTotalLabel: string;
  summaryTotalAmount: number;
  summaryTotalValidated?: boolean;
  summaryPendingTotalText?: string;
  summaryFooterNote?: string;
  summaryCustomContent?: React.ReactNode;
  children: React.ReactNode;
}

export const SharedPayTaxProgressiveModal: React.FC<SharedPayTaxProgressiveModalProps> = ({
  open,
  onClose,
  onBack,
  backLabel,
  closeLabel,
  disablePortal = true,
  isDirty = false,
  confirmCloseMessage,
  onSaveDraft,
  dirtyCancelLabel,
  icon,
  title,
  subtitle,
  stepIndicator,
  summaryTitle,
  summaryMetaBadges = [],
  summaryLines,
  summaryEmptyText,
  summaryTotalLabel,
  summaryTotalAmount,
  summaryTotalValidated = true,
  summaryPendingTotalText,
  summaryFooterNote,
  summaryCustomContent,
  children,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const totalDisplay = summaryTotalValidated
    ? `৳ ${summaryTotalAmount.toLocaleString()}`
    : (summaryPendingTotalText ?? t('pendingValidationLabel'));

  const summaryBody = (
    <div className="space-y-3 text-xs">
      {summaryMetaBadges.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {summaryMetaBadges.map((badge) => (
            <span
              key={badge}
              className="px-2 py-0.5 rounded-md bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-[11px] font-mono text-teal-800 dark:text-teal-200"
            >
              {badge}
            </span>
          ))}
        </div>
      )}
      {summaryCustomContent}
      {summaryLines.length === 0 ? (
        !summaryCustomContent && <p className="text-slate-500 dark:text-slate-400">{summaryEmptyText}</p>
      ) : (
        <div className="space-y-2 divide-y divide-slate-200/80 dark:divide-slate-700/80">
          {summaryLines.map((line) => (
            <div key={line.id} className="pt-2 first:pt-0 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-white break-words">{line.label}</div>
                {line.meta && <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono break-words">{line.meta}</div>}
              </div>
              <strong className="font-mono text-slate-900 dark:text-white whitespace-nowrap">{line.amountText}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="pt-3 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between gap-2">
        <span className="font-bold text-slate-700 dark:text-slate-200">{summaryTotalLabel}</span>
        <strong data-testid="progressive-summary-total" className={`font-mono ${summaryTotalValidated ? 'text-base text-teal-700 dark:text-teal-300' : 'text-xs text-slate-500 dark:text-slate-400'}`}>
          {totalDisplay}
        </strong>
      </div>
      {summaryFooterNote && <p className="text-[11px] text-slate-500 dark:text-slate-400">{summaryFooterNote}</p>}
    </div>
  );

  return (
    <AppDialog
      open={open}
      onClose={onClose}
      onBack={onBack}
      backLabel={backLabel ?? (isBn ? 'পেছনে যান' : 'Back')}
      closeLabel={closeLabel ?? (isBn ? 'বন্ধ করুন' : 'Close')}
      disablePortal={disablePortal}
      maxWidth="lg"
      fullWidth
      isDirty={isDirty}
      confirmCloseMessage={confirmCloseMessage}
      onSaveDraft={onSaveDraft}
      dirtyCancelLabel={dirtyCancelLabel}
      id="shared-pay-tax-modal"
      className="!max-w-[1040px] w-full max-sm:!m-2 max-sm:!w-[calc(100%-16px)]"
      title={
        <h1 className="inline-flex items-center gap-2 text-base sm:text-lg font-bold text-slate-900 dark:text-white m-0">
          {icon}
          <span>{title}</span>
        </h1>
      }
      subtitle={
        <span className="inline-flex flex-wrap items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-semibold font-mono text-[11px]">
            {stepIndicator}
          </span>
          <span>{subtitle}</span>
        </span>
      }
    >
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-6 items-start">
        <div className="min-w-0">{children}</div>
        <aside
          data-testid="progressive-modal-summary-rail"
          className="hidden lg:block sticky top-0 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-4 space-y-3"
        >
          <h2 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">
            {summaryTitle}
          </h2>
          {summaryBody}
        </aside>
      </div>

      <div
        data-testid="progressive-modal-mobile-footer"
        className="lg:hidden sticky -bottom-6 -mx-6 mt-6 px-4 py-3 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-10 space-y-3 shadow-[0_-6px_18px_rgba(15,23,42,0.08)]"
      >
        {mobileExpanded && (
          <div data-testid="progressive-mobile-summary-expanded" className="pb-2 border-b border-slate-200 dark:border-slate-800">
            {summaryBody}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{summaryTotalLabel}</div>
            <div data-testid="progressive-mobile-summary-total" className={`font-bold font-mono ${summaryTotalValidated ? 'text-sm text-teal-700 dark:text-teal-300' : 'text-xs text-slate-500 dark:text-slate-400'}`}>
              {totalDisplay}
            </div>
          </div>
          <AppButton
            type="button"
            actionType="secondary"
            surface="soft"
            size="small"
            data-testid="mobile-summary-toggle"
            endIcon={mobileExpanded ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
            onClick={() => setMobileExpanded((prev) => !prev)}
          >
            {isBn ? (mobileExpanded ? 'সারাংশ লুকান' : 'সারাংশ') : (mobileExpanded ? 'Hide Summary' : 'Summary')}
          </AppButton>
        </div>
      </div>
    </AppDialog>
  );
};
