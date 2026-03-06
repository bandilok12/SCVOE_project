import { useEffect, useState } from 'react';

interface GoogleTranslateElement {
  new (
    options: {
      pageLanguage: string;
      includedLanguages: string;
      layout: number;
      autoDisplay: boolean;
    },
    elementId: string
  ): void;
  InlineLayout: {
    SIMPLE: number;
  };
}

declare global {
  interface Window {
    google?: {
      translate?: {
        TranslateElement: GoogleTranslateElement;
      };
    };
    googleTranslateElementInit?: () => void;
  }
}

const GoogleTranslateBar = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Remove banner frame that blocks content
    const removeBanner = () => {
      const banner = document.querySelector('.goog-te-banner-frame.skiptranslate');
      if (banner) {
        banner.remove();
      }
      // Reset body top offset that Google Translate adds
      document.body.style.top = '0px';
      document.body.style.position = 'static';
    };

    // Initialize Google Translate Widget
    const initTranslate = () => {
      console.log('Initializing Google Translate...');
      
      if (window.google?.translate?.TranslateElement) {
        const container = document.getElementById('google_translate_element');
        if (container) {
          container.innerHTML = ''; // Clear any existing content
          
          try {
            new window.google.translate.TranslateElement(
              {
                pageLanguage: 'en',
                includedLanguages: 'en,hi,te,es,fr,zh-CN,ar,pt,de,ja,ru,ko,it,th,vi,nl,tr,pl,id,ms,uk,sv',
                layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false,
              },
              'google_translate_element'
            );
            console.log('Google Translate initialized successfully');
            setIsLoaded(true);
            
            // Remove banner after initialization
            setTimeout(removeBanner, 100);
          } catch (error) {
            console.error('Error initializing Google Translate:', error);
          }
        }
      } else if (retryCount < 5) {
        // Retry if Google Translate hasn't loaded yet
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
        }, 500);
      }
    };

    // Set up callback for Google Translate
    window.googleTranslateElementInit = initTranslate;

    // Load the script if not already loaded
    const loadScript = () => {
      const existingScript = document.getElementById('google-translate-script');
      
      if (existingScript) {
        // Script already exists, try to initialize
        if (window.google?.translate) {
          initTranslate();
        }
        return;
      }

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Failed to load Google Translate script');
        setIsLoaded(false);
      };
      
      document.head.appendChild(script);
      console.log('Google Translate script added to page');
    };

    // Wait for DOM to be fully ready
    if (document.readyState === 'complete') {
      loadScript();
    } else {
      window.addEventListener('load', loadScript);
    }

    // Set up mutation observer to remove banner if it appears
    const observer = new MutationObserver(removeBanner);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      window.removeEventListener('load', loadScript);
    };
  }, [retryCount]);

  return (
        <div id="google_translate_element" />
        
  );
};

export default GoogleTranslateBar;
