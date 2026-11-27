export type HomeLang = 'en' | 'bn';

export type HomeAction =
  | 'home'
  | 'pay'
  | 'other'
  | 'login'
  | 'guide'
  | 'report'
  | 'help'
  | 'history'
  | 'certificates'
  | 'corrections'
  | 'again'
  | 'drafts'
  | 'status'
  | 'receipts'
  | 'security'
  | 'nbr';

export type BannerPaymentService =
  | 'TAX_WITH_RETURN'
  | 'ADVANCE_TAX'
  | 'SOURCE_TAX_DEPOSIT'
  | 'TRAVEL_TAX';

export interface BannerSlide {
  id: string;
  serviceCode?: BannerPaymentService;
  headingEn: string;
  headingBn: string;
  mobileHeadingEn: string;
  mobileHeadingBn: string;
  descriptionEn: string;
  descriptionBn: string;
  mobileDescriptionEn: string;
  mobileDescriptionBn: string;
  actionEn: string;
  actionBn: string;
  image: string;
  mobileImage?: string;
  backgroundColor?: string | null;
  headingColor?: string | null;
  bodyColor?: string | null;
  outlineColor?: string | null;
}

export type BannerLoadStatus = 'loading' | 'ready' | 'unavailable';

export interface HomeCopy {
  meta: { title: string };
  nav: { home: string; guide: string; guideShort: string; report: string; help: string };
  login: string;
  dashboard: string;
  dashboardCta: string;
  eyebrow: string;
  heroTitle: string;
  heroBody: string;
  payTax: string;
  otherTax: string;
  langSwitch: string;
  langSwitchLabel: string;
  carousel: {
    regionLabel: string;
    regionDescription: string;
    controlsLabel: string;
    prev: string;
    next: string;
    goTo: (n: number) => string;
    slideAnnouncement: (index: number, total: number, heading: string) => string;
    unavailableTitle: string;
    loadingMessage: string;
    unavailableMessage: string;
    retryLabel: string;
  };
  find: {
    title: string;
    body: string;
    placeholder: string;
    emptyError: string;
    tooShort: string;
    noRecord: (ref: string) => string;
    noRecordHint: string;
    previewLookupNotice: string;
    sampleMatchBadge: string;
    search: string;
    clear: string;
  };
  help: {
    title: string;
    body: string;
    guide: string;
    chat: string;
  };
  section: {
    eyebrow: string;
    title: string;
    body: string;
    cta: string;
  };
  features: {
    all: {
      title: string;
      badge: string;
      body: string;
      chips: readonly [string, string, string];
      steps: readonly [string, string, string];
    };
    history: { title: string; body: string; taxYear: string };
    certs: { title: string; body: string; short: string };
    corrections: { title: string; body: string; short: string };
    again: { title: string; body: string; short: string };
    drafts: { title: string; body: string; short: string };
    secure: { title: string; body: string };
  };
  links: {
    status: string;
    receipts: string;
    security: string;
    nbr: string;
  };
  footer: {
    tagline: string;
    copyright: string;
  };
  dialogs: {
    close: string;
    otherTaxTitle: string;
    otherTaxSubtitle: string;
    otherTaxChoices: {
      travelTitle: string;
      travelBody: string;
      giftTitle: string;
      giftBody: string;
      allTitle: string;
      allBody: string;
    };
    helpTitle: string;
    helpSubtitle: string;
    helpTopics: ReadonlyArray<{ title: string; summary: string; route: string; cta: string }>;
    helplineLabel: string;
    lookupTitle: string;
    lookupClose: string;
    viewHistory: string;
    goToLogin: string;
    unavailableTitle: string;
    certificatesUnavailable: string;
    statusUnavailable: string;
  };
  taxYears: readonly [string, string, string, string];
}

export interface HomeViewProps {
  c: HomeCopy;
  language: HomeLang;
  onToggleLang: () => void;
  onAction: (action: HomeAction) => void;
  onSearch: (reference: string) => void;
  signedIn: boolean;
  sliderPaused: boolean;
}
