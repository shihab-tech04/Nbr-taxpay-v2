import React from 'react';
import ButtonBase, { type ButtonBaseProps } from '@mui/material/ButtonBase';
import { PUBLIC_PREVIEW } from '../../shared/previewMode';

export interface AppCardButtonProps extends Omit<ButtonBaseProps, 'component'> {
  selected?: boolean;
  previewRestricted?: boolean;
}

export const AppCardButton = React.forwardRef<HTMLButtonElement, AppCardButtonProps>(
  function AppCardButton(
    {
      type = 'button',
      selected = false,
      disabled = false,
      previewRestricted = false,
      onClick,
      className = '',
      sx,
      children,
      ...rest
    },
    ref
  ) {
    const isPreviewDisabled = Boolean(previewRestricted && PUBLIC_PREVIEW);
    const effectiveDisabled = Boolean(disabled || isPreviewDisabled);

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
          {
            display: 'flex',
            textAlign: 'left',
            fontFamily: 'inherit',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            '&:focus-visible': {
              outline: '2px solid #2C5EAD',
              outlineOffset: 3,
            },
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
