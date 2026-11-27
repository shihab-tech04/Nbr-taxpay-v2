import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useApp } from '../../shared/AppContext';
import { HelpCircle, PhoneCall, Plus } from 'lucide-react';
import { AppTextField, AppSelectField, AppTextArea } from '../../design-system/forms';

export const SupportView: React.FC = () => {
  const { t } = useTranslation();
  const { addSupportTicket } = useApp();

  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<'Technical' | 'Tax Assessment' | 'Payment Issue' | 'Other'>('Payment Issue');
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) {
      alert('Please enter subject and message.');
      return;
    }
    addSupportTicket({ subject, category, message });
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
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white rounded-xl text-xs font-semibold flex items-center gap-2 shadow-sm"
          >
            <Plus size={16} /> Open Support Ticket
          </button>
        </div>

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
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6 space-y-4">
            <h3 className="text-base font-bold">Create Support Ticket</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <AppTextField
                  label="Subject"
                  value={subject}
                  onChange={e => setSubject(e.target.value)}
                  placeholder="e.g., Payment gateway timeout"
                  required
                />
              </div>
              <div>
                <AppSelectField
                  label="Category"
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  options={[
                    { value: 'Payment Issue', label: 'Payment Issue' },
                    { value: 'Tax Assessment', label: 'Tax Assessment' },
                    { value: 'Technical', label: 'Technical' },
                    { value: 'Other', label: 'Other' }
                  ]}
                />
              </div>
            </div>
            <div>
              <AppTextArea
                label="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
                rows={3}
                placeholder="Describe your issue in detail..."
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
