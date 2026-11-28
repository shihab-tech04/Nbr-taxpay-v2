import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Download, Printer, ShieldAlert } from 'lucide-react';
import type { PaymentLineItem, PaymentTransaction } from '../../types/tax';
import { AppButton } from '../../design-system/buttons';
import { isValidYmd } from '../../design-system/dates/dateUtils';
import { AppToast } from '../../design-system/feedback';
import { AppDialog } from '../../design-system/modals';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';
import {
  buildCertificatePdfLines,
  buildPaymentCertificateRecord,
  downloadSamplePdf,
} from '../../shared/certificateUtils';

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
  const [downloadedToast, setDownloadedToast] = useState(false);

  const cert = transaction ? buildPaymentCertificateRecord(transaction, isAuthenticated) : null;

  const columns: AppColumn<PaymentLineItem>[] = [
    {
      key: 'headNameEn',
      header: t('taxHead'),
      sortable: true,
      accessor: (item) => (isBn ? item.headNameBn : item.headNameEn),
      cell: (item) => (
        <div>
          <div className="font-medium">{isBn ? item.headNameBn : item.headNameEn}</div>
          <div className="text-[11px] text-slate-500 font-mono">{isBn ? 'কোড' : 'Code'}: {item.headCode}</div>
        </div>
      ),
    },
    {
      key: 'assessmentYear',
      header: t('assessmentYear'),
      sortable: true,
      accessor: (item) => item.assessmentYear,
      cell: (item) => <span className="font-mono">{item.assessmentYear}</span>,
    },
    {
      key: 'amount',
      header: t('amountBdt'),
      align: 'right',
      sortable: true,
      accessor: (item) => item.amount,
      cell: (item) => <span className="font-semibold font-mono">৳ {item.amount.toLocaleString()}</span>,
    },
  ];

  const { sortState, handleSort, sortedData } = useTableState(cert?.items ?? [], {
    columns,
    initialSort: { columnKey: 'headNameEn', direction: 'asc' },
  });

  if (!cert) return null;

  const handleDownload = () => {
    if (downloadSamplePdf(cert.certificateId, buildCertificatePdfLines(cert))) {
      setDownloadedToast(true);
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
                {cert.certificateId} · {cert.transactionRef}
              </div>
            </div>
          </div>
        }
        closeLabel={isBn ? 'সনদ বন্ধ করুন' : 'Close certificate'}
        actions={
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={onClose}>{t('back')}</AppButton>
            <div className="flex items-center gap-2">
              <AppButton actionType="secondary" size="small" startIcon={<Printer size={16} />} onClick={() => window.print()}>
                {isBn ? 'প্রিন্ট' : 'Print'}
              </AppButton>
              <AppButton actionType="primary" size="small" startIcon={<Download size={16} />} onClick={handleDownload}>
                {isBn ? 'নমুনা পিডিএফ ডাউনলোড' : 'Download PDF'}
              </AppButton>
            </div>
          </div>
        }
      >
        <div className="space-y-5 text-xs">
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 flex items-start gap-2">
            <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
            <span>
              {isBn
                ? 'এটি শুধুমাত্র পেমেন্ট সনদের ইউআই প্রিভিউ — কোনো সরকারি কর রেয়াত সনদ বা নিষ্পত্তি প্রমাণ নয়।'
                : 'Illustrative Payment Certificate UI preview only — separate from Tax Credit Certificates and not official NBR verification.'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
            <div><span className="text-slate-500 block">{t('challanNumberLabel')}</span><strong className="font-mono text-slate-900 dark:text-white">{cert.challanNumber}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'ব্যাংক রেফারেন্স' : 'Bank Reference'}</span><strong className="font-mono text-slate-900 dark:text-white">{cert.bankRef}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'তারিখ ও মাধ্যম' : 'Date & Channel'}</span><strong className="text-slate-900 dark:text-white">{new Date(cert.createdAt).toLocaleDateString()} · {cert.paymentChannel}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'প্রদানকারী' : 'Payer'}</span><strong className="text-slate-900 dark:text-white">{cert.taxpayerName}</strong></div>
            <div><span className="text-slate-500 block">{t('taxpayerTin')}</span><strong className="font-mono text-slate-900 dark:text-white">{cert.taxpayerTin}</strong></div>
            <div><span className="text-slate-500 block">{t('assessmentYear')}</span><strong className="font-mono text-slate-900 dark:text-white">{cert.assessmentYears}</strong></div>
            {cert.beneficiaryTin && (
              <div className="col-span-2 sm:col-span-3">
                <span className="text-slate-500 block">{isBn ? 'সুবিধাভোগী প্রাপক' : 'Recipient / Beneficiary'}</span>
                <strong className="text-slate-900 dark:text-white">{cert.beneficiaryName} (TIN: {cert.beneficiaryTin})</strong>
              </div>
            )}
            {cert.giftDate && isValidYmd(cert.giftDate) && (
              <div><span className="text-slate-500 block">{t('giftDate')}</span><strong className="font-mono text-slate-900 dark:text-white">{cert.giftDate}</strong></div>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{isBn ? 'সম্মিলিত কর খাতসমূহ' : 'Combined Payment-Head Allocations'}</h4>
              <span className="font-mono font-bold text-teal-700 dark:text-teal-400">{isBn ? 'মোট (নমুনা)' : 'Sample Total'}: ৳ {cert.totalAmount.toLocaleString()}</span>
            </div>
            <AppTable<PaymentLineItem> columns={columns} data={sortedData} keyExtractor={(_, i) => `${cert.certificateId}-${i}`} sortState={sortState} onSort={handleSort} />
          </div>

          <div data-testid="certificate-lifecycle-note" className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300">
            {isBn ? cert.lifecycleNoteBn : cert.lifecycleNoteEn}
          </div>
        </div>
      </AppDialog>
      <AppToast open={downloadedToast} onClose={() => setDownloadedToast(false)} message={isBn ? `${cert.certificateId}.pdf ডাউনলোড হয়েছে` : `Downloaded ${cert.certificateId}.pdf`} severity="success" />
    </>
  );
};
