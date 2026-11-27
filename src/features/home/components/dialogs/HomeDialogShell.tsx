import React, { useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { X } from 'lucide-react';
import { AppIconButton } from '../../../../design-system/buttons';

export function HomeDialogShell({
  open,
  onClose,
  titleId,
  title,
  closeLabel,
  maxWidth = 'sm',
  disablePortal = false,
  children,
}: {
  open: boolean;
  onClose: () => void;
  titleId: string;
  title: React.ReactNode;
  closeLabel: string;
  maxWidth?: 'xs' | 'sm' | 'md';
  disablePortal?: boolean;
  children: React.ReactNode;
}) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (!open && wasOpenRef.current) {
      const prev = previousFocusRef.current;
      previousFocusRef.current = null;
      if (prev && prev.isConnected) {
        window.requestAnimationFrame(() => prev.focus());
      }
    }
    wasOpenRef.current = open;
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={maxWidth}
      fullWidth
      disablePortal={disablePortal}
      aria-labelledby={titleId}
      sx={{
        '& .MuiDialog-container': {
          alignItems: { xs: 'flex-end', sm: 'center' },
        },
        '& .MuiDialog-paper': {
          m: { xs: 1, sm: 2 },
          width: { xs: 'calc(100% - 16px)', sm: undefined },
          borderRadius: { xs: '20px', sm: '16px' },
        },
      }}
    >
      <DialogTitle
        id={titleId}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pr: 1.5 }}
      >
        <span className="flex items-center gap-2 text-[18px] font-bold text-[#0f1d34]">
          {title}
        </span>
        <AppIconButton onClick={onClose} aria-label={closeLabel} size="small">
          <X className="size-4" aria-hidden="true" />
        </AppIconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
    </Dialog>
  );
}
