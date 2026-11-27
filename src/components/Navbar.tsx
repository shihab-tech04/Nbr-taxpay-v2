import React, { useState } from 'react';
import { useApp } from '../shared/AppContext';
import { useTranslation } from 'react-i18next';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  AppBar, Toolbar, Button, IconButton, Menu, MenuItem, 
  Avatar, Box, Tooltip, Switch, alpha 
} from '@mui/material';
import { 
  Sun, Moon, Menu as MenuIcon, User, LogOut 
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, setIsAuthenticated, language, setLanguage, themeMode, toggleTheme } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [mobileAnchorEl, setMobileAnchorEl] = useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    setIsAuthenticated(false);
    handleClose();
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        bgcolor: themeMode === 'light' ? 'rgba(255, 255, 255, 0.9)' : 'rgba(30, 41, 59, 0.9)',
        backdropFilter: 'blur(8px)',
        borderBottom: '1px solid',
        borderColor: themeMode === 'light' ? 'slate.200' : 'slate.800',
        color: 'text.primary'
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', gap: 4, px: { xs: 2, md: 6 }, py: 1.5 }}>
        {/* Zone 1: Single text element wordmark */}
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

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium">
          <Link 
            to="/" 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${isActive('/') ? 'text-teal-700 dark:text-teal-400 border-teal-700' : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('home')}
          </Link>
          <Link 
            to="/all-taxes" 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${isActive('/all-taxes') ? 'text-teal-700 dark:text-teal-400 border-teal-700' : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('allTaxes')}
          </Link>
          <Link 
            to="/travel-tax" 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${isActive('/travel-tax') ? 'text-teal-700 dark:text-teal-400 border-teal-700' : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('travelTax')}
          </Link>
          <Link 
            to="/gift-tax" 
            className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${isActive('/gift-tax') ? 'text-teal-700 dark:text-teal-400 border-teal-700' : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
          >
            {t('giftTax')}
          </Link>
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className={`transition-colors whitespace-nowrap shrink-0 pb-1 border-b-2 ${isActive('/dashboard') ? 'text-teal-700 dark:text-teal-400 border-teal-700' : 'text-slate-600 dark:text-slate-300 border-transparent hover:text-slate-900 dark:hover:text-white'}`}
            >
              {t('dashboard')}
            </Link>
          )}
        </nav>

        {/* Zone 3: 1 primary action & utilities */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Language Toggle */}
          <button
            onClick={() => setLanguage(language === 'en' ? 'bn' : 'en')}
            className="px-2.5 py-1 text-xs font-semibold rounded-md border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Switch Language (EN/BN)"
          >
            {language === 'en' ? 'বাংলা' : 'EN'}
          </button>

          {/* Theme Toggle */}
          <IconButton 
            onClick={toggleTheme} 
            size="small"
            sx={{ color: 'text.secondary' }}
            title="Toggle Theme"
          >
            {themeMode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </IconButton>

          {/* Auth Action */}
          {isAuthenticated ? (
            <div>
              <button
                onClick={handleMenu}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-teal-50 dark:bg-teal-950/50 border border-teal-200 dark:border-teal-800 text-teal-900 dark:text-teal-200 hover:bg-teal-100 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
                  {user.name.charAt(0)}
                </div>
                <span className="text-xs font-medium hidden sm:inline">{user.name.split(' ')[0]}</span>
              </button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => { handleClose(); navigate('/dashboard'); }}>
                  {t('dashboard')}
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/beneficiaries'); }}>
                  {t('beneficiaries')}
                </MenuItem>
                <MenuItem onClick={() => { handleClose(); navigate('/history'); }}>
                  {t('history')}
                </MenuItem>
                <MenuItem onClick={handleSignOut} sx={{ color: 'error.main' }}>
                  {t('signOut')}
                </MenuItem>
              </Menu>
            </div>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              {t('signIn')}
            </button>
          )}
        </div>
      </Toolbar>
    </AppBar>
  );
};
