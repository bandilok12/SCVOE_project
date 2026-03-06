import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mic, MicOff, X, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useTextToSpeech } from '@/hooks/use-text-to-speech';
import { supabase } from '@/integrations/supabase/client';

// Extend Window interface for SpeechRecognition
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  abort(): void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition?: new () => ISpeechRecognition;
    webkitSpeechRecognition?: new () => ISpeechRecognition;
  }
}

// Multi-language voice commands
const multiLangCommands: { [lang: string]: { [key: string]: string[] } } = {
  en: {
    home: ['home', 'go home', 'main page'],
    shop: ['shop', 'store', 'marketplace', 'go to shop'],
    cart: ['cart', 'shopping cart', 'view cart', 'open cart', 'my cart'],
    checkout: ['checkout', 'proceed to checkout', 'pay now', 'complete order', 'place order'],
    clearCart: ['clear cart', 'empty cart', 'remove all items', 'clear my cart'],
    orders: ['orders', 'my orders', 'order status', 'check orders'],
    prediction: ['prediction', 'predict', 'crop prediction'],
    analytics: ['analytics', 'dashboard'],
    contact: ['contact', 'contact us'],
    login: ['login', 'sign in', 'sign up'],
  },
  hi: {
    home: ['होम', 'मुख्य पृष्ठ', 'घर'],
    shop: ['दुकान', 'स्टोर', 'खरीदारी'],
    cart: ['कार्ट', 'टोकरी', 'मेरी टोकरी'],
    checkout: ['चेकआउट', 'भुगतान करें', 'ऑर्डर दें'],
    clearCart: ['कार्ट खाली करें', 'सब हटाएं'],
    orders: ['ऑर्डर', 'मेरे ऑर्डर'],
    prediction: ['भविष्यवाणी', 'फसल भविष्यवाणी'],
    analytics: ['विश्लेषण', 'डैशबोर्ड'],
    contact: ['संपर्क', 'हमसे संपर्क करें'],
    login: ['लॉगिन', 'साइन इन'],
  },
  te: {
    home: ['హోమ్', 'ముఖ్య పేజీ', 'హోమ్‌కు వెళ్లండి'],
    shop: ['షాప్', 'స్టోర్', 'దుకాణం', 'షాప్‌కు వెళ్లండి'],
    cart: ['కార్ట్', 'నా కార్ట్', 'బుట్ట'],
    checkout: ['చెకౌట్', 'చెకౌట్‌కు వెళ్లండి', 'చెల్లింపు', 'ఆర్డర్ పెట్టు'],
    clearCart: ['కార్ట్ ఖాళీ చేయండి', 'కార్ట్ క్లియర్', 'అన్నీ తొలగించండి'],
    orders: ['ఆర్డర్లు', 'నా ఆర్డర్లు', 'ఆర్డర్ స్థితి'],
    prediction: ['అంచనా', 'పంట అంచనా'],
    analytics: ['విశ్లేషణ', 'డ్యాష్‌బోర్డ్'],
    contact: ['సంప్రదించండి'],
    login: ['లాగిన్', 'సైన్ ఇన్'],
  },
  it: {
    home: ['home', 'pagina principale', 'vai alla home'],
    shop: ['negozio', 'shop', 'vai al negozio'],
    cart: ['carrello', 'il mio carrello', 'apri carrello'],
    checkout: ['checkout', 'vai alla cassa', 'procedi al checkout', 'paga'],
    clearCart: ['svuota carrello', 'pulisci carrello', 'rimuovi tutto'],
    orders: ['ordini', 'i miei ordini', 'stato ordine'],
    prediction: ['previsione', 'previsione raccolto'],
    analytics: ['analisi', 'dashboard'],
    contact: ['contatto', 'contattaci'],
    login: ['accedi', 'login', 'registrati'],
  },
  th: {
    home: ['หน้าแรก', 'กลับหน้าแรก'],
    shop: ['ร้านค้า', 'ไปที่ร้านค้า', 'ช้อปปิ้ง'],
    cart: ['ตะกร้า', 'ตะกร้าสินค้า', 'ตะกร้าของฉัน'],
    checkout: ['ชำระเงิน', 'ไปชำระเงิน', 'เช็คเอาท์'],
    clearCart: ['ล้างตะกร้า', 'เคลียร์ตะกร้า', 'ลบทั้งหมด'],
    orders: ['คำสั่งซื้อ', 'คำสั่งซื้อของฉัน', 'สถานะคำสั่งซื้อ'],
    prediction: ['พยากรณ์', 'พยากรณ์พืชผล'],
    analytics: ['การวิเคราะห์', 'แดชบอร์ด'],
    contact: ['ติดต่อ', 'ติดต่อเรา'],
    login: ['เข้าสู่ระบบ', 'ลงชื่อเข้าใช้'],
  },
  vi: {
    home: ['trang chủ', 'về trang chủ'],
    shop: ['cửa hàng', 'đi đến cửa hàng', 'mua sắm'],
    cart: ['giỏ hàng', 'mở giỏ hàng', 'giỏ của tôi'],
    checkout: ['thanh toán', 'đi thanh toán', 'checkout'],
    clearCart: ['xóa giỏ hàng', 'làm trống giỏ', 'xóa tất cả'],
    orders: ['đơn hàng', 'đơn hàng của tôi', 'trạng thái đơn hàng'],
    prediction: ['dự đoán', 'dự đoán cây trồng'],
    analytics: ['phân tích', 'bảng điều khiển'],
    contact: ['liên hệ', 'liên hệ chúng tôi'],
    login: ['đăng nhập', 'đăng ký'],
  },
  es: {
    home: ['inicio', 'página principal', 'ir a inicio'],
    shop: ['tienda', 'comprar', 'ir a tienda'],
    cart: ['carrito', 'mi carrito', 'ver carrito'],
    checkout: ['pagar', 'finalizar compra', 'proceder al pago'],
    clearCart: ['vaciar carrito', 'limpiar carrito'],
    orders: ['pedidos', 'mis pedidos', 'estado del pedido'],
    prediction: ['predicción', 'predecir cultivo'],
    analytics: ['análisis', 'estadísticas'],
    contact: ['contacto', 'contáctenos'],
    login: ['iniciar sesión', 'registrarse'],
  },
  fr: {
    home: ['accueil', 'page principale', 'aller à accueil'],
    shop: ['boutique', 'magasin', 'acheter'],
    cart: ['panier', 'mon panier', 'voir panier'],
    checkout: ['payer', 'finaliser la commande', 'passer à la caisse'],
    clearCart: ['vider le panier', 'effacer panier'],
    orders: ['commandes', 'mes commandes', 'statut commande'],
    prediction: ['prédiction', 'prédire récolte'],
    analytics: ['analytique', 'tableau de bord'],
    contact: ['contact', 'nous contacter'],
    login: ['connexion', 'se connecter'],
  },
  zh: {
    home: ['首页', '主页', '回首页'],
    shop: ['商店', '购物', '去商店'],
    cart: ['购物车', '我的购物车', '查看购物车'],
    checkout: ['结账', '付款', '完成订单'],
    clearCart: ['清空购物车', '清除购物车'],
    orders: ['订单', '我的订单', '订单状态'],
    prediction: ['预测', '作物预测'],
    analytics: ['分析', '数据分析'],
    contact: ['联系', '联系我们'],
    login: ['登录', '注册'],
  },
  ar: {
    home: ['الرئيسية', 'الصفحة الرئيسية'],
    shop: ['المتجر', 'تسوق'],
    cart: ['السلة', 'عربة التسوق'],
    checkout: ['الدفع', 'إتمام الطلب'],
    clearCart: ['إفراغ السلة', 'مسح السلة'],
    orders: ['الطلبات', 'طلباتي'],
    prediction: ['التنبؤ', 'توقع المحصول'],
    analytics: ['التحليلات', 'لوحة التحكم'],
    contact: ['اتصل', 'اتصل بنا'],
    login: ['تسجيل الدخول', 'إنشاء حساب'],
  },
  de: {
    home: ['startseite', 'hauptseite', 'nach hause'],
    shop: ['geschäft', 'laden', 'einkaufen'],
    cart: ['warenkorb', 'mein warenkorb'],
    checkout: ['zur kasse', 'bezahlen', 'bestellung abschließen'],
    clearCart: ['warenkorb leeren', 'alles entfernen'],
    orders: ['bestellungen', 'meine bestellungen'],
    prediction: ['vorhersage', 'erntevorhersage'],
    analytics: ['analytik', 'dashboard'],
    contact: ['kontakt', 'kontaktieren sie uns'],
    login: ['anmelden', 'registrieren'],
  },
  ja: {
    home: ['ホーム', 'メインページ', 'トップへ'],
    shop: ['ショップ', '店舗', '買い物'],
    cart: ['カート', 'ショッピングカート'],
    checkout: ['レジに進む', '支払い', '注文する'],
    clearCart: ['カートを空にする', 'すべて削除'],
    orders: ['注文', '注文履歴', '注文状況'],
    prediction: ['予測', '作物予測'],
    analytics: ['分析', 'ダッシュボード'],
    contact: ['お問い合わせ', '連絡'],
    login: ['ログイン', '登録'],
  },
  ko: {
    home: ['홈', '메인', '홈으로'],
    shop: ['쇼핑', '상점', '매장'],
    cart: ['장바구니', '내 장바구니'],
    checkout: ['결제', '주문하기', '체크아웃'],
    clearCart: ['장바구니 비우기', '모두 삭제'],
    orders: ['주문', '내 주문', '주문 상태'],
    prediction: ['예측', '작물 예측'],
    analytics: ['분석', '대시보드'],
    contact: ['연락', '문의하기'],
    login: ['로그인', '회원가입'],
  },
  ru: {
    home: ['главная', 'домой', 'на главную'],
    shop: ['магазин', 'покупки'],
    cart: ['корзина', 'моя корзина'],
    checkout: ['оформить заказ', 'оплатить', 'к оплате'],
    clearCart: ['очистить корзину', 'удалить все'],
    orders: ['заказы', 'мои заказы', 'статус заказа'],
    prediction: ['прогноз', 'прогноз урожая'],
    analytics: ['аналитика', 'панель управления'],
    contact: ['контакты', 'связаться'],
    login: ['войти', 'регистрация'],
  },
};

const VoiceAssistant = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { addToCart, clearCart, items } = useCart();
  const { speak, isSpeaking } = useTextToSpeech();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<ISpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognitionClass) {
      const recognitionInstance = new SpeechRecognitionClass();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      
      // Map language codes to speech recognition language codes
      const langMap: { [key: string]: string } = {
        en: 'en-US', hi: 'hi-IN', te: 'te-IN', es: 'es-ES', fr: 'fr-FR', zh: 'zh-CN',
        ar: 'ar-SA', pt: 'pt-BR', de: 'de-DE', ja: 'ja-JP', ru: 'ru-RU',
        ko: 'ko-KR', it: 'it-IT', th: 'th-TH', vi: 'vi-VN', nl: 'nl-NL',
        tr: 'tr-TR', pl: 'pl-PL', id: 'id-ID', ms: 'ms-MY', uk: 'uk-UA', sv: 'sv-SE',
      };
      
      recognitionInstance.lang = langMap[i18n.language] || 'en-US';
      setRecognition(recognitionInstance);
    }
  }, [i18n.language]);

  const searchAndAddToCart = async (productName: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('name', `%${productName}%`)
        .eq('is_active', true)
        .limit(1)
        .single();

      if (error || !data) {
        const message = t('voice.productNotFound', { product: productName });
        toast({ title: t('voice.error'), description: message, variant: 'destructive' });
        speak(message);
        return;
      }

      const product = {
        id: data.id,
        name: data.name,
        description: data.description || '',
        price: Number(data.price),
        image: data.image_url || '',
        category: data.category,
        stock: data.stock,
        unit: data.unit,
      };

      addToCart(product);
      const message = t('voice.addedToCart', { product: data.name });
      toast({ title: t('voice.success'), description: message });
      speak(message);
    } catch (err) {
      console.error('Error searching product:', err);
    }
  };

  const searchProducts = async (query: string) => {
    navigate(`/shop?search=${encodeURIComponent(query)}`);
    const message = t('voice.searchingFor', { query });
    toast({ title: t('voice.command'), description: message });
    speak(message);
  };

  const handleCheckout = useCallback(() => {
    if (items.length === 0) {
      const message = t('voice.cartEmpty');
      toast({ title: t('voice.error'), description: message, variant: 'destructive' });
      speak(message);
      return;
    }
    navigate('/checkout');
    const message = t('voice.proceedingToCheckout');
    toast({ title: t('voice.command'), description: message });
    speak(message);
  }, [items, navigate, t, speak]);

  const handleClearCart = useCallback(() => {
    if (items.length === 0) {
      const message = t('voice.cartEmpty');
      toast({ title: t('voice.info'), description: message });
      speak(message);
      return;
    }
    clearCart();
    const message = t('voice.cartCleared');
    toast({ title: t('voice.success'), description: message });
    speak(message);
  }, [items, clearCart, t, speak]);

  const matchMultiLangCommand = useCallback((command: string, lang: string): string | null => {
    const lowerCommand = command.toLowerCase();
    const commands = multiLangCommands[lang] || multiLangCommands.en;
    
    for (const [action, phrases] of Object.entries(commands)) {
      for (const phrase of phrases) {
        if (lowerCommand.includes(phrase.toLowerCase())) {
          return action;
        }
      }
    }
    
    // Fallback to English commands
    if (lang !== 'en') {
      for (const [action, phrases] of Object.entries(multiLangCommands.en)) {
        for (const phrase of phrases) {
          if (lowerCommand.includes(phrase.toLowerCase())) {
            return action;
          }
        }
      }
    }
    
    return null;
  }, []);

  const processCommand = useCallback(async (command: string) => {
    const lowerCommand = command.toLowerCase();
    const currentLang = i18n.language;
    
    // Check multi-language commands
    const action = matchMultiLangCommand(command, currentLang);
    
    if (action) {
      const actionRoutes: { [key: string]: string } = {
        home: '/',
        shop: '/shop',
        cart: '/cart',
        orders: '/orders',
        prediction: '/predict',
        analytics: '/analytics',
        contact: '/contact',
        login: '/auth',
      };
      
      if (action === 'checkout') {
        handleCheckout();
        return true;
      }
      
      if (action === 'clearCart') {
        handleClearCart();
        return true;
      }
      
      if (actionRoutes[action]) {
        navigate(actionRoutes[action]);
        const message = `${t('voice.navigating')} ${action}`;
        toast({ title: t('voice.command'), description: message });
        speak(message);
        return true;
      }
    }

    // Add to cart command patterns (multi-language)
    const addToCartPatterns = [
      /add (.+) to (?:the )?cart/i,
      /add to cart (.+)/i,
      /put (.+) in (?:the )?cart/i,
      /buy (.+)/i,
      /(.+) कार्ट में डालें/i,
      /(.+) खरीदें/i,
      /añadir (.+) al carrito/i,
      /comprar (.+)/i,
      /ajouter (.+) au panier/i,
      /acheter (.+)/i,
      /把(.+)加入购物车/i,
      /购买(.+)/i,
      /(.+)をカートに追加/i,
      /(.+)を買う/i,
      /(.+) 장바구니에 추가/i,
      /(.+) 구매/i,
      /aggiungi (.+) al carrello/i,
      /compra (.+)/i,
      /เพิ่ม (.+) ลง(?:ใน)?ตะกร้า/i,
      /ซื้อ (.+)/i,
      /thêm (.+) vào giỏ/i,
      /mua (.+)/i,
      /(.+) కార్ట్‌లో జోడించ/i,
      /(.+) కొన/i,
    ];
    
    for (const pattern of addToCartPatterns) {
      const match = lowerCommand.match(pattern);
      if (match && match[1]) {
        await searchAndAddToCart(match[1].trim());
        return true;
      }
    }

    // Search command patterns (multi-language)
    const searchPatterns = [
      /search (?:for )?(.+)/i,
      /find (.+)/i,
      /look for (.+)/i,
      /show me (.+)/i,
      /(.+) खोजें/i,
      /(.+) ढूंढें/i,
      /buscar (.+)/i,
      /chercher (.+)/i,
      /搜索(.+)/i,
      /查找(.+)/i,
      /(.+)を検索/i,
      /(.+)を探す/i,
      /(.+) 검색/i,
      /(.+) 찾기/i,
      /cerca (.+)/i,
      /trova (.+)/i,
      /ค้นหา (.+)/i,
      /หา (.+)/i,
      /tìm (.+)/i,
      /tìm kiếm (.+)/i,
      /(.+) కోసం వెతక/i,
      /(.+) వెతక/i,
    ];

    for (const pattern of searchPatterns) {
      const match = lowerCommand.match(pattern);
      if (match && match[1]) {
        await searchProducts(match[1].trim());
        return true;
      }
    }

    // Command not recognized
    const message = t('voice.tryAgain');
    toast({
      title: t('voice.notRecognized'),
      description: message,
      variant: "destructive",
    });
    speak(t('voice.notRecognized') + '. ' + message);
    return false;
  }, [navigate, t, speak, i18n.language, matchMultiLangCommand, handleCheckout, handleClearCart]);

  const startListening = () => {
    if (!recognition) {
      toast({
        title: t('voice.notSupported'),
        description: t('voice.browserNotSupported'),
        variant: "destructive",
      });
      speak(t('voice.browserNotSupported'));
      return;
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const current = event.resultIndex;
      const result = event.results[current][0].transcript;
      setTranscript(result);
      
      if (event.results[current].isFinal) {
        processCommand(result);
        setIsListening(false);
      }
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast({
        title: t('voice.error'),
        description: t('voice.errorMessage'),
        variant: "destructive",
      });
    };

    recognition.onend = () => setIsListening(false);

    recognition.start();
    setIsListening(true);
    setTranscript('');
    speak(t('voice.listening'));
  };

  const stopListening = () => {
    recognition?.stop();
    setIsListening(false);
  };

  return (
    <>
      <Button
        onClick={isListening ? stopListening : startListening}
        size="icon"
        variant={isListening ? "destructive" : "outline"}
        className="fixed bottom-40 right-6 z-50 h-20 w-20 text-primary-foreground rounded-full bg-primary/90 shadow-lg"
        title={t('voice.title')}
      >
        {isListening ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
      </Button>

      {isListening && (
        <div className="fixed bottom-60 right-6 z-50 bg-card border border-border rounded-lg p-4 shadow-xl max-w-xs animate-fade-in">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-primary">{t('voice.listening')}</span>
              {isSpeaking && <Volume2 className="h-4 w-4 text-primary animate-pulse" />}
            </div>
            <Button size="icon" variant="ghost" className="h-6 w-6" onClick={stopListening}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-primary rounded-full animate-pulse"
                  style={{
                    height: `${12 + Math.random() * 12}px`,
                    animationDelay: `${i * 0.15}s`,
                  }}
                />
              ))}
            </div>
          </div>
          {transcript && (
            <p className="text-sm text-muted-foreground italic">"{transcript}"</p>
          )}
          <p className="text-xs text-muted-foreground mt-2">
            {t('voice.tryCommands')}
          </p>
        </div>
      )}
    </>
  );
};

export default VoiceAssistant;
