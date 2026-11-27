// All compiled builds are read-only until authentic existing API integration is accepted.
export const PUBLIC_PREVIEW =
  typeof import.meta !== 'undefined' && import.meta.env ? import.meta.env.PROD : false;
