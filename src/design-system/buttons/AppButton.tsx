import React from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import type { SxProps, Theme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';
import { BUTTON_TOKENS } from '../theme';

export type ButtonTone =
  | 'primary'
  | 'secondary'
  | 'neutral'
  | 'danger'
  | 'confirm'
  | 'ghost'
  | 'hero'
  | 'heroSecondary'
  | 'homeOutlined'
  | 'homeSoft';

export interface AppButtonProps
  extends Omit<ButtonProps, 'variant' | 'color' | 'href'> {
  tone?: ButtonTone;
  loading?: boolean;
  loadingLabel?: string;
  previewRestricted?: boolean;
  href?: string;
  target?: string;
  rel?: string;
  to?: string;
}

function resolveButtonMapping(tone: ButtonTone): {
  variant: ButtonProps['variant'];
  color: ButtonProps['color'];
  sx: SxProps<Theme>;
} {
  switch (tone) {
    case 'primary':
      return {
        variant: 'contained',
        color: 'primary',
        sx: {
          bgcolor: '#0F766E',
          color: '#FFFFFF',
          '&:hover': { bgcolor: '#115E59' },
        },
      };
    case 'confirm':
      return {
        variant: 'contained',
        color: 'primary',
        sx: {
          bgcolor: BUTTON_TOKENS.confirmMain,
          color: BUTTON_TOKENS.confirmText,
          fontWeight: 700,
          '&:hover': { bgcolor: BUTTON_TOKENS.confirmHover, color: '#FFFFFF' },
        },
      };
    case 'secondary':
      return {
        variant: 'outlined',
        color: 'primary',
        sx: {
          borderColor: 'divider',
          color: 'text.primary',
          '&:hover': {
            borderColor: '#0F766E',
            bgcolor: 'action.hover',
          },
        },
      };
    case 'neutral':
      return {
        variant: 'contained',
        color: 'inherit',
        sx: (theme) => ({
          bgcolor: theme.palette.mode === 'light' ? '#F1F5F9' : '#1E293B',
          color: theme.palette.text.primary,
          '&:hover': {
            bgcolor: theme.palette.mode === 'light' ? '#E2E8F0' : '#334155',
          },
        }),
      };
    case 'danger':
      return {
        variant: 'contained',
        color: 'error',
        sx: {},
      };
    case 'ghost':
      return {
        variant: 'text',
        color: 'inherit',
        sx: {
          color: '#3E4B62',
          '&:hover': {
            bgcolor: '#F4F6FA',
            color: '#0F1D34',
          },
        },
      };
    case 'hero':
      return {
        variant: 'contained',
        color: 'primary',
        sx: {
          bgcolor: BUTTON_TOKENS.homePrimary,
          color: '#FFFFFF',
          border: '1px solid transparent',
          borderRadius: `${BUTTON_TOKENS.heroBorderRadius}px`,
          minHeight: BUTTON_TOKENS.heightLarge,
          px: 3,
          py: 1,
          fontSize: BUTTON_TOKENS.fontSizeLarge,
          boxShadow: '0 12px 24px -12px rgba(47, 85, 164, 0.85)',
          '&:hover': {
            bgcolor: BUTTON_TOKENS.homePrimaryHover,
            boxShadow: '0 12px 24px -12px rgba(47, 85, 164, 0.85)',
          },
        },
      };
    case 'heroSecondary':
      return {
        variant: 'outlined',
        color: 'primary',
        sx: {
          color: 'var(--slider2-outline, #1C3D70)',
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          borderColor: 'var(--slider2-outline, #1C3D70)',
          borderRadius: `${BUTTON_TOKENS.heroBorderRadius}px`,
          minHeight: BUTTON_TOKENS.heightLarge,
          px: 3,
          py: 1,
          fontSize: BUTTON_TOKENS.fontSizeLarge,
          '&:hover': {
            bgcolor: '#FFFFFF',
            borderColor: 'var(--slider2-outline, #1C3D70)',
          },
        },
      };
    case 'homeOutlined':
      return {
        variant: 'outlined',
        color: 'primary',
        sx: {
          bgcolor: '#FFFFFF',
          color: BUTTON_TOKENS.homeAccentText,
          borderColor: BUTTON_TOKENS.homeAccentBorder,
          borderRadius: '8px',
          minHeight: 40,
          '&:hover': {
            bgcolor: BUTTON_TOKENS.homeAccentBgHover,
            borderColor: BUTTON_TOKENS.homeAccentBorder,
          },
        },
      };
    case 'homeSoft':
      return {
        variant: 'contained',
        color: 'inherit',
        sx: {
          bgcolor: '#E6EDF8',
          color: BUTTON_TOKENS.homeAccentText,
          border: `1px solid ${BUTTON_TOKENS.homeAccentBorder}`,
          '&:hover': {
            bgcolor: BUTTON_TOKENS.homeAccentBorder,
          },
        },
      };
  }
}

function mergeSx(
  base: SxProps<Theme>,
  extra?: SxProps<Theme>
): SxProps<Theme> {
  if (!extra) return base;
  return [
    ...(Array.isArray(base) ? base : [base]),
    ...(Array.isArray(extra) ? extra : [extra]),
  ];
}

export const AppButton = React.forwardRef<HTMLButtonElement, AppButtonProps>(
  function AppButton(
    {
      tone = 'primary',
      size = 'medium',
      type,
      loading = false,
      loadingLabel,
      disabled = false,
      previewRestricted = false,
      startIcon,
      endIcon,
      href,
      target,
      rel,
      to,
      onClick,
      children,
      sx,
      ...rest
    },
    ref
  ) {
    const isPreviewDisabled = Boolean(previewRestricted && PUBLIC_PREVIEW);
    const effectiveDisabled = Boolean(disabled || loading || isPreviewDisabled);
    const mapping = resolveButtonMapping(tone);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (effectiveDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    const resolvedStartIcon = loading ? (
      <CircularProgress size={16} color="inherit" aria-hidden="true" />
    ) : (
      startIcon
    );

    const linkProps = href
      ? {
          component: 'a' as const,
          href,
          target,
          rel: target === '_blank' ? rel ?? 'noopener noreferrer' : rel,
        }
      : to
        ? {
            component: RouterLink,
            to,
          }
        : {
            type: type ?? 'button',
          };

    return (
      <Button
        ref={ref}
        variant={mapping.variant}
        color={mapping.color}
        size={size}
        disabled={effectiveDisabled}
        aria-busy={loading || undefined}
        startIcon={resolvedStartIcon}
        endIcon={endIcon}
        onClick={handleClick}
        sx={mergeSx(mapping.sx, sx)}
        {...linkProps}
        {...rest}
      >
        {loading && loadingLabel ? loadingLabel : children}
      </Button>
    );
  }
);
