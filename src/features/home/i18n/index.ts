import type { HomeCopy, HomeLang } from '../model/home.types';
import { bn } from './bn';
import { en } from './en';

export const homeCopy: Record<HomeLang, HomeCopy> = { en, bn };
