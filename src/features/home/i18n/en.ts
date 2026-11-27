import type { HomeCopy } from '../model/home.types';

export const en: HomeCopy = {
  meta: { title: 'Sohojkor · Income tax payments' },
  nav: { home: 'Home', guide: 'User guide', guideShort: 'Guide', report: 'Report', help: 'Help' },
  login: 'Login',
  dashboard: 'Dashboard',
  dashboardCta: 'Open dashboard',
  eyebrow: 'Income tax, simplified',
  heroTitle: 'Tax payments, without the confusion',
  heroBody:
    'Choose the payment you need, see what happens next, and keep the payment reference handy when you need it.',
  payTax: 'Pay Tax',
  otherTax: 'Other Tax',
  langSwitch: 'বাংলা',
  langSwitchLabel: 'Switch to Bangla',
  carousel: {
    regionLabel: 'Tax payment service banners',
    regionDescription: 'Swipe or use the arrow keys to change banner images and colors.',
    controlsLabel: 'Banner navigation',
    prev: 'Previous slide',
    next: 'Next slide',
    goTo: (n: number) => `Go to slide ${n}`,
    slideAnnouncement: (index: number, total: number, heading: string) =>
      `Banner ${index + 1} of ${total}: ${heading}`,
    unavailableTitle: 'Tax payments',
    loadingMessage: 'Loading banner information…',
    unavailableMessage:
      'Banner information is temporarily unavailable. Payment services are still accessible.',
    retryLabel: 'Retry banner loading',
  },
  find: {
    title: 'Find a payment record',
    body: 'Search by challan, token or transaction reference.',
    placeholder: 'Challan, token or reference',
    emptyError: 'Enter a payment reference.',
    tooShort: 'Enter at least 6 characters of your reference.',
    invalidFormat:
      'Enter a valid payment reference containing only letters, numbers, hyphens, or slashes.',
    serviceUnavailableTitle: 'Verification service unavailable',
    previewLookupNotice:
      'Live payment record verification is not connected in this read-only preview, so no missing-record result has been confirmed. Sign in through an official session to check verified records.',
    unauthorizedTitle: 'Sign-in or receipt verification required',
    unauthorizedHint:
      'Private or third-party payment records cannot be inspected without an authenticated taxpayer session.',
    noRecord: (ref: string) => `No record for “${ref}”.`,
    noRecordHint: 'Check the reference on your receipt, or log in to see all your payments.',
    sampleMatchBadge: 'Sample prototype record (not an official verified challan)',
    search: 'Search',
    clear: 'Clear search',
  },
  help: {
    title: 'New to paying online?',
    body: 'Our step-by-step guide walks you through your first payment.',
    guide: 'Read the guide',
    chat: 'Chat with us',
  },
  section: {
    eyebrow: 'Services',
    title: 'Everything in one place',
    body: 'Pay, organise and track your taxes.',
    cta: 'Log in for your dashboard',
  },
  features: {
    all: {
      title: 'All Tax Payments',
      badge: 'Start here',
      body: 'Pay taxes for yourself, family or clients.',
      chips: ['Yourself', 'Family', 'Clients'],
      steps: ['Choose tax type', 'Pay securely', 'Get your receipt'],
    },
    history: {
      title: 'Payment History',
      body: 'Past payments, tax years and receipts.',
      taxYear: 'Tax year',
    },
    certs: {
      title: 'Tax Certificates',
      body: 'Find and download available tax certificates.',
      short: 'Find & download',
    },
    corrections: {
      title: 'Corrections & Requests',
      body: 'Request corrections and follow their progress.',
      short: 'Request & track',
    },
    again: {
      title: 'Pay Again',
      body: 'Reuse and edit a previous payment.',
      short: 'Reuse & edit',
    },
    drafts: {
      title: 'Saved Drafts',
      body: 'Save a payment and continue it later.',
      short: 'Continue later',
    },
    secure: {
      title: 'Secure & NBR-aligned',
      body: 'Encrypted payments with instant challan and receipt.',
    },
  },
  links: {
    status: 'Payment status & receipt',
    receipts: 'Receipts & corrections',
    security: 'Security & support',
    nbr: 'NBR publications',
  },
  footer: {
    tagline: 'Income tax payment information',
    copyright: '© 2026 Sohojkor',
  },
  dialogs: {
    close: 'Close',
    otherTaxTitle: 'Other tax payments',
    otherTaxSubtitle: 'Select a tax type to continue.',
    otherTaxChoices: {
      travelTitle: 'Travel Tax',
      travelBody: 'Continue through the Travel Tax assessment and payment journey.',
      giftTitle: 'Gift Tax',
      giftBody: 'Enter Donor and Donee Gift Tax declaration details.',
    },
    helpTitle: 'Sohojkor help',
    helpSubtitle: 'Guide-based answers',
    helpOpening: 'How can we help? Choose a topic or type a question.',
    helpQuestionPlaceholder: 'Ask a question',
    helpSendLabel: 'Send',
    helpOpenGuide: 'Open user guide',
    helpDisclaimer: 'Not tax advice or a calculation service.',
    helpFallbackAnswer:
      'Ask about payment, receipts or travel tax. Open the user guide for step-by-step instructions.',
    helpTopics: [
      {
        id: 'payments',
        title: 'Income tax payments',
        summary: 'How to choose a tax category and preview a challan.',
        keywords: ['pay', 'payment', 'return', 'advance', 'ait', 'tds', 'tax', 'challan'],
        answer:
          'Open All Tax Payments, choose Tax with Return or Other Tax, confirm the assessment year and amount, then review the preview before proceeding.',
        category: 'payments',
      },
      {
        id: 'records',
        title: 'Receipts & corrections',
        summary: 'Checking a reference, sample receipts, and correction requests.',
        keywords: ['receipt', 'history', 'verify', 'reference', 'correction', 'certificate'],
        answer:
          'Use Find a payment record with your challan or transaction reference, or check Payment History and Corrections once signed in.',
        category: 'records',
      },
      {
        id: 'travel-gift',
        title: 'Travel & Gift tax',
        summary: 'Departure travel tax routes and donor/donee gift declarations.',
        keywords: ['travel', 'passport', 'gift', 'donor', 'donee', 'other'],
        answer:
          'Choose Other Tax from the hero banner to calculate Travel Tax by route and travel class or enter Gift Tax donor/donee details.',
        category: 'travel',
      },
    ],
    helplineLabel: 'NBR National Call Center Helpline: 16555',
    lookupTitle: 'Payment Record Lookup',
    lookupClose: 'Close lookup',
    viewHistory: 'Open Payment History',
    goToLogin: 'Go to Login',
    unavailableTitle: 'Service Unavailable',
    certificatesUnavailable:
      'Dedicated tax certificate downloads (certificates contract) are not yet connected in this cleanroom preview. Payment History lists sample challan previews.',
    statusUnavailable:
      'Public payment verification (verify contract) is not connected to an official backend in this cleanroom preview. Use Payment History for sample records.',
  },
  taxYears: ['2025–26', '2024–25', '2023–24', '2022–23'],
};
