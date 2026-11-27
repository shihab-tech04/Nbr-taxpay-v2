import type React from 'react';
import type { SxProps, Theme } from '@mui/material/styles';
import { BUTTON_TOKENS, getThemeColors } from '../theme';
import type {
  ButtonActionType,
  ButtonGeometry,
  ButtonIntent,
  ButtonPalette,
  ResolvedButtonStyle,
  SecondarySurface,
} from './buttonTypes';
import { resolveSecondaryStyle } from './secondaryButtonConfig';
export { resolveIconButtonStyle } from './iconButtonConfig';

export function mergeButtonSx(base: SxProps<Theme>, extra?: SxProps<Theme>): SxProps<Theme> {
  if (!extra) return base;
  return [...(Array.isArray(base) ? base : [base]), ...(Array.isArray(extra) ? extra : [extra])];
}

export function buildDisabledLinkHandlers(
  effectiveDisabled: boolean,
  onClick?: React.MouseEventHandler<HTMLAnchorElement>,
  onKeyDown?: React.KeyboardEventHandler<HTMLAnchorElement>
) {
  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = (event) => {
    if (effectiveDisabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onClick?.(event);
  };
  const handleKeyDown: React.KeyboardEventHandler<HTMLAnchorElement> = (event) => {
    if (effectiveDisabled && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    onKeyDown?.(event);
  };
  return { handleClick, handleKeyDown };
}

function getGeometrySx(geometry: ButtonGeometry): Record<string, unknown> {
  switch (geometry) {
    case 'hero':
      return {
        borderRadius: `${BUTTON_TOKENS.heroBorderRadius}px`,
        minHeight: BUTTON_TOKENS.heightLarge,
        px: 3,
        py: 1,
        fontSize: BUTTON_TOKENS.fontSizeLarge,
      };
    case 'compact':
      return { borderRadius: `${BUTTON_TOKENS.compactRadius}px`, minHeight: BUTTON_TOKENS.heightSmall };
    case 'pill':
      return { borderRadius: `${BUTTON_TOKENS.pillRadius}px` };
    case 'standard':
    default:
      return {};
  }
}

function resolvePrimaryStyle(
  intent: ButtonIntent,
  palette: ButtonPalette,
  geometrySx: Record<string, unknown>
): ResolvedButtonStyle {
  if (intent === 'destructive') {
    return { variant: 'contained', color: 'error', sx: geometrySx };
  }
  if (intent === 'confirm') {
    return {
      variant: 'contained',
      color: 'primary',
      sx: (theme) => {
        const colors = getThemeColors(theme.palette.mode);
        return {
          bgcolor: colors.confirm.main,
          color: colors.confirm.text,
          fontWeight: 700,
          '&:hover': { bgcolor: colors.confirm.hover, color: '#FFFFFF' },
          ...geometrySx,
        };
      },
    };
  }
  if (palette === 'home') {
    return {
      variant: 'contained',
      color: 'primary',
      sx: (theme) => {
        const colors = getThemeColors(theme.palette.mode);
        return {
          bgcolor: colors.home.primary,
          color: '#FFFFFF',
          border: '1px solid transparent',
          boxShadow: '0 12px 24px -12px rgba(47, 85, 164, 0.85)',
          '&:hover': {
            bgcolor: colors.home.primaryHover,
            boxShadow: '0 12px 24px -12px rgba(47, 85, 164, 0.85)',
          },
          ...geometrySx,
        };
      },
    };
  }
  return {
    variant: 'contained',
    color: 'primary',
    sx: (theme) => {
      const colors = getThemeColors(theme.palette.mode);
      return {
        bgcolor: colors.brand.main,
        color: '#FFFFFF',
        '&:hover': { bgcolor: colors.brand.hover },
        ...geometrySx,
      };
    },
  };
}

export function resolveButtonStyle(options: {
  actionType: ButtonActionType;
  intent: ButtonIntent;
  palette: ButtonPalette;
  surface: SecondarySurface;
  geometry: ButtonGeometry;
}): ResolvedButtonStyle {
  const geometrySx = getGeometrySx(options.geometry);
  if (options.actionType === 'primary') {
    return resolvePrimaryStyle(options.intent, options.palette, geometrySx);
  }
  return resolveSecondaryStyle({ ...options, geometrySx });
}
