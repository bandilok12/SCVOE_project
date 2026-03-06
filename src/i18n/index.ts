import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './translations/en.json';
import hi from './translations/hi.json';
import te from './translations/te.json';
import es from './translations/es.json';
import fr from './translations/fr.json';
import zh from './translations/zh.json';
import ar from './translations/ar.json';
import pt from './translations/pt.json';
import de from './translations/de.json';
import ja from './translations/ja.json';
import ru from './translations/ru.json';
import ko from './translations/ko.json';
import it from './translations/it.json';
import th from './translations/th.json';
import vi from './translations/vi.json';
import nl from './translations/nl.json';
import tr from './translations/tr.json';
import pl from './translations/pl.json';
import id from './translations/id.json';
import ms from './translations/ms.json';
import uk from './translations/uk.json';
import sv from './translations/sv.json';

export const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
  { code: 'te', name: 'తెలుగు', flag: '🇮🇳' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
  { code: 'it', name: 'Italiano', flag: '🇮🇹' },
  { code: 'th', name: 'ไทย', flag: '🇹🇭' },
  { code: 'vi', name: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
  { code: 'id', name: 'Indonesia', flag: '🇮🇩' },
  { code: 'ms', name: 'Bahasa Melayu', flag: '🇲🇾' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'sv', name: 'Svenska', flag: '🇸🇪' },
];

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      te: { translation: te },
      es: { translation: es },
      fr: { translation: fr },
      zh: { translation: zh },
      ar: { translation: ar },
      pt: { translation: pt },
      de: { translation: de },
      ja: { translation: ja },
      ru: { translation: ru },
      ko: { translation: ko },
      it: { translation: it },
      th: { translation: th },
      vi: { translation: vi },
      nl: { translation: nl },
      tr: { translation: tr },
      pl: { translation: pl },
      id: { translation: id },
      ms: { translation: ms },
      uk: { translation: uk },
      sv: { translation: sv },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
