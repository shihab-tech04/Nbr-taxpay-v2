import React from 'react';
import { PaymentTransaction } from '../types/tax';
import { useTranslation } from 'react-i18next';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
} from '@mui/material';
import { CheckCircle, Download, Printer, X, ShieldCheck } from 'lucide-react';
import { AppButton, AppIconButton } from '../design-system/buttons';

interface ReceiptModalProps {
  open: boolean;
  onClose: () => void;
  transaction: PaymentTransaction | null;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ open, onClose, transaction }) => {
  const { t } = useTranslation();

  if (!transaction) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle className="flex items-center justify-between bg-teal-50 dark:bg-teal-950/45 px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 flex items-center justify-center">
            <CheckCircle size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Sample challan — not valid for payment</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ref: {transaction.transactionRef}</p>
          </div>
        </div>
        <AppIconButton aria-label="Close receipt" onClick={onClose} size="small">
          <X size={20} />
        </AppIconButton>
      </DialogTitle>

      <DialogContent className="p-6 space-y-6">
        {/* Header Metadata */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-lg text-xs">
          <div>
            <span className="text-slate-500 block">Challan Number</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.challanNumber}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Bank Reference</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.bankRef}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Payment Date</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm">{new Date(transaction.createdAt).toLocaleString()}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Taxpayer TIN</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm font-mono">{transaction.taxpayerTin}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Taxpayer Name</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm">{transaction.taxpayerName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block">Payment Channel</span>
            <strong className="text-slate-900 dark:text-slate-100 text-sm font-semibold text-teal-700">{transaction.paymentChannel}</strong>
          </div>
        </div>

        {transaction.beneficiaryTin && (
          <div className="p-3 bg-teal-50 dark:bg-teal-950/30 rounded-lg border border-teal-200 dark:border-teal-800 text-xs">
            <span className="font-semibold text-teal-900 dark:text-teal-200">Filed On Behalf Of Beneficiary: </span>
            <span className="text-slate-700 dark:text-slate-300">{transaction.beneficiaryName} (TIN: {transaction.beneficiaryTin})</span>
          </div>
        )}

        {/* Line Items Table */}
        <div>
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-3">Tax Head Allocations</h4>
          <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold">
                <tr>
                  <th className="p-3">Tax Head Code & Name</th>
                  <th className="p-3">Assessment Year</th>
                  <th className="p-3 text-right">Amount (BDT)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {transaction.items.map((item, index) => (
                  <tr key={index} className="text-slate-800 dark:text-slate-200">
                    <td className="p-3">
                      <div className="font-medium">{item.headNameEn}</div>
                      <div className="text-[11px] text-slate-500 font-mono">Code: {item.headCode} {item.remarks ? `· ${item.remarks}` : ''}</div>
                    </td>
                    <td className="p-3 font-mono">{item.assessmentYear}</td>
                    <td className="p-3 text-right font-semibold font-mono">৳ {item.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-slate-50 dark:bg-slate-800 font-bold text-slate-900 dark:text-white">
                <tr>
                  <td colSpan={2} className="p-3 text-right">Total Paid:</td>
                  <td className="p-3 text-right font-mono text-teal-700 dark:text-teal-400 text-sm">৳ {transaction.totalAmount.toLocaleString()}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-emerald-50 dark:bg-emerald-950/30 rounded-lg border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-900 dark:text-emerald-200">
          <ShieldCheck size={20} className="shrink-0 text-emerald-600" />
          <span>Illustrative receipt only. No payment or official challan has been issued.</span>
        </div>
      </DialogContent>

      <DialogActions className="px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 justify-between">
        <AppButton tone="secondary" size="small" onClick={onClose}>
          {t('back')}
        </AppButton>
        <div className="flex gap-2">
          <AppButton tone="secondary" size="small" onClick={handlePrint} startIcon={<Printer size={16} />}>
            {t('printChallan')}
          </AppButton>
          <AppButton tone="primary" size="small" disabled startIcon={<Download size={16} />}>
            {t('downloadChallan')}
          </AppButton>
        </div>
      </DialogActions>
    </Dialog>
  );
};
