import English from './packs/en.json';
import German from './packs/de.json';

const languages = {
  en: English,
  de: German,
};

interface KeywordType {
  value: string;
  key: string;
}

export function I18N(
  key: any,
  language: 'de' | 'en',
  keywords?: KeywordType[],
): string {
  // @ts-ignore
  let i18nText: string = languages[language][key] || key;
  //Converting {keyword vals}
  if (keywords != undefined) {
    keywords.forEach(keyword => {
      i18nText = i18nText.replaceAll(`{${keyword.key}}`, keyword.value);
    });
  }
  return i18nText;
}
