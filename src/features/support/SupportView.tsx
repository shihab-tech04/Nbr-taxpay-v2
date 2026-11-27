import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../../shared/AppContext';
import { HelpCircle, PhoneCall, Plus, BookOpen, AlertTriangle, ShieldCheck } from 'lucide-react';
import { AppTextField, AppSelectField, AppTextArea } from '../../design-system/forms';
import { AppButton } from '../../design-system/buttons';
import { SupportTicket } from '../../types/tax';

type SupportCategory = SupportTicket['category'];

export const SupportView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [searchParams] = useSearchParams();
  const { addSupportTicket } = useApp();

  const contract = searchParams.get('contract');
  const queryCategory = searchParams.get('category');
  const isBn = i18n.language === 'bn';

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportCategory>(
    contract === 'incident' ? 'Technical' : 'Payment Issue'
  );
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(() => contract === 'incident');
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: { subject?: string; message?: string } = {};
    if (!subject.trim()) {
      nextErrors.subject = t('requiredSubjectError');
    }
    if (!message.trim()) {
      nextErrors.message = t('requiredMessageError');
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    addSupportTicket({ subject: subject.trim(), category, message: message.trim() });
    setSubject('');
    setMessage('');
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-6 lg:px-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <HelpCircle className="text-teal-700" size={28} /> {t('support')}
            </h1>
            <p className="text-xs text-slate-500">Get assistance, view FAQs, and contact NBR helpline support.</p>
          </div>
          <AppButton
            tone="primary"
            size="small"
            previewRestricted
            startIcon={<Plus size={16} />}
            onClick={() => setShowModal(true)}
            sx={{ borderRadius: '12px', px: 2, py: 1.25 }}
          >
            {contract === 'incident'
              ? isBn
                ? 'সমস্যা রিপোর্ট করুন'
                : 'Report an Issue'
              : 'Open Support Ticket'}
          </AppButton>
        </div>

        {contract === 'user_guide' && (
          <div
            role="region"
            aria-label={isBn ? 'ব্যবহার নির্দেশিকা' : 'User Guide Context'}
            className="p-5 rounded-2xl border border-teal-200 dark:border-teal-800 bg-teal-50/70 dark:bg-teal-950/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-teal-900 dark:text-teal-200">
              {queryCategory === 'security' ? <ShieldCheck size={18} /> : <BookOpen size={18} />}
              <span>
                {queryCategory === 'records'
                  ? isBn
                    ? 'ব্যবহার নির্দেশিকা · রসিদ ও চালান যাচাইকরণ'
                    : 'User Guide · Receipts & Challan Verification'
                  : queryCategory === 'security'
                    ? isBn
                      ? 'ব্যবহার নির্দেশিকা · নিরাপত্তা ও সরকারি পোর্টাল নির্দেশনা'
                      : 'User Guide · Security & Official Portal Safeguards'
                    : isBn
                      ? 'সোহজকর ব্যবহার নির্দেশিকা'
                      : 'Sohojkor Citizen User Guide'}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {queryCategory === 'records'
                ? isBn
                  ? 'আপনার পেমেন্টের রসিদ নম্বর, চালান নম্বর বা ব্যাংক রেফারেন্স দিয়ে হোম পেজের রেকর্ড অনুসন্ধান বক্স অথবা পেমেন্ট ইতিহাস থেকে চালান যাচাই করুন।'
                  : 'Use your transaction reference, challan number, or bank reference in the Home record lookup or Payment History table to inspect sample receipts.'
                : queryCategory === 'security'
                  ? isBn
                    ? 'কোনো ব্যক্তিগত তথ্য, পাসওয়ার্ড বা ওটিপি কখনোই তৃতীয় পক্ষের সাথে শেয়ার করবেন না এবং সর্বদা সরকারি .gov.bd ডোমেইন যাচাই করুন।'
                    : 'Never share personal credentials or OTPs. Official tax payments are verified only through authenticated NBR citizen channels.'
                  : isBn
                    ? 'ধাপে ধাপে রিটার্ন সহ কর, অন্যান্য কর, ভ্রমণ কর এবং দানকর পরিশোধ ও চালান সংরক্ষণের নিয়মাবলি নিচে দেখুন।'
                    : 'Step-by-step instructions for Income Tax with Return, Advance/Other Tax, Travel Tax, and Gift Tax filings.'}
            </p>
          </div>
        )}

        {contract === 'incident' && (
          <div
            role="region"
            aria-label={isBn ? 'সমস্যা রিপোর্ট' : 'Incident Report Context'}
            className="p-5 rounded-2xl border border-amber-200 dark:border-amber-800 bg-amber-50/80 dark:bg-amber-950/30 space-y-2"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900 dark:text-amber-200">
              <AlertTriangle size={18} />
              <span>
                {isBn
                  ? 'অভিযোগ ও কারিগরি সমস্যা রিপোর্ট'
                  : 'Incident & Payment Issue Reporting'}
              </span>
            </div>
            <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
              {isBn
                ? 'পেমেন্ট গেটওয়ে ত্রুটি, চালান অমিল বা পোর্টালের যেকোনো সমস্যা সম্পর্কে বিস্তারিত লিখে জমা দিন।'
                : 'Report payment gateway timeouts, challan mismatches, or portal accessibility problems using the ticket form below.'}
            </p>
          </div>
        )}

        {/* Helpline Banner */}
        <div className="p-6 bg-teal-700 text-white rounded-2xl shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-lg font-bold">NBR National Call Center Helpline</h3>
            <p className="text-xs text-teal-100">Official toll-free assistance for citizens regarding tax filings, E-Challans, and payment gateway issues.</p>
          </div>
          <div className="px-6 py-3 bg-white text-teal-900 rounded-xl font-bold text-lg flex items-center gap-2 font-mono shadow-sm">
            <PhoneCall size={20} /> 16555
          </div>
        </div>

        {showModal && (
          <form onSubmit={handleSubmit} noValidate className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold">Create Support Ticket</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <AppTextField
                  label={t('supportSubjectLabel')}
                  value={subject}
                  onChange={e => {
                    setSubject(e.target.value);
                    if (errors.subject) setErrors(prev => ({ ...prev, subject: undefined }));
                  }}
                  placeholder={t('supportSubjectPlaceholder')}
                  error={Boolean(errors.subject)}
                  helperText={errors.subject || t('supportSubjectHelper')}
                  required
                />
              </div>
              <div>
                <AppSelectField
                  label={t('supportCategoryLabel')}
                  value={category}
                  onChange={e => setCategory(e.target.value as SupportCategory)}
                  helperText={t('supportCategoryHelper')}
                  options={[
                    { value: 'Payment Issue', label: t('catPaymentIssue') },
                    { value: 'Tax Assessment', label: t('catTaxAssessment') },
                    { value: 'Technical', label: t('catTechnical') },
                    { value: 'Other', label: t('catOther') }
                  ]}
                />
              </div>
            </div>
            <div>
              <AppTextArea
                label={t('supportMessageLabel')}
                value={message}
                onChange={e => {
                  setMessage(e.target.value);
                  if (errors.message) setErrors(prev => ({ ...prev, message: undefined }));
                }}
                rows={3}
                placeholder={t('supportMessagePlaceholder')}
                error={Boolean(errors.message)}
                helperText={errors.message || t('supportMessageHelper')}
                required
              />
            </div>
            <div className="flex justify-end gap-3">
              <AppButton
                type="button"
                tone="secondary"
                size="small"
                onClick={() => {
                  setErrors({});
                  setShowModal(false);
                }}
              >
                {t('cancel')}
              </AppButton>
              <AppButton
                type="submit"
                tone="primary"
                size="small"
                previewRestricted
              >
                {t('save')}
              </AppButton>
            </div>
          </form>
        )}

        {/* FAQ Section */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
          <h3 className="text-lg font-bold">{t('faqTitle')}</h3>
          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">How do I verify my E-Challan?</h4>
              <p className="text-slate-600 dark:text-slate-300">Every successful payment generates a verifiable challan number with digital QR code verification on Sohojkor and NBR servers.</p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl space-y-1">
              <h4 className="font-bold text-slate-900 dark:text-white">Can I pay taxes on behalf of family members?</h4>
              <p className="text-slate-600 dark:text-slate-300">Yes, use the Beneficiaries module to map family member TINs securely and file payments on their behalf.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
