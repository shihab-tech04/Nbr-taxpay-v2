import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import { AppTable, useTableState, type AppColumn } from '../../../design-system/tables';
import type { Beneficiary } from '../../../types/tax';

interface BeneficiariesTableProps {
  beneficiaries: readonly Beneficiary[];
  onRequestDelete: (beneficiary: Beneficiary) => void;
}

const RELATIONSHIP_I18N: Record<Beneficiary['relationship'], string> = {
  Father: 'father',
  Mother: 'mother',
  Siblings: 'siblings',
  Son: 'son',
  Daughter: 'daughter',
  Spouse: 'spouse',
  Friends: 'friends',
  Clients: 'clients',
  Others: 'others',
};

export const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({
  beneficiaries,
  onRequestDelete,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  const columns: AppColumn<Beneficiary>[] = [
    {
      key: 'name',
      header: isBn ? 'নাম ও টিআইএন' : 'Name & TIN',
      sortable: true,
      accessor: (b) => b.name,
      cell: (b) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{b.name}</div>
          <div className="text-[11px] text-teal-700 dark:text-teal-400 font-mono">TIN: {b.tin}</div>
        </div>
      ),
    },
    {
      key: 'relationship',
      header: t('relationship'),
      sortable: true,
      accessor: (b) => b.relationship,
      cell: (b) => (
        <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-medium">
          {t(RELATIONSHIP_I18N[b.relationship] ?? 'others')}
        </span>
      ),
    },
    {
      key: 'phone',
      header: t('phone'),
      sortable: true,
      accessor: (b) => b.phone,
      cell: (b) => <span className="font-mono">{b.phone}</span>,
    },
    {
      key: 'createdAt',
      header: isBn ? 'সংযোজনের তারিখ' : 'Added Date',
      sortable: true,
      accessor: (b) => b.createdAt,
      cell: (b) => <span className="font-mono">{b.createdAt}</span>,
    },
    {
      key: 'actions',
      header: t('actions'),
      align: 'right',
      cell: (b) => (
        <AppIconButton
          intent="destructive"
          size="small"
          previewRestricted
          aria-label={isBn ? `${b.name} মুছুন` : `Delete ${b.name}`}
          title={t('delete')}
          onClick={() => onRequestDelete(b)}
        >
          <Trash2 size={16} />
        </AppIconButton>
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
  } = useTableState(beneficiaries, {
    columns,
    initialSort: { columnKey: 'name', direction: 'asc' },
    initialRowsPerPage: 5,
  });

  return (
    <AppTable
      columns={columns}
      data={pagedData}
      keyExtractor={(b) => b.id}
      sortState={sortState}
      onSort={handleSort}
      pagination={pagination}
      onPageChange={handlePageChange}
      onRowsPerPageChange={handleRowsPerPageChange}
      totalRows={totalRows}
      emptyMessage={isBn ? 'কোনো বেনিফিশিয়ারি পাওয়া যায়নি।' : 'No beneficiaries found.'}
    />
  );
};
