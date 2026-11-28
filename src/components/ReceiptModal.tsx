import React, { useRef, useState } from 'react';
import { PaymentTransaction, PaymentLineItem } from '../types/tax';
import { useTranslation } from 'react-i18next';
import { Award, CheckCircle, Download, FileEdit, Printer, ShieldCheck } from 'lucide-react';
import { AppButton } from '../design-system/buttons';
import { isValidYmd } from '../design-system/dates/dateUtils';
import { AppToast } from '../design-system/feedback';
import { AppTable, useTableState, type AppColumn } from '../design-system/tables';
import { AppDialog } from '../design-system/modals';
import { exportCertificateElementToPdf } from '../shared/certificatePdfExport';
import { buildPaymentCertificateRecord } from '../shared/certificateUtils';
import { isTransactionCorrectionEligible } from '../shared/correctionLogic';
import { useOptionalDomainState } from '../shared/DomainStateContext';
import { CertificatePaper } from './certificates/CertificatePaper';
import { PaymentCertificateDialog } from './certificates/PaymentCertificateDialog';
import { CorrectionRequestModal } from './corrections/CorrectionRequestModal';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
  isAuthenticated?: boolean;
  disablePortal?: boolean;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ open, onClose, transaction, isAuthenticated = false, disablePortal = false }) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n?.language === 'bn';
  const domainState = useOptionalDomainState();
  const [certOpen, setCertOpen] = useState(false);
  const [corrOpen, setCorrOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [exportError, setExportError] = useState<string | null>(null);
  const paperRef = useRef<HTMLElement>(null);

  const columns: AppColumn<PaymentLineItem>[] = [
    {
      key: 'headNameEn', header: isBn ? 'কর খাতের কোড ও নাম' : 'Tax Head Code & Name', sortable: true, accessor: (item) => (isBn ? item.headNameBn : item.headNameEn),
      cell: (item) => (<div><div className="font-medium">{isBn ? item.headNameBn : item.headNameEn}</div><div className="text-[11px] text-slate-500 font-mono">{isBn ? 'কোড' : 'Code'}: {item.headCode} {item.remarks ? `· ${item.remarks}` : ''}</div></div>),
    },
    { key: 'assessmentYear', header: t('assessmentYear'), sortable: true, accessor: (item) => item.assessmentYear, cell: (item) => <span className="font-mono">{item.assessmentYear}</span> },
    { key: 'amount', header: t('amountBdt'), align: 'right', sortable: true, accessor: (item) => item.amount, cell: (item) => <span className="font-semibold font-mono">৳ {item.amount.toLocaleString()}</span> },
  ];

  const { sortState, handleSort, sortedData } = useTableState(transaction?.items ?? [], { columns, initialSort: { columnKey: 'headNameEn', direction: 'asc' } });
  if (!transaction) return null;

  const cert = buildPaymentCertificateRecord(transaction, isAuthenticated);
  const scope = domainState?.activeScope ?? (isAuthenticated && transaction.taxpayerTin ? `acct_${transaction.taxpayerTin}` : 'walkin');
  const correctionEligible = Boolean(domainState) && isTransactionCorrectionEligible(transaction, scope, isAuthenticated);

  const handleDownloadPdf = async () => {
    if (!cert) {
      setExportError(isBn ? 'অসমন্বিত লেনদেনের পিডিএফ তৈরি সম্ভব নয়।' : 'Receipt PDF unavailable for unreconciled or pending records.');
      return;
    }
    setExportError(null);
    if (await exportCertificateElementToPdf(cert, paperRef.current, 'receipt')) {
      setToastMsg(isBn ? `${transaction.challanNumber}.pdf ডাউনলোড হয়েছে` : `Downloaded ${transaction.challanNumber}.pdf`);
    } else {
      setExportError(isBn ? 'পিডিএফ ডাউনলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।' : 'Could not export receipt PDF. Please retry.');
    }
  };

  return (
    <>
      <AppDialog
        open={open} onClose={onClose} maxWidth="md" responsiveBottomSheet disablePortal={disablePortal} id="receipt-modal"
        closeLabel={isBn ? 'রসিদ বন্ধ করুন' : 'Close receipt'}
        title={
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center shrink-0"><CheckCircle size={24} /></div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">{isBn ? 'নমুনা চালান — পরিশোধের জন্য বৈধ নয়' : 'Sample challan — not valid for payment'}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-normal">Ref: {transaction.transactionRef}</p>
            </div>
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center justify-between gap-2 w-full">
            <AppButton actionType="secondary" size="small" onClick={onClose}>{t('back')}</AppButton>
            <div className="flex flex-wrap gap-2">
              {correctionEligible && (
                <AppButton actionType="secondary" surface="outlined" size="small" previewRestricted onClick={() => setCorrOpen(true)} startIcon={<FileEdit size={16} />}>{t('applyForCorrection')}</AppButton>
              )}
              {cert && (
                <AppButton actionType="secondary" surface="soft" size="small" onClick={() => setCertOpen(true)} startIcon={<Award size={16} />}>{isBn ? 'পেমেন্ট সনদ' : 'Certificate'}</AppButton>
              )}
              <AppButton actionType="secondary" size="small" onClick={() => window.print()} startIcon={<Printer size={16} />}>{t('printChallan')}</AppButton>
              <AppButton actionType="primary" size="small" disabled={!cert} onClick={() => void handleDownloadPdf()} startIcon={<Download size={16} />}>{t('downloadChallan')}</AppButton>
            </div>
          </div>
        }
      >
        <div className="space-y-6">
          {exportError && <div role="alert" className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-700">{exportError}</div>}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs">
            <div><span className="text-slate-500 block">{t('challanNumberLabel')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.challanNumber}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'ব্যাংক রেফারেন্স' : 'Bank Reference'}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.bankRef || (isBn ? 'প্রযোজ্য নয় (শূন্য-কর)' : 'Not Applicable (Zero-Tax)')}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'পরিশোধের তারিখ' : 'Payment Date'}</span><strong className="text-slate-900 dark:text-slate-100 text-sm">{new Date(transaction.createdAt).toLocaleString()}</strong></div>
            <div><span className="text-slate-500 block">{t('taxpayerTin')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.taxpayerTin || 'Walk-In'}</strong></div>
            <div><span className="text-slate-500 block">{t('name')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm">{transaction.taxpayerName}</strong></div>
            <div><span className="text-slate-500 block">{isBn ? 'পেমেন্ট মাধ্যম' : 'Payment Channel'}</span><strong className="text-sm font-semibold text-teal-700 dark:text-teal-400">{transaction.totalAmount === 0 && transaction.category === 'travel_tax' ? (isBn ? 'শূন্য-কর (মাধ্যম অপ্রয়োজনীয়)' : 'Zero-Tax (No Payment)') : transaction.paymentChannel}</strong></div>
            {transaction.giftDate && isValidYmd(transaction.giftDate) && <div data-testid="receipt-gift-date"><span className="text-slate-500 block">{t('giftDate')}</span><strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.giftDate}</strong></div>}
            {transaction.category === 'travel_tax' && transaction.travelDetails && (
              <div data-testid="receipt-travel-summary" className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-500 block">{isBn ? 'ভ্রমণের বিবরণ' : 'Travel Details'}</span>
                <strong className="text-slate-900 dark:text-slate-100 font-mono">{transaction.travelDetails.travelMode ?? 'Land'} · {transaction.travelDetails.departurePort ?? '—'} → {transaction.travelDetails.destination}{transaction.travelDetails.travelDate ? ` (${transaction.travelDetails.travelDate})` : ''}{transaction.travelDetails.passportMasked ? ` · ${transaction.travelDetails.passportMasked}` : ''}</strong>
              </div>
            )}
          </div>
          {transaction.giftDetails ? (
            <div data-testid="receipt-gift-attribution" className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div><span className="font-semibold text-teal-900 dark:text-teal-200 block">{isBn ? 'ক্রেডিট ও পক্ষভুক্তি (দাতা / On Behalf Of)' : 'Credit Attribution & On Behalf Of (Donor)'}</span><span className="text-slate-700 dark:text-slate-300 font-mono">{transaction.giftDetails.onBehalfOfName} ({transaction.giftDetails.onBehalfOfTin})</span></div>
              <div><span className="font-semibold text-teal-900 dark:text-teal-200 block">{isBn ? 'যার মাধ্যমে (গ্রহীতা / Through)' : 'Through (Donee & Relationship)'}</span><span className="text-slate-700 dark:text-slate-300 font-mono">{transaction.giftDetails.throughName} ({transaction.giftDetails.throughTin}) · {transaction.giftDetails.relationshipTag}</span></div>
              <div><span className="font-semibold text-teal-900 dark:text-teal-200 block">{isBn ? 'ঘোষিত দানের মূল্য' : 'Declared Gift Value'}</span><span className="font-mono">৳ {transaction.giftDetails.giftValue.toLocaleString()}</span></div>
              <div><span className="font-semibold text-teal-900 dark:text-teal-200 block">{t('giftDescription')}</span><span>{transaction.giftDetails.description}{transaction.giftDetails.remarks ? ` · ${transaction.giftDetails.remarks}` : ''}</span></div>
            </div>
          ) : transaction.beneficiaryTin ? (
            <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800 text-xs">
              <span className="font-semibold text-teal-900 dark:text-teal-200">{isBn ? 'প্রাপকের পক্ষে দাখিলকৃত: ' : 'Filed On Behalf Of Beneficiary: '}</span>
              <span className="text-slate-700 dark:text-slate-300">{transaction.beneficiaryName} (TIN: {transaction.beneficiaryTin})</span>
            </div>
          ) : null}
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
          {cert && <div className="fixed -left-[9999px] top-0 w-[760px]" aria-hidden="true"><CertificatePaper cert={cert} paperRef={paperRef} /></div>}
        </div>
      </AppDialog>
      <PaymentCertificateDialog open={certOpen} onClose={() => setCertOpen(false)} transaction={transaction} isAuthenticated={isAuthenticated} disablePortal={disablePortal} />
      {correctionEligible && <CorrectionRequestModal open={corrOpen} onClose={() => setCorrOpen(false)} initialTransaction={transaction} disablePortal={disablePortal} />}
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </>
  );
};
