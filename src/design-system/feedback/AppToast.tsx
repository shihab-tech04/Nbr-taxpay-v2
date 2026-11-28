import React from 'react';
import { Snackbar, Alert } from '@mui/material';

export interface AppToastProps {
  open: boolean;
  onClose: () => void;
  message: React.ReactNode;
  severity?: 'success' | 'info' | 'warning' | 'error';
  autoHideDuration?: number;
}

export const AppToast: React.FC<AppToastProps> = ({
  open,
  onClose,
  message,
  severity = 'success',
  autoHideDuration = 3000,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          borderRadius: '12px',
          fontWeight: 600,
          fontSize: '0.85rem',
          boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};
