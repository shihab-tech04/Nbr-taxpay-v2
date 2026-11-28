export type YmdMonth = '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10' | '11' | '12';
export type YmdDay =
  | '01' | '02' | '03' | '04' | '05' | '06' | '07' | '08' | '09' | '10'
  | '11' | '12' | '13' | '14' | '15' | '16' | '17' | '18' | '19' | '20'
  | '21' | '22' | '23' | '24' | '25' | '26' | '27' | '28' | '29' | '30' | '31';
export type YmdDateString = `${number}-${YmdMonth}-${YmdDay}`;

export type BeneficiaryRelationship =
  | 'Father' | 'Mother' | 'Siblings' | 'Son' | 'Daughter' | 'Spouse' | 'Friends' | 'Clients' | 'Others';

export interface GiftPartyRecord {
  tin: string;
  name: string;
  classification?: string;
  relationship?: BeneficiaryRelationship;
  relationshipTag?: string;
}

export interface GiftDetails {
  donorTin: string;
  donorName: string;
  doneeTin: string;
  doneeName: string;
  relationship: BeneficiaryRelationship;
  relationshipTag: string;
  giftValue: number;
  giftDate: YmdDateString;
  description: string;
  remarks?: string;
  estimatedTax: number;
  creditAttributionRole: 'donor';
  throughName: string;
  throughTin: string;
  onBehalfOfName: string;
  onBehalfOfTin: string;
}

export interface GiftDraftSnapshot {
  donor: GiftPartyRecord | null;
  donee: GiftPartyRecord | null;
  relationship?: BeneficiaryRelationship | '';
  relationshipTag?: string;
  giftAmountInput: string;
  giftDate: string;
  description: string;
  remarks?: string;
  creditAttributionRole?: 'donor';
  throughTin?: string;
  throughName?: string;
  onBehalfOfTin?: string;
  onBehalfOfName?: string;
  stage?: 1 | 2 | 3;
}
