import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useTextToSpeech = () => {
  const { i18n } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      console.warn('Text-to-speech not supported');
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Map i18n language codes to speech synthesis language codes
    const langMap: { [key: string]: string } = {
      en: 'en-US',
      hi: 'hi-IN',
      te: 'te-IN',
      es: 'es-ES',
      fr: 'fr-FR',
      zh: 'zh-CN',
      ar: 'ar-SA',
      pt: 'pt-BR',
      de: 'de-DE',
      ja: 'ja-JP',
      ru: 'ru-RU',
      ko: 'ko-KR',
      it: 'it-IT',
      th: 'th-TH',
      vi: 'vi-VN',
      nl: 'nl-NL',
      tr: 'tr-TR',
      pl: 'pl-PL',
      id: 'id-ID',
      ms: 'ms-MY',
      uk: 'uk-UA',
      sv: 'sv-SE',
    };

    utterance.lang = langMap[i18n.language] || 'en-US';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, [i18n.language]);

  const stop = useCallback(() => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return { speak, stop, isSpeaking };
};
