export function maskProfileTin(tin: string): string {
  const digits = tin.replace(/\D/g, '');
  if (digits.length < 4) return '••••';
  const prefix = digits.slice(0, 3);
  const suffix = digits.slice(-3);
  return `${prefix} •••• •${suffix}`;
}

export function maskProfilePhone(phone: string): string {
  const cleaned = phone.trim();
  if (cleaned.length < 6) return '••••••';
  const start = cleaned.slice(0, 5);
  const end = cleaned.slice(-3);
  return `${start}••••${end}`;
}

export function maskProfileEmail(email: string): string {
  const parts = email.split('@');
  if (parts.length !== 2) return '••••@••••';
  const local = parts[0];
  const domain = parts[1];
  const visible = local.slice(0, 2);
  return `${visible}••••@${domain}`;
}

export function formatProfileValue(
  key: string,
  value: string,
  revealed: boolean
): string {
  if (revealed) return value;
  if (key === 'tin') return maskProfileTin(value);
  if (key === 'mobileNumber') return maskProfilePhone(value);
  if (key === 'emailAddress') return maskProfileEmail(value);
  return value;
}
