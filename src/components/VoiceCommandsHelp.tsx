import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { HelpCircle, X, Mic, ShoppingCart, Search, Home, CreditCard, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface CommandCategory {
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  commands: { phrase: string; description: string }[];
}

const commandsByLanguage: Record<string, CommandCategory[]> = {
  en: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"Go home" / "Home"', description: 'Navigate to home page' },
        { phrase: '"Go to shop" / "Shop"', description: 'Open the marketplace' },
        { phrase: '"Open cart" / "My cart"', description: 'View shopping cart' },
        { phrase: '"My orders" / "Order status"', description: 'Check order history' },
        { phrase: '"Prediction" / "Crop prediction"', description: 'Open prediction tool' },
        { phrase: '"Analytics" / "Dashboard"', description: 'View analytics' },
        { phrase: '"Contact" / "Contact us"', description: 'Go to contact page' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"Add [product] to cart"', description: 'Add item to cart' },
        { phrase: '"Buy [product]"', description: 'Search and add to cart' },
        { phrase: '"Put [product] in cart"', description: 'Add item to cart' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"Proceed to checkout"', description: 'Go to checkout' },
        { phrase: '"Pay now" / "Place order"', description: 'Complete purchase' },
        { phrase: '"Complete order"', description: 'Finalize order' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"Clear cart" / "Empty cart"', description: 'Remove all items' },
        { phrase: '"Clear my cart"', description: 'Empty shopping cart' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"Search for [product]"', description: 'Find products' },
        { phrase: '"Find [product]"', description: 'Search marketplace' },
        { phrase: '"Show me [product]"', description: 'Display products' },
      ],
    },
  ],
  hi: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"होम" / "मुख्य पृष्ठ"', description: 'मुख्य पृष्ठ पर जाएं' },
        { phrase: '"दुकान" / "स्टोर"', description: 'बाजार खोलें' },
        { phrase: '"कार्ट" / "मेरी टोकरी"', description: 'शॉपिंग कार्ट देखें' },
        { phrase: '"मेरे ऑर्डर"', description: 'ऑर्डर इतिहास देखें' },
        { phrase: '"फसल भविष्यवाणी"', description: 'भविष्यवाणी टूल खोलें' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"[उत्पाद] कार्ट में डालें"', description: 'कार्ट में जोड़ें' },
        { phrase: '"[उत्पाद] खरीदें"', description: 'खोजें और कार्ट में जोड़ें' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"चेकआउट" / "भुगतान करें"', description: 'चेकआउट पर जाएं' },
        { phrase: '"ऑर्डर दें"', description: 'खरीद पूरी करें' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"कार्ट खाली करें"', description: 'सभी आइटम हटाएं' },
        { phrase: '"सब हटाएं"', description: 'शॉपिंग कार्ट खाली करें' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"[उत्पाद] खोजें"', description: 'उत्पाद खोजें' },
        { phrase: '"[उत्पाद] ढूंढें"', description: 'बाजार में खोजें' },
      ],
    },
  ],
  te: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"హోమ్" / "ముఖ్య పేజీ"', description: 'హోమ్ పేజీకి వెళ్లండి' },
        { phrase: '"షాప్" / "దుకాణం"', description: 'మార్కెట్‌ను తెరవండి' },
        { phrase: '"కార్ట్" / "నా కార్ట్"', description: 'షాపింగ్ కార్ట్ చూడండి' },
        { phrase: '"నా ఆర్డర్లు"', description: 'ఆర్డర్ హిస్టరీ చూడండి' },
        { phrase: '"పంట అంచనా"', description: 'అంచనా టూల్ తెరవండి' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"[ఉత్పత్తి] కార్ట్‌లో జోడించు"', description: 'కార్ట్‌కు జోడించండి' },
        { phrase: '"[ఉత్పత్తి] కొను"', description: 'వెతికి కార్ట్‌కు జోడించండి' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"చెకౌట్" / "చెల్లింపు"', description: 'చెకౌట్‌కు వెళ్లండి' },
        { phrase: '"ఆర్డర్ పెట్టు"', description: 'కొనుగోలు పూర్తి చేయండి' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"కార్ట్ ఖాళీ చేయండి"', description: 'అన్ని అంశాలు తొలగించండి' },
        { phrase: '"అన్నీ తొలగించండి"', description: 'షాపింగ్ కార్ట్ ఖాళీ చేయండి' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"[ఉత్పత్తి] కోసం వెతకండి"', description: 'ఉత్పత్తులు కనుగొనండి' },
        { phrase: '"[ఉత్పత్తి] వెతకండి"', description: 'మార్కెట్‌లో వెతకండి' },
      ],
    },
  ],
  zh: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"首页" / "回首页"', description: '导航到首页' },
        { phrase: '"商店" / "购物"', description: '打开商城' },
        { phrase: '"购物车" / "我的购物车"', description: '查看购物车' },
        { phrase: '"我的订单" / "订单状态"', description: '查看订单历史' },
        { phrase: '"预测" / "作物预测"', description: '打开预测工具' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"把[产品]加入购物车"', description: '添加到购物车' },
        { phrase: '"购买[产品]"', description: '搜索并添加到购物车' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"结账" / "付款"', description: '前往结账' },
        { phrase: '"完成订单"', description: '完成购买' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"清空购物车"', description: '移除所有商品' },
        { phrase: '"清除购物车"', description: '清空购物车' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"搜索[产品]"', description: '查找产品' },
        { phrase: '"查找[产品]"', description: '在商城中搜索' },
      ],
    },
  ],
  ar: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"الرئيسية" / "الصفحة الرئيسية"', description: 'انتقل إلى الصفحة الرئيسية' },
        { phrase: '"المتجر" / "تسوق"', description: 'افتح السوق' },
        { phrase: '"السلة" / "عربة التسوق"', description: 'عرض سلة التسوق' },
        { phrase: '"طلباتي"', description: 'عرض سجل الطلبات' },
        { phrase: '"التنبؤ" / "توقع المحصول"', description: 'افتح أداة التنبؤ' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"أضف [المنتج] إلى السلة"', description: 'أضف إلى السلة' },
        { phrase: '"اشتري [المنتج]"', description: 'ابحث وأضف إلى السلة' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"الدفع" / "إتمام الطلب"', description: 'انتقل إلى الدفع' },
        { phrase: '"أكمل الطلب"', description: 'أكمل الشراء' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"إفراغ السلة"', description: 'إزالة جميع العناصر' },
        { phrase: '"مسح السلة"', description: 'إفراغ سلة التسوق' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"ابحث عن [المنتج]"', description: 'ابحث عن المنتجات' },
        { phrase: '"جد [المنتج]"', description: 'ابحث في السوق' },
      ],
    },
  ],
  es: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"Inicio" / "Página principal"', description: 'Ir a la página de inicio' },
        { phrase: '"Tienda" / "Comprar"', description: 'Abrir el mercado' },
        { phrase: '"Carrito" / "Mi carrito"', description: 'Ver carrito de compras' },
        { phrase: '"Mis pedidos"', description: 'Ver historial de pedidos' },
        { phrase: '"Predicción" / "Predecir cultivo"', description: 'Abrir herramienta de predicción' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"Añadir [producto] al carrito"', description: 'Agregar al carrito' },
        { phrase: '"Comprar [producto]"', description: 'Buscar y agregar al carrito' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"Pagar" / "Finalizar compra"', description: 'Ir al pago' },
        { phrase: '"Proceder al pago"', description: 'Completar compra' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"Vaciar carrito"', description: 'Eliminar todos los artículos' },
        { phrase: '"Limpiar carrito"', description: 'Vaciar carrito de compras' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"Buscar [producto]"', description: 'Buscar productos' },
        { phrase: '"Encontrar [producto]"', description: 'Buscar en el mercado' },
      ],
    },
  ],
  fr: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"Accueil" / "Page principale"', description: 'Aller à la page d\'accueil' },
        { phrase: '"Boutique" / "Magasin"', description: 'Ouvrir le marché' },
        { phrase: '"Panier" / "Mon panier"', description: 'Voir le panier' },
        { phrase: '"Mes commandes"', description: 'Voir l\'historique des commandes' },
        { phrase: '"Prédiction" / "Prédire récolte"', description: 'Ouvrir l\'outil de prédiction' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"Ajouter [produit] au panier"', description: 'Ajouter au panier' },
        { phrase: '"Acheter [produit]"', description: 'Rechercher et ajouter au panier' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"Payer" / "Finaliser la commande"', description: 'Aller au paiement' },
        { phrase: '"Passer à la caisse"', description: 'Finaliser l\'achat' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"Vider le panier"', description: 'Supprimer tous les articles' },
        { phrase: '"Effacer panier"', description: 'Vider le panier' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"Chercher [produit]"', description: 'Trouver des produits' },
        { phrase: '"Trouver [produit]"', description: 'Rechercher sur le marché' },
      ],
    },
  ],
  th: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"หน้าแรก" / "กลับหน้าแรก"', description: 'ไปที่หน้าแรก' },
        { phrase: '"ร้านค้า" / "ช้อปปิ้ง"', description: 'เปิดตลาด' },
        { phrase: '"ตะกร้า" / "ตะกร้าของฉัน"', description: 'ดูตะกร้าสินค้า' },
        { phrase: '"คำสั่งซื้อของฉัน"', description: 'ดูประวัติคำสั่งซื้อ' },
        { phrase: '"พยากรณ์" / "พยากรณ์พืชผล"', description: 'เปิดเครื่องมือพยากรณ์' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"เพิ่ม [สินค้า] ลงตะกร้า"', description: 'เพิ่มลงตะกร้า' },
        { phrase: '"ซื้อ [สินค้า]"', description: 'ค้นหาและเพิ่มลงตะกร้า' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"ชำระเงิน" / "เช็คเอาท์"', description: 'ไปชำระเงิน' },
        { phrase: '"ไปชำระเงิน"', description: 'ทำการซื้อให้เสร็จ' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"ล้างตะกร้า"', description: 'ลบสินค้าทั้งหมด' },
        { phrase: '"เคลียร์ตะกร้า"', description: 'ล้างตะกร้าสินค้า' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"ค้นหา [สินค้า]"', description: 'ค้นหาสินค้า' },
        { phrase: '"หา [สินค้า]"', description: 'ค้นหาในตลาด' },
      ],
    },
  ],
  vi: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"Trang chủ" / "Về trang chủ"', description: 'Đi đến trang chủ' },
        { phrase: '"Cửa hàng" / "Mua sắm"', description: 'Mở chợ' },
        { phrase: '"Giỏ hàng" / "Giỏ của tôi"', description: 'Xem giỏ hàng' },
        { phrase: '"Đơn hàng của tôi"', description: 'Xem lịch sử đơn hàng' },
        { phrase: '"Dự đoán" / "Dự đoán cây trồng"', description: 'Mở công cụ dự đoán' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"Thêm [sản phẩm] vào giỏ"', description: 'Thêm vào giỏ hàng' },
        { phrase: '"Mua [sản phẩm]"', description: 'Tìm kiếm và thêm vào giỏ' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"Thanh toán" / "Checkout"', description: 'Đi đến thanh toán' },
        { phrase: '"Đi thanh toán"', description: 'Hoàn tất mua hàng' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"Xóa giỏ hàng"', description: 'Xóa tất cả mặt hàng' },
        { phrase: '"Làm trống giỏ"', description: 'Xóa giỏ hàng' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"Tìm [sản phẩm]"', description: 'Tìm sản phẩm' },
        { phrase: '"Tìm kiếm [sản phẩm]"', description: 'Tìm kiếm trong chợ' },
      ],
    },
  ],
  it: [
    {
      icon: Home,
      titleKey: 'voiceHelp.navigation',
      commands: [
        { phrase: '"Home" / "Pagina principale"', description: 'Vai alla home page' },
        { phrase: '"Negozio" / "Shop"', description: 'Apri il mercato' },
        { phrase: '"Carrello" / "Il mio carrello"', description: 'Visualizza carrello' },
        { phrase: '"I miei ordini"', description: 'Visualizza cronologia ordini' },
        { phrase: '"Previsione" / "Previsione raccolto"', description: 'Apri strumento previsione' },
      ],
    },
    {
      icon: ShoppingCart,
      titleKey: 'voiceHelp.cart',
      commands: [
        { phrase: '"Aggiungi [prodotto] al carrello"', description: 'Aggiungi al carrello' },
        { phrase: '"Compra [prodotto]"', description: 'Cerca e aggiungi al carrello' },
      ],
    },
    {
      icon: CreditCard,
      titleKey: 'voiceHelp.checkout',
      commands: [
        { phrase: '"Checkout" / "Vai alla cassa"', description: 'Vai al pagamento' },
        { phrase: '"Procedi al checkout"', description: 'Completa l\'acquisto' },
      ],
    },
    {
      icon: Trash2,
      titleKey: 'voiceHelp.cartManagement',
      commands: [
        { phrase: '"Svuota carrello"', description: 'Rimuovi tutti gli articoli' },
        { phrase: '"Pulisci carrello"', description: 'Svuota il carrello' },
      ],
    },
    {
      icon: Search,
      titleKey: 'voiceHelp.search',
      commands: [
        { phrase: '"Cerca [prodotto]"', description: 'Trova prodotti' },
        { phrase: '"Trova [prodotto]"', description: 'Cerca nel mercato' },
      ],
    },
  ],
};

const VoiceCommandsHelp = () => {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  
  const currentLang = i18n.language;
  const commands = commandsByLanguage[currentLang] || commandsByLanguage.en;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="fixed bottom-80 right-6 z-50 h-20 w-20 rounded-full bg-primary/90 text-primary-foreground shadow-lg hover:bg-primary"
          title={t('voiceHelp.title')}
        >
          <HelpCircle className="h-6 w-6" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mic className="h-5 w-5 text-primary" />
            {t('voiceHelp.title')}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[60vh] pr-4">
          <div className="space-y-6">
            <p className="text-muted-foreground">
              {t('voiceHelp.description')}
            </p>
            
            {commands.map((category, idx) => {
              const Icon = category.icon;
              return (
                <div key={idx} className="space-y-3">
                  <h3 className="flex items-center gap-2 font-semibold text-foreground">
                    <Icon className="h-4 w-4 text-primary" />
                    {t(category.titleKey)}
                  </h3>
                  <div className="grid gap-2">
                    {category.commands.map((cmd, cmdIdx) => (
                      <div
                        key={cmdIdx}
                        className="flex items-start gap-3 rounded-lg bg-muted p-3"
                      >
                        <code className="flex-1 text-sm font-medium text-primary">
                          {cmd.phrase}
                        </code>
                        <span className="text-sm text-muted-foreground">
                          {cmd.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            
            <div className="rounded-lg border border-primary/20 bg-primary/5 p-4">
              <h4 className="font-medium text-foreground mb-2">
                {t('voiceHelp.tips')}
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>• {t('voiceHelp.tip1')}</li>
                <li>• {t('voiceHelp.tip2')}</li>
                <li>• {t('voiceHelp.tip3')}</li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default VoiceCommandsHelp;
