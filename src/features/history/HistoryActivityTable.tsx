import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, Eye, FileEdit, RotateCcw } from 'lucide-react';
import { isTransactionCorrectionEligible } from '../../shared/correctionLogic';
import type { PaymentTransaction } from '../../types/tax';
import { AppButton } from '../../design-system/buttons';
import { AppTable, type AppColumn, type TablePaginationState, type TableSortState } from '../../design-system/tables';
import { formatTxAySummary, formatTxBeneficiarySummary, formatTxHeadSummary } from './historyLogic';

interface HistoryActivityTableProps {
  columns: AppColumn<PaymentTransaction>[];
  pagedData: PaymentTransaction[];
  sortState: TableSortState | null;
  onSort: (columnKey: string) => void;
  pagination: TablePaginationState;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  totalRows: number;
  activeScope: string;
  isAuthenticated: boolean;
  onViewReceipt: (tx: PaymentTransaction) => void;
  onViewCertificate: (tx: PaymentTransaction) => void;
  onPayAgain: (tx: PaymentTransaction) => void;
  onApplyCorrection: (tx: PaymentTransaction) => void;
}

export const HistoryActivityTable: React.FC<HistoryActivityTableProps> = ({
  columns, pagedData, sortState, onSort, pagination, onPageChange, onRowsPerPageChange, totalRows,
  activeScope, isAuthenticated, onViewReceipt, onViewCertificate, onPayAgain, onApplyCorrection,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  return (
    <>
      <div className="hidden md:block">
        <AppTable
          columns={columns}
          data={pagedData}
          keyExtractor={(tx) => tx.id}
          sortState={sortState}
          onSort={onSort}
          pagination={pagination}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          totalRows={totalRows}
          emptyMessage={isBn ? 'কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।' : 'No payment records found.'}
        />
      </div>

      <div className="md:hidden space-y-3" data-testid="history-mobile-cards">
        {pagedData.length === 0 ? (
          <div className="p-6 text-center text-xs text-slate-500 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
            {isBn ? 'কোনো পেমেন্ট রেকর্ড পাওয়া যায়নি।' : 'No payment records found.'}
          </div>
        ) : (
          pagedData.map((tx) => (
            <div key={tx.id} className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2.5 text-xs">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold font-mono text-slate-900 dark:text-white break-all">{tx.transactionRef}</div>
                  <div className="text-[11px] text-slate-500 font-mono break-all">{tx.challanNumber}</div>
                </div>
                <strong className="font-mono text-sm text-teal-700 dark:text-teal-400 shrink-0">৳ {tx.totalAmount.toLocaleString()}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-slate-100 dark:border-slate-800">
                <div><span className="text-slate-500 block">{isBn ? 'করদাতা' : 'Payer'}</span><span className="font-medium">{tx.taxpayerName}</span></div>
                <div><span className="text-slate-500 block">{isBn ? 'প্রাপক' : 'Beneficiary'}</span><span>{formatTxBeneficiarySummary(tx, isBn)}</span></div>
                <div><span className="text-slate-500 block">{isBn ? 'কর খাত' : 'Tax Head'}</span><span>{formatTxHeadSummary(tx, isBn)}</span></div>
                <div><span className="text-slate-500 block">{t('assessmentYear')}</span><span className="font-mono">{formatTxAySummary(tx)} · {tx.status}</span></div>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-1">
                <AppButton actionType="secondary" size="small" startIcon={<Eye size={13} />} onClick={() => onViewReceipt(tx)}>{isBn ? 'রসিদ' : 'Receipt'}</AppButton>
                {tx.status === 'Completed' && <AppButton actionType="secondary" surface="soft" size="small" startIcon={<Award size={13} />} onClick={() => onViewCertificate(tx)}>{isBn ? 'সনদ' : 'Certificate'}</AppButton>}
                <AppButton actionType="secondary" surface="soft" size="small" startIcon={<RotateCcw size={13} />} onClick={() => onPayAgain(tx)}>{t('payAgain')}</AppButton>
                {isTransactionCorrectionEligible(tx, activeScope, isAuthenticated) && (
                  <AppButton actionType="secondary" surface="outlined" size="small" previewRestricted startIcon={<FileEdit size={13} />} onClick={() => onApplyCorrection(tx)}>{t('applyForCorrection')}</AppButton>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
};
