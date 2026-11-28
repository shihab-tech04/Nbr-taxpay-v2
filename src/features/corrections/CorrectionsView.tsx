import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Plus } from 'lucide-react';
import { useApp } from '../../shared/AppContext';
import { isRestrictedOperationAllowed } from '../../shared/previewPolicy';
import { AppButton } from '../../design-system/buttons';
import { AppToast } from '../../design-system/feedback';
import { AppTable, useTableState, type AppColumn } from '../../design-system/tables';
import { CorrectionFormDialog } from './components/CorrectionFormDialog';
import type { CorrectionRequest } from '../../types/tax';

export const CorrectionsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const { corrections, addCorrection, transactions } = useApp();
  const [showModal, setShowModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const handleCreateCorrection = (data: { challanNumber: string; reason: string; description: string }) => {
    if (!isRestrictedOperationAllowed('correction_write')) return;
    const tx = transactions.find((tr) => tr.challanNumber === data.challanNumber);
    addCorrection({
      transactionId: tx ? tx.id : 'tx-custom',
      challanNumber: data.challanNumber,
      reason: data.reason,
      description: data.description,
    });
    setToastMsg(isBn ? 'সংশোধনের আবেদন জমা দেওয়া হয়েছে' : 'Correction request submitted');
  };

  const columns: AppColumn<CorrectionRequest>[] = [
    {
      key: 'challanNumber',
      header: isBn ? 'চালান নম্বর ও কারণ' : 'Challan Number & Reason',
      sortable: true,
      accessor: (c) => c.challanNumber,
      cell: (c) => (
        <div>
          <div className="font-bold font-mono text-slate-900 dark:text-white">{c.challanNumber}</div>
          <div className="text-[11px] text-teal-700 dark:text-teal-400">{c.reason}</div>
        </div>
      ),
    },
    {
      key: 'description',
      header: isBn ? 'বিবরণ' : 'Description',
      cell: (c) => <span className="text-slate-600 dark:text-slate-300">{c.description}</span>,
    },
    {
      key: 'createdAt',
      header: isBn ? 'তারিখ' : 'Date',
      sortable: true,
      accessor: (c) => c.createdAt,
      cell: (c) => <span className="font-mono">{c.createdAt}</span>,
    },
    {
      key: 'status',
      header: t('status'),
      sortable: true,
      accessor: (c) => c.status,
      cell: (c) => (
        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
          {c.status}
        </span>
      ),
    },
  ];

  const {
    sortState,
    handleSort,
    pagination,
    handlePageChange,
    handleRowsPerPageChange,
    pagedData,
    totalRows,
  } = useTableState(corrections, {
    columns,
    initialSort: { columnKey: 'createdAt', direction: 'desc' },
    initialRowsPerPage: 5,
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-teal-700" size={28} /> {t('corrections')}
            </h1>
            <p className="text-xs text-slate-500">
              {isBn
                ? 'চালান সংশোধনের আবেদন করুন এবং প্রশাসনিক পর্যালোচনার অবস্থা দেখুন।'
                : 'Apply for challan corrections and track NBR administrative review status.'}
            </p>
          </div>
          <AppButton
            actionType="primary"
            size="small"
            previewRestricted
            startIcon={<Plus size={16} />}
            onClick={() => setShowModal(true)}
            sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
          >
            {t('submitCorrection')}
          </AppButton>
        </div>

        <CorrectionFormDialog
          open={showModal}
          onClose={() => setShowModal(false)}
          onSubmit={handleCreateCorrection}
        />

        <AppTable
          columns={columns}
          data={pagedData}
          keyExtractor={(c) => c.id}
          sortState={sortState}
          onSort={handleSort}
          pagination={pagination}
          onPageChange={handlePageChange}
          onRowsPerPageChange={handleRowsPerPageChange}
          totalRows={totalRows}
          emptyMessage={isBn ? 'কোনো সংশোধন আবেদন পাওয়া যায়নি।' : 'No correction applications found.'}
        />
      </div>

      <AppToast open={Boolean(toastMsg)} onClose={() => setToastMsg(null)} message={toastMsg} severity="success" />
    </div>
  );
};
