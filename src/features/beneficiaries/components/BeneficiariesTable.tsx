import React from 'react';
import { Trash2 } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import type { Beneficiary } from '../../../types/tax';

interface BeneficiariesTableProps {
  beneficiaries: readonly Beneficiary[];
  onDelete: (id: string) => void;
}

export const BeneficiariesTable: React.FC<BeneficiariesTableProps> = ({
  beneficiaries,
  onDelete,
}) => (
  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
    <table className="w-full text-left text-xs">
      <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
        <tr>
          <th className="p-4">Name & TIN</th>
          <th className="p-4">Relationship</th>
          <th className="p-4">Phone Number</th>
          <th className="p-4">Added Date</th>
          <th className="p-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
        {beneficiaries.map((b) => (
          <tr key={b.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
            <td className="p-4">
              <div className="font-bold text-slate-900 dark:text-white">{b.name}</div>
              <div className="text-[11px] text-teal-700 font-mono">TIN: {b.tin}</div>
            </td>
            <td className="p-4">
              <span className="px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950 text-teal-800 dark:text-teal-200 border border-teal-200 dark:border-teal-800 font-medium">
                {b.relationship}
              </span>
            </td>
            <td className="p-4 font-mono">{b.phone}</td>
            <td className="p-4 font-mono">{b.createdAt}</td>
            <td className="p-4 text-right">
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
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
