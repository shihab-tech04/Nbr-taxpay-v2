import React from 'react';
import { useTranslation } from 'react-i18next';
import { Award, CheckCircle, FileText, LogIn, ArrowRight } from 'lucide-react';
import { AppButton } from '../../../design-system/buttons';
import { PaymentSuccessCard } from '../../../components/payments/PaymentSuccessCard';
import type { PaymentTransaction } from '../../../types/tax';

interface AllTaxResultStepProps {
  transaction: PaymentTransaction;
  isAuthenticated: boolean;
  onViewReceipt: () => void;
  onViewCertificate: () => void;
  onSignInToClaim: () => void;
  onContinueWalkIn: () => void;
  onReturnDashboard: () => void;
}

export const AllTaxResultStep: React.FC<AllTaxResultStepProps> = ({
  transaction,
  isAuthenticated,
  onViewReceipt,
  onViewCertificate,
  onSignInToClaim,
  onContinueWalkIn,
  onReturnDashboard,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n.language === 'bn';

  const detailsBox = (
    <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl max-w-md mx-auto text-left space-y-2 text-xs font-mono">
      <div className="flex justify-between">
        <span className="text-slate-500">Transaction Ref:</span>
        <strong>{transaction.transactionRef}</strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Challan Number:</span>
        <strong>{transaction.challanNumber}</strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Bank Ref:</span>
        <strong>{transaction.bankRef}</strong>
      </div>
      <div className="flex justify-between">
        <span className="text-slate-500">Sample Total:</span>
        <strong className="text-teal-700">৳ {transaction.totalAmount.toLocaleString()}</strong>
      </div>
    </div>
  );

  if (isAuthenticated) {
    return (
      <PaymentSuccessCard
        title={t('paymentSuccess')}
        subtitle={
          isBn
            ? 'কেবল প্রোটোটাইপ প্রদর্শনী রেকর্ড — কোনো আসল টাকা বা সরকারি এনবিআর লেনদেন সম্পন্ন হয়নি।'
            : 'Illustrative prototype record only — no real payment or official NBR gateway verification occurred.'
        }
        details={detailsBox}
        onViewReceipt={onViewReceipt}
        onViewCertificate={onViewCertificate}
        onReturnDashboard={onReturnDashboard}
      />
    );
  }

  return (
    <div
      data-testid="walkin-payment-result"
      className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-8 text-center space-y-6"
    >
      <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
        <CheckCircle size={36} />
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">{t('paymentSuccess')}</h2>
        <p className="text-xs text-slate-500 max-w-lg mx-auto">
          {isBn
            ? 'ওয়াক-ইন প্রিভিউ সম্পন্ন হয়েছে। স্বয়ংক্রিয়ভাবে কোনো অ্যাকাউন্টে যুক্ত হয়নি — আপনি চালান প্রিন্ট/ডাউনলোড করতে পারেন অথবা সাইন ইন করে দাবি (Claim) করতে পারেন।'
            : 'Walk-in preview recorded without automatic account claim. Download/print your challan or sign in explicitly to claim this record.'}
        </p>
      </div>

      {detailsBox}

      <div className="flex flex-wrap justify-center gap-3 pt-2">
        <AppButton actionType="primary" startIcon={<FileText size={15} />} onClick={onViewReceipt}>
          {isBn ? 'চালান বিবরণ ও ডাউনলোড' : 'Challan Details & Print'}
        </AppButton>
        <AppButton actionType="secondary" surface="soft" startIcon={<Award size={15} />} onClick={onViewCertificate}>
          {isBn ? 'পেমেন্ট সনদ দেখুন' : 'View Payment Certificate'}
        </AppButton>
        <AppButton actionType="secondary" surface="outlined" startIcon={<LogIn size={15} />} onClick={onSignInToClaim}>
          {isBn ? 'অ্যাকাউন্টে যুক্ত করতে সাইন ইন করুন' : 'Sign in to Claim Payment'}
        </AppButton>
        <AppButton actionType="secondary" surface="ghost" endIcon={<ArrowRight size={15} />} onClick={onContinueWalkIn}>
          {isBn ? 'সাইন-ইন ছাড়া চালিয়ে যান' : 'Continue without signing in'}
        </AppButton>
      </div>
    </div>
  );
};
