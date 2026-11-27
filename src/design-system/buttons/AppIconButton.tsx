import React from 'react';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import {
  isActionBlockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import type { ButtonPalette, IconButtonSurface } from './buttonTypes';
import { resolveIconButtonStyle } from './buttonConfig';

export interface AppIconButtonProps extends Omit<IconButtonProps, 'aria-label' | 'color'> {
  'aria-label': string;
  intent?: 'default' | 'destructive';
  palette?: ButtonPalette;
  surface?: IconButtonSurface;
  loading?: boolean;
  previewRestricted?: boolean;
  publicCapability?: PublicCapability;
}

export const AppIconButton = React.forwardRef<HTMLButtonElement, AppIconButtonProps>(
  function AppIconButton(
    {
      intent = 'default',
      palette = 'brand',
      surface = 'default',
      type = 'button',
      size = 'small',
      loading = false,
      disabled = false,
      previewRestricted = false,
      publicCapability,
      onClick,
      children,
      sx,
      ...rest
    },
    ref
  ) {
    const blockedByPreview = isActionBlockedByPreviewPolicy({
      previewRestricted,
      publicCapability,
    });
    const effectiveDisabled = Boolean(disabled || loading || blockedByPreview);
    const resolvedSx = resolveIconButtonStyle({ intent, palette, surface });

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (effectiveDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <IconButton
        ref={ref}
        type={type}
        size={size}
        disabled={effectiveDisabled}
        aria-busy={loading || undefined}
        onClick={handleClick}
        sx={[resolvedSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
        {...rest}
      >
        {loading ? <CircularProgress size={16} color="inherit" aria-hidden="true" /> : children}
      </IconButton>
    );
  }
);
