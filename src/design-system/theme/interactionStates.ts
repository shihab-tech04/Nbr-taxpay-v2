import type { ThemeColorTokens } from './palette';

export function buildFocusVisibleStyle(outlineColor: string, offset = 2) {
  return {
    outline: `2px solid ${outlineColor}`,
    outlineOffset: offset,
  };
}

export function buildDisabledInteractionStyle(opacity = 0.62) {
  return {
    cursor: 'not-allowed',
    pointerEvents: 'auto' as const,
    opacity,
  };
}

export function buildSelectionFocusRing(colors: ThemeColorTokens, isError = false) {
  return {
    boxShadow: `0 0 0 3px ${isError ? colors.error.focusRing : colors.focus.ring}`,
  };
}
