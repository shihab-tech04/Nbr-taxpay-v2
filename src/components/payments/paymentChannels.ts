export type ActivePaymentChannel =
  | 'bKash'
  | 'Nagad'
  | 'Rocket'
  | 'Visa/Mastercard'
  | 'CityBank';

export type FutureGatewayCode =
  | 'BKASH'
  | 'NAGAD'
  | 'ROCKET'
  | 'INTERNET_BANKING'
  | 'SONALI_E_SHEBA'
  | 'BEFTN_RTGS'
  | 'VISA'
  | 'MASTERCARD'
  | 'BANK_BRANCH';

export interface ActivePaymentChannelOption {
  value: ActivePaymentChannel;
  title: string;
  description: string;
  group: 'mfs' | 'bank' | 'card';
  mode: 'NOW' | 'OTC';
  futureGatewayCodes: readonly FutureGatewayCode[];
}

export const ACTIVE_PAYMENT_CHANNEL_OPTIONS: readonly ActivePaymentChannelOption[] = [
  {
    value: 'bKash',
    title: 'bKash',
    description: 'Mobile financial service',
    group: 'mfs',
    mode: 'NOW',
    futureGatewayCodes: ['BKASH'],
  },
  {
    value: 'Nagad',
    title: 'Nagad',
    description: 'Mobile financial service',
    group: 'mfs',
    mode: 'NOW',
    futureGatewayCodes: ['NAGAD'],
  },
  {
    value: 'Rocket',
    title: 'Rocket',
    description: 'Mobile banking wallet',
    group: 'mfs',
    mode: 'NOW',
    futureGatewayCodes: ['ROCKET'],
  },
  {
    value: 'Visa/Mastercard',
    title: 'Visa/Mastercard',
    description: 'Debit or credit card',
    group: 'card',
    mode: 'NOW',
    futureGatewayCodes: ['VISA', 'MASTERCARD'],
  },
  {
    value: 'CityBank',
    title: 'CityBank',
    description: 'Online banking & branch',
    group: 'bank',
    mode: 'NOW',
    futureGatewayCodes: ['INTERNET_BANKING', 'SONALI_E_SHEBA', 'BEFTN_RTGS', 'BANK_BRANCH'],
  },
] as const;
