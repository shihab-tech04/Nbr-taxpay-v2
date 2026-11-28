export interface PaymentAttemptParams<T> {
  lockRef: { current: boolean };
  run: () => T;
  onSuccess: (result: T) => void;
  onError: (message: string) => void;
  fallbackError: string;
}

export function executePaymentAttempt<T>({
  lockRef,
  run,
  onSuccess,
  onError,
  fallbackError,
}: PaymentAttemptParams<T>): boolean {
  if (lockRef.current) return false;
  lockRef.current = true;
  try {
    const result = run();
    onSuccess(result);
    return true;
  } catch (err) {
    lockRef.current = false;
    const message = err instanceof Error && err.message.trim() ? err.message : fallbackError;
    onError(message);
    return false;
  }
}
