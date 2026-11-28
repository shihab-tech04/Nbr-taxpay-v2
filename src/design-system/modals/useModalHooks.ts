import { useEffect, useRef, useState } from 'react';

export function useModalFocusRestore(open: boolean) {
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const wasOpenRef = useRef(false);

  useEffect(() => {
    if (open && !wasOpenRef.current) {
      previousFocusRef.current =
        document.activeElement instanceof HTMLElement ? document.activeElement : null;
    } else if (!open && wasOpenRef.current) {
      const prev = previousFocusRef.current;
      previousFocusRef.current = null;
      if (prev && prev.isConnected) {
        window.requestAnimationFrame(() => prev.focus());
      }
    }
    wasOpenRef.current = open;
  }, [open]);
}

export function useDirtyCloseGuard(
  open: boolean,
  isDirty: boolean,
  onClose: () => void,
  options: { disableBackdropClick?: boolean; disableEscapeKeyDown?: boolean } = {}
) {
  const [showDiscardPrompt, setShowDiscardPrompt] = useState(false);

  useEffect(() => {
    if (!open) {
      setShowDiscardPrompt(false);
    }
  }, [open]);

  const requestClose = (reason?: 'backdropClick' | 'escapeKeyDown') => {
    if (reason === 'backdropClick' && options.disableBackdropClick) return;
    if (reason === 'escapeKeyDown' && options.disableEscapeKeyDown) return;
    if (isDirty) {
      setShowDiscardPrompt(true);
      return;
    }
    setShowDiscardPrompt(false);
    onClose();
  };

  const confirmDiscard = () => {
    setShowDiscardPrompt(false);
    onClose();
  };

  const cancelDiscard = () => {
    setShowDiscardPrompt(false);
  };

  return {
    showDiscardPrompt: open && showDiscardPrompt,
    requestClose,
    confirmDiscard,
    cancelDiscard,
  };
}
