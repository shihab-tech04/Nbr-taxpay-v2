import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar } from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { usePreferences } from '../shared/PreferencesContext';
import { useSession } from '../shared/SessionContext';
import { AppButton, AppIconButton } from '../design-system/buttons';
import { NavbarDesktopLinks } from './NavbarDesktopLinks';
import { NavbarAccountMenu } from './NavbarAccountMenu';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, setIsAuthenticated } = useSession();
  const { language, setLanguage, themeMode, toggleTheme } = usePreferences();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        bgcolor: themeMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: themeMode === 'light' ? 'slate.200' : 'slate.800',
        color: 'text.primary',
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 4, px: { xs: 2, md: 6 }, py: 1.5 }}>
        <Link
          to="/"
          style={{ textDecoration: 'none', color: 'inherit' }}
          className="flex items-center gap-2 whitespace-nowrap shrink-0 group"
        >
          <div className="w-9 h-9 rounded-lg bg-teal-700 flex items-center justify-center text-white font-bold shadow-sm transition-transform group-hover:scale-105">
            সহ
          </div>
          <div className="flex flex-col">
            <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-white leading-tight">
              Sohojkor · সহজকর
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wide uppercase">
              NBR Citizen Tax Portal
            </span>
          </div>
        </Link>

        <NavbarDesktopLinks currentPath={location.pathname} isAuthenticated={isAuthenticated} />

        <div className="flex items-center gap-3 shrink-0">
          <AppButton
            actionType="secondary"
            geometry="compact"
            size="small"
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            title="Switch Language (EN/BN)"
            sx={{ minHeight: 30, minWidth: 0, px: 1.5, py: 0.5, borderRadius: '6px', fontSize: '0.75rem' }}
          >
            {language === 'en' ? 'বাংলা' : 'EN'}
          </AppButton>

          <AppIconButton aria-label="Toggle Theme" onClick={toggleTheme} size="small" title="Toggle Theme">
            {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </AppIconButton>

          <NavbarAccountMenu
            userName={user.name}
            isAuthenticated={isAuthenticated}
            onSignOut={handleSignOut}
          />
        </div>
      </Toolbar>
    </AppBar>
  );
};
