export type TravelMode = 'Land' | 'Water';
export type PassportType = 'BD' | 'Foreign';
export type TravelStage = 1 | 2 | 3;

export const TRAVEL_TAX_YEAR = '2026–27';
export const TRAVEL_TAX_ECONOMIC_CODE = '1144102';

export const LAND_PORTS: readonly string[] = [
  'Benapole',
  'Burimari',
  'Nakugaon',
  'Banglabandha',
  'Sheola',
  'Bhomra',
  'Sonamasjid',
  'Hili',
  'Akhaura',
  'Tamabil',
  'Bibirbazar',
  'Bholaganj',
  'Sonahat',
  'Dhanua Kamalpur',
  'Gobrakura-Koroitoli',
  'Teknaf',
] as const;

export interface SamplePassportEntry {
  passportNumber: string;
  passengerName: string;
  dob: string;
}

export const BD_SAMPLE_PASSPORTS: readonly SamplePassportEntry[] = [
  { passportNumber: 'TEST123456', passengerName: 'Md. Rafiqul Islam', dob: '1988-05-14' },
  { passportNumber: 'TEST230001', passengerName: 'Nusrat Jahan Chowdhury', dob: '1993-09-22' },
  { passportNumber: 'TEST230002', passengerName: 'Tanvir Ahmed', dob: '2017-04-10' },
  { passportNumber: 'TEST230003', passengerName: 'Ayaan Hossain', dob: '2023-02-18' },
  { passportNumber: 'TEST230004', passengerName: 'Farhana Yasmin', dob: '1979-12-03' },
  { passportNumber: 'TEST230005', passengerName: 'Mahmudul Hasan', dob: '2014-11-27' },
  { passportNumber: 'TEST230006', passengerName: 'Zara Karim', dob: '2021-08-05' },
  { passportNumber: 'TEST230007', passengerName: 'Kamrul Hasan', dob: '1965-03-19' },
  { passportNumber: 'TEST230008', passengerName: 'Tasnim Akter', dob: '2015-06-30' },
  { passportNumber: 'TEST230009', passengerName: 'Arifur Rahman', dob: '1999-01-25' },
] as const;

export const FOREIGN_NATIONALITIES: readonly string[] = [
  'Australia',
  'Canada',
  'China',
  'France',
  'Germany',
  'India',
  'Japan',
  'Malaysia',
  'Nepal',
  'Saudi Arabia',
  'Singapore',
  'United Arab Emirates',
  'United Kingdom',
  'United States',
] as const;

export interface DraftPassengerInput {
  id: string;
  passportType: PassportType;
  passportNumber: string;
  passengerName: string;
  dob: string;
  nationality: string;
  bdChecked: boolean;
  medicalAssessment: boolean;
}

export interface ConfirmedPassenger {
  id: string;
  passportType: PassportType;
  passportNumber: string;
  passportMasked: string;
  passengerName: string;
  dob: string;
  nationality?: string;
  needsRevalidation?: boolean;
}

export interface TravelDetailsInput {
  travelMode: TravelMode;
  departurePort: string;
  destination: string;
  travelDate: string;
}

export interface TravelPassengerErrors {
  passport?: string;
  passengerName?: string;
  dob?: string;
  nationality?: string;
  medical?: string;
  lookupUnavailable?: boolean;
}

export interface TravelDetailsErrors {
  departurePort?: string;
  destination?: string;
  travelDate?: string;
}
