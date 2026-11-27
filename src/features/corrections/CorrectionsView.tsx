import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../shared/AppContext';
import { FileText, Plus } from 'lucide-react';
import { AppTextField, AppSelectField, AppTextArea } from '../../design-system/forms';

export const CorrectionsView: React.FC = () => {
  const { t } = useTranslation();
  const { corrections, addCorrection, transactions } = useApp();

  const [challanNumber, setChallanNumber] = useState('');
  const [reason, setReason] = useState('Incorrect Assessment Year');
  const [description, setDescription] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!challanNumber || !description) {
      alert('Please fill in challan number and description.');
      return;
    }
    const tx = transactions.find(t => t.challanNumber === challanNumber);
    addCorrection({
      transactionId: tx ? tx.id : 'tx-custom',
      challanNumber,
      reason,
      description
    });
    setChallanNumber('');
    setDescription('');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <FileText className="text-teal-700" size={28} /> {t('corrections')}
            </h1>
            <p className="text-xs text-slate-500">Apply for challan corrections and track NBR administrative review status.</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> {t('submitCorrection')}
          </button>
        </div>

        {showModal && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold">New Challan Correction Application</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <AppTextField
                  label="Challan Number"
                  value={challanNumber}
                  onChange={e => setChallanNumber(e.target.value)}
                  placeholder="e.g., NBR-CHL-2026-881920"
                  required
                  slotProps={{
                    htmlInput: {
                      className: 'font-mono'
                    }
                  }}
                />
              </div>
              <div>
                <AppSelectField
                  label="Reason for Correction"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  options={[
                    { value: 'Incorrect Assessment Year', label: 'Incorrect Assessment Year' },
                    { value: 'Typo in Taxpayer TIN', label: 'Typo in Taxpayer TIN' },
                    { value: 'Incorrect Tax Head Allocation', label: 'Incorrect Tax Head Allocation' },
                    { value: 'Amount Adjustment', label: 'Amount Adjustment' }
                  ]}
                />
              </div>
            </div>
            <div>
              <AppTextArea
                label="Detailed Explanation"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={3}
                placeholder="Explain the required correction..."
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg text-xs font-semibold"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-700 text-white rounded-lg text-xs font-semibold"
              >
                {t('save')}
              </button>
            </div>
          </form>
        )}

        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
              <tr>
                <th className="p-4">Challan Number & Reason</th>
                <th className="p-4">Description</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {corrections.map(c => (
                <tr key={c.id}>
                  <td className="p-4">
                    <div className="font-bold font-mono text-slate-900 dark:text-white">{c.challanNumber}</div>
                    <div className="text-[11px] text-teal-700">{c.reason}</div>
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300">{c.description}</td>
                  <td className="p-4 font-mono">{c.createdAt}</td>
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-medium">
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
