import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Menu, MenuItem } from '@mui/material';
import { AppButton } from '../design-system/buttons';

interface NavbarAccountMenuProps {
  userName: string;
  isAuthenticated: boolean;
  unreadNotifications?: number;
  onSignOut: () => void;
}

export const NavbarAccountMenu: React.FC<NavbarAccountMenuProps> = ({
  userName,
  isAuthenticated,
  unreadNotifications = 0,
  onSignOut,
}) => {
  const { t, i18n } = useTranslation();
  const bn = i18n.language === 'bn';
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = () => setAnchorEl(null);

  if (!isAuthenticated) {
    return (
      <AppButton
        actionType="primary"
        geometry="compact"
        size="small"
        to="/login"
        sx={{ whiteSpace: 'nowrap', flexShrink: 0, fontSize: '0.75rem', px: { xs: 1.25, sm: 2 } }}
      >
        <span className="sm:hidden">{bn ? 'লগইন' : 'Sign In'}</span>
        <span className="hidden sm:inline">{t('signIn')}</span>
      </AppButton>
    );
  }

  return (
    <div>
      <AppButton
        actionType="secondary"
        surface="soft"
        geometry="pill"
        size="small"
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-haspopup="menu"
        aria-expanded={Boolean(anchorEl)}
        sx={{ pl: 1, pr: 1.5, py: 0.5, minHeight: 34 }}
      >
        <div className="w-6 h-6 rounded-full bg-teal-700 text-white flex items-center justify-center text-xs font-bold">
          {userName.charAt(0)}
        </div>
        <span className="text-xs font-medium hidden sm:inline">{userName.split(' ')[0]}</span>
      </AppButton>
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
        <MenuItem onClick={() => { handleClose(); navigate('/profile'); }}>
          {t('profile') || 'Profile'}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/beneficiaries'); }}>
          {t('beneficiaries')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/history'); }}>
          {t('history')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/corrections'); }}>
          {t('corrections')}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/certificates'); }}>
          {bn ? 'সনদসমূহ' : 'Certificates'}
        </MenuItem>
        <MenuItem onClick={() => { handleClose(); navigate('/notifications'); }}>
          {t('notifications')}{unreadNotifications > 0 ? ` (${unreadNotifications})` : ''}
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            onSignOut();
          }}
          sx={{ color: 'error.main' }}
        >
          {t('signOut')}
        </MenuItem>
      </Menu>
    </div>
  );
};
