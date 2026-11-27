import React from 'react';
import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
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

  return (
    <div className="space-y-3 pt-4">
      <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        Configured Line Items ({items.length})
      </h4>
      <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            <tr>
              <th className="p-3">Tax Head</th>
              <th className="p-3">AY</th>
              <th className="p-3 text-right">Amount</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {items.map((item, idx) => (
              <tr key={`${item.headId}-${idx}`}>
                <td className="p-3">
                  <div className="font-medium">{item.headNameEn}</div>
                  <div className="text-[11px] text-slate-500 font-mono">Code: {item.headCode}</div>
                </td>
                <td className="p-3 font-mono">{item.assessmentYear}</td>
                <td className="p-3 text-right font-mono font-semibold">
                  ৳ {item.amount.toLocaleString()}
                </td>
                <td className="p-3 text-center">
                  <AppIconButton
                    intent="destructive"
                    size="small"
                    previewRestricted
                    aria-label={`Remove ${item.headNameEn}`}
                    onClick={() => onRemoveItem(idx)}
                  >
                    <Trash2 size={16} />
                  </AppIconButton>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold">
            <tr>
              <td colSpan={2} className="p-3 text-right">
                {t('totalPayable')}:
              </td>
              <td className="p-3 text-right font-mono text-teal-700 text-sm">
                ৳ {totalAmount.toLocaleString()}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
};
