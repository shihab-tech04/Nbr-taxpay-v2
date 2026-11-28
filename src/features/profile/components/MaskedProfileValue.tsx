import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { AppIconButton } from '../../../design-system/buttons';
import { formatProfileValue, isSensitiveMaskValue } from '../profileUtils';
import type { ProfileFieldMeta } from '../profileTypes';

interface MaskedProfileValueProps {
  meta: ProfileFieldMeta;
  value: string;
  identityKey: string;
  canReveal: boolean;
  onCopySuccess?: (label: string) => void;
}

export const MaskedProfileValue: React.FC<MaskedProfileValueProps> = ({
  meta,
  value,
  identityKey,
  canReveal,
  onCopySuccess,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const label = isBn ? meta.labelBn : meta.labelEn;

  const scopeKey = `${identityKey}|${meta.key}|${value}|${canReveal ? '1' : '0'}`;
  const [revealState, setRevealState] = useState<{ scope: string; active: boolean }>({
    scope: scopeKey,
    active: false,
  });
  const [copyState, setCopyState] = useState<{ scope: string; active: boolean }>({
    scope: scopeKey,
    active: false,
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [scopeKey]);

  const sensitive = Boolean(meta.maskable) && isSensitiveMaskValue(value);
  const effectiveRevealed = canReveal && revealState.scope === scopeKey && revealState.active;
  const effectiveCopied = canReveal && copyState.scope === scopeKey && copyState.active;
  const displayValue = formatProfileValue(meta.key, value, effectiveRevealed);

  const handleCopy = async () => {
    if (!canReveal || !isSensitiveMaskValue(value)) return;
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
      setCopyState({ scope: scopeKey, active: true });
      onCopySuccess?.(label);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        setCopyState({ scope: scopeKey, active: false });
      }, 2000);
    }
  };

  return (
    <div className="flex items-center justify-between gap-2 w-full">
      <span
        data-testid={`profile-value-${meta.key}`}
        className={`text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 block break-words mt-0.5 min-w-0 ${
          meta.maskable || meta.key.includes('Tin') || meta.key.includes('Phone') ? 'font-mono' : ''
        }`}
      >
        {displayValue}
      </span>

      {(sensitive || (meta.copyable && isSensitiveMaskValue(value))) && (
        <div className="flex items-center gap-1 shrink-0">
          {sensitive && (
            <AppIconButton
              size="small"
              surface="tinted"
              previewRestricted
              disabled={!canReveal}
              aria-label={
                isBn
                  ? effectiveRevealed
                    ? `${label} গোপন করুন`
                    : `${label} দেখুন`
                  : effectiveRevealed
                  ? `Hide ${label}`
                  : `Reveal ${label}`
              }
              aria-pressed={effectiveRevealed}
              title={
                !canReveal
                  ? isBn
                    ? 'দেখতে সাইন ইন করুন'
                    : 'Sign in to reveal'
                  : effectiveRevealed
                  ? isBn
                    ? `${label} গোপন করুন`
                    : `Hide ${label}`
                  : isBn
                  ? `${label} দেখুন`
                  : `Reveal ${label}`
              }
              onClick={() =>
                canReveal &&
                setRevealState((prev) => ({
                  scope: scopeKey,
                  active: prev.scope === scopeKey ? !prev.active : true,
                }))
              }
            >
              {effectiveRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
            </AppIconButton>
          )}
          {meta.copyable && isSensitiveMaskValue(value) && (
            <AppIconButton
              size="small"
              surface="tinted"
              previewRestricted
              disabled={!canReveal}
              aria-label={isBn ? `${label} কপি করুন` : `Copy ${label}`}
              title={
                !canReveal
                  ? isBn
                    ? 'কপি করতে সাইন ইন করুন'
                    : 'Sign in to copy'
                  : isBn
                  ? `${label} কপি করুন`
                  : `Copy ${label}`
              }
              onClick={handleCopy}
            >
              {effectiveCopied ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
            </AppIconButton>
          )}
        </div>
      )}
    </div>
  );
};
