/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Alert } from '@mui/material';
import { PUBLIC_PREVIEW } from './shared/previewMode';
import { AppProvider, useApp } from './shared/AppContext';
import { getTheme } from './design-system/theme';
import { AppDateLocalizationProvider } from './design-system/dates';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './features/home';
import { LoginView } from './features/account/LoginView';
import { DashboardView } from './features/dashboard/DashboardView';
import { AllTaxPaymentsView } from './features/payments/AllTaxPaymentsView';
import { TravelTaxView } from './features/travel-tax/TravelTaxView';
import { GiftTaxView } from './features/gift-tax/GiftTaxView';
import { BeneficiariesView } from './features/beneficiaries/BeneficiariesView';
import { HistoryView } from './features/history/HistoryView';
import { DraftsView } from './features/drafts/DraftsView';
import { CorrectionsView } from './features/corrections/CorrectionsView';
import { SupportView } from './features/support/SupportView';
import './i18n/i18n';

const Router = import.meta.env.BASE_URL === '/' ? BrowserRouter : HashRouter;

const previewView = (view: React.ReactNode) => PUBLIC_PREVIEW ? (
  <fieldset disabled className="m-0 min-w-0 w-full border-0 p-0" aria-label="Read-only prototype screen">{view}</fieldset>
) : view;

const AppRoutes: React.FC = () => {
  const location = useLocation();
  const isHomeRoute = location.pathname === '/';

  const previewBanner = PUBLIC_PREVIEW && (
    <Alert severity="warning" role="status">
      Experimental read-only UI preview — not an official tax service. Sample data only. Sign-in, real personal data entry, payments and submissions are unavailable. পরীক্ষামূলক প্রদর্শনী — সরকারি কর সেবা নয়। প্রকৃত তথ্য বা অর্থ প্রদান করবেন না।
    </Alert>
  );

  if (isHomeRoute) {
    return (
      <div className="flex flex-col min-h-screen">
        {previewBanner}
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {previewBanner}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={previewView(<LoginView />)} />
          <Route path="/dashboard" element={previewView(<DashboardView />)} />
          <Route path="/all-taxes" element={previewView(<AllTaxPaymentsView />)} />
          <Route path="/travel-tax" element={previewView(<TravelTaxView />)} />
          <Route path="/gift-tax" element={previewView(<GiftTaxView />)} />
          <Route path="/beneficiaries" element={previewView(<BeneficiariesView />)} />
          <Route path="/history" element={previewView(<HistoryView />)} />
          <Route path="/drafts" element={previewView(<DraftsView />)} />
          <Route path="/corrections" element={previewView(<CorrectionsView />)} />
          <Route path="/support" element={previewView(<SupportView />)} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

const AppContent: React.FC = () => {
  const { themeMode } = useApp();
  const theme = React.useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppDateLocalizationProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AppDateLocalizationProvider>
    </ThemeProvider>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
