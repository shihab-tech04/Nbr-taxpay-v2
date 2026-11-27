import React from 'react';
import type { PublicCapability } from '../../shared/previewPolicy';

export type SelectionPalette = 'brand' | 'home';
export type SelectionSize = 'small' | 'medium';

export interface AppRadioGroupContextValue {
  name?: string;
  disabled: boolean;
  readOnly: boolean;
  error: boolean;
  size: SelectionSize;
  palette: SelectionPalette;
  errorId?: string;
  publicCapability: PublicCapability;
  previewRestricted: boolean;
}

export const AppRadioGroupContext = React.createContext<AppRadioGroupContextValue | null>(null);

export function useAppRadioGroupContext(): AppRadioGroupContextValue | null {
  return React.useContext(AppRadioGroupContext);
}

export function isSelectionInteractionBlocked(disabled: boolean, readOnly: boolean): boolean {
  return Boolean(disabled || readOnly);
}

export function createBlockedSelectionHandlers(
  blocked: boolean,
  blockedKeys: readonly string[] = [' ', 'Enter']
) {
  return {
    handleClick(event: { preventDefault: () => void; stopPropagation: () => void }): void {
      if (!blocked) return;
      event.preventDefault();
      event.stopPropagation();
    },
    handleKeyDown(event: {
      key: string;
      preventDefault: () => void;
      stopPropagation: () => void;
    }): void {
      if (!blocked) return;
      if (blockedKeys.includes(event.key)) {
        event.preventDefault();
        event.stopPropagation();
      }
    },
  };
}
