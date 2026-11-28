import React, { useRef, useState } from 'react';
import { PaymentTransaction, PaymentLineItem } from '../types/tax';
import { useTranslation } from 'react-i18next';
import { Award, CheckCircle, Download, Printer, ShieldCheck } from 'lucide-react';
import { AppButton } from '../design-system/buttons';
import { isValidYmd } from '../design-system/dates/dateUtils';
import { AppToast } from '../design-system/feedback';
import { AppTable, useTableState, type AppColumn } from '../design-system/tables';
import { AppDialog } from '../design-system/modals';
import { exportCertificateElementToPdf } from '../shared/certificatePdfExport';
import { buildPaymentCertificateRecord } from '../shared/certificateUtils';
import { CertificatePaper } from './certificates/CertificatePaper';
import { PaymentCertificateDialog } from './certificates/PaymentCertificateDialog';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  isAuthenticated?: boolean;
  disablePortal?: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  open,
  onClose,
  transaction,
  isAuthenticated = false,
  disablePortal = false,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n?.language === 'bn';
  const [certOpen, setCertOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const paperRef = useRef<HTMLElement>(null);

  const columns: AppColumn<PaymentLineItem>[] = [
    {
      key: 'headNameEn',
      header: isBn ? 'কর খাতের কোড ও নাম' : 'Tax Head Code & Name',
      sortable: true,
      accessor: (item) => (isBn ? item.headNameBn : item.headNameEn),
      cell: (item) => (
        <div>
          <div className="font-medium">{isBn ? item.headNameBn : item.headNameEn}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            {isBn ? 'কোড' : 'Code'}: {item.headCode} {item.remarks ? `· ${item.remarks}` : ''}
          </div>
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

  const { sortState, handleSort, sortedData } = useTableState(transaction?.items ?? [], {
    columns,
    initialSort: { columnKey: 'headNameEn', direction: 'asc' },
  });

  if (!transaction) return null;
  const cert = buildPaymentCertificateRecord(transaction, isAuthenticated);

  const handleDownloadPdf = async () => {
    if (!cert) return;
    if (await exportCertificateElementToPdf(cert, paperRef.current, 'receipt')) {
      setToastMsg(isBn ? `${transaction.challanNumber}.pdf ডাউনলোড হয়েছে` : `Downloaded ${transaction.challanNumber}.pdf`);
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
        id="receipt-modal"
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center shrink-0">
              <CheckCircle size={24} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isBn ? 'নমুনা চালান — পরিশোধের জন্য বৈধ নয়' : 'Sample challan — not valid for payment'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Ref: {transaction.transactionRef}</p>
            </div>
          </div>
        }
        closeLabel={isBn ? 'রসিদ বন্ধ করুন' : 'Close receipt'}
        actions={
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={onClose}>{t('back')}</AppButton>
            <div className="flex flex-wrap gap-2">
              {cert && (
                <AppButton actionType="secondary" surface="soft" size="small" onClick={() => setCertOpen(true)} startIcon={<Award size={16} />}>
                  {isBn ? 'পেমেন্ট সনদ' : 'Certificate'}
                </AppButton>
              )}
              <AppButton actionType="secondary" size="small" onClick={() => window.print()} startIcon={<Printer size={16} />}>
                {t('printChallan')}
              </AppButton>
              <AppButton actionType="primary" size="small" disabled={!cert} onClick={() => void handleDownloadPdf()} startIcon={<Download size={16} />}>
                {t('downloadChallan')}
              </AppButton>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs">
            <div><span className="text-slate-500 block">{t('challanNumberLabel')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.challanNumber}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'ব্যাংক রেফারেন্স' : 'Bank Reference'}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.bankRef}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'পরিশোধের তারিখ' : 'Payment Date'}</span><strong className="text-slate-900 dark:text-slate-100 text-sm">{new Date(transaction.createdAt).toLocaleString()}</strong></div>
            <div><span className="text-slate-500 block">{t('taxpayerTin')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.taxpayerTin || 'Walk-In'}</strong></div>
            <div><span className="text-slate-500 block">{t('name')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm">{transaction.taxpayerName}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Channel'}</span><strong className="text-sm font-semibold text-teal-700 dark:text-teal-400">{transaction.paymentChannel}</strong></div>
            {transaction.giftDate && isValidYmd(transaction.giftDate) && (
              <div data-testid="receipt-gift-date"><span className="text-slate-500 block">{t('giftDate')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.giftDate}</strong></div>
            )}
          </div>
          {transaction.beneficiaryTin && (
            <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800 text-xs">
              <span className="font-semibold text-teal-900 dark:text-teal-200">{isBn ? 'প্রাপকের পক্ষে দাখিলকৃত: ' : 'Filed On Behalf Of Beneficiary: '}</span>
              <span className="text-slate-700 dark:text-slate-300">{transaction.beneficiaryName} (TIN: {transaction.beneficiaryTin})</span>
            </div>
          )}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{isBn ? 'কর খাত বিভাজন' : 'Tax Head Allocations'}</h4>
              <span className="text-xs font-bold text-teal-700 dark:text-teal-400 font-mono">{isBn ? 'নমুনা মোট' : 'Sample Total'}: ৳ {transaction.totalAmount.toLocaleString()}</span>
            </div>
            <AppTable<PaymentLineItem> columns={columns} data={sortedData} keyExtractor={(_, i) => String(i)} sortState={sortState} onSort={handleSort} />
          </div>
          <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
            <ShieldCheck size={20} className="shrink-0 text-emerald-600" />
            <span>{isBn ? 'এটি কেবল একটি নমুনা রসিদ। কোনো পেমেন্ট বা সরকারি চালান ইস্যু করা হয়নি।' : 'Illustrative receipt only. No payment or official challan has been issued.'}</span>
          </div>
          {cert && (
            <div className="fixed -left-[9999px] top-0 w-[760px]" aria-hidden="true">
              <CertificatePaper cert={cert} paperRef={paperRef} />
            </div>
          )}
        </div>
      </AppDialog>
      <PaymentCertificateDialog open={certOpen} onClose={() => setCertOpen(false)} transaction={transaction} isAuthenticated={isAuthenticated} disablePortal={disablePortal} />
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </>
  );
};
