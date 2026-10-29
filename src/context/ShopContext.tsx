import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { FlowerProduct, ExtraGift, CartItem, Order, SelectedGift, OrderStatus, Article, PaymentSettings, ActivePaymentGateway, IzmirDistrict } from '../types';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_EXTRA_GIFTS } from '../data/initialGifts';
import { IZMIR_DISTRICTS } from '../data/izmirDistricts';

export const DEFAULT_PAYMENT_SETTINGS: PaymentSettings = {
  activeGateway: 'paytr',
  paytr: {
    merchantId: '492817',
    merchantKey: 'pTr_live_k8912xJhs82',
    merchantSalt: 'sLt_99182aBcDeF',
    testMode: true,
    installmentEnabled: true,
    maxInstallments: 6,
  },
  ziraat: {
    merchantId: '6700019284',
    terminalId: 'ZR009281',
    storeKey: 'Ziraat3D_Sec_Key_9812',
    apiUser: 'ZRT_API_VELVET',
    testMode: true,
    installmentEnabled: true,
    maxInstallments: 6,
  },
  bankTransfer: {
    bankName: 'T.C. Ziraat Bankası A.Ş.',
    accountHolder: 'Velvet Rose Çiçekçilik ve Tasarım Ltd. Şti.',
    iban: 'TR35 0001 0002 4498 7654 3210 01',
    branchCode: '0350 - İzmir Bornova Şubesi',
    accountNumber: '9876543-1',
    fastEnabled: true,
    noteInstruction: 'Havale / FAST açıklama kısmına lütfen sipariş sonrası verilen Sipariş No veya Adınızı yazınız.',
  }
};

interface ShopContextType {
  products: FlowerProduct[];
  extraGifts: ExtraGift[];
  cart: CartItem[];
  orders: Order[];
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedDistrictFilter: string;
  setSelectedDistrictFilter: (district: string) => void;
  
  // Modals & Navigation state
  activeModal: 'none' | 'extra_gift' | 'checkout' | 'order_tracking' | 'admin' | 'product_detail' | 'article_detail' | 'cart_drawer';
  setActiveModal: (modal: 'none' | 'extra_gift' | 'checkout' | 'order_tracking' | 'admin' | 'product_detail' | 'article_detail' | 'cart_drawer') => void;
  pendingFlowerForGift: FlowerProduct | null;
  selectedProductDetail: FlowerProduct | null;
  setSelectedProductDetail: (product: FlowerProduct | null) => void;
  selectedArticle: Article | null;
  setSelectedArticle: (article: Article | null) => void;
  activeTrackingOrder: Order | null;
  setActiveTrackingOrder: (order: Order | null) => void;

  // Cart actions
  startAddToCart: (product: FlowerProduct) => void;
  confirmAddToCartWithGifts: (selectedGifts: SelectedGift[]) => void;
  updateCartItemQuantity: (cartItemId: string, delta: number) => void;
  removeCartItem: (cartItemId: string) => void;
  clearCart: () => void;
  cartTotal: number;
  cartItemCount: number;

  // Order actions
  placeOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusHistory'>) => Order;
  trackOrder: (query: string) => Order | null;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;

  // Payment Infrastructure
  paymentSettings: PaymentSettings;
  updatePaymentSettings: (settings: PaymentSettings) => void;
  setActiveGateway: (gateway: ActivePaymentGateway) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  favoriteCount: number;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (val: boolean) => void;

  // Florist Admin CRUD
  addProduct: (product: FlowerProduct) => void;
  updateProduct: (product: FlowerProduct) => void;
  deleteProduct: (id: string) => void;
  toggleProductCampaign: (productId: string) => void;
  toggleProductBestSeller: (productId: string) => void;
  toggleProductFeatured: (productId: string) => void;
  addExtraGift: (gift: ExtraGift) => void;
  updateExtraGift: (gift: ExtraGift) => void;
  deleteExtraGift: (id: string) => void;
  resetToDefaults: () => void;

  // Delivery Zones / Districts Management (Aktif & Kapalı Bölgeler)
  districts: IzmirDistrict[];
  activeDistricts: IzmirDistrict[];
  toggleDistrictActive: (districtId: string) => void;
  updateDistrictSettings: (districtId: string, updates: Partial<IzmirDistrict>) => void;
  setAllDistrictsActive: (active: boolean) => void;
  activateCentralDistrictsOnly: () => void;
  resetDistrictsToDefault: () => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const SAMPLE_INITIAL_ORDER: Order = {
  id: 'IZM-3501',
  createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 min ago
  status: 'courier',
  statusHistory: [
    {
      status: 'received',
      title: 'Sipariş Alındı & Onaylandı',
      timestamp: 'Bugün 10:15',
      description: 'Siparişiniz İzmir Bornova atölyemize ulaştı ve çiçek ustamıza iletildi.',
      completed: true
    },
    {
      status: 'preparing',
      title: 'Çiçek Atölyede Hazırlanıyor',
      timestamp: 'Bugün 10:30',
      description: 'Gördüğünüz tasarım doğrultusunda taze kesim güller ve yeşillikler özenle ambalajlanıyor.',
      completed: true
    },
    {
      status: 'courier',
      title: 'Özel Çiçek Kuryesinde / Dağıtımda',
      timestamp: 'Bugün 11:05',
      description: 'Kuryemiz klimalı özel araçla teslimat adresine doğru hareket etti.',
      completed: true
    },
    {
      status: 'delivered',
      title: 'Alıcıya Teslim Edildi',
      timestamp: 'Tahmini: 11:45',
      description: 'Güleryüzle teslimat yapılacak ve anında SMS ile bilgi verilecektir.',
      completed: false
    }
  ],
  items: [
    {
      cartItemId: 'sample-cart-1',
      product: INITIAL_PRODUCTS[0],
      quantity: 1,
      selectedGifts: [
        {
          gift: INITIAL_EXTRA_GIFTS[0],
          quantity: 1
        },
        {
          gift: INITIAL_EXTRA_GIFTS[2],
          quantity: 1
        }
      ]
    }
  ],
  totalAmount: 2320,
  recipient: {
    name: 'Selin Yılmaz',
    phone: '0532 987 65 43',
    relationship: 'Sevgiliye'
  },
  sender: {
    name: 'Murat Kaya',
    phone: '0544 123 45 67',
    email: 'murat@example.com',
    isAnonymous: false
  },
  deliveryAddress: {
    city: 'İzmir',
    district: 'Karşıyaka',
    neighborhood: 'Bostanlı',
    streetAddress: 'Cemal Gürsel Caddesi No:142 Daire:6',
    buildingNo: '142',
    apartmentNo: '6',
    addressDescription: 'Bostanlı İskelesi yakını, Deniz Palas Apt.'
  },
  deliveryDate: 'Bugün',
  deliveryTimeSlot: 'Bugün 11:00 - 14:00 (Öğle Arası)',
  cardNote: 'Gözlerinin değdiği her yer çiçek açıyor sevgilim. Hayatımın en güzel baharısın, iyi ki varsın!',
  cardSenderName: 'Murat',
  paymentMethod: 'credit_card',
  paymentGateway: 'paytr',
  installment: 1
};

const SAMPLE_SECOND_ORDER: Order = {
  id: 'IZM-3502',
  createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
  status: 'preparing',
  statusHistory: [
    {
      status: 'received',
      title: 'Sipariş Alındı & Onaylandı',
      timestamp: 'Bugün 11:10',
      description: 'Sipariş Bornova atölyemize ulaştı ve çiçek ustasına atandı.',
      completed: true
    },
    {
      status: 'preparing',
      title: 'Atölyede Hazırlanıyor',
      timestamp: 'Bugün 11:20',
      description: 'Phalaenopsis orkide özenle seçildi ve hediye ambalajı yapılıyor.',
      completed: true
    },
    {
      status: 'courier',
      title: 'Kuryeye Teslim Edilecek',
      timestamp: 'Bekleniyor: 12:30',
      description: 'Karşıyaka ekspres kuryesine verilecek.',
      completed: false
    },
    {
      status: 'delivered',
      title: 'Teslim Edildi',
      timestamp: 'Tahmini: 14:00',
      description: 'Alıcıya bizzat teslim edilecek.',
      completed: false
    }
  ],
  items: [
    {
      cartItemId: 'sample-cart-2',
      product: INITIAL_PRODUCTS[1] || INITIAL_PRODUCTS[0],
      quantity: 1,
      selectedGifts: [
        {
          gift: INITIAL_EXTRA_GIFTS[1] || INITIAL_EXTRA_GIFTS[0],
          quantity: 1
        }
      ]
    }
  ],
  totalAmount: 1750,
  recipient: {
    name: 'Ayşe Demir',
    phone: '0533 111 22 33',
    relationship: 'Anneme'
  },
  sender: {
    name: 'Mehmet Demir',
    phone: '0542 333 44 55',
    email: 'mehmet.demir@example.com',
    isAnonymous: false
  },
  deliveryAddress: {
    city: 'İzmir',
    district: 'Karşıyaka',
    neighborhood: 'Latife Hanım',
    streetAddress: '7412. Sokak',
    buildingNo: '18',
    apartmentNo: '4',
    addressDescription: 'TOKİ Konutları C-2 Blok, kapıda güvenlik mevcuttur.'
  },
  deliveryDate: 'Bugün',
  deliveryTimeSlot: 'Bugün 14:00 - 17:00 (Öğleden Sonra)',
  cardNote: 'Canım annem, yeni evin sana huzur ve mutluluk getirsin. Seni çok seviyoruz, iyi ki varsın!',
  cardSenderName: 'Oğlun Mehmet',
  paymentMethod: 'credit_card',
  paymentGateway: 'ziraat',
  installment: 3
};

const INITIAL_ORDERS_SAMPLE: Order[] = [SAMPLE_SECOND_ORDER, SAMPLE_INITIAL_ORDER];

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load products from localStorage or defaults
  // Silinen ürün ID'leri 'velvet_rose_deleted_ids' key'inde saklanır.
  // Bu sayede sayfa yenilendiğinde silinen ürünler INITIAL_PRODUCTS'tan geri gelmez.
  const [products, setProducts] = useState<FlowerProduct[]>(() => {
    try {
      // Kalıcı olarak silinmiş ürün ID'leri
      const deletedIdsRaw = localStorage.getItem('velvet_rose_deleted_ids');
      const deletedIds: Set<string> = deletedIdsRaw
        ? new Set(JSON.parse(deletedIdsRaw))
        : new Set();

      const saved = localStorage.getItem('velvet_rose_products') || localStorage.getItem('flora_izmir_products');
      if (saved) {
        const parsed: FlowerProduct[] = JSON.parse(saved);
        // Silinmiş ürünleri dışarıda bırak
        const filtered = parsed.filter(p => !deletedIds.has(p.id));
        if (filtered.length > 0 || parsed.length > 0) {
          return filtered;
        }
      }
      // İlk açılış: INITIAL_PRODUCTS'tan silinenleri çıkar
      return INITIAL_PRODUCTS.filter(p => !deletedIds.has(p.id));
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Load extra gifts
  const [extraGifts, setExtraGifts] = useState<ExtraGift[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_rose_gifts') || localStorage.getItem('flora_izmir_gifts');
      return saved ? JSON.parse(saved) : INITIAL_EXTRA_GIFTS;
    } catch {
      return INITIAL_EXTRA_GIFTS;
    }
  });

  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_rose_cart') || localStorage.getItem('flora_izmir_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_rose_orders') || localStorage.getItem('flora_izmir_orders');
      return saved ? JSON.parse(saved) : INITIAL_ORDERS_SAMPLE;
    } catch {
      return INITIAL_ORDERS_SAMPLE;
    }
  });

  // Filtering & search
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDistrictFilter, setSelectedDistrictFilter] = useState<string>('all');

  // Modals
  const [activeModal, setActiveModal] = useState<'none' | 'extra_gift' | 'checkout' | 'order_tracking' | 'admin' | 'product_detail' | 'article_detail' | 'cart_drawer'>('none');
  const [pendingFlowerForGift, setPendingFlowerForGift] = useState<FlowerProduct | null>(null);
  const [selectedProductDetail, setSelectedProductDetail] = useState<FlowerProduct | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeTrackingOrder, setActiveTrackingOrder] = useState<Order | null>(null);

  // Favorites state
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_rose_favorites') || localStorage.getItem('flora_izmir_favorites');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [showFavoritesOnly, setShowFavoritesOnly] = useState<boolean>(false);

  // Payment Settings (PayTR vs Ziraat Bankası POS & Bank Transfer)
  const [paymentSettings, setPaymentSettings] = useState<PaymentSettings>(() => {
    try {
      const saved = localStorage.getItem('velvet_rose_payment_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_PAYMENT_SETTINGS,
          ...parsed,
          paytr: { ...DEFAULT_PAYMENT_SETTINGS.paytr, ...(parsed.paytr || {}) },
          ziraat: { ...DEFAULT_PAYMENT_SETTINGS.ziraat, ...(parsed.ziraat || {}) },
          bankTransfer: { ...DEFAULT_PAYMENT_SETTINGS.bankTransfer, ...(parsed.bankTransfer || {}) },
        };
      }
      return DEFAULT_PAYMENT_SETTINGS;
    } catch {
      return DEFAULT_PAYMENT_SETTINGS;
    }
  });

  const updatePaymentSettings = (newSettings: PaymentSettings) => {
    setPaymentSettings(newSettings);
    localStorage.setItem('velvet_rose_payment_settings', JSON.stringify(newSettings));
  };

  const setActiveGateway = (gateway: ActivePaymentGateway) => {
    setPaymentSettings(prev => {
      const updated = { ...prev, activeGateway: gateway };
      localStorage.setItem('velvet_rose_payment_settings', JSON.stringify(updated));
      return updated;
    });
  };

  // Delivery Districts / Zones State (Aktif / Kapalı Bölgeler Yönetimi)
  const [districts, setDistricts] = useState<IzmirDistrict[]>(() => {
    try {
      const saved = localStorage.getItem('velvet_rose_districts');
      if (saved) {
        const parsed: IzmirDistrict[] = JSON.parse(saved);
        return IZMIR_DISTRICTS.map(defDist => {
          const match = parsed.find(p => p.id === defDist.id);
          return match ? { ...defDist, ...match } : { ...defDist, isActive: true };
        });
      }
      return IZMIR_DISTRICTS.map(d => ({ ...d, isActive: true }));
    } catch {
      return IZMIR_DISTRICTS.map(d => ({ ...d, isActive: true }));
    }
  });

  const activeDistricts = useMemo(() => {
    return districts.filter(d => d.isActive !== false);
  }, [districts]);

  const toggleDistrictActive = (districtId: string) => {
    setDistricts(prev => {
      const updated = prev.map(d => d.id === districtId ? { ...d, isActive: d.isActive === false ? true : false } : d);
      localStorage.setItem('velvet_rose_districts', JSON.stringify(updated));
      return updated;
    });
  };

  const updateDistrictSettings = (districtId: string, updates: Partial<IzmirDistrict>) => {
    setDistricts(prev => {
      const updated = prev.map(d => d.id === districtId ? { ...d, ...updates } : d);
      localStorage.setItem('velvet_rose_districts', JSON.stringify(updated));
      return updated;
    });
  };

  const setAllDistrictsActive = (active: boolean) => {
    setDistricts(prev => {
      const updated = prev.map(d => ({ ...d, isActive: active }));
      localStorage.setItem('velvet_rose_districts', JSON.stringify(updated));
      return updated;
    });
  };

  const activateCentralDistrictsOnly = () => {
    const centralIds = ['bornova', 'karsiyaka', 'konak', 'bayrakli', 'buca', 'cigli', 'balcova', 'narlidere', 'karabaglar', 'gaziemir'];
    setDistricts(prev => {
      const updated = prev.map(d => ({
        ...d,
        isActive: centralIds.includes(d.id)
      }));
      localStorage.setItem('velvet_rose_districts', JSON.stringify(updated));
      return updated;
    });
  };

  const resetDistrictsToDefault = () => {
    const fresh = IZMIR_DISTRICTS.map(d => ({ ...d, isActive: true }));
    setDistricts(fresh);
    localStorage.setItem('velvet_rose_districts', JSON.stringify(fresh));
  };

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('velvet_rose_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('velvet_rose_gifts', JSON.stringify(extraGifts));
  }, [extraGifts]);

  useEffect(() => {
    localStorage.setItem('velvet_rose_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('velvet_rose_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('velvet_rose_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('velvet_rose_payment_settings', JSON.stringify(paymentSettings));
  }, [paymentSettings]);

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const isFavorite = (productId: string) => favorites.includes(productId);
  const favoriteCount = favorites.length;

  // Start adding flower -> triggers Extra Gift upsell modal!
  const startAddToCart = (product: FlowerProduct) => {
    setPendingFlowerForGift(product);
    setActiveModal('extra_gift');
  };

  // Confirm and add to cart with selected gifts
  const confirmAddToCartWithGifts = (selectedGifts: SelectedGift[]) => {
    if (!pendingFlowerForGift) return;

    const newCartItem: CartItem = {
      cartItemId: `cart-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      product: pendingFlowerForGift,
      quantity: 1,
      selectedGifts: selectedGifts.filter(g => g.quantity > 0)
    };

    setCart(prev => [newCartItem, ...prev]);
    setPendingFlowerForGift(null);
    setActiveModal('cart_drawer');
  };

  const updateCartItemQuantity = (cartItemId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.cartItemId === cartItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const removeCartItem = (cartItemId: string) => {
    setCart(prev => prev.filter(item => item.cartItemId !== cartItemId));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Calculate cart totals
  const cartTotal = cart.reduce((total, item) => {
    const productSubtotal = item.product.price * item.quantity;
    const giftsSubtotal = item.selectedGifts.reduce((giftTotal, g) => {
      return giftTotal + (g.gift.price * g.quantity);
    }, 0);
    return total + productSubtotal + giftsSubtotal;
  }, 0);

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Place order
  const placeOrder = (orderData: Omit<Order, 'id' | 'createdAt' | 'status' | 'statusHistory'>): Order => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newOrderId = `IZM-${randomNum}`;
    const now = new Date();
    const timeFormatted = now.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    const newOrder: Order = {
      ...orderData,
      id: newOrderId,
      createdAt: now.toISOString(),
      status: 'received',
      statusHistory: [
        {
          status: 'received',
          title: 'Sipariş Alındı & Onaylandı',
          timestamp: `Bugün ${timeFormatted}`,
          description: 'Siparişiniz İzmir atölyemize ulaştı ve çiçek tasarımcımıza iletildi.',
          completed: true
        },
        {
          status: 'preparing',
          title: 'Çiçek Atölyede Hazırlanıyor',
          timestamp: 'Sırada',
          description: 'Sitede gördüğünüz tasarıma ve çiçek adetlerine sadık kalınarak taze çiçeklerle usta ellerde hazırlanıyor.',
          completed: false
        },
        {
          status: 'courier',
          title: 'Özel Çiçek Kuryesinde / Dağıtımda',
          timestamp: 'Planlanıyor',
          description: 'Özel taşıma kutusunda İzmir içi adrese teslimata çıkarılacak.',
          completed: false
        },
        {
          status: 'delivered',
          title: 'Alıcıya Teslim Edildi',
          timestamp: 'Hedeflenen saat',
          description: 'Teslimat anında SMS ve e-posta ile bildirim gönderilecek.',
          completed: false
        }
      ]
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setActiveTrackingOrder(newOrder);
    setActiveModal('order_tracking');
    return newOrder;
  };

  // Track order by ID or phone number
  const trackOrder = (query: string): Order | null => {
    const cleanQuery = query.trim().toUpperCase().replace(/[\s-]/g, '');
    const found = orders.find(o => {
      const cleanId = o.id.replace(/[\s-]/g, '').toUpperCase();
      const cleanPhone = o.sender.phone.replace(/[\s-]/g, '');
      const cleanRecPhone = o.recipient.phone.replace(/[\s-]/g, '');
      return cleanId.includes(cleanQuery) || cleanPhone.includes(cleanQuery) || cleanRecPhone.includes(cleanQuery);
    });

    if (found) {
      setActiveTrackingOrder(found);
      setActiveModal('order_tracking');
      return found;
    }
    return null;
  };

  // Update order status (Florist Admin action)
  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const statusOrder: OrderStatus[] = ['received', 'preparing', 'courier', 'delivered'];
    const newIdx = statusOrder.indexOf(newStatus);
    const nowTime = new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });

    setOrders(prev => prev.map(order => {
      if (order.id !== orderId) return order;

      const updatedHistory = order.statusHistory.map(h => {
        const hIdx = statusOrder.indexOf(h.status);
        if (hIdx <= newIdx) {
          return {
            ...h,
            completed: true,
            timestamp: h.completed ? h.timestamp : `Bugün ${nowTime}`
          };
        }
        return {
          ...h,
          completed: false
        };
      });

      return {
        ...order,
        status: newStatus,
        statusHistory: updatedHistory
      };
    }));

    // If currently tracked order is this one, update activeTrackingOrder
    if (activeTrackingOrder?.id === orderId) {
      setActiveTrackingOrder(prev => {
        if (!prev) return null;
        const updatedHistory = prev.statusHistory.map(h => {
          const hIdx = statusOrder.indexOf(h.status);
          return {
            ...h,
            completed: hIdx <= newIdx,
            timestamp: hIdx === newIdx ? `Bugün ${nowTime}` : h.timestamp
          };
        });
        return {
          ...prev,
          status: newStatus,
          statusHistory: updatedHistory
        };
      });
    }
  };

  // CRUD for Products
  const addProduct = (product: FlowerProduct) => {
    setProducts(prev => [product, ...prev]);
  };

  const updateProduct = (product: FlowerProduct) => {
    setProducts(prev => prev.map(p => p.id === product.id ? product : p));
  };

  const deleteProduct = (id: string) => {
    // 1. React state'den kaldır
    setProducts(prev => {
      const updated = prev.filter(p => p.id !== id);
      // 2. Anında localStorage'a yaz (useEffect'i beklemeden)
      localStorage.setItem('velvet_rose_products', JSON.stringify(updated));
      return updated;
    });
    // 3. Silinmiş ID'ler listesine ekle — sayfa yenilemede geri gelmesin
    try {
      const raw = localStorage.getItem('velvet_rose_deleted_ids');
      const deletedIds: string[] = raw ? JSON.parse(raw) : [];
      if (!deletedIds.includes(id)) {
        deletedIds.push(id);
        localStorage.setItem('velvet_rose_deleted_ids', JSON.stringify(deletedIds));
      }
    } catch { /* ignore */ }
  };

  const toggleProductCampaign = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      if (p.hasCampaign) {
        // Revert campaign: restore original regular price
        const restoredPrice = p.originalPrice || p.oldPrice || p.price;
        return {
          ...p,
          hasCampaign: false,
          price: restoredPrice,
          oldPrice: undefined,
          originalPrice: undefined,
          campaignDiscountPercent: undefined
        };
      } else {
        // Activate campaign: apply 20% discount (%20 iskonto)
        const basePrice = p.price;
        const discounted = Math.round(basePrice * 0.8);
        return {
          ...p,
          hasCampaign: true,
          originalPrice: basePrice,
          oldPrice: basePrice,
          price: discounted,
          campaignDiscountPercent: 20
        };
      }
    }));
  };

  const toggleProductBestSeller = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        isBestSeller: !p.isBestSeller
      };
    }));
  };

  const toggleProductFeatured = (productId: string) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId) return p;
      return {
        ...p,
        isFeatured: !p.isFeatured
      };
    }));
  };

  // CRUD for Extra Gifts
  const addExtraGift = (gift: ExtraGift) => {
    setExtraGifts(prev => [gift, ...prev]);
  };

  const updateExtraGift = (gift: ExtraGift) => {
    setExtraGifts(prev => prev.map(g => g.id === gift.id ? gift : g));
  };

  const deleteExtraGift = (id: string) => {
    setExtraGifts(prev => prev.filter(g => g.id !== id));
  };

  const resetToDefaults = () => {
    setProducts(INITIAL_PRODUCTS);
    setExtraGifts(INITIAL_EXTRA_GIFTS);
    setOrders([SAMPLE_INITIAL_ORDER]);
    setPaymentSettings(DEFAULT_PAYMENT_SETTINGS);
    resetDistrictsToDefault();
    localStorage.removeItem('velvet_rose_products');
    localStorage.removeItem('velvet_rose_gifts');
    localStorage.removeItem('velvet_rose_orders');
    localStorage.removeItem('velvet_rose_payment_settings');
    localStorage.removeItem('velvet_rose_districts');
    localStorage.removeItem('velvet_rose_deleted_ids'); // silinmiş ID listesini de temizle
    localStorage.removeItem('flora_izmir_products');
    localStorage.removeItem('flora_izmir_gifts');
    localStorage.removeItem('flora_izmir_orders');
  };

  return (
    <ShopContext.Provider
      value={{
        products,
        extraGifts,
        cart,
        orders,
        districts,
        activeDistricts,
        toggleDistrictActive,
        updateDistrictSettings,
        setAllDistrictsActive,
        activateCentralDistrictsOnly,
        resetDistrictsToDefault,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        selectedDistrictFilter,
        setSelectedDistrictFilter,
        activeModal,
        setActiveModal,
        pendingFlowerForGift,
        selectedProductDetail,
        setSelectedProductDetail,
        selectedArticle,
        setSelectedArticle,
        activeTrackingOrder,
        setActiveTrackingOrder,
        startAddToCart,
        confirmAddToCartWithGifts,
        updateCartItemQuantity,
        removeCartItem,
        clearCart,
        cartTotal,
        cartItemCount,
        placeOrder,
        trackOrder,
        updateOrderStatus,
        paymentSettings,
        updatePaymentSettings,
        setActiveGateway,
        favorites,
        toggleFavorite,
        isFavorite,
        favoriteCount,
        showFavoritesOnly,
        setShowFavoritesOnly,
        addProduct,
        updateProduct,
        deleteProduct,
        toggleProductCampaign,
        toggleProductBestSeller,
        toggleProductFeatured,
        addExtraGift,
        updateExtraGift,
        deleteExtraGift,
        resetToDefaults
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
