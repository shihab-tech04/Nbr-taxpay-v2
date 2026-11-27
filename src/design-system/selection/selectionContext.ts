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
