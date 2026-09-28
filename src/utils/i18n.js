import { UI_STRINGS, TAB_STR_KEY, TAB_TITLES } from '../data/constants';

export function t(key, lang) {
  return (UI_STRINGS[lang] || UI_STRINGS.es)[key] || key;
}

export function getHeaderTitle(tabId, lang) {
  if (tabId === 'inicio') return `${t('greeting', lang)}`;
  return t(TAB_STR_KEY[tabId], lang) || TAB_TITLES[tabId];
}
