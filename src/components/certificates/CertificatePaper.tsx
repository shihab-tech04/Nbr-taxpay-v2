import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, ShieldAlert } from 'lucide-react';
import { AppIconButton } from '../../design-system/buttons';
import type { PaymentCertificateRecord } from '../../shared/certificateUtils';

interface CertificatePaperProps {
  cert: PaymentCertificateRecord;
  paperRef?: React.Ref<HTMLElement>;
  onCopySuccess?: (refId: string) => void;
}

export const CertificatePaper: React.FC<CertificatePaperProps> = ({
  cert,
  paperRef,
  onCopySuccess,
}) => {
  const { t, i18n } = useTranslation();
  const isBn = i18n?.language === 'bn';
  const [copyStatus, setCopyStatus] = useState<'idle' | 'done' | 'failed'>('idle');

  const handleCopyRef = async () => {
    let ok = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(cert.certificateId);
        ok = true;
      }
    } catch {
      ok = false;
    }
    if (!ok && typeof document !== 'undefined' && typeof document.execCommand === 'function') {
      const ta = document.createElement('textarea');
      ta.value = cert.certificateId;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        ok = document.execCommand('copy');
      } catch {
        ok = false;
      }
      document.body.removeChild(ta);
    }
    if (ok) {
      setCopyStatus('done');
      onCopySuccess?.(cert.certificateId);
      setTimeout(() => setCopyStatus('idle'), 2000);
    } else {
      setCopyStatus('failed');
    }
  };

  return (
    <article
      ref={paperRef}
      lang={isBn ? 'bn' : 'en'}
      data-testid="payment-certificate-paper"
      className="payment-certificate-paper bg-white text-slate-900 rounded-xl border border-slate-200 p-4 sm:p-5 space-y-4 text-xs"
    >
      <header className="space-y-3 border-b border-slate-200 pb-3">
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 flex items-start gap-2">
          <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
          <span>
            {isBn
              ? 'এটি কেবল সম্মিলিত পেমেন্ট সনদের ইউআই প্রিভিউ — কোনো সরকারি কর রেয়াত সনদ বা চূড়ান্ত নিষ্পত্তি প্রমাণ নয়।'
              : 'Illustrative Combined Payment Certificate UI preview — separate from Tax Credit Certificates and not official NBR settlement.'}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className="text-sm font-bold text-slate-900">
              {isBn ? 'সহজকর · সম্মিলিত পেমেন্ট সনদ (নমুনা)' : 'Sohojkor · Combined Payment Certificate (Sample)'}
            </div>
            <div className="font-mono text-[11px] text-slate-600">{cert.certificateId}</div>
          </div>
          <div className="flex items-center gap-1.5 no-print">
            <AppIconButton
              size="small"
              surface="tinted"
              aria-label={isBn ? 'সনদ রেফারেন্স কপি করুন' : 'Copy certificate reference'}
              onClick={handleCopyRef}
            >
              {copyStatus === 'done' ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
            </AppIconButton>
            {copyStatus === 'failed' && (
              <span role="alert" className="text-[11px] text-rose-600">
                {isBn ? 'কপি করা যায়নি।' : 'Copy failed.'}
              </span>
            )}
          </div>
        </div>
      </header>

      <section className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
        <div><span className="text-slate-500 block">{t('challanNumberLabel')}</span><strong className="font-mono break-all">{cert.challanNumber}</strong></div>
        <div><span className="text-slate-500 block">{isBn ? 'ব্যাংক রেফারেন্স' : 'Bank Reference'}</span><strong className="font-mono break-all">{cert.bankRef}</strong></div>
        <div><span className="text-slate-500 block">{isBn ? 'তারিখ ও মাধ্যম' : 'Date & Channel'}</span><strong>{new Date(cert.createdAt).toLocaleDateString()} · {cert.paymentChannel}</strong></div>
        <div><span className="text-slate-500 block">{isBn ? 'প্রদানকারী' : 'Payer'}</span><strong className="break-words">{cert.taxpayerName || (isBn ? 'ওয়াক-ইন করদাতা' : 'Walk-In Taxpayer')}</strong></div>
        <div><span className="text-slate-500 block">{t('taxpayerTin')}</span><strong className="font-mono">{cert.taxpayerTin || 'Walk-In'}</strong></div>
        <div><span className="text-slate-500 block">{t('assessmentYear')}</span><strong className="font-mono">{cert.assessmentYears}</strong></div>
        {cert.beneficiaryTin && (
          <div className="col-span-2 sm:col-span-3">
            <span className="text-slate-500 block">{isBn ? 'সুবিধাভোগী / প্রাপক' : 'Recipient / Beneficiary'}</span>
            <strong className="break-words">{cert.beneficiaryName} (TIN: {cert.beneficiaryTin})</strong>
          </div>
        )}
        {cert.giftDate && (
          <div><span className="text-slate-500 block">{t('giftDate')}</span><strong className="font-mono">{cert.giftDate}</strong></div>
        )}
        {cert.travelDetails && (
          <div className="col-span-2 sm:col-span-3">
            <span className="text-slate-500 block">{isBn ? 'ভ্রমণ তথ্য' : 'Travel Details'}</span>
            <strong>
              {cert.travelDetails.passengerName || '—'} · {cert.travelDetails.passportMasked || cert.travelDetails.passportNumber || '—'} · {[cert.travelDetails.travelMode, cert.travelDetails.departurePort, cert.travelDetails.destination, cert.travelDetails.travelDate].filter(Boolean).join(' · ')}
            </strong>
          </div>
        )}
      </section>

      <section data-pdf-scroll="true" className="overflow-x-auto border border-slate-200 rounded-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-100 text-slate-700">
            <tr>
              <th className="p-2.5 font-semibold">{t('taxHead')}</th>
              <th className="p-2.5 font-semibold">{t('assessmentYear')}</th>
              <th className="p-2.5 font-semibold">{isBn ? 'মন্তব্য' : 'Remarks'}</th>
              <th className="p-2.5 font-semibold text-right">{t('amountBdt')}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {cert.items.map((item, idx) => (
              <tr key={`${cert.certificateId}-line-${idx}`}>
                <td className="p-2.5 align-top break-words">
                  <div className="font-medium text-slate-900">{isBn ? item.headNameBn : item.headNameEn}</div>
                  <div className="text-[11px] text-slate-500 font-mono">
                    {item.headCode}{item.taxpayerTin ? ` · ${item.taxpayerName ?? ''} (${item.taxpayerTin})` : ''}
                  </div>
                </td>
                <td className="p-2.5 align-top font-mono">{item.assessmentYear}</td>
                <td className="p-2.5 align-top whitespace-pre-wrap break-words text-slate-600">{item.remarks || '—'}</td>
                <td className="p-2.5 align-top text-right font-mono font-semibold whitespace-nowrap">৳ {item.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="bg-teal-50/70 border-t border-slate-200 font-bold text-teal-900">
            <tr>
              <td colSpan={3} className="p-2.5 text-right">{isBn ? 'সমন্বিত নমুনা মোট' : 'Reconciled Sample Total'}</td>
              <td className="p-2.5 text-right font-mono">৳ {cert.totalAmount.toLocaleString()}</td>
            </tr>
          </tfoot>
        </table>
      </section>

      <footer data-testid="certificate-lifecycle-note" className="p-3 rounded-xl bg-slate-100 border border-slate-200 text-slate-700">
        {isBn ? cert.lifecycleNoteBn : cert.lifecycleNoteEn}
      </footer>
    </article>
  );
};
