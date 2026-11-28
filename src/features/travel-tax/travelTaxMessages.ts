export type TravelLang = 'en' | 'bn';

const EN_MESSAGES = {
  medicalBlock:
    'Medical exemptions are not granted automatically online. Report to the departure port tax desk for individual assessment.',
  invalidPassport: 'Enter a valid passport number (6–12 alphanumeric characters).',
  maskedPassportRejected:
    'Masked passport values cannot be verified. Enter the full passport number and reconfirm.',
  duplicatePassport: 'Duplicate passport number: this passenger is already confirmed.',
  checkPassportRequired: 'Click Check Passport to verify Bangladeshi passport details.',
  lookupUnavailable: 'Passport lookup unavailable for this number. Use a valid sample passport.',
  foreignNameRequired: 'Passport holder full name is required.',
  dobRequired: 'Date of birth is required.',
  dobInvalid: 'Enter a valid date of birth on or before today.',
  nationalityRequired: 'Nationality is required for foreign passport holders.',
  landPortRequired: 'Select an approved land departure port.',
  waterPortRequired: 'Enter the water departure port name.',
  destinationRequired: 'Destination country or city is required.',
  travelDateRequired: 'Planned travel date is required.',
  travelDatePast: 'Travel date cannot be in the past (Asia/Dhaka).',
  travelDateBeforeDob: 'Travel date cannot be earlier than a passenger date of birth.',
  mobileInvalid: 'Enter a valid 11-digit receipt mobile number (01XXXXXXXXX).',
  revalidateBeforeContinue: 'Re-enter and confirm masked passport numbers for all passengers before continuing.',
  noConfirmedPassengers: 'Confirm at least one passenger before continuing.',
  routeStateRejected:
    'Saved draft or transaction data does not belong to the active account or could not be verified.',
  preSubmitFailed:
    'Submission blocked: passenger confirmation, dates, port, mobile, or total tax calculation requires attention.',
} as const;

const BN_MESSAGES: Record<keyof typeof EN_MESSAGES, string> = {
  medicalBlock:
    'চিকিৎসাজনিত অব্যাহতি অনলাইনে স্বয়ংক্রিয়ভাবে দেওয়া হয় না। বহির্গমন বন্দরের কর ডেস্কে ব্যক্তিগত মূল্যায়নের জন্য যোগাযোগ করুন।',
  invalidPassport: '৬–১২ অক্ষর ও সংখ্যার সঠিক পাসপোর্ট নম্বর লিখুন।',
  maskedPassportRejected:
    'মাস্ক করা পাসপোর্ট নম্বর যাচাইকৃত হিসেবে গণ্য হয় না। সম্পূর্ণ পাসপোর্ট নম্বর লিখে পুনরায় নিশ্চিত করুন।',
  duplicatePassport: 'ডুপ্লিকেট পাসপোর্ট নম্বর: এই যাত্রী ইতিমধ্যে নিশ্চিত করা হয়েছে।',
  checkPassportRequired: 'বাংলাদেশি পাসপোর্ট যাচাই করতে "পাসপোর্ট যাচাই" বোতামে ক্লিক করুন।',
  lookupUnavailable: 'এই পাসপোর্ট নম্বরের তথ্য পাওয়া যায়নি। সঠিক নমুনা পাসপোর্ট ব্যবহার করুন।',
  foreignNameRequired: 'পাসপোর্টে উল্লেখিত পূর্ণ নাম আবশ্যক।',
  dobRequired: 'জন্ম তারিখ আবশ্যক।',
  dobInvalid: 'আজ বা তার পূর্বের সঠিক জন্ম তারিখ লিখুন।',
  nationalityRequired: 'বিদেশি পাসপোর্টধারীর জন্য জাতীয়তা আবশ্যক।',
  landPortRequired: 'একটি অনুমোদিত স্থল বন্দর নির্বাচন করুন।',
  waterPortRequired: 'জল বন্দরের নাম লিখুন।',
  destinationRequired: 'গন্তব্য দেশ বা শহরের নাম আবশ্যক।',
  travelDateRequired: 'ভ্রমণের সম্ভাব্য তারিখ আবশ্যক।',
  travelDatePast: 'ভ্রমণের তারিখ অতীতের হতে পারবে না (ঢাকা সময়)।',
  travelDateBeforeDob: 'ভ্রমণের তারিখ কোনো যাত্রীর জন্ম তারিখের আগে হতে পারবে না।',
  mobileInvalid: 'রসিদের জন্য ১১ ডিজিটের সঠিক বাংলাদেশি মোবাইল নম্বর দিন (01XXXXXXXXX)।',
  revalidateBeforeContinue: 'পরবর্তী ধাপে যাওয়ার আগে সকল যাত্রীর মাস্ক করা পাসপোর্ট পুনরায় লিখে নিশ্চিত করুন।',
  noConfirmedPassengers: 'এগিয়ে যাওয়ার আগে অন্তত একজন যাত্রী নিশ্চিত করুন।',
  routeStateRejected:
    'পুনরায় শুরু করা খসড়া বা পূর্ববর্তী লেনদেন বর্তমান অ্যাকাউন্টের সাথে মেলে না বা যাচাই করা যায়নি।',
  preSubmitFailed:
    'জমা দেওয়া বাতিল হয়েছে: যাত্রীর পাসপোর্ট নিশ্চিতকরণ, তারিখ, বন্দর, মোবাইল বা মোট কর পুনরায় যাচাই করুন।',
};

export function getTravelTaxMsg(lang: string | TravelLang) {
  return lang === 'bn' ? BN_MESSAGES : EN_MESSAGES;
}
