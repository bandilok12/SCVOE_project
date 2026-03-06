import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, ChevronDown } from "lucide-react";
import { languages } from "@/i18n";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

declare global {
  interface Window {
    triggerGoogleTranslate?: (langCode: string) => void;
  }
}

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  const currentLang =
    languages.find((l) => l.code === i18n.language) ?? languages[0];

  // Map i18next language codes to Google Translate codes
  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en',
    'hi': 'hi',
    'te': 'te',
    'es': 'es',
    'fr': 'fr',
    'ar': 'ar',
    'pt': 'pt',
    'de': 'de',
    'ja': 'ja',
    'ru': 'ru',
    'ko': 'ko',
    'it': 'it',
    'th': 'th',
    'vi': 'vi',
    'nl': 'nl',
    'tr': 'tr',
    'pl': 'pl',
    'id': 'id',
    'ms': 'ms',
    'uk': 'uk',
    'sv': 'sv'
  };

  const changeLanguage = async (code: string) => {
    // Update i18next language
    localStorage.setItem("i18nextLng", code);
    await i18n.changeLanguage(code);
    
    // Trigger Google Translate via the global function
    const googleLangCode = langMap[code] || code;
    if (window.triggerGoogleTranslate) {
      window.triggerGoogleTranslate(googleLangCode);
    }
    
    setIsOpen(false);
  };

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLang.flag} {currentLang.name}
          </span>
          <ChevronDown className="h-3 w-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={`cursor-pointer ${
              i18n.language === lang.code ? "bg-accent" : ""
            }`}
          >
            <span className="mr-2">{lang.flag}</span>
            {lang.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSelector;
