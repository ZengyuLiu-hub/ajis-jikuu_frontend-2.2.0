import { ReactNode, useEffect } from 'react';
import i18next from 'i18next';
import { initReactI18next, I18nextProvider } from 'react-i18next';

import { Languages, Lang } from '../types';
import { useLanguage } from '../selectors';

import enCommons from '../locales/en/commons.json';
import enMessages from '../locales/en/messages.json';
import enAtoms from '../locales/en/atoms.json';
import enMolecules from '../locales/en/molecules.json';
import enOrganisms from '../locales/en/organisms.json';
import enTemplates from '../locales/en/templates.json';
import enPages from '../locales/en/pages.json';

import jaCommons from '../locales/ja/commons.json';
import jaMessages from '../locales/ja/messages.json';
import jaAtoms from '../locales/ja/atoms.json';
import jaMolecules from '../locales/ja/molecules.json';
import jaOrganisms from '../locales/ja/organisms.json';
import jaTemplates from '../locales/ja/templates.json';
import jaPages from '../locales/ja/pages.json';

const resources = {
  en: {
    commons: enCommons,
    messages: enMessages,
    atoms: enAtoms,
    molecules: enMolecules,
    organisms: enOrganisms,
    templates: enTemplates,
    pages: enPages,
  },
  ja: {
    commons: jaCommons,
    messages: jaMessages,
    atoms: jaAtoms,
    molecules: jaMolecules,
    organisms: jaOrganisms,
    templates: jaTemplates,
    pages: jaPages,
  },
  // TODO 後続のストーリーで翻訳する際に言語対応
} as const;

i18next
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    ns: [
      'commons',
      'messages',
      'atoms',
      'molecules',
      'organisms',
      'templates',
      'pages',
    ],
    defaultNS: 'common',
    lng: Languages.ja,
    fallbackLng: Languages.ja,
    debug: process.env.NODE_ENV === 'development',

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },

    resources,
  });

i18next.languages = [Languages.ja, Languages.en];

interface Props {
  children: ReactNode;
}

export const I18N = (props: Props) => {
  const language = useLanguage();

  useEffect(() => {
    i18next.changeLanguage(language);
  }, [language]);

  return <I18nextProvider i18n={i18next}>{props.children}</I18nextProvider>;
};

export const i18n = i18next;

export const langList: Lang[] = [
  { label: '🇯🇵 日本語', lang: Languages.ja },
  { label: '🇺🇲 English', lang: Languages.en },
  { label: '🇨🇳 中国語（簡体字）', lang: Languages.cn },
  { label: '🇨🇳 中国語（繁体字）', lang: Languages.tw },
  { label: '🇰🇷 韓国語', lang: Languages.ko },
  { label: '🇻🇳 ベトナム語', lang: Languages.vi },
  { label: '🇹🇭 タイ語', lang: Languages.th },
];
