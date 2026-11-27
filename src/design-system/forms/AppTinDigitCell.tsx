import React from 'react';
import { getThemeColors, TIN_TOKENS } from '../theme';

type ThemeColors = ReturnType<typeof getThemeColors>;

export interface AppTinDigitCellProps {
  digit: string;
  isFilled: boolean;
  isActive: boolean;
  masked: boolean;
  disabled: boolean;
  readOnly: boolean;
  error: boolean;
  colors: ThemeColors;
}

export const AppTinDigitCell: React.FC<AppTinDigitCellProps> = ({
  digit,
  isFilled,
  isActive,
  masked,
  disabled,
  readOnly,
  error,
  colors,
}) => {
  const cellBorderColor = error
    ? colors.error.main
    : isActive
      ? colors.tin.cellActiveBorder
      : isFilled
        ? colors.tin.cellFilledBorder
        : colors.tin.cellBorder;

  const backgroundColor = disabled
    ? colors.surface.disabled
    : readOnly
      ? colors.surface.readOnly
      : isActive
        ? colors.tin.cellActiveBg
        : colors.tin.cellBg;

  const color = disabled
    ? colors.text.disabled
    : isActive
      ? colors.tin.cellActiveText
      : colors.tin.cellText;

  return (
    <span
      aria-hidden="true"
      className="flex items-center justify-center min-w-0 text-xs sm:text-sm font-semibold tabular-nums select-none transition-colors"
      style={{
        borderRadius: `${TIN_TOKENS.cellRadiusDesktop}px`,
        border: `1px solid ${cellBorderColor}`,
        backgroundColor,
        color,
        boxShadow: isActive ? `0 0 0 2px ${colors.tin.cellActiveBorder}` : undefined,
      }}
    >
      {digit ? (masked ? '•' : digit) : ''}
    </span>
  );
};

export function findDigitCellIndexAtPoint(
  container: HTMLElement,
  clientX: number,
  clientY: number,
  maxLength: number,
  valueLength: number
): number {
  const cells = Array.from(container.querySelectorAll(':scope > span'));
  const hit = cells.findIndex((cell) => {
    const rect = cell.getBoundingClientRect();
    return (
      clientX >= rect.left &&
      clientX <= rect.right &&
      clientY >= rect.top &&
      clientY <= rect.bottom
    );
  });
  return Math.min(hit < 0 ? maxLength - 1 : hit, valueLength);
}
