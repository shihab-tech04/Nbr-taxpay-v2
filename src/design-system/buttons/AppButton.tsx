import React from 'react';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import { isActionBlockedByPreviewPolicy } from '../../shared/previewPolicy';
import { mergeButtonSx, resolveButtonStyle } from './buttonConfig';
import { AnchorButtonElement, RouterLinkButtonElement } from './ButtonLinkElements';
import type {
  AppButtonAsAnchorProps,
  AppButtonAsButtonProps,
  AppButtonAsRouterLinkProps,
  AppButtonComponent,
  AppButtonProps,
  SharedAppButtonProps,
} from './buttonTypes';

export type {
  AppButtonAsAnchorProps,
  AppButtonAsButtonProps,
  AppButtonAsRouterLinkProps,
  AppButtonProps,
};

const AppButtonImpl = React.forwardRef<HTMLButtonElement | HTMLAnchorElement, AppButtonProps>(
  function AppButton(props, ref) {
    const {
      actionType = 'primary',
      intent = 'default',
      palette = 'brand',
      surface = 'outlined',
      geometry = 'standard',
      size = 'medium',
      loading = false,
      loadingLabel,
      disabled = false,
      previewRestricted = false,
      publicCapability,
      startIcon,
      endIcon,
      children,
      sx,
      onClick,
      ...rest
    } = props;

    const blockedByPreview = isActionBlockedByPreviewPolicy({ previewRestricted, publicCapability });
    const effectiveDisabled = Boolean(disabled || loading || blockedByPreview);
    const resolvedStyle = resolveButtonStyle({
      actionType,
      intent,
      palette,
      surface: actionType === 'secondary' ? surface : 'outlined',
      geometry,
    });
    const resolvedStartIcon = loading ? (
      <CircularProgress size={16} color="inherit" aria-hidden="true" />
    ) : (
      startIcon
    );
    const content = loading && loadingLabel ? loadingLabel : children;

    if ('href' in props && props.href !== undefined) {
      const anchorRest = rest as Omit<
        AppButtonAsAnchorProps,
        keyof SharedAppButtonProps | 'actionType' | 'intent' | 'surface' | 'onClick'
      >;
      return (
        <AnchorButtonElement
          {...anchorRest}
          ref={ref as React.Ref<HTMLAnchorElement>}
          resolvedStyle={resolvedStyle}
          size={size}
          effectiveDisabled={effectiveDisabled}
          loading={loading}
          resolvedStartIcon={resolvedStartIcon}
          endIcon={endIcon}
          buttonChildren={content}
          sx={sx}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        />
      );
    }

    if ('to' in props && props.to !== undefined) {
      const routerRest = rest as Omit<
        AppButtonAsRouterLinkProps,
        keyof SharedAppButtonProps | 'actionType' | 'intent' | 'surface' | 'onClick'
      >;
      return (
        <RouterLinkButtonElement
          {...routerRest}
          ref={ref as React.Ref<HTMLAnchorElement>}
          resolvedStyle={resolvedStyle}
          size={size}
          effectiveDisabled={effectiveDisabled}
          loading={loading}
          resolvedStartIcon={resolvedStartIcon}
          endIcon={endIcon}
          buttonChildren={content}
          sx={sx}
          onClick={onClick as React.MouseEventHandler<HTMLAnchorElement> | undefined}
        />
      );
    }

    const { type = 'button', ...buttonRest } = rest as Omit<
      AppButtonAsButtonProps,
      keyof SharedAppButtonProps | 'actionType' | 'intent' | 'surface'
    >;

    return (
      <Button
        {...(buttonRest as Record<string, unknown>)}
        ref={ref as React.Ref<HTMLButtonElement>}
        type={type}
        variant={resolvedStyle.variant}
        color={resolvedStyle.color}
        size={size}
        disabled={effectiveDisabled}
        aria-busy={loading || undefined}
        startIcon={resolvedStartIcon}
        endIcon={endIcon}
        onClick={(event: React.MouseEvent<HTMLButtonElement>) => {
          if (effectiveDisabled) {
            event.preventDefault();
            return;
          }
          (onClick as React.MouseEventHandler<HTMLButtonElement> | undefined)?.(event);
        }}
        sx={mergeButtonSx(resolvedStyle.sx, sx)}
      >
        {content}
      </Button>
    );
  }
);

export const AppButton = AppButtonImpl as unknown as AppButtonComponent;
