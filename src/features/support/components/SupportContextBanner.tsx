import React from 'react';
import { AlertTriangle, BookOpen, ShieldCheck } from 'lucide-react';

interface SupportContextBannerProps {
  contract: string | null;
  queryCategory: string | null;
  isBn: boolean;
}

export const SupportContextBanner: React.FC<SupportContextBannerProps> = ({
  contract,
  queryCategory,
  isBn,
}) => {
  if (contract === 'user_guide') {
    const title =
      queryCategory === 'records'
        ? isBn
          ? 'ব্যবহার নির্দেশিকা · রসিদ ও চালান যাচাইকরণ'
          : 'User Guide · Receipts & Challan Verification'
        : queryCategory === 'security'
          ? isBn
            ? 'ব্যবহার নির্দেশিকা · নিরাপত্তা ও সরকারি পোর্টাল নির্দেশনা'
            : 'User Guide · Security & Official Portal Safeguards'
          : isBn
            ? 'সোহজকর ব্যবহার নির্দেশিকা'
            : 'Sohojkor Citizen User Guide';

    const body =
      queryCategory === 'records'
        ? isBn
          ? 'আপনার পেমেন্টের রসিদ নম্বর, চালান নম্বর বা ব্যাংক রেফারেন্স দিয়ে হোম পেজের রেকর্ড অনুসন্ধান বক্স অথবা পেমেন্ট ইতিহাস থেকে চালান যাচাই করুন।'
          : 'Use your transaction reference, challan number, or bank reference in the Home record lookup or Payment History table to inspect sample receipts.'
        : queryCategory === 'security'
          ? isBn
            ? 'কোনো ব্যক্তিগত তথ্য, পাসওয়ার্ড বা ওটিপি কখনোই তৃতীয় পক্ষের সাথে শেয়ার করবেন না এবং সর্বদা সরকারি .gov.bd ডোমেইন যাচাই করুন।'
            : 'Never share personal credentials or OTPs. Official tax payments are verified only through authenticated NBR citizen channels.'
          : isBn
            ? 'ধাপে ধাপে রিটার্ন সহ কর, অন্যান্য কর, ভ্রমণ কর এবং দানকর পরিশোধ ও চালান সংরক্ষণের নিয়মাবলি নিচে দেখুন।'
            : 'Step-by-step instructions for Income Tax with Return, Advance/Other Tax, Travel Tax, and Gift Tax filings.';

    return (
      <div
        role="region"
        aria-label={isBn ? 'ব্যবহার নির্দেশিকা' : 'User Guide Context'}
        className="p-5 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/30 space-y-2"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-teal-900 dark:text-teal-200">
          {queryCategory === 'security' ? <ShieldCheck size={18} /> : <BookOpen size={18} />}
          <span>{title}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">{body}</p>
      </div>
    );
  }

  if (contract === 'incident') {
    return (
      <div
        role="region"
        aria-label={isBn ? 'সমস্যা রিপোর্ট' : 'Incident Report Context'}
        className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 space-y-2"
      >
        <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
          <AlertTriangle size={18} />
          <span>{isBn ? 'অভিযোগ ও কারিগরি সমস্যা রিপোর্ট' : 'Incident & Payment Issue Reporting'}</span>
        </div>
        <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
          {isBn
            ? 'পেমেন্ট গেটওয়ে ত্রুটি, চালান অমিল বা পোর্টালের যেকোনো সমস্যা সম্পর্কে বিস্তারিত লিখে জমা দিন।'
            : 'Report payment gateway timeouts, challan mismatches, or portal accessibility problems using the ticket form below.'}
        </p>
      </div>
    );
  }

  return null;
};
