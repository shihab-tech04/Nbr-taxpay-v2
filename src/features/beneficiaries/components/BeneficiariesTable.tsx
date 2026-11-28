import React from 'react';
import { Trash2 } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import { AppTable, type AppColumn } from '../../../design-system/tables';
import type { Beneficiary } from '../../../types/tax';

interface BeneficiariesTableProps {
  beneficiaries: readonly Beneficiary[];
  onDelete: (id: string) => void;
}

export const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({
  beneficiaries,
  onDelete,
}) => {
  const columns: AppColumn<Beneficiary>[] = [
    {
      key: 'name',
      header: 'Name & TIN',
      sortable: true,
      cell: (b) => (
        <div>
          <div className="font-bold text-slate-900 dark:text-white">{b.name}</div>
          <div className="text-[11px] text-teal-700 font-mono">TIN: {b.tin}</div>
        </div>
      ),
    },
    {
      key: 'relationship',
      header: 'Relationship',
      sortable: true,
      cell: (b) => (
        <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-medium">
          {b.relationship}
        </span>
      ),
    },
    {
      key: 'phone',
      header: 'Phone Number',
      sortable: true,
      cell: (b) => <span className="font-mono">{b.phone}</span>,
    },
    {
      key: 'createdAt',
      header: 'Added Date',
      sortable: true,
      cell: (b) => <span className="font-mono">{b.createdAt}</span>,
    },
    {
      key: 'actions',
      header: 'Actions',
      align: 'right',
      cell: (b) => (
        <AppIconButton
          intent="destructive"
          size="small"
          previewRestricted
          aria-label={`Delete ${b.name}`}
          title="Delete"
          onClick={() => onDelete(b.id)}
        >
          <Trash2 size={16} />
        </AppIconButton>
      ),
    },
  ];

  return (
    <AppTable
      columns={columns}
      data={beneficiaries}
      keyExtractor={(b) => b.id}
      emptyMessage="No beneficiaries found."
    />
  );
};
