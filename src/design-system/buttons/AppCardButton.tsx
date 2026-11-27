import React from 'react';
import ButtonBase, { type ButtonBaseProps } from '@mui/material/ButtonBase';
import {
  isActionBlockedByPreviewPolicy,
  type PublicCapability,
} from '../../shared/previewPolicy';
import { getThemeColors } from '../theme';

export interface AppCardButtonProps extends Omit<ButtonBaseProps, 'component'> {
  selected?: boolean;
  previewRestricted?: boolean;
  publicCapability?: PublicCapability;
}

export const AppCardButton = React.forwardRef<HTMLButtonElement, AppCardButtonProps>(
  function AppCardButton(
    {
      type = 'button',
      selected = false,
      disabled = false,
      previewRestricted = false,
      publicCapability,
      onClick,
      className = '',
      sx,
      children,
      ...rest
    },
    ref
  ) {
    const blockedByPreview = isActionBlockedByPreviewPolicy({
      previewRestricted,
      publicCapability,
    });
    const effectiveDisabled = Boolean(disabled || blockedByPreview);

    const handleClick: React.MouseEventHandler<HTMLButtonElement> = (event) => {
      if (effectiveDisabled) {
        event.preventDefault();
        return;
      }
      onClick?.(event);
    };

    return (
      <ButtonBase
        ref={ref}
        type={type}
        disabled={effectiveDisabled}
        aria-pressed={selected || undefined}
        onClick={handleClick}
        className={className}
        sx={[
          (theme) => {
            const colors = getThemeColors(theme.palette.mode);
            return {
              display: 'flex',
              textAlign: 'left',
              fontFamily: 'inherit',
              justifyContent: 'flex-start',
              alignItems: 'stretch',
              '&:focus-visible': {
                outline: `2px solid ${colors.focus.homeOutline}`,
                outlineOffset: 3,
              },
            };
          },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
        {...rest}
      >
        {children}
      </ButtonBase>
    );
  }
);
