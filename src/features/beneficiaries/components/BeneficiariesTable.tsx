import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, History, Pencil, Trash2 } from 'lucide-react';
import { AppButton, AppIconButton } from '../../../design-system/buttons';
import { AppCheckbox } from '../../../design-system/selection';
import { AppTable, useTableState, type AppColumn } from '../../../design-system/tables';
import type { Beneficiary, BeneficiaryList } from '../../../types/tax';
import { formatBeneficiaryDisplayName, formatBeneficiaryDisplayTag } from '../beneficiaryLogic';

interface BeneficiariesTableProps {
  beneficiaries: readonly Beneficiary[];
  lists: readonly BeneficiaryList[];
  selectedIds: readonly string[];
  onToggleSelect: (id: string, checked: boolean) => void;
  onToggleSelectAll: (ids: string[], checked: boolean) => void;
  onMakePayment: (beneficiary: Beneficiary) => void;
  onViewTimeline: (beneficiary: Beneficiary) => void;
  onRequestEdit: (beneficiary: Beneficiary) => void;
  onRequestDelete: (beneficiary: Beneficiary) => void;
}

export const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({
  beneficiaries, lists, selectedIds, onToggleSelect, onToggleSelectAll,
  onMakePayment, onViewTimeline, onRequestEdit, onRequestDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const listNameById = new Map(lists.map((l) => [l.id, l.name]));
  const selectedSet = new Set(selectedIds);

  const baseColumns: AppColumn<Beneficiary>[] = [
    {
      key: 'name',
      header: isBn ? 'নাম ও টিআইএন' : 'Name & TIN',
      sortable: true,
      accessor: (b) => b.name || formatBeneficiaryDisplayTag(b, t),
      cell: (b) => {
        const finalTag = formatBeneficiaryDisplayTag(b, t);
        const title = b.name.trim() ? `${b.name.trim()} · ${finalTag}` : finalTag;
        return (
          <div>
            <div className="font-bold text-slate-900 dark:text-white">{title}</div>
            <div className="text-[11px] text-teal-700 dark:text-teal-400 font-mono">TIN: {b.tin}</div>
          </div>
        );
      },
    },
    {
      key: 'listId',
      header: isBn ? 'তালিকা' : 'List',
      sortable: true,
      accessor: (b) => (b.listId ? listNameById.get(b.listId) ?? '' : ''),
      cell: (b) => (
        <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-xs font-medium">
          {(b.listId && listNameById.get(b.listId)) || (isBn ? 'অনির্ধারিত' : 'Unassigned')}
        </span>
      ),
    },
    {
      key: 'phone',
      header: t('phone'),
      sortable: true,
      accessor: (b) => b.phone ?? '',
      cell: (b) => <span className="font-mono">{b.phone?.trim() || '—'}</span>,
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      cell: (b) => {
        const displayName = formatBeneficiaryDisplayName(b, t);
        return (
          <div className="inline-flex items-center justify-end gap-1.5">
            <AppButton actionType="primary" size="small" endIcon={<ArrowRight size={13} />} onClick={() => onMakePayment(b)}>
              {isBn ? 'কর দিন' : 'Make Payment'}
            </AppButton>
            <AppIconButton size="small" aria-label={`Timeline ${displayName}`} title={isBn ? 'পেমেন্ট সময়রেখা' : 'Payment Timeline'} onClick={() => onViewTimeline(b)}>
              <History size={15} />
            </AppIconButton>
            <AppIconButton size="small" previewRestricted aria-label={`Edit ${displayName}`} title={t('edit')} onClick={() => onRequestEdit(b)}>
              <Pencil size={15} />
            </AppIconButton>
            <AppIconButton intent="destructive" size="small" previewRestricted aria-label={isBn ? `${displayName} মুছুন` : `Delete ${displayName}`} title={t('delete')} onClick={() => onRequestDelete(b)}>
              <Trash2 size={15} />
            </AppIconButton>
          </div>
        );
      },
    },
  ];

  const { sortState, handleSort, pagination, handlePageChange, handleRowsPerPageChange, pagedData, totalRows } =
    useTableState(beneficiaries, { columns: baseColumns, initialSort: { columnKey: 'name', direction: 'asc' }, initialRowsPerPage: 5 });

  const pagedIds = pagedData.map((b) => b.id);
  const allVisibleSelected = pagedIds.length > 0 && pagedIds.every((id) => selectedSet.has(id));
  const someVisibleSelected = !allVisibleSelected && pagedIds.some((id) => selectedSet.has(id));

  const columns: AppColumn<Beneficiary>[] = [
    {
      key: 'select',
      header: (
        <AppCheckbox
          label={<span className="sr-only">{t('selectAllVisible')}</span>}
          checked={allVisibleSelected}
          indeterminate={someVisibleSelected}
          previewRestricted
          className="[&_.MuiFormControlLabel-root]:!mr-0"
          onChange={(e) => onToggleSelectAll(pagedIds, e.target.checked)}
        />
      ),
      cell: (b) => (
        <AppCheckbox
          label={<span className="sr-only">{`Select ${formatBeneficiaryDisplayName(b, t)}`}</span>}
          checked={selectedSet.has(b.id)}
          previewRestricted
          className="[&_.MuiFormControlLabel-root]:!mr-0"
          onChange={(e) => onToggleSelect(b.id, e.target.checked)}
        />
      ),
    },
    ...baseColumns,
  ];

  return (
    <div className="space-y-4">
      <div className="hidden sm:block">
        <AppTable columns={columns} data={pagedData} keyExtractor={(b) => b.id} sortState={sortState} onSort={handleSort} pagination={pagination} onPageChange={handlePageChange} onRowsPerPageChange={handleRowsPerPageChange} totalRows={totalRows} emptyMessage={isBn ? 'কোনো বেনিফিশিয়ারি পাওয়া যায়নি।' : 'No beneficiaries found.'} />
      </div>
      <div className="sm:hidden space-y-3">
        {pagedData.map((b) => {
          const displayName = formatBeneficiaryDisplayName(b, t);
          return (
            <div key={b.id} className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between items-start gap-2">
                <div className="flex items-start gap-2">
                  <AppCheckbox label={<span className="sr-only">{`Select ${displayName}`}</span>} checked={selectedSet.has(b.id)} previewRestricted className="[&_.MuiFormControlLabel-root]:!mr-0" onChange={(e) => onToggleSelect(b.id, e.target.checked)} />
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white">{b.name.trim() ? `${b.name.trim()} · ${formatBeneficiaryDisplayTag(b, t)}` : formatBeneficiaryDisplayTag(b, t)}</div>
                    <div className="font-mono text-teal-700 dark:text-teal-400">TIN: {b.tin}</div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">{(b.listId && listNameById.get(b.listId)) || '—'}</span>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <AppButton actionType="primary" size="small" onClick={() => onMakePayment(b)}>{isBn ? 'কর দিন' : 'Make Payment'}</AppButton>
                <AppButton actionType="secondary" size="small" onClick={() => onViewTimeline(b)}>{isBn ? 'সময়রেখা' : 'Timeline'}</AppButton>
                <AppButton actionType="secondary" size="small" previewRestricted onClick={() => onRequestEdit(b)}>{t('edit')}</AppButton>
                <AppButton actionType="secondary" intent="destructive" size="small" previewRestricted onClick={() => onRequestDelete(b)}>{t('delete')}</AppButton>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
