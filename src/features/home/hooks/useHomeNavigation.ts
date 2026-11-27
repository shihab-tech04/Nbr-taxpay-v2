import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../../shared/AppContext';
import { PUBLIC_PREVIEW } from '../../../shared/previewMode';
import type { PaymentTransaction } from '../../../types/tax';
import type { HomeAction } from '../model/home.types';

export type LookupOutcome =
  | { kind: 'too_short'; reference: string }
  | { kind: 'preview_blocked'; reference: string }
  | { kind: 'matched_sample'; reference: string; transaction: PaymentTransaction }
  | { kind: 'not_found'; reference: string };

export function evaluateRecordLookup(
  rawReference: string,
  transactions: PaymentTransaction[],
  isPreviewMode: boolean
): LookupOutcome | null {
  const reference = rawReference.trim();
  if (!reference) return null;
  if (reference.length < 6) {
    return { kind: 'too_short', reference };
  }
  if (isPreviewMode) {
    return { kind: 'preview_blocked', reference };
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
      switch (action) {
        case 'home':
          navigate('/');
          if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;
        case 'pay':
          navigate('/all-taxes');
          break;
        case 'other':
          setOtherTaxOpen(true);
          break;
        case 'login':
          navigate(isAuthenticated ? '/dashboard' : '/login');
          break;
        case 'guide':
        case 'receipts':
        case 'security':
        case 'report':
          navigate('/support');
          break;
        case 'help':
          setHelpOpen(true);
          break;
        case 'history':
        case 'again':
          navigate('/history');
          break;
        case 'drafts':
          navigate('/drafts');
          break;
        case 'corrections':
          navigate('/corrections');
          break;
        case 'certificates':
          if (isAuthenticated) {
            navigate('/history');
          } else {
            setUnavailableKind('certificates');
          }
          break;
        case 'status':
          setUnavailableKind('status');
          break;
        case 'nbr':
          // External link handled via semantic <a href="https://nbr.gov.bd/">
          break;
      }
    },
    [isAuthenticated, navigate]
  );

  const handleSearch = useCallback(
    (reference: string) => {
      const outcome = evaluateRecordLookup(reference, transactions, PUBLIC_PREVIEW);
      if (outcome) {
        setLookupOutcome(outcome);
      }
    },
    [transactions]
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
