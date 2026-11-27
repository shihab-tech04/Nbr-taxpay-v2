import React, { useCallback, useEffect, useSyncExternalStore } from 'react';
import { homeCopy } from './i18n';
import { useHomeNavigation } from './hooks/useHomeNavigation';
import { HomeDesktopLayout } from './components/HomeDesktopLayout';
import { HomeMobileLayout } from './components/HomeMobileLayout';
import { HomeDialogs } from './components/HomeDialogs';
import './home2.css';
import './slider2.css';

function useMediaQuery(query: string, serverFallback = true): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
        return () => {};
      }
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query]
  );

  const getSnapshot = () => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return serverFallback;
    }
    return window.matchMedia(query).matches;
  };

  return useSyncExternalStore(subscribe, getSnapshot, () => serverFallback);
}

export const HomePage: React.FC = () => {
  const {
    language,
    signedIn,
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
  } = useHomeNavigation();

  const isDesktop = useMediaQuery('(min-width: 960px)', true);
  const c = homeCopy[language];

  useEffect(() => {
    document.title = c.meta.title;
  }, [c.meta.title]);

  const Layout = isDesktop ? HomeDesktopLayout : HomeMobileLayout;

  return (
    <div
      data-testid="home2-root"
      data-design="uploaded-mobile-bento"
      data-viewport={isDesktop ? 'desktop' : 'mobile'}
      className="home2-import-root"
      lang={language}
    >
      <div data-home2-view>
        <Layout
          c={c}
          language={language}
          onToggleLang={toggleLanguage}
          onAction={handleAction}
          onSearch={handleSearch}
          signedIn={signedIn}
          sliderPaused={sliderPaused}
        />
      </div>

      <HomeDialogs
        c={c}
        otherTaxOpen={otherTaxOpen}
        onCloseOtherTax={() => setOtherTaxOpen(false)}
        helpOpen={helpOpen}
        onCloseHelp={() => setHelpOpen(false)}
        lookupOutcome={lookupOutcome}
        onCloseLookup={() => setLookupOutcome(null)}
        unavailableKind={unavailableKind}
        onCloseUnavailable={() => setUnavailableKind(null)}
        onNavigate={(path) => navigate(path)}
      />
    </div>
  );
};
