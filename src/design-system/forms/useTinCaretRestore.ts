import { useLayoutEffect, useRef } from 'react';
import type React from 'react';

export function useTinCaretRestore(
  inputRef: React.RefObject<HTMLInputElement | null>,
  value: string,
  onChange: (nextValue: string) => void
) {
  const pendingCaretRef = useRef<number | null>(null);

  useLayoutEffect(() => {
    const targetIndex = pendingCaretRef.current;
    const el = inputRef.current;
    if (targetIndex === null || !el) return;
    pendingCaretRef.current = null;
    if (document.activeElement === el) {
      const clamped = Math.min(targetIndex, value.length);
      el.setSelectionRange(clamped, clamped);
    }
  }, [value, inputRef]);

  return (nextValue: string, nextCaretIndex: number) => {
    pendingCaretRef.current = nextCaretIndex;
    onChange(nextValue);
    if (nextValue === value) {
      queueMicrotask(() => {
        const el = inputRef.current;
        if (pendingCaretRef.current !== null && el && document.activeElement === el) {
          const clamped = Math.min(pendingCaretRef.current, el.value.length);
          pendingCaretRef.current = null;
          el.setSelectionRange(clamped, clamped);
        }
      });
    }
  };
}
