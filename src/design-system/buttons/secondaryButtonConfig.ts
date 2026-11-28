import { BUTTON_TOKENS, getThemeColors } from '../theme';
import type {
  ButtonGeometry,
  ButtonIntent,
  ButtonPalette,
  ResolvedButtonStyle,
  SecondarySurface,
} from './buttonTypes';

export function resolveSecondaryStyle(options: {
  intent: ButtonIntent;
  palette: ButtonPalette;
  surface: SecondarySurface;
  geometry: ButtonGeometry;
  geometrySx: Record<string, unknown>;
}): ResolvedButtonStyle {
  const { intent, palette, surface, geometry, geometrySx } = options;
  if (intent === 'destructive') {
    return {
      variant: surface === 'ghost' ? 'text' : 'outlined',
      color: 'error',
      sx: (theme) => {
        const colors = getThemeColors(theme.palette.mode);
        return {
          color: colors.error.main,
          borderColor: surface === 'outlined' ? colors.error.main : undefined,
          '&:hover': {
            bgcolor: colors.error.focusRing,
            borderColor: surface === 'outlined' ? colors.error.hover : undefined,
          },
          ...geometrySx,
        };
      },
    };
  }
  if (surface === 'ghost') {
    return {
      variant: 'text',
      color: 'inherit',
      sx: (theme) => {
        const colors = getThemeColors(theme.palette.mode);
        return {
          color: palette === 'home' ? colors.home.ghostText : colors.text.secondary,
          '&:hover': {
            bgcolor: palette === 'home' ? colors.home.ghostHoverBg : colors.brand.softBg,
            color: palette === 'home' ? colors.home.ghostHoverText : colors.text.primary,
          },
          ...geometrySx,
        };
      },
    };
  }
  if (surface === 'soft') {
    return {
      variant: 'contained',
      color: 'inherit',
      sx: (theme) => {
        const colors = getThemeColors(theme.palette.mode);
        if (palette === 'home') {
          return {
            bgcolor: colors.home.softBg,
            color: colors.home.accentText,
            border: `1px solid ${colors.home.accentBorder}`,
            '&:hover': { bgcolor: colors.home.softHoverBg },
            ...geometrySx,
          };
        }
        return {
          bgcolor: colors.surface.neutral,
          color: colors.text.primary,
          '&:hover': { bgcolor: colors.surface.neutralHover },
          ...geometrySx,
        };
      },
    };
  }
  if (palette === 'home') {
    if (geometry === 'hero') {
      return {
        variant: 'outlined',
        color: 'primary',
        sx: (theme) => {
          const colors = getThemeColors(theme.palette.mode);
          const outlineFallback = `var(--slider2-outline, ${colors.home.ghostText})`;
          return {
            color: outlineFallback,
            bgcolor: 'rgba(255, 255, 255, 0.8)',
            borderColor: outlineFallback,
            '&:hover': { bgcolor: '#FFFFFF', borderColor: outlineFallback },
            ...geometrySx,
          };
        },
      };
    }
    return {
      variant: 'outlined',
      color: 'primary',
      sx: (theme) => {
        const colors = getThemeColors(theme.palette.mode);
        return {
          bgcolor: colors.isLight ? '#FFFFFF' : colors.surface.paper,
          color: colors.isLight ? colors.home.accentText : colors.text.primary,
          borderColor: colors.isLight ? colors.home.accentBorder : colors.border.neutral,
          borderRadius: `${BUTTON_TOKENS.compactRadius}px`,
          minHeight: BUTTON_TOKENS.heightMedium,
          '&:hover': {
            bgcolor: colors.isLight ? colors.home.accentBgHover : colors.brand.softBg,
            borderColor: colors.isLight ? colors.home.accentBorder : colors.border.hover,
          },
          '&.Mui-disabled': {
            bgcolor: colors.isLight ? '#FFFFFF' : colors.surface.disabled,
            color: colors.text.disabled,
            borderColor: colors.border.neutral,
          },
          ...geometrySx,
        };
      },
    };
  }
  return {
    variant: 'outlined',
    color: 'primary',
    sx: (theme) => {
      const colors = getThemeColors(theme.palette.mode);
      return {
        borderColor: colors.border.neutral,
        color: colors.text.primary,
        '&:hover': { borderColor: colors.brand.main, bgcolor: colors.brand.softBg },
        ...geometrySx,
      };
    },
  };
}
