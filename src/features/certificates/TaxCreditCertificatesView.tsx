import React, { useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Award, Download, Eye, ShieldCheck } from 'lucide-react';
import type { PaymentTransaction } from '../../types/tax';
import { useApp } from '../../shared/AppContext';
import { exportCertificateElementToPdf } from '../../shared/certificatePdfExport';
import { buildPaymentCertificateRecord, type PaymentCertificateRecord } from '../../shared/certificateUtils';
import { AppButton } from '../../design-system/buttons';
import { AppStateView, AppToast } from '../../design-system/feedback';
import { useAppNavigation } from '../../design-system/navigation';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';
import { CertificatePaper } from '../../components/certificates/CertificatePaper';
import { PaymentCertificateDialog } from '../../components/certificates/PaymentCertificateDialog';

export const TaxCreditCertificatesView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const navigate = useNavigate();
  const { goBack } = useAppNavigation();
  const { transactions, isAuthenticated, activeScope } = useApp();

  const [selectedTx, setSelectedTx] = useState<PaymentTransaction | null>(null);
  const [exportCert, setExportCert] = useState<PaymentCertificateRecord | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const offscreenPaperRef = useRef<HTMLElement>(null);

  const txByCertId = useMemo(
    () => new Map(transactions.map((tx) => [`CERT-${tx.transactionRef}`, tx])),
    [transactions]
  );

  const certificates = useMemo(
    () =>
      transactions
        .map((tx) => buildPaymentCertificateRecord(tx, isAuthenticated))
        .filter((item): item is PaymentCertificateRecord => Boolean(item && item.ownerScope === activeScope)),
    [transactions, isAuthenticated, activeScope]
  );

  const handleRowDownload = (cert: PaymentCertificateRecord) => {
    setExportCert(cert);
    requestAnimationFrame(() => {
      void exportCertificateElementToPdf(cert, offscreenPaperRef.current, 'certificate').then((ok) => {
        if (ok) {
          setToastMsg(isBn ? `${cert.certificateId}.pdf ডাউনলোড হয়েছে` : `Downloaded ${cert.certificateId}.pdf`);
        }
      });
    });
  };

  const columns: AppColumn<PaymentCertificateRecord>[] = [
    {
      key: 'certificateId',
      header: isBn ? 'সনদ ও লেনদেন আইডি' : 'Certificate & Transaction Ref',
      sortable: true,
      accessor: (c) => c.certificateId,
      cell: (c) => (
        <div>
          <div className="font-mono font-bold text-slate-900 dark:text-white">{c.certificateId}</div>
          <div className="text-[11px] font-mono text-slate-500">{c.challanNumber}</div>
        </div>
      ),
    },
    {
      key: 'assessmentYears',
      header: t('assessmentYear'),
      sortable: true,
      accessor: (c) => c.assessmentYears,
      cell: (c) => <span className="font-mono">{c.assessmentYears}</span>,
    },
    {
      key: 'totalAmount',
      header: t('amountBdt'),
      align: 'right',
      sortable: true,
      accessor: (c) => c.totalAmount,
      cell: (c) => <span className="font-mono font-bold text-teal-700 dark:text-teal-400">৳ {c.totalAmount.toLocaleString()}</span>,
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      cell: (c) => (
        <div className="inline-flex items-center gap-2">
          <AppButton actionType="secondary" size="small" startIcon={<Eye size={14} />} onClick={() => setSelectedTx(txByCertId.get(c.certificateId) ?? null)}>
            {isBn ? 'দেখুন' : 'View'}
          </AppButton>
          <AppButton actionType="primary" size="small" startIcon={<Download size={14} />} onClick={() => handleRowDownload(c)}>
            {isBn ? 'পিডিএফ' : 'Download'}
          </AppButton>
        </div>
      ),
    },
  ];

  const { sortState, handleSort, pagination, handlePageChange, handleRowsPerPageChange, pagedData, totalRows } =
    useTableState(certificates, { columns, initialSort: { columnKey: 'certificateId', direction: 'desc' }, initialRowsPerPage: 10 });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <AppButton actionType="secondary" surface="outlined" size="small" startIcon={<ArrowLeft size={16} />} onClick={() => goBack(isAuthenticated ? '/dashboard' : '/')}>
              {t('back')}
            </AppButton>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <Award className="text-teal-700 dark:text-teal-400" size={28} />
                {isBn ? 'কর সনদ ও পেমেন্ট সনদ' : 'Certificates & Payment Receipts'}
              </h1>
              <p className="text-xs text-slate-500">
                {isBn
                  ? 'কর রেয়াত সনদ এবং প্রতিটি সম্পন্ন লেনদেনের সম্মিলিত পেমেন্ট সনদ পৃথকভাবে সংরক্ষিত।'
                  : 'Tax Credit Certificates and Combined Transaction Payment Certificates are kept strictly separate.'}
              </p>
            </div>
          </div>
          {!isAuthenticated && (
            <AppButton actionType="primary" size="small" onClick={() => navigate('/login?returnTo=/certificates')}>
              {t('signIn')}
            </AppButton>
          )}
        </div>

        <section data-testid="tax-credit-certificates-section" className="space-y-3">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="text-teal-700" size={20} />
            {isBn ? 'কর রেয়াত সনদ (Tax Credit Certificates)' : 'Tax Credit Certificates'}
          </h2>
          <AppStateView
            variant="empty"
            className="max-w-none w-full my-0"
            title={isBn ? 'সরকারি কর রেয়াত সনদ এই প্রোটোটাইপে উপলব্ধ নয়' : 'Official Tax Credit Certificates Require Live NBR Verification'}
            description={
              isBn
                ? 'কর রেয়াত সনদ শুধুমাত্র অনুমোদিত SQL/API মূল্যায়ন লেজার যুক্ত হলে তৈরি হবে। প্রতিটি পেমেন্ট সনদ নিচে পৃথকভাবে দেখানো হয়েছে।'
                : 'Tax Credit Certificates depend on verified SQL/API assessment records (F-18, currently deferred) and are never substituted with transaction payment receipts.'
            }
          />
        </section>

        <section data-testid="payment-certificates-section" className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isBn ? 'সম্পন্ন লেনদেনের সম্মিলিত পেমেন্ট সনদ' : 'Transaction Payment Certificates (One Combined Certificate Per Transaction)'}
            </h2>
            <p className="text-xs text-slate-500">
              {isAuthenticated
                ? isBn ? 'সাইন-ইন সেশন মোড: সম্পন্ন লেনদেনের প্রিভিউ সনদ দেখুন, প্রিন্ট বা পিডিএফ ডাউনলোড করুন।' : 'Signed-in session mode: view, print, or download combined sample payment certificates.'
                : isBn ? 'ওয়াক-ইন সেশন মোড: অ্যাকাউন্ট সংযোগ ছাড়াই তাৎক্ষণিক প্রিন্ট বা ডাউনলোড করুন।' : 'Walk-in session mode: download or print combined session certificates without claiming persistent account binding.'}
            </p>
          </div>
          <AppTable
            columns={columns}
            data={pagedData}
            keyExtractor={(c) => c.certificateId}
            sortState={sortState}
            onSort={handleSort}
            pagination={pagination}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalRows={totalRows}
            emptyMessage={isBn ? 'কোনো সম্পন্ন পেমেন্ট সনদ নেই।' : 'No completed transaction certificates found.'}
          />
        </section>
      </div>

      {exportCert && (
        <div className="fixed -left-[9999px] top-0 w-[760px]" aria-hidden="true">
          <CertificatePaper cert={exportCert} paperRef={offscreenPaperRef} />
        </div>
      )}
      <PaymentCertificateDialog open={Boolean(selectedTx)} onClose={() => setSelectedTx(null)} transaction={selectedTx} isAuthenticated={isAuthenticated} />
      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
