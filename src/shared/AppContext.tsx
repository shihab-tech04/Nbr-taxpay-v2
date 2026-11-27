import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, Beneficiary, PaymentTransaction, PaymentDraft, CorrectionRequest, SupportTicket, Language } from '../types/tax';
import { INITIAL_USER, INITIAL_BENEFICIARIES, INITIAL_TRANSACTIONS, INITIAL_DRAFTS, INITIAL_CORRECTIONS, INITIAL_SUPPORT } from './mockData';
import { useTranslation } from 'react-i18next';
import { PUBLIC_PREVIEW } from './previewMode';

// The hosted prototype must not read or persist taxpayer/business records.
const preferenceKeys = new Set(['sohojkor_lang', 'sohojkor_theme']);
const readStorage = (key: string) => {
  if (PUBLIC_PREVIEW && !preferenceKeys.has(key)) return null;
  try { return window.localStorage.getItem(key); } catch { return null; }
};
const writeStorage = (key: string, value: string) => {
  if (PUBLIC_PREVIEW && !preferenceKeys.has(key)) return;
  try { window.localStorage.setItem(key, value); } catch { /* Storage unavailable; continue in memory. */ }
};

interface AppContextType {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
  beneficiaries: Beneficiary[];
  addBeneficiary: (b: Omit<Beneficiary, 'id' | 'createdAt'>) => void;
  deleteBeneficiary: (id: string) => void;
  transactions: PaymentTransaction[];
  addTransaction: (tx: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>) => PaymentTransaction;
  drafts: PaymentDraft[];
  saveDraft: (draft: Omit<PaymentDraft, 'id' | 'updatedAt'>) => void;
  deleteDraft: (id: string) => void;
  corrections: CorrectionRequest[];
  addCorrection: (c: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => void;
  supportTickets: SupportTicket[];
  addSupportTicket: (s: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = readStorage('sohojkor_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return readStorage('sohojkor_auth') === 'true';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    return (readStorage('sohojkor_lang') as Language) || 'en';
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    return (readStorage('sohojkor_theme') as 'light' | 'dark') || 'light';
  });

  const [beneficiaries, setBeneficiaries] = useState<Beneficiary[]>(() => {
    const saved = readStorage('sohojkor_beneficiaries');
    return saved ? JSON.parse(saved) : INITIAL_BENEFICIARIES;
  });

  const [transactions, setTransactions] = useState<PaymentTransaction[]>(() => {
    const saved = readStorage('sohojkor_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [drafts, setDrafts] = useState<PaymentDraft[]>(() => {
    const saved = readStorage('sohojkor_drafts');
    return saved ? JSON.parse(saved) : INITIAL_DRAFTS;
  });

  const [corrections, setCorrections] = useState<CorrectionRequest[]>(() => {
    const saved = readStorage('sohojkor_corrections');
    return saved ? JSON.parse(saved) : INITIAL_CORRECTIONS;
  });

  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(() => {
    const saved = readStorage('sohojkor_support');
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT;
  });

  useEffect(() => {
    writeStorage('sohojkor_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    writeStorage('sohojkor_auth', String(isAuthenticated));
  }, [isAuthenticated]);

  useEffect(() => {
    writeStorage('sohojkor_lang', language);
    i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    writeStorage('sohojkor_theme', themeMode);
    if (themeMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeMode]);

  useEffect(() => {
    writeStorage('sohojkor_beneficiaries', JSON.stringify(beneficiaries));
  }, [beneficiaries]);

  useEffect(() => {
    writeStorage('sohojkor_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    writeStorage('sohojkor_drafts', JSON.stringify(drafts));
  }, [drafts]);

  useEffect(() => {
    writeStorage('sohojkor_corrections', JSON.stringify(corrections));
  }, [corrections]);

  useEffect(() => {
    writeStorage('sohojkor_support', JSON.stringify(supportTickets));
  }, [supportTickets]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const toggleTheme = () => {
    setThemeMode(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addBeneficiary = (b: Omit<Beneficiary, 'id' | 'createdAt'>) => {
    const newB: Beneficiary = {
      ...b,
      id: 'b-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setBeneficiaries(prev => [newB, ...prev]);
  };

  const deleteBeneficiary = (id: string) => {
    setBeneficiaries(prev => prev.filter(b => b.id !== id));
  };

  const addTransaction = (txData: Omit<PaymentTransaction, 'id' | 'createdAt' | 'transactionRef' | 'challanNumber' | 'bankRef'>): PaymentTransaction => {
    const newTx: PaymentTransaction = {
      ...txData,
      id: 'tx-' + Date.now(),
      transactionRef: 'SOHO-2026-' + Math.floor(10000 + Math.random() * 90000),
      challanNumber: 'NBR-CHL-2026-' + Math.floor(100000 + Math.random() * 900000),
      bankRef: txData.paymentChannel.substring(0, 2).toUpperCase() + '-TRX-' + Math.floor(1000000 + Math.random() * 9000000),
      createdAt: new Date().toISOString()
    };
    setTransactions(prev => [newTx, ...prev]);
    return newTx;
  };

  const saveDraft = (draftData: Omit<PaymentDraft, 'id' | 'updatedAt'>) => {
    const newDraft: PaymentDraft = {
      ...draftData,
      id: 'dr-' + Date.now(),
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setDrafts(prev => [newDraft, ...prev]);
  };

  const deleteDraft = (id: string) => {
    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  const addCorrection = (cData: Omit<CorrectionRequest, 'id' | 'createdAt' | 'status'>) => {
    const newC: CorrectionRequest = {
      ...cData,
      id: 'cor-' + Date.now(),
      status: 'Submitted',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setCorrections(prev => [newC, ...prev]);
  };

  const addSupportTicket = (sData: Omit<SupportTicket, 'id' | 'createdAt' | 'status'>) => {
    const newS: SupportTicket = {
      ...sData,
      id: 'sup-' + Date.now(),
      status: 'Open',
      createdAt: new Date().toISOString().split('T')[0]
    };
    setSupportTickets(prev => [newS, ...prev]);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        isAuthenticated,
        setIsAuthenticated,
        language,
        setLanguage,
        themeMode,
        toggleTheme,
        beneficiaries,
        addBeneficiary,
        deleteBeneficiary,
        transactions,
        addTransaction,
        drafts,
        saveDraft,
        deleteDraft,
        corrections,
        addCorrection,
        supportTickets,
        addSupportTicket
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
