import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import { AppTable, type AppColumn } from '../../../design-system/tables';
import type { PaymentLineItem } from '../../../types/tax';

interface AllTaxItemsTableProps {
  items: readonly PaymentLineItem[];
  totalAmount: number;
  onRemoveItem: (index: number) => void;
}

export const AllTaxItemsTable: React.FC<AllTaxItemsTableProps> = ({
  items,
  totalAmount,
  onRemoveItem,
}) => {
  const { t } = useTranslation();

  if (items.length === 0) return null;

  const columns: AppColumn<PaymentLineItem>[] = [
    {
      key: 'headNameEn',
      header: 'Tax Head',
      sortable: true,
      cell: (item) => (
        <div>
          <div className="font-medium">{item.headNameEn}</div>
          <div className="text-[11px] text-slate-500 font-mono">Code: {item.headCode}</div>
        </div>
      ),
    },
    {
      key: 'assessmentYear',
      header: 'AY',
      sortable: true,
      cell: (item) => <span className="font-mono">{item.assessmentYear}</span>,
    },
    {
      key: 'amount',
      header: 'Amount',
      align: 'right',
      sortable: true,
      cell: (item) => <span className="font-mono font-semibold">৳ {item.amount.toLocaleString()}</span>,
    },
    {
      key: 'action',
      header: 'Action',
      align: 'center',
      cell: (_, idx) => (
        <AppIconButton
          intent="destructive"
          size="small"
          previewRestricted
          aria-label={`Remove item`}
          onClick={() => onRemoveItem(idx)}
        >
          <Trash2 size={16} />
        </AppIconButton>
      ),
    },
  ];

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          Configured Line Items ({items.length})
        </h4>
        <span className="text-xs font-bold text-teal-700 dark:text-teal-400 font-mono">
          {t('totalPayable')}: ৳ {totalAmount.toLocaleString()}
        </span>
      </div>
      <AppTable
        columns={columns}
        data={items}
        keyExtractor={(item, idx) => `${item.headId}-${idx}`}
      />
    </div>
  );
};
