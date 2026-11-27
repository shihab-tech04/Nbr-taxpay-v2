export const HOME_COLORS = {
  background: '#F4F6FA',
  textPrimary: '#0F1D34',
  textSecondary: '#3E4B62',
  textMuted: '#5D697E',
  border: '#DFE5EE',
  primaryHeroButton: '#2F55A4',
  primaryHeroHover: '#1F3C7A',
  accentText: '#1C3D70',
  accentBorder: '#CAD8EF',
  surfaceLight: '#F8FAFD',
  softAccentBg: '#E6EDF8',
  errorText: '#D0353B',
  bentoAllTax: '#A5BCE1',
  bentoHistory: '#E3DDD4',
  bentoCertificates: '#CECFEB',
  bentoCorrections: '#E3D2D4',
  bentoPayAgainDesktop: '#E3DDD4',
  bentoPayAgainMobile: '#CCE4EB',
  bentoDrafts: '#D5E6D4',
  bentoSecurity: '#CAD8EF',
  bentoHelp: '#CCE4EB',
} as const;

export const SLIDER2_FALLBACK_THEMES: Record<string, readonly [string, string, string, string]> = {
  intro: ['#EAF2FF', '#172033', '#5F6B7A', '#2C5EAD'],
  TAX_WITH_RETURN: ['#EEF4FF', '#214887', '#4D6486', '#315DAA'],
  ADVANCE_TAX: ['#FFF6EC', '#80420D', '#765334', '#A65B19'],
  SOURCE_TAX_DEPOSIT: ['#F6F1FC', '#4E327B', '#5A4673', '#6D4BA8'],
  TRAVEL_TAX: ['#ECF8FC', '#07516B', '#316078', '#0C6D8D'],
};

export function isValidHexColor(value: string | null | undefined): value is string {
  return typeof value === 'string' && /^#[0-9a-fA-F]{6}$/.test(value);
}
