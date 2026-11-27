import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../shared/AppContext';
import { PUBLIC_PREVIEW } from '../../../shared/previewMode';
import type { PaymentTransaction } from '../../../types/tax';
import type { HomeAction } from '../model/home.types';
import { resolveHomeActionTarget } from '../model/routeContract';
import { isBannerCmsConfigured } from '../services/bannerService';

export type LookupOutcome =
  | { kind: 'too_short'; reference: string }
  | { kind: 'invalid'; reference: string }
  | { kind: 'service_unavailable'; reference: string }
  | { kind: 'unauthorized'; reference: string }
  | { kind: 'matched_sample'; reference: string; transaction: PaymentTransaction }
  | { kind: 'not_found'; reference: string };

export interface RecordLookupContext {
  isPreviewMode: boolean;
  serviceAvailable: boolean;
  signedIn: boolean;
}

const VALID_REFERENCE_PATTERN = /^[A-Za-z0-9\-/_.]+$/;

export function sanitizeReferenceQuery(value: string): string {
  return value.trim();
}

export function evaluateRecordLookup(
  rawReference: string,
  transactions: PaymentTransaction[],
  context: RecordLookupContext
): LookupOutcome | null {
  const reference = sanitizeReferenceQuery(rawReference);
  if (!reference) return null;
  if (reference.length < 6) {
    return { kind: 'too_short', reference };
  }
  if (!VALID_REFERENCE_PATTERN.test(reference)) {
    return { kind: 'invalid', reference };
  }
  if (context.isPreviewMode || !context.serviceAvailable) {
    return { kind: 'service_unavailable', reference };
  }
  if (!context.signedIn) {
    return { kind: 'unauthorized', reference };
  }
  const needle = reference.toUpperCase();
  const matched = transactions.find(
    (tx) =>
      tx.transactionRef.toUpperCase() === needle ||
      tx.challanNumber.toUpperCase() === needle ||
      tx.bankRef.toUpperCase() === needle
  );
  if (matched) {
    return { kind: 'matched_sample', reference, transaction: matched };
  }
  return { kind: 'not_found', reference };
}

export function useHomeNavigation() {
  const navigate = useNavigate();
  const { isAuthenticated, language, setLanguage, transactions } = useApp();

  const [otherTaxOpen, setOtherTaxOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [lookupOutcome, setLookupOutcome] = useState<LookupOutcome | null>(null);
  const [unavailableKind, setUnavailableKind] = useState<'certificates' | 'status' | null>(null);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === 'en' ? 'bn' : 'en');
  }, [language, setLanguage]);

  const handleAction = useCallback(
    (action: HomeAction) => {
      const target = resolveHomeActionTarget(action, isAuthenticated);
      switch (target.kind) {
        case 'navigate':
          navigate(target.path);
          if (target.scrollTop && typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;
        case 'dialog':
          if (target.dialog === 'other') setOtherTaxOpen(true);
          else setHelpOpen(true);
          break;
        case 'unavailable':
          setUnavailableKind(target.unavailableKind);
          break;
        case 'external':
          // Handled via semantic <a href="https://nbr.gov.bd/">
          break;
      }
    },
    [isAuthenticated, navigate]
  );

  const handleSearch = useCallback(
    (reference: string) => {
      const outcome = evaluateRecordLookup(reference, transactions, {
        isPreviewMode: PUBLIC_PREVIEW,
        serviceAvailable: isBannerCmsConfigured(),
        signedIn: isAuthenticated,
      });
      if (outcome) {
        setLookupOutcome(outcome);
      }
    },
    [isAuthenticated, transactions]
  );

  const sliderPaused =
    otherTaxOpen || helpOpen || lookupOutcome !== null || unavailableKind !== null;

  return {
    language,
    signedIn: isAuthenticated,
    toggleLanguage,
    handleAction,
    handleSearch,
    navigate,
    sliderPaused,
    otherTaxOpen,
    setOtherTaxOpen,
    helpOpen,
    setHelpOpen,
    lookupOutcome,
    setLookupOutcome,
    unavailableKind,
    setUnavailableKind,
  };
}
