export interface RecordVerificationServiceStatus {
  available: boolean;
  mode: 'unavailable' | 'live';
  reason: 'payment_verification_unconfigured';
}

// Record verification is a dedicated payment-record capability and must NEVER be
// inferred from branding/banner CMS configuration.
export function getRecordVerificationServiceStatus(): RecordVerificationServiceStatus {
  return {
    available: false,
    mode: 'unavailable',
    reason: 'payment_verification_unconfigured',
  };
}
