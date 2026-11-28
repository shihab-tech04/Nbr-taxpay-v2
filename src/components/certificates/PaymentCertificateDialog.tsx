import React, { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Download, Printer } from 'lucide-react';
import type { PaymentTransaction } from '../../types/tax';
import { AppButton } from '../../design-system/buttons';
import { AppStateView, AppToast } from '../../design-system/feedback';
import { AppDialog } from '../../design-system/modals';
import { exportCertificateElementToPdf } from '../../shared/certificatePdfExport';
import { buildPaymentCertificateRecord } from '../../shared/certificateUtils';
import { CertificatePaper } from './CertificatePaper';

interface PaymentCertificateDialogProps {
  open: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  isAuthenticated: boolean;
  disablePortal?: boolean;
}

export const PaymentCertificateDialog: React.FC<PaymentCertificateDialogProps> = ({
  open,
  onClose,
  transaction,
  isAuthenticated,
  disablePortal = false,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n?.language === 'bn';
  const paperRef = useRef<HTMLElement>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);

  if (!transaction) return null;

  const cert = buildPaymentCertificateRecord(transaction, isAuthenticated);

  const handleDownload = async () => {
    if (!cert) return;
    setExportError(null);
    const ok = await exportCertificateElementToPdf(cert, paperRef.current, 'certificate');
    if (ok) {
      setToastMsg(isBn ? `${cert.certificateId}.pdf ডাউনলোড হয়েছে` : `Downloaded ${cert.certificateId}.pdf`);
    } else {
      setExportError(isBn ? 'পিডিএফ ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Could not export PDF. Please retry.');
    }
  };

  return (
    <>
      <AppDialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        responsiveBottomSheet
        disablePortal={disablePortal}
        id="payment-certificate-dialog"
        title={
          <div className="flex items-center gap-2.5">
            <Award className="text-teal-700 dark:text-teal-400 shrink-0" size={22} />
            <div className="min-w-0">
              <div className="text-base font-bold text-slate-900 dark:text-white truncate">
                {isBn ? 'সম্মিলিত পেমেন্ট সনদ (নমুনা)' : 'Combined Payment Certificate (Sample)'}
              </div>
              <div className="text-xs font-mono text-slate-500 font-normal">
                {cert ? `${cert.certificateId} · ${cert.transactionRef}` : transaction.transactionRef}
              </div>
            </div>
          </div>
        }
        closeLabel={isBn ? 'সনদ বন্ধ করুন' : 'Close certificate'}
        actions={
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={onClose}>
              {t('back')}
            </AppButton>
            {cert && (
              <div className="flex items-center gap-2">
                <AppButton actionType="secondary" size="small" startIcon={<Printer size={16} />} onClick={() => window.print()}>
                  {isBn ? 'প্রিন্ট' : 'Print'}
                </AppButton>
                <AppButton actionType="primary" size="small" startIcon={<Download size={16} />} onClick={() => void handleDownload()}>
                  {isBn ? 'নমুনা পিডিএফ ডাউনলোড' : 'Download PDF'}
                </AppButton>
              </div>
            )}
          </div>
        }
      >
        {!cert ? (
          <AppStateView
            variant="error"
            title={isBn ? 'সনদ প্রিভিউ অনুপলব্ধ' : 'Certificate Preview Unavailable'}
            description={
              isBn
                ? 'লেনদেনের মোট অঙ্ক ও কর খাতের যোগফল সমন্বিত নয় অথবা লেনদেনটি সম্পন্ন হয়নি।'
                : 'Transaction allocations could not be reconciled or payment status is not completed.'
            }
          />
        ) : (
          <div className="space-y-3">
            {exportError && (
              <div role="alert" className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {exportError}
              </div>
            )}
            <CertificatePaper
              cert={cert}
              paperRef={paperRef}
              onCopySuccess={(id) =>
                setToastMsg(isBn ? `${id} কপি হয়েছে` : `Copied ${id} to clipboard`)
              }
            />
          </div>
        )}
      </AppDialog>
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </>
  );
};
