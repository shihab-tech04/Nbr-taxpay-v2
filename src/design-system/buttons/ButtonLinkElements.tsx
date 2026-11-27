import React from 'react';
import Button, { type ButtonProps } from '@mui/material/Button';
import type { SxProps, Theme } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import type { ResolvedButtonStyle } from './buttonTypes';
import type { AppButtonAsAnchorProps, AppButtonAsRouterLinkProps, SharedAppButtonProps } from './buttonTypes';
import { buildDisabledLinkHandlers, mergeButtonSx } from './buttonConfig';

interface LinkVariantCommon {
  resolvedStyle: ResolvedButtonStyle;
  size: ButtonProps['size'];
  effectiveDisabled: boolean;
  loading: boolean;
  resolvedStartIcon: React.ReactNode;
  endIcon: React.ReactNode;
  buttonChildren: React.ReactNode;
  sx?: SxProps<Theme>;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export const AnchorButtonElement = React.forwardRef<
  HTMLAnchorElement,
  LinkVariantCommon & Omit<AppButtonAsAnchorProps, keyof SharedAppButtonProps | 'actionType' | 'intent' | 'surface' | 'onClick'>
>(function AnchorButtonElement(
  {
    href,
    target,
    rel,
    onKeyDown,
    resolvedStyle,
    size,
    effectiveDisabled,
    loading,
    resolvedStartIcon,
    endIcon,
    buttonChildren,
    sx,
    onClick,
    ...anchorRest
  },
  ref
) {
  const { handleClick, handleKeyDown } = buildDisabledLinkHandlers(effectiveDisabled, onClick, onKeyDown);
  return (
    <Button
      {...(anchorRest as Record<string, unknown>)}
      ref={ref}
      component="a"
      href={effectiveDisabled ? undefined : href}
      target={target}
      rel={target === '_blank' ? rel ?? 'noopener noreferrer' : rel}
      variant={resolvedStyle.variant}
      color={resolvedStyle.color}
      size={size}
      disabled={effectiveDisabled}
      aria-disabled={effectiveDisabled || undefined}
      aria-busy={loading || undefined}
      tabIndex={effectiveDisabled ? -1 : anchorRest.tabIndex}
      startIcon={resolvedStartIcon}
      endIcon={endIcon}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={mergeButtonSx(resolvedStyle.sx, sx)}
    >
      {buttonChildren}
    </Button>
  );
});

export const RouterLinkButtonElement = React.forwardRef<
  HTMLAnchorElement,
  LinkVariantCommon & Omit<AppButtonAsRouterLinkProps, keyof SharedAppButtonProps | 'actionType' | 'intent' | 'surface' | 'onClick'>
>(function RouterLinkButtonElement(
  {
    to,
    onKeyDown,
    resolvedStyle,
    size,
    effectiveDisabled,
    loading,
    resolvedStartIcon,
    endIcon,
    buttonChildren,
    sx,
    onClick,
    ...routerRest
  },
  ref
) {
  const { handleClick, handleKeyDown } = buildDisabledLinkHandlers(effectiveDisabled, onClick, onKeyDown);
  return (
    <Button
      {...(routerRest as Record<string, unknown>)}
      ref={ref}
      component={RouterLink}
      to={to}
      variant={resolvedStyle.variant}
      color={resolvedStyle.color}
      size={size}
      disabled={effectiveDisabled}
      aria-disabled={effectiveDisabled || undefined}
      aria-busy={loading || undefined}
      tabIndex={effectiveDisabled ? -1 : routerRest.tabIndex}
      startIcon={resolvedStartIcon}
      endIcon={endIcon}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      sx={mergeButtonSx(resolvedStyle.sx, sx)}
    >
      {buttonChildren}
    </Button>
  );
});
