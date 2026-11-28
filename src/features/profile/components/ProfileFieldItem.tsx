import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Copy, Check, Eye, EyeOff } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import { formatProfileValue } from '../profileUtils';
import type { ProfileFieldMeta } from '../profileTypes';

interface ProfileFieldItemProps {
  meta: ProfileFieldMeta;
  value: string;
  canReveal?: boolean;
  onCopySuccess?: (label: string) => void;
}

export const ProfileFieldItem: React.FC<ProfileFieldItemProps> = ({
  meta,
  value,
  canReveal = false,
  onCopySuccess,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const label = isBn ? meta.labelBn : meta.labelEn;
  const effectiveRevealed = canReveal && revealed;
  const displayValue = formatProfileValue(meta.key, value, effectiveRevealed);

  const handleCopy = async () => {
    if (!canReveal) return;
    let didCopy = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (!didCopy && typeof document !== 'undefined') {
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      didCopy = document.execCommand('copy');
      document.body.removeChild(helper);
    }

    if (didCopy) {
      setCopied(true);
      onCopySuccess?.(label);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      data-testid={`profile-field-${meta.key}`}
      className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 transition-colors"
    >
      <div className="min-w-0 pr-2">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block truncate">
          {label}
        </span>
        <span
          className={`text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 block break-words mt-0.5 ${
            meta.maskable || meta.key.includes('Tin') || meta.key.includes('Phone') ? 'font-mono' : ''
          }`}
        >
          {displayValue}
        </span>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {meta.maskable && (
          <AppIconButton
            size="small"
            surface="tinted"
            previewRestricted
            disabled={!canReveal}
            aria-label={effectiveRevealed ? `Hide ${label}` : `Reveal ${label}`}
            title={
              !canReveal
                ? isBn
                  ? 'দেখতে সাইন ইন করুন'
                  : 'Sign in to reveal'
                : effectiveRevealed
                ? `Hide ${label}`
                : `Reveal ${label}`
            }
            onClick={() => canReveal && setRevealed((prev) => !prev)}
          >
            {effectiveRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
          </AppIconButton>
        )}
        {meta.copyable && (
          <AppIconButton
            size="small"
            surface="tinted"
            previewRestricted
            disabled={!canReveal}
            aria-label={`Copy ${label}`}
            title={
              !canReveal
                ? isBn
                  ? 'কপি করতে সাইন ইন করুন'
                  : 'Sign in to copy'
                : `Copy ${label}`
            }
            onClick={handleCopy}
          >
            {copied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
          </AppIconButton>
        )}
      </div>
    </div>
  );
};
