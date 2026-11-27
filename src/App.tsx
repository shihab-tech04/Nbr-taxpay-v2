/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { AppProvider, useApp } from './shared/AppContext';
import { getTheme } from './design-system/theme';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './features/home/HomeView';
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

const AppContent: React.FC = () => {
  const { themeMode } = useApp();
  const theme = React.useMemo(() => getTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/dashboard" element={<DashboardView />} />
              <Route path="/all-taxes" element={<AllTaxPaymentsView />} />
              <Route path="/travel-tax" element={<TravelTaxView />} />
              <Route path="/gift-tax" element={<GiftTaxView />} />
              <Route path="/beneficiaries" element={<BeneficiariesView />} />
              <Route path="/history" element={<HistoryView />} />
              <Route path="/drafts" element={<DraftsView />} />
              <Route path="/corrections" element={<CorrectionsView />} />
              <Route path="/support" element={<SupportView />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
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
