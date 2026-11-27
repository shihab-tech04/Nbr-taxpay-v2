import React from 'react';
import IconButton, { type IconButtonProps } from '@mui/material/IconButton';
import CircularProgress from '@mui/material/CircularProgress';
import type { SxProps, Theme } from '@mui/material/styles';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { BUTTON_TOKENS } from '../theme';

export type IconButtonTone = 'default' | 'primary' | 'danger' | 'homeArrow' | 'homeSubmit' | 'homeClear';

export interface AppIconButtonProps extends Omit<IconButtonProps, 'aria-label'> {
  'aria-label': string;
  tone?: IconButtonTone;
  loading?: boolean;
  previewRestricted?: boolean;
}

function resolveIconToneSx(tone: IconButtonTone): SxProps<Theme> {
  switch (tone) {
    case 'primary':
      return {
        color: '#0F766E',
        '&:hover': { bgcolor: 'rgba(15, 118, 110, 0.08)' },
      };
    case 'danger':
      return {
        color: '#E11D48',
        '&:hover': { bgcolor: 'rgba(225, 29, 72, 0.08)' },
      };
    case 'homeArrow':
      return {
        width: 36,
        height: 36,
        borderRadius: '999px',
        color: '#141B2D',
        bgcolor: 'transparent',
        '&:hover': { bgcolor: '#F3F4F8' },
      };
    case 'homeSubmit':
      return {
        width: 40,
        height: 40,
        borderRadius: '12px',
        bgcolor: '#E6EDF8',
        color: BUTTON_TOKENS.homeAccentText,
        border: `1px solid ${BUTTON_TOKENS.homeAccentBorder}`,
        '&:hover': { bgcolor: BUTTON_TOKENS.homeAccentBorder },
        '&.Mui-disabled': {
          bgcolor: '#E6EDF8',
          color: BUTTON_TOKENS.homeAccentText,
          opacity: 0.8,
        },
      };
    case 'homeClear':
      return {
        width: 28,
        height: 28,
        borderRadius: '999px',
        color: '#5F6880',
        '&:hover': {
          bgcolor: 'rgba(231, 233, 239, 0.6)',
          color: '#141B2D',
        },
      };
    case 'default':
    default:
      return {
        color: 'text.secondary',
      };
  }
}

export const AppIconButton = React.forwardRef<HTMLButtonElement, AppIconButtonProps>(
  function AppIconButton(
    {
      tone = 'default',
      type = 'button',
      size = 'small',
      loading = false,
      disabled = false,
      previewRestricted = false,
      onClick,
      children,
      sx,
      ...rest
    },
    ref
  ) {
    const isPreviewDisabled = Boolean(previewRestricted && PUBLIC_PREVIEW);
    const effectiveDisabled = Boolean(disabled || loading || isPreviewDisabled);
    const toneSx = resolveIconToneSx(tone);

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
        sx={[toneSx, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
        {...rest}
      >
        {loading ? <CircularProgress size={16} color="inherit" aria-hidden="true" /> : children}
      </IconButton>
    );
  }
);
