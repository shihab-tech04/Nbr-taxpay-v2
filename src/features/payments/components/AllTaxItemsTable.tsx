import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import { AppTable, useTableState, type AppColumn } from '../../../design-system/tables';
import type { PaymentLineItem } from '../../../types/tax';

interface IndexedLineItem {
  item: PaymentLineItem;
  originalIndex: number;
}

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
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  const indexedItems: IndexedLineItem[] = items.map((item, originalIndex) => ({
    item,
    originalIndex,
  }));

  const columns: AppColumn<IndexedLineItem>[] = [
    {
      key: 'headNameEn',
      header: t('taxHead'),
      sortable: true,
      accessor: (row) => (isBn ? row.item.headNameBn : row.item.headNameEn),
      cell: ({ item }) => (
        <div>
          <div className="font-medium">{isBn ? item.headNameBn : item.headNameEn}</div>
          <div className="text-[11px] text-slate-500 font-mono">
            {isBn ? 'কোড' : 'Code'}: {item.headCode}
          </div>
        </div>
      ),
    },
    {
      key: 'assessmentYear',
      header: isBn ? 'কর বর্ষ' : 'AY',
      sortable: true,
      accessor: (row) => row.item.assessmentYear,
      cell: ({ item }) => <span className="font-mono">{item.assessmentYear}</span>,
    },
    {
      key: 'amount',
      header: t('amountBdt'),
      align: 'right',
      sortable: true,
      accessor: (row) => row.item.amount,
      cell: ({ item }) => (
        <span className="font-mono font-semibold">৳ {item.amount.toLocaleString()}</span>
      ),
    },
    {
      key: 'action',
      header: t('actions'),
      align: 'center',
      cell: ({ item, originalIndex }) => (
        <AppIconButton
          intent="destructive"
          size="small"
          previewRestricted
          aria-label={
            isBn
              ? `${item.headNameBn} মুছুন`
              : `Remove ${item.headNameEn}`
          }
          onClick={() => onRemoveItem(originalIndex)}
        >
          <Trash2 size={16} />
        </AppIconButton>
      ),
    },
  ];

  const { sortState, handleSort, sortedData } = useTableState(indexedItems, {
    columns,
    initialSort: { columnKey: 'headNameEn', direction: 'asc' },
  });

  if (items.length === 0) return null;

  return (
    <div className="space-y-3 pt-4">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {isBn
            ? `নির্বাচিত কর খাতসমূহ (${items.length})`
            : `Configured Line Items (${items.length})`}
        </h4>
        <span className="text-xs font-bold text-teal-700 dark:text-teal-400 font-mono">
          {t('totalPayable')}: ৳ {totalAmount.toLocaleString()}
        </span>
      </div>
      <AppTable
        columns={columns}
        data={sortedData}
        keyExtractor={(row) => `${row.item.headId}-${row.originalIndex}`}
        sortState={sortState}
        onSort={handleSort}
      />
    </div>
  );
};
