import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Language } from '../types/tax';
import { readAppStorage, writeAppStorage } from './storageAdapter';

export interface PreferencesContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  themeMode: 'light' | 'dark';
  toggleTheme: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | undefined>(undefined);

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { i18n } = useTranslation();

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = readAppStorage('sohojkor_lang');
    return saved === 'bn' ? 'bn' : 'en';
  });

  const [themeMode, setThemeMode] = useState<'light' | 'dark'>(() => {
    const saved = readAppStorage('sohojkor_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    writeAppStorage('sohojkor_lang', language);
    void i18n.changeLanguage(language);
  }, [language, i18n]);

  useEffect(() => {
    writeAppStorage('sohojkor_theme', themeMode);
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', themeMode === 'dark');
    }
  }, [themeMode]);

  const value = useMemo<PreferencesContextValue>(
    () => ({
      language,
      setLanguage: (lang: Language) => setLanguageState(lang),
      themeMode,
      toggleTheme: () => setThemeMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [language, themeMode]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export function usePreferences(): PreferencesContextValue {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
}
