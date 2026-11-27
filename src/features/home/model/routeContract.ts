import type { HelpGuideTopic, HomeAction } from './home.types';

export type OriginalContractKey =
  | 'home-2'
  | 'guest'
  | 'taxpayer_home'
  | 'taxpayer_login'
  | 'user_guide'
  | 'incident'
  | 'history'
  | 'corrections'
  | 'certificates'
  | 'verify';

export type HomeRouteTarget =
  | { kind: 'navigate'; path: string; contract: OriginalContractKey; scrollTop?: boolean }
  | { kind: 'dialog'; dialog: 'other' | 'help' }
  | { kind: 'unavailable'; unavailableKind: 'certificates' | 'status'; contract: OriginalContractKey }
  | { kind: 'external'; url: string };

export const NBR_PUBLICATIONS_URL = 'https://nbr.gov.bd/';

export function resolveHomeActionTarget(
  action: HomeAction,
  signedIn: boolean
): HomeRouteTarget {
  switch (action) {
    case 'home':
      return { kind: 'navigate', path: '/', contract: 'home-2', scrollTop: true };
    case 'pay':
      return { kind: 'navigate', path: '/all-taxes', contract: 'guest' };
    case 'other':
      return { kind: 'dialog', dialog: 'other' };
    case 'login':
      return signedIn
        ? { kind: 'navigate', path: '/dashboard', contract: 'taxpayer_home' }
        : { kind: 'navigate', path: '/login', contract: 'taxpayer_login' };
    case 'guide':
      return { kind: 'navigate', path: '/support?contract=user_guide', contract: 'user_guide' };
    case 'receipts':
      return {
        kind: 'navigate',
        path: '/support?contract=user_guide&category=records',
        contract: 'user_guide',
      };
    case 'security':
      return {
        kind: 'navigate',
        path: '/support?contract=user_guide&category=security',
        contract: 'user_guide',
      };
    case 'report':
      return { kind: 'navigate', path: '/support?contract=incident', contract: 'incident' };
    case 'help':
      return { kind: 'dialog', dialog: 'help' };
    case 'history':
    case 'again':
      return { kind: 'navigate', path: '/history', contract: 'history' };
    case 'drafts':
      return signedIn
        ? { kind: 'navigate', path: '/drafts', contract: 'taxpayer_home' }
        : { kind: 'navigate', path: '/login', contract: 'taxpayer_login' };
    case 'corrections':
      return { kind: 'navigate', path: '/corrections', contract: 'corrections' };
    case 'certificates':
      return {
        kind: 'unavailable',
        unavailableKind: 'certificates',
        contract: signedIn ? 'certificates' : 'verify',
      };
    case 'status':
      return {
        kind: 'unavailable',
        unavailableKind: 'status',
        contract: 'verify',
      };
    case 'nbr':
      return { kind: 'external', url: NBR_PUBLICATIONS_URL };
  }
}

export function matchHelpAnswer(
  query: string,
  topics: readonly HelpGuideTopic[],
  fallbackAnswer: string
): string {
  const normalized = query
    .toLocaleLowerCase()
    .replace(/[?!।.,]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  if (!normalized) return fallbackAnswer;

  let bestTopic: HelpGuideTopic | undefined;
  let bestScore = 0;

  for (const topic of topics) {
    let score = 0;
    for (const kw of topic.keywords) {
      const needle = kw.toLocaleLowerCase();
      if (normalized.includes(needle)) {
        score += needle.length * needle.length;
      }
    }
    if (topic.title.toLocaleLowerCase().includes(normalized)) {
      score += normalized.length * normalized.length;
    }
    if (score > bestScore) {
      bestScore = score;
      bestTopic = topic;
    }
  }

  return bestTopic?.answer ?? fallbackAnswer;
}
