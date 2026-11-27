import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface NavbarDesktopLinksProps {
  currentPath: string;
  isAuthenticated: boolean;
}

export const NavbarDesktopLinks: React.FC<NavbarDesktopLinksProps> = ({
  currentPath,
  isAuthenticated,
}) => {
  const { t } = useTranslation();

  const linkClass = (path: string) =>
    `transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${
      currentPath === path
        ? 'text-teal-700 dark:text-teal-400 border-teal-700'
        : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'
    }`;

  return (
    <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
      <Link to="/" className={linkClass('/')}>
        {t('home')}
      </Link>
      <Link to="/all-taxes" className={linkClass('/all-taxes')}>
        {t('allTaxes')}
      </Link>
      <Link to="/travel-tax" className={linkClass('/travel-tax')}>
        {t('travelTax')}
      </Link>
      <Link to="/gift-tax" className={linkClass('/gift-tax')}>
        {t('giftTax')}
      </Link>
      {isAuthenticated && (
        <Link to="/dashboard" className={linkClass('/dashboard')}>
          {t('dashboard')}
        </Link>
      )}
    </nav>
  );
};
