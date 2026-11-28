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
  profileContext?: boolean;
  onCopySuccess?: (label: string) => void;
}

export const MaskedProfileValue: React.FC<MaskedProfileValueProps> = ({
  meta,
  value,
  identityKey,
  canReveal,
  profileContext = false,
  onCopySuccess,
}) => {
  const { i18n } = useTranslation();
  const isBn = i18n.language === 'bn';
  const label = isBn ? meta.labelBn : meta.labelEn;

  const scopeKey = `${identityKey}|${meta.key}|${value}|${canReveal ? '1' : '0'}|${profileContext ? '1' : '0'}`;
  const [revealState, setRevealState] = useState<{ scope: string; active: boolean }>({ scope: scopeKey, active: false });
  const [copyState, setCopyState] = useState<{ scope: string; status: 'idle' | 'done' | 'failed' }>({
    scope: scopeKey,
    status: 'idle',
  });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const transitionEpochRef = useRef(0);

  useEffect(() => {
    transitionEpochRef.current += 1;
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setRevealState({ scope: scopeKey, active: false });
    setCopyState({ scope: scopeKey, status: 'idle' });
    return () => {
      transitionEpochRef.current += 1;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [scopeKey]);

  const sensitive = Boolean(meta.maskable) && isSensitiveMaskValue(value, meta.key);
  const isTinField = meta.key === 'tin' || meta.key === 'previousTin';
  const canCopy = canReveal && Boolean(meta.copyable) && sensitive && (!isTinField || profileContext);
  const effectiveRevealed = canReveal && revealState.scope === scopeKey && revealState.active;
  const copyStatus = copyState.scope === scopeKey ? copyState.status : 'idle';
  const displayValue = formatProfileValue(meta.key, value, effectiveRevealed);

  const handleCopy = async () => {
    if (!canCopy) return;
    const epochAtStart = transitionEpochRef.current;
    let didCopy = false;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        didCopy = true;
      }
    } catch {
      didCopy = false;
    }

    if (transitionEpochRef.current !== epochAtStart) return;

    if (!didCopy && typeof document !== 'undefined' && typeof document.execCommand === 'function') {
      const helper = document.createElement('textarea');
      helper.value = value;
      helper.setAttribute('readonly', '');
      helper.style.position = 'fixed';
      helper.style.opacity = '0';
      document.body.appendChild(helper);
      helper.select();
      try {
        didCopy = document.execCommand('copy');
      } catch {
        didCopy = false;
      }
      document.body.removeChild(helper);
    }

    if (transitionEpochRef.current !== epochAtStart) return;

    if (timerRef.current) clearTimeout(timerRef.current);
    if (didCopy) {
      setCopyState({ scope: scopeKey, status: 'done' });
      onCopySuccess?.(label);
      timerRef.current = setTimeout(() => {
        if (transitionEpochRef.current === epochAtStart) {
          setCopyState({ scope: scopeKey, status: 'idle' });
        }
      }, 2000);
    } else {
      setCopyState({ scope: scopeKey, status: 'failed' });
    }
  };

  return (
    <div className="space-y-1 w-full">
      <div className="flex items-center justify-between gap-2 w-full">
        <span
          data-testid={`profile-value-${meta.key}`}
          className={`text-xs sm:text-sm font-medium text-slate-900 dark:text-slate-100 block break-words mt-0.5 min-w-0 ${
            meta.maskable || meta.key.includes('Tin') || meta.key.includes('Phone') ? 'font-mono' : ''
          }`}
        >
          {displayValue}
        </span>

        {sensitive && (
          <div className="flex items-center gap-1 shrink-0">
            <AppIconButton
              size="small"
              surface="tinted"
              previewRestricted
              disabled={!canReveal}
              aria-label={isBn ? (effectiveRevealed ? `${label} গোপন করুন` : `${label} দেখুন`) : effectiveRevealed ? `Hide ${label}` : `Reveal ${label}`}
              aria-pressed={effectiveRevealed}
              title={!canReveal ? (isBn ? 'দেখতে সাইন ইন করুন' : 'Sign in to reveal') : effectiveRevealed ? (isBn ? `${label} গোপন করুন` : `Hide ${label}`) : isBn ? `${label} দেখুন` : `Reveal ${label}`}
              onClick={() => canReveal && setRevealState((prev) => ({ scope: scopeKey, active: prev.scope === scopeKey ? !prev.active : true }))}
            >
              {effectiveRevealed ? <EyeOff size={15} /> : <Eye size={15} />}
            </AppIconButton>

            {meta.copyable && (!isTinField || profileContext) && (
              <AppIconButton
                size="small"
                surface="tinted"
                previewRestricted
                disabled={!canCopy}
                aria-label={isBn ? `${label} কপি করুন` : `Copy ${label}`}
                title={!canCopy ? (isBn ? 'কপি অনুপলব্ধ' : 'Copy unavailable') : isBn ? `${label} কপি করুন` : `Copy ${label}`}
                onClick={handleCopy}
              >
                {copyStatus === 'done' ? <Check size={15} className="text-emerald-600" /> : <Copy size={15} />}
              </AppIconButton>
            )}
          </div>
        )}
      </div>
      {copyStatus === 'failed' && (
        <span role="alert" className="block text-[11px] text-rose-600 dark:text-rose-400">
          {isBn ? 'কপি করা যায়নি। আবার চেষ্টা করুন।' : 'Could not copy. Please retry.'}
        </span>
      )}
    </div>
  );
};
