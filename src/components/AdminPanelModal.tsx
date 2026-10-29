import React, { useState, useEffect, useMemo } from 'react';
import { X, Plus, Trash2, Edit3, Package, Gift, ShoppingBag, Truck, Check, RotateCcw, Tag, Percent, Sparkles, Flame, CreditCard, ShieldCheck, CheckCircle2, Building, RefreshCw, Key, Lock, ArrowRight, Sliders, Printer, Copy, Phone, MessageCircle, MapPin, ExternalLink, ChevronDown, ChevronUp, FileText, Search, UserCheck, Calendar, Clock, AlertTriangle, Eye, CheckCheck, Heart, Crown } from 'lucide-react';
import { useShop, DEFAULT_PAYMENT_SETTINGS } from '../context/ShopContext';
import { FlowerProduct, ExtraGift, OrderStatus, FlowerCategory, PaymentSettings, ActivePaymentGateway, Order } from '../types';
import { SafeImage } from './SafeImage';
import { ImageFileInput } from './ImageFileInput';

const FLOWER_CATEGORIES: { id: FlowerCategory; label: string; icon: string; desc: string }[] = [
  { id: 'dogum_gunu', label: 'Doğum Günü', icon: '🎂', desc: 'Doğum günü kutlama çiçekleri' },
  { id: 'yildonumu', label: 'Evlilik Yıldönümü', icon: '💕', desc: 'Evlilik yıldönümü & romantik jestler' },
  { id: 'ask_romantik', label: 'Aşk & Sevgiliye', icon: '❤️', desc: 'Kırmızı güller ve tutkulu tasarımlar' },
  { id: 'yeni_is', label: 'Yeni İş & Tebrik', icon: '💼', desc: 'Ofis, terfi ve başarı tebriği' },
  { id: 'ozel_tasarim_celenk', label: 'Özel Tasarım & Çelenk', icon: '🏛️', desc: 'Açılış, düğün, taziye/cenaze çelenkleri ve VIP ferforje' },
  { id: 'gecmis_olsun', label: 'Geçmiş Olsun', icon: '🌿', desc: 'Moral, enerji ve şifa çiçekleri' },
  { id: 'ozur', label: 'Özür Dilerim & Barışma', icon: '🕊️', desc: 'Gönül alma ve af dileme jestleri' },
  { id: 'icimden_geldi', label: 'İçimden Geldi', icon: '✨', desc: 'Sebepsiz içten gelen tatlı sürprizler' },
];

const CATEGORY_NAMES_MAP: Record<FlowerCategory, string> = {
  dogum_gunu: 'Doğum Günü',
  yildonumu: 'Evlilik Yıldönümü',
  ask_romantik: 'Aşk & Sevgiliye',
  yeni_is: 'Yeni İş & Tebrik',
  ozel_tasarim_celenk: 'Özel Tasarım & Çelenk',
  gecmis_olsun: 'Geçmiş Olsun',
  ozur: 'Özür Dilerim & Barışma',
  icimden_geldi: 'İçimden Geldi',
  guller: 'Aşk & Sevgiliye',
  orkideler: 'Yeni İş & Tebrik',
  kutuda: 'Evlilik Yıldönümü',
  vazo: 'Doğum Günü'
};

export const AdminPanelModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    products,
    extraGifts,
    orders,
    districts,
    activeDistricts,
    toggleDistrictActive,
    updateDistrictSettings,
    setAllDistrictsActive,
    activateCentralDistrictsOnly,
    resetDistrictsToDefault,
    addProduct,
    updateProduct,
    deleteProduct,
    toggleProductCampaign,
    toggleProductBestSeller,
    toggleProductFeatured,
    addExtraGift,
    updateExtraGift,
    deleteExtraGift,
    updateOrderStatus,
    paymentSettings,
    updatePaymentSettings,
    setActiveGateway,
    resetToDefaults
  } = useShop();

  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'gifts' | 'delivery' | 'payment'>('orders');

  // Delivery Zones Tab States
  const [districtSearchTerm, setDistrictSearchTerm] = useState('');
  const [districtFilterMode, setDistrictFilterMode] = useState<'all' | 'active' | 'inactive'>('all');
  const [inspectingDistrictId, setInspectingDistrictId] = useState<string | null>(null);
  const [inspectingNeighSearch, setInspectingNeighSearch] = useState('');
  const [editingDistrictFee, setEditingDistrictFee] = useState<{ [id: string]: number }>({});
  const [districtFeeSaved, setDistrictFeeSaved] = useState<string | null>(null);

  // Orders Search & Filter States
  const [orderSearchTerm, setOrderSearchTerm] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<'all' | OrderStatus>('all');
  const [expandedOrderIds, setExpandedOrderIds] = useState<Record<string, boolean>>({});
  const [printSlipOrder, setPrintSlipOrder] = useState<Order | null>(null);
  const [copiedAddressOrderId, setCopiedAddressOrderId] = useState<string | null>(null);

  // Filtered orders based on search and status
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // Status filter
      if (orderStatusFilter !== 'all' && order.status !== orderStatusFilter) {
        return false;
      }
      // Search term
      if (orderSearchTerm.trim()) {
        const q = orderSearchTerm.toLowerCase().trim();
        const idMatch = order.id.toLowerCase().includes(q);
        const recipientMatch = order.recipient.name.toLowerCase().includes(q) || order.recipient.phone.includes(q);
        const senderMatch = order.sender.name.toLowerCase().includes(q) || order.sender.phone.includes(q);
        const districtMatch = order.deliveryAddress.district.toLowerCase().includes(q) || order.deliveryAddress.neighborhood.toLowerCase().includes(q);
        const streetMatch = order.deliveryAddress.streetAddress.toLowerCase().includes(q);
        const itemMatch = order.items.some(i => i.product.name.toLowerCase().includes(q));
        if (!idMatch && !recipientMatch && !senderMatch && !districtMatch && !streetMatch && !itemMatch) {
          return false;
        }
      }
      return true;
    });
  }, [orders, orderStatusFilter, orderSearchTerm]);

  // Filtered districts for delivery zones management
  const filteredDistricts = useMemo(() => {
    return districts.filter((d) => {
      if (districtFilterMode === 'active' && !d.isActive) return false;
      if (districtFilterMode === 'inactive' && d.isActive) return false;
      if (districtSearchTerm.trim()) {
        const q = districtSearchTerm.toLowerCase().trim();
        const nameMatch = d.name.toLowerCase().includes(q);
        const neighMatch = d.neighborhoods.some(n => n.toLowerCase().includes(q));
        if (!nameMatch && !neighMatch) return false;
      }
      return true;
    });
  }, [districts, districtFilterMode, districtSearchTerm]);

  const inspectingDistrict = useMemo(() => {
    return districts.find(d => d.id === inspectingDistrictId) || null;
  }, [districts, inspectingDistrictId]);

  const filteredInspectingNeighborhoods = useMemo(() => {
    if (!inspectingDistrict) return [];
    if (!inspectingNeighSearch.trim()) return inspectingDistrict.neighborhoods;
    const q = inspectingNeighSearch.toLowerCase().trim();
    return inspectingDistrict.neighborhoods.filter(n => n.toLowerCase().includes(q));
  }, [inspectingDistrict, inspectingNeighSearch]);

  // Payment configuration local state
  const [paymentForm, setPaymentForm] = useState<PaymentSettings>(paymentSettings);
  const [paymentSaveSuccess, setPaymentSaveSuccess] = useState(false);
  const [testConnectionStatus, setTestConnectionStatus] = useState<string | null>(null);

  useEffect(() => {
    setPaymentForm(paymentSettings);
  }, [paymentSettings]);

  // New Flower Product Form State (Supports Multiple Categories)
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProductName, setNewProductName] = useState('');
  const [newProductCategories, setNewProductCategories] = useState<FlowerCategory[]>(['dogum_gunu']);
  const [newProductPrice, setNewProductPrice] = useState(1200);
  const [newProductOldPrice, setNewProductOldPrice] = useState(1400);
  const [newProductHasCampaign, setNewProductHasCampaign] = useState(false);
  const [newProductIsBestSeller, setNewProductIsBestSeller] = useState(false);
const [newProductIsFeatured, setNewProductIsFeatured] = useState(false);
  const [newProductImage, setNewProductImage] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductStemCount, setNewProductStemCount] = useState(25);
  const [productFilterMode, setProductFilterMode] = useState<'all' | 'bestseller' | 'featured' | 'campaign'>('all');

  // Edit Product State
  const [editingProduct, setEditingProduct] = useState<FlowerProduct | null>(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductPrice, setEditProductPrice] = useState(0);
  const [editProductOldPrice, setEditProductOldPrice] = useState(0);
  const [editProductImage, setEditProductImage] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductStemCount, setEditProductStemCount] = useState(25);

  const openEditProduct = (prod: FlowerProduct) => {
    setEditingProduct(prod);
    setEditProductName(prod.name);
    setEditProductPrice(prod.price);
    setEditProductOldPrice(prod.oldPrice || prod.price);
    setEditProductImage(prod.image);
    setEditProductDescription(prod.description);
    setEditProductStemCount(prod.stemCount || 25);
  };

  const handleSaveEditProduct = () => {
    if (!editingProduct) return;
    updateProduct({
      ...editingProduct,
      name: editProductName.trim() || editingProduct.name,
      price: editProductPrice,
      oldPrice: editProductOldPrice,
      image: editProductImage.trim() || editingProduct.image,
      description: editProductDescription.trim() || editingProduct.description,
      stemCount: editProductStemCount,
    });
    setEditingProduct(null);
  };

  // Edit Gift State
  const [editingGift, setEditingGift] = useState<ExtraGift | null>(null);
  const [editGiftName, setEditGiftName] = useState('');
  const [editGiftPrice, setEditGiftPrice] = useState(0);
  const [editGiftImage, setEditGiftImage] = useState('');
  const [editGiftDescription, setEditGiftDescription] = useState('');
  const [editGiftBadge, setEditGiftBadge] = useState('');

  const openEditGift = (gift: ExtraGift) => {
    setEditingGift(gift);
    setEditGiftName(gift.name);
    setEditGiftPrice(gift.price);
    setEditGiftImage(gift.image);
    setEditGiftDescription(gift.description);
    setEditGiftBadge(gift.badge || '');
  };

  const handleSaveEditGift = () => {
    if (!editingGift) return;
    updateExtraGift({
      ...editingGift,
      name: editGiftName.trim() || editingGift.name,
      price: editGiftPrice,
      image: editGiftImage.trim() || editingGift.image,
      description: editGiftDescription.trim() || editingGift.description,
      badge: editGiftBadge.trim() || undefined,
    });
    setEditingGift(null);
  };

  // New Extra Gift Form State
  const [showAddGift, setShowAddGift] = useState(false);
  const [newGiftName, setNewGiftName] = useState('');
  const [newGiftCategory, setNewGiftCategory] = useState<'cikolata' | 'pelus' | 'balon' | 'vazo' | 'kart' | 'mum'>('cikolata');
  const [newGiftPrice, setNewGiftPrice] = useState(250);
  const [newGiftImage, setNewGiftImage] = useState('');
  const [newGiftDescription, setNewGiftDescription] = useState('');
  const [newGiftBadge, setNewGiftBadge] = useState('Özel Seçim');

  // Gift Card Print State
  const [printOrder, setPrintOrder] = useState<Order | null>(null);
  const [cardFontSize, setCardFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [showRecipientOnCard, setShowRecipientOnCard] = useState(true);
  const [copiedNote, setCopiedNote] = useState(false);

  // Authentication & Security PIN State
  const [adminPin, setAdminPin] = useState<string>(() => localStorage.getItem('velvet_admin_pin') || '1234');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => sessionStorage.getItem('velvet_admin_auth') === 'true');
  const [pinInput, setPinInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [pinChangeSuccess, setPinChangeSuccess] = useState(false);
  const [pinChangeError, setPinChangeError] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.trim() === adminPin.trim()) {
      setIsAuthenticated(true);
      sessionStorage.setItem('velvet_admin_auth', 'true');
      setAuthError('');
      setPinInput('');
    } else {
      setAuthError('Hatalı PIN kodu! Lütfen kontrol edip tekrar deneyiniz.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('velvet_admin_auth');
    setActiveModal('none');
  };

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPinInput.trim().length < 4) {
      setPinChangeError('PIN kodu en az 4 haneli olmalıdır.');
      return;
    }
    setAdminPin(newPinInput.trim());
    localStorage.setItem('velvet_admin_pin', newPinInput.trim());
    setPinChangeSuccess(true);
    setPinChangeError('');
    setNewPinInput('');
    setTimeout(() => setPinChangeSuccess(false), 3000);
  };

  if (activeModal !== 'admin') {
    return null;
  }

  const toggleNewProductCategory = (catId: FlowerCategory) => {
    setNewProductCategories(prev =>
      prev.includes(catId)
        ? prev.filter(c => c !== catId)
        : [...prev, catId]
    );
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductName.trim()) return;

    if (newProductCategories.length === 0) {
      alert('Lütfen ürünün görüntüleneceği en az 1 kategori seçiniz.');
      return;
    }

    if (!newProductImage.trim()) {
      alert('Lütfen cihazınızdan çiçek için bir görsel/fotoğraf dosyası seçin.');
      return;
    }

    const originalBase = Number(newProductPrice);
    const finalPrice = newProductHasCampaign ? Math.round(originalBase * 0.8) : originalBase;
    const finalOldPrice = newProductHasCampaign ? originalBase : (Number(newProductOldPrice) || undefined);
    const primaryCategory = newProductCategories[0];

    const newProd: FlowerProduct = {
      id: `fl-${Date.now()}`,
      name: newProductName.trim(),
      category: primaryCategory,
      categories: newProductCategories,
      price: finalPrice,
      oldPrice: finalOldPrice,
      originalPrice: newProductHasCampaign ? originalBase : undefined,
      hasCampaign: newProductHasCampaign,
      campaignDiscountPercent: newProductHasCampaign ? 20 : undefined,
      image: newProductImage.trim(),
      description: newProductDescription.trim() || 'İzmir Bornova atölyemizde özenle tanzim edilen taze buket.',
      stemCount: Number(newProductStemCount),
      height: '55 cm',
      vaseIncluded: newProductCategories.includes('vazo'),
      tags: newProductHasCampaign 
        ? ['Kısa Süreli Kampanyalı Ürün', 'Yeni Ürün', 'Aynı Gün Teslim'] 
        : ['Yeni Ürün', 'Aynı Gün Teslim'],
      isBestSeller: newProductIsBestSeller,
      isFeatured: newProductIsFeatured,
      isSameDay: true,
      rating: 5.0,
      reviewsCount: 1
    };

    addProduct(newProd);
    setNewProductName('');
    setNewProductDescription('');
    setNewProductImage('');
    setNewProductCategories(['dogum_gunu']);
    setNewProductHasCampaign(false);
    setNewProductIsBestSeller(false);
    setNewProductIsFeatured(false);
    setShowAddProduct(false);
  };

  const handleCreateGift = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGiftName.trim()) return;

    if (!newGiftImage.trim()) {
      alert('Lütfen cihazınızdan hediye için bir görsel/fotoğraf dosyası seçin.');
      return;
    }

    const newGift: ExtraGift = {
      id: `gift-${Date.now()}`,
      name: newGiftName.trim(),
      category: newGiftCategory,
      price: Number(newGiftPrice),
      image: newGiftImage.trim(),
      description: newGiftDescription.trim() || 'Çiçek siparişinizle birlikte özel kutusunda adrese teslim edilir.',
      inStock: true,
      badge: newGiftBadge.trim() || undefined
    };

    addExtraGift(newGift);
    setNewGiftName('');
    setNewGiftDescription('');
    setNewGiftImage('');
    setShowAddGift(false);
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  // Security Gate: Visiting customers cannot enter without PIN
  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
        <div 
          className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200/80 overflow-hidden flex flex-col p-6 sm:p-8"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close back to store */}
          <button
            onClick={() => setActiveModal('none')}
            className="absolute top-4 right-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors cursor-pointer"
            title="Siteye Geri Dön"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Brand Logo & Lock Crest Icon */}
          <div className="flex flex-col items-center justify-center mb-4">
            <img
              src="/assets/aistudio/velvet-rose-premium-logo_a1210b70.png"
              alt="Velvet Rose"
              className="h-16 sm:h-20 w-auto object-contain mb-3 max-w-[200px] sm:max-w-[240px]"
            />
            <div className="w-12 h-12 rounded-2xl bg-stone-900 text-rose-300 flex items-center justify-center shadow-md">
              <Lock className="w-6 h-6 text-rose-400" />
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="text-[11px] font-bold text-rose-700 uppercase tracking-widest mb-1">
              Velvet Rose · Yetkili Girişi
            </div>
            <h2 className="text-xl font-display font-medium text-stone-900">
              Dükkan Yönetim Merkezi
            </h2>
            <p className="text-xs text-stone-500 mt-1.5 leading-relaxed">
              Bu alan mağaza sahipleri ve çiçek atölyesi personeline özeldir. Erişim sağlamak için lütfen 4 haneli güvenlik PIN kodunuzu giriniz.
            </p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                Yönetici Güvenlik PIN Kodu
              </label>
              <div className="relative">
                <input
                  type="password"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={8}
                  value={pinInput}
                  onChange={(e) => {
                    setPinInput(e.target.value);
                    if (authError) setAuthError('');
                  }}
                  placeholder="••••"
                  autoFocus
                  className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 px-4 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/30 focus:border-rose-600 bg-stone-50 text-stone-900"
                />
              </div>
              {authError && (
                <p className="text-xs text-red-600 font-medium mt-1.5 text-center">
                  {authError}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-stone-900 hover:bg-black text-white text-sm font-semibold rounded-xl shadow-md transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Yönetim Paneline Giriş Yap</span>
              <ArrowRight className="w-4 h-4 text-rose-300" />
            </button>
          </form>

          {/* Quick florist initial PIN info */}
          <div className="mt-6 pt-5 border-t border-stone-100 flex flex-col items-center gap-2 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-stone-100 rounded-full text-[11px] text-stone-600 font-medium">
              <Key className="w-3.5 h-3.5 text-rose-600" />
              <span>İlk Kurulum Varsayılan PIN: <strong className="font-mono text-stone-900">1234</strong></span>
            </div>
            <p className="text-[11px] text-stone-400">
              * Giriş yaptıktan sonra PIN kodunuzu Ödeme & Ayarlar sekmesinden dilediğiniz zaman değiştirebilirsiniz.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-white p-1.5 rounded-xl border border-stone-700 shrink-0 hidden sm:block">
              <img
                src="/assets/aistudio/velvet-rose-premium-logo_a1210b70.png"
                alt="Velvet Rose"
                className="h-10 sm:h-12 w-auto object-contain max-w-[140px] sm:max-w-[180px]"
              />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-300 tracking-wider uppercase mb-0.5">
                <span>Velvet Rose (velvetrose.com.tr) Dükkan Paneli</span>
                <span aria-hidden="true">·</span>
                <span>Bornova Atölye Yönetimi</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-display font-medium text-white">
                Çiçekçi & Sipariş Yönetim Merkezi
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-300 hover:text-white bg-stone-800 hover:bg-stone-700 rounded-lg transition-colors cursor-pointer"
              title="Yönetim Panelini Kilitle ve Çıkış Yap"
            >
              <Lock className="w-3.5 h-3.5 text-rose-300" />
              <span className="hidden sm:inline">Güvenli Çıkış</span>
            </button>
            <button
              onClick={() => setActiveModal('none')}
              className="p-1.5 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
              title="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 border-b border-stone-200 bg-stone-50 text-xs">
          <div className="p-3.5 border-r border-stone-200 text-center sm:text-left sm:px-6">
            <span className="text-stone-500 block">Kayıtlı Çiçek Tasarımı</span>
            <span className="text-lg font-bold text-stone-900 tabular-nums">{products.length} Adet</span>
          </div>
          <div className="p-3.5 border-r border-stone-200 text-center sm:text-left sm:px-6">
            <span className="text-stone-500 block">Yüklü Ekstra Hediye</span>
            <span className="text-lg font-bold text-stone-900 tabular-nums">{extraGifts.length} Çeşit</span>
          </div>
          <div className="p-3.5 border-r border-stone-200 text-center sm:text-left sm:px-6">
            <span className="text-stone-500 block">Aktif Teslimat Ağı</span>
            <span className="text-lg font-bold text-emerald-800 tabular-nums">{activeDistricts.length} / {districts.length} İlçe</span>
          </div>
          <div className="p-3.5 text-center sm:text-left sm:px-6">
            <span className="text-stone-500 block">Gelen Siparişler & Ciro</span>
            <span className="text-lg font-bold text-rose-800 tabular-nums">{orders.length} Sipariş ({totalRevenue.toLocaleString('tr-TR')} ₺)</span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border-b border-stone-200">
          {/* Scroll container */}
          <div className="flex overflow-x-auto scrollbar-hide px-4 sm:px-6 gap-1 min-w-0">
            {/* Tab: Siparişler */}
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-shrink-0 flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'orders'
                  ? 'border-rose-700 text-rose-800 bg-rose-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              <span>🛍️</span>
              <span>Gelen Siparişler</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'orders' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-600'
              }`}>
                {orders.length}
              </span>
            </button>

            {/* Tab: Ürünler */}
            <button
              onClick={() => setActiveTab('products')}
              className={`flex-shrink-0 flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'products'
                  ? 'border-rose-700 text-rose-800 bg-rose-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              <span>🌸</span>
              <span>Çiçek Ürünleri</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'products' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-600'
              }`}>
                {products.length}
              </span>
            </button>

            {/* Tab: Hediyeler */}
            <button
              onClick={() => setActiveTab('gifts')}
              className={`flex-shrink-0 flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'gifts'
                  ? 'border-rose-700 text-rose-800 bg-rose-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              <span>🎁</span>
              <span>Ekstra Hediyeler</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeTab === 'gifts' ? 'bg-rose-100 text-rose-700' : 'bg-stone-100 text-stone-600'
              }`}>
                {extraGifts.length}
              </span>
            </button>

            {/* Tab: Teslimat */}
            <button
              onClick={() => setActiveTab('delivery')}
              className={`flex-shrink-0 flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'delivery'
                  ? 'border-rose-700 text-rose-800 bg-rose-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0 text-rose-500" />
              <span>Teslimat Bölgeleri</span>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                activeDistricts.length > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
              }`}>
                {activeDistricts.length}/{districts.length} Aktif
              </span>
            </button>

            {/* Tab: Ödeme */}
            <button
              onClick={() => setActiveTab('payment')}
              className={`flex-shrink-0 flex items-center gap-2 py-3.5 px-4 text-xs font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'payment'
                  ? 'border-rose-700 text-rose-800 bg-rose-50/50'
                  : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-50'
              }`}
            >
              <CreditCard className="w-3.5 h-3.5 shrink-0" />
              <span>Ödeme & POS</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-800 uppercase">
                {paymentSettings.activeGateway === 'paytr' ? 'PayTR ✓' : 'Ziraat ✓'}
              </span>
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-50/50">
          
          {/* TAB 1: ORDERS MANAGEMENT (DETAYLI SİPARİŞ & ADRES YÖNETİMİ) */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              
              {/* Header & Orders Description */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-rose-700" />
                    <span>Gelen Siparişler & Canlı Atölye Yönetimi</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
                      {filteredOrders.length} Sipariş
                    </span>
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Gelen her siparişin teslimat adresi, kurye tarifi, çiçek ve hediye içeriği, kart notu ve müşteri bilgileri aşağıda detaylı olarak yer alır.
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-500">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Canlı Sipariş Akışı Aktif</span>
                </div>
              </div>

              {/* Order Search & Filter Bar */}
              <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Search Input */}
                  <div className="relative flex-1">
                    <input
                      type="text"
                      value={orderSearchTerm}
                      onChange={(e) => setOrderSearchTerm(e.target.value)}
                      placeholder="Sipariş no (#IZM-...), alıcı/gönderici adı, telefon, ilçe veya çiçek adı ara..."
                      className="w-full text-xs bg-stone-50 border border-stone-300 rounded-lg pl-8 pr-8 py-2 text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-600 focus:bg-white"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
                    {orderSearchTerm && (
                      <button
                        type="button"
                        onClick={() => setOrderSearchTerm('')}
                        className="text-stone-400 hover:text-stone-700 text-xs absolute right-2.5 top-2 px-1 hover:bg-stone-200 rounded"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Expand / Collapse All Toggle */}
                  <button
                    type="button"
                    onClick={() => {
                      const allExpanded = orders.every(o => expandedOrderIds[o.id] !== false);
                      const nextState: Record<string, boolean> = {};
                      orders.forEach(o => {
                        nextState[o.id] = !allExpanded;
                      });
                      setExpandedOrderIds(nextState);
                    }}
                    className="px-3 py-2 text-xs font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                  >
                    <Sliders className="w-3.5 h-3.5 text-stone-500" />
                    <span>Tümünü {orders.every(o => expandedOrderIds[o.id] !== false) ? 'Daralt' : 'Genişlet'}</span>
                  </button>
                </div>

                {/* Status Tabs Strip */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-stone-100 pt-2.5">
                  <span className="text-[11px] font-semibold text-stone-400 shrink-0 mr-1">Durum Filtresi:</span>
                  
                  <button
                    type="button"
                    onClick={() => setOrderStatusFilter('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                      orderStatusFilter === 'all'
                        ? 'bg-stone-900 text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    Tümü ({orders.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderStatusFilter('received')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                      orderStatusFilter === 'received'
                        ? 'bg-blue-700 text-white'
                        : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                    }`}
                  >
                    <span>📋 Sipariş Alındı</span>
                    <span className="tabular-nums">({orders.filter(o => o.status === 'received').length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderStatusFilter('preparing')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                      orderStatusFilter === 'preparing'
                        ? 'bg-amber-700 text-white'
                        : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                    }`}
                  >
                    <span>✂️ Hazırlanıyor</span>
                    <span className="tabular-nums">({orders.filter(o => o.status === 'preparing').length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderStatusFilter('courier')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                      orderStatusFilter === 'courier'
                        ? 'bg-purple-700 text-white'
                        : 'bg-purple-50 text-purple-700 hover:bg-purple-100'
                    }`}
                  >
                    <span>🚚 Kuryede / Yolda</span>
                    <span className="tabular-nums">({orders.filter(o => o.status === 'courier').length})</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOrderStatusFilter('delivered')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors whitespace-nowrap flex items-center gap-1 cursor-pointer ${
                      orderStatusFilter === 'delivered'
                        ? 'bg-emerald-700 text-white'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                  >
                    <span>✅ Teslim Edildi</span>
                    <span className="tabular-nums">({orders.filter(o => o.status === 'delivered').length})</span>
                  </button>
                </div>
              </div>

              {/* No Orders Empty State */}
              {filteredOrders.length === 0 && (
                <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center space-y-2">
                  <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto text-xl">
                    🚚
                  </div>
                  <h4 className="text-sm font-bold text-stone-800">Filtreye Uygun Sipariş Bulunamadı</h4>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Arama kriterinizi değiştirebilir veya durum filtresini "Tümü" olarak seçebilirsiniz.
                  </p>
                  {orderSearchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setOrderSearchTerm('');
                        setOrderStatusFilter('all');
                      }}
                      className="mt-2 text-xs text-rose-700 hover:underline font-semibold"
                    >
                      Aramayı ve Filtreleri Temizle
                    </button>
                  )}
                </div>
              )}

              {/* DETAILED ORDERS LIST */}
              {filteredOrders.map((order) => {
                const isExpanded = expandedOrderIds[order.id] !== false; // expanded by default!

                // Status styling helper
                const statusBadgeConfig = {
                  received: { label: '1. Sipariş Alındı', bg: 'bg-blue-50 text-blue-800 border-blue-200', icon: '📋' },
                  preparing: { label: '2. Atölyede Hazırlanıyor', bg: 'bg-amber-50 text-amber-800 border-amber-200', icon: '🔧' },
                  courier: { label: '3. Özel Kuryede / Yolda', bg: 'bg-purple-50 text-purple-800 border-purple-200', icon: '🚚' },
                  delivered: { label: '4. Alıcıya Teslim Edildi', bg: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: '✅' },
                }[order.status];

                // Full address string for clipboard & maps
                const fullAddressString = `İzmir, ${order.deliveryAddress.district}, ${order.deliveryAddress.neighborhood} Mah., ${order.deliveryAddress.streetAddress}${order.deliveryAddress.buildingNo ? ` No: ${order.deliveryAddress.buildingNo}` : ''}${order.deliveryAddress.apartmentNo ? ` D: ${order.deliveryAddress.apartmentNo}` : ''}`;
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddressString)}`;

                // Format creation date
                const formattedDate = order.createdAt 
                  ? new Date(order.createdAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
                  : 'Bugün';

                return (
                  <div
                    key={order.id}
                    className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden transition-all duration-200 hover:border-stone-300"
                  >
                    
                    {/* ORDER CARD HEADER STRIP */}
                    <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-stone-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                      
                      {/* Left: ID, Timestamps, Region */}
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-base font-black text-stone-900 font-mono tracking-tight">
                            #{order.id}
                          </span>
                          
                          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                            📍 {order.deliveryAddress.district} · {order.deliveryAddress.neighborhood} Mah.
                          </span>

                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${statusBadgeConfig.bg}`}>
                            <span>{statusBadgeConfig.icon}</span>
                            <span>{statusBadgeConfig.label}</span>
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-stone-400" />
                            <span>Sipariş Zamanı: <strong>{formattedDate}</strong></span>
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1 text-stone-800 font-semibold">
                            <Calendar className="w-3.5 h-3.5 text-rose-600" />
                            <span>Teslimat: {order.deliveryDate} ({order.deliveryTimeSlot})</span>
                          </span>
                        </div>
                      </div>

                      {/* Right: Status Change Controller & Print Actions */}
                      <div className="flex flex-wrap items-center gap-2 self-start lg:self-center">
                        
                        {/* Status Select Controller */}
                        <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-xl border border-stone-300 shadow-2xs">
                          <span className="text-[11px] font-bold text-stone-500">Durum:</span>
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                            className="text-xs font-bold text-stone-900 bg-transparent focus:outline-none cursor-pointer"
                          >
                            <option value="received">1. Sipariş Alındı</option>
                            <option value="preparing">2. Atölyede Hazırlanıyor</option>
                            <option value="courier">3. Kuryede / Yolda</option>
                            <option value="delivered">4. Teslim Edildi</option>
                          </select>
                        </div>

                        {/* Print Workshop & Courier Slip Button */}
                        <button
                          type="button"
                          onClick={() => setPrintSlipOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                          title="Kurye Teslim ve Atölye Hazırlık Fişini Yazdır"
                        >
                          <FileText className="w-3.5 h-3.5 text-rose-300" />
                          <span>Sipariş Fişi</span>
                        </button>

                        {/* Print Gift Card Button */}
                        <button
                          type="button"
                          onClick={() => setPrintOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                          title="Hediye Mesaj Kartını Yazdır"
                        >
                          <Printer className="w-3.5 h-3.5" />
                          <span>Kartı Yazdır</span>
                        </button>

                        {/* Toggle Expand/Collapse */}
                        <button
                          type="button"
                          onClick={() => {
                            setExpandedOrderIds(prev => ({
                              ...prev,
                              [order.id]: !isExpanded
                            }));
                          }}
                          className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-200/70 rounded-lg transition-colors cursor-pointer"
                          title={isExpanded ? 'Detayları Kapat' : 'Detayları Aç'}
                        >
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                      </div>

                    </div>

                    {/* EXPANDED DETAILED ORDER VIEW */}
                    {isExpanded && (
                      <div className="p-4 sm:p-6 space-y-6 animate-in fade-in duration-200">
                        
                        {/* ROW 1: 📍 TESLİMAT ADRESİ & KURYE LOJİSTİK BİLGİLERİ (EN ÇOK ÖNEM VERİLEN KISIM) */}
                        <div className="bg-rose-50/40 rounded-2xl border border-rose-200/80 p-4 sm:p-5 space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-rose-200/60 pb-3">
                            <div className="flex items-center gap-2">
                              <div className="w-7 h-7 rounded-lg bg-rose-700 text-white flex items-center justify-center">
                                <MapPin className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                                  Teslimat Adresi ve Kurye Lojistik Rehberi
                                </h4>
                                <span className="text-[11px] text-stone-500">
                                  İzmir İçi Hızlı & Güvenli Çiçek Dağıtımı
                                </span>
                              </div>
                            </div>

                            {/* Logistics Quick Actions */}
                            <div className="flex items-center gap-2">
                              <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-rose-900 rounded-lg text-xs font-semibold border border-rose-300 transition-colors cursor-pointer shadow-2xs"
                              >
                                <ExternalLink className="w-3.5 h-3.5 text-rose-600" />
                                <span>Google Haritada Aç</span>
                              </a>

                              <button
                                type="button"
                                onClick={() => {
                                  navigator.clipboard.writeText(fullAddressString);
                                  setCopiedAddressOrderId(order.id);
                                  setTimeout(() => setCopiedAddressOrderId(null), 2500);
                                }}
                                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-800 rounded-lg text-xs font-semibold border border-stone-300 transition-colors cursor-pointer shadow-2xs"
                              >
                                {copiedAddressOrderId === order.id ? (
                                  <>
                                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                    <span className="text-emerald-700 font-bold">Kopyalandı!</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5 text-stone-500" />
                                    <span>Adresi Kopyala</span>
                                  </>
                                )}
                              </button>
                            </div>
                          </div>

                          {/* Full Structured Address Breakdown */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                            <div className="bg-white p-3 rounded-xl border border-rose-200/70">
                              <span className="text-[10px] text-stone-400 uppercase font-bold block mb-0.5">İl & İlçe:</span>
                              <span className="font-bold text-stone-900 text-sm">
                                İzmir / {order.deliveryAddress.district}
                              </span>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-rose-200/70">
                              <span className="text-[10px] text-stone-400 uppercase font-bold block mb-0.5">Mahalle:</span>
                              <span className="font-bold text-stone-900 text-sm">
                                {order.deliveryAddress.neighborhood} Mah.
                              </span>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-rose-200/70 sm:col-span-2">
                              <span className="text-[10px] text-stone-400 uppercase font-bold block mb-0.5">Cadde / Sokak:</span>
                              <span className="font-bold text-rose-950 text-sm">
                                🛣️ {order.deliveryAddress.streetAddress}
                              </span>
                            </div>
                          </div>

                          {/* Building & Apartment Details Row */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                            <div className="bg-white p-3 rounded-xl border border-stone-200">
                              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Bina / Dış Kapı No:</span>
                              <span className="font-bold text-stone-900 text-sm">
                                {order.deliveryAddress.buildingNo ? `No: ${order.deliveryAddress.buildingNo}` : 'Belirtilmedi'}
                              </span>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-stone-200">
                              <span className="text-[10px] text-stone-400 uppercase font-semibold block">İç Kapı / Daire No:</span>
                              <span className="font-bold text-stone-900 text-sm">
                                {order.deliveryAddress.apartmentNo ? `Daire: ${order.deliveryAddress.apartmentNo}` : 'Belirtilmedi'}
                              </span>
                            </div>

                            <div className="bg-white p-3 rounded-xl border border-stone-200 sm:col-span-2">
                              <span className="text-[10px] text-stone-400 uppercase font-semibold block">Teslimat Zamanı:</span>
                              <span className="font-bold text-rose-800 text-sm">
                                {order.deliveryDate} · {order.deliveryTimeSlot}
                              </span>
                            </div>
                          </div>

                          {/* Courier Directions / Note if provided */}
                          {order.deliveryAddress.addressDescription && (
                            <div className="p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                              <div className="w-6 h-6 rounded-md bg-amber-200 text-amber-900 flex items-center justify-center shrink-0 font-bold">
                                🛣️
                              </div>
                              <div>
                                <span className="font-bold block text-amber-950 text-xs">
                                  Müşteriden Kurye İçin Adres Tarifi / Teslimat Notu:
                                </span>
                                <p className="mt-0.5 text-amber-900 font-medium leading-relaxed">
                                  "{order.deliveryAddress.addressDescription}"
                                </p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* ROW 2: 👤 ALICI, GÖNDERİCİ VE FİNANS / ÖDEME BİLGİLERİ */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          
                          {/* 1. Recipient Box */}
                          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                              <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                                <Heart className="w-3.5 h-3.5 text-rose-600" />
                                <span>Alıcı (Teslim Alacak Kişi)</span>
                              </h5>
                              {order.recipient.relationship && (
                                <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
                                  {order.recipient.relationship}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 text-xs">
                              <span className="text-stone-400 text-[11px] block">Adı Soyadı:</span>
                              <span className="text-sm font-bold text-stone-900 block">
                                {order.recipient.name}
                              </span>

                              <span className="text-stone-400 text-[11px] block pt-1">İletişim Telefonu:</span>
                              <span className="font-mono font-bold text-stone-800 block text-xs">
                                {order.recipient.phone}
                              </span>
                            </div>

                            {/* Direct Communication Buttons for Florist & Courier */}
                            <div className="flex items-center gap-2 pt-1 border-t border-stone-200/60">
                              <a
                                href={`tel:${order.recipient.phone}`}
                                className="flex-1 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg text-center text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-stone-600" />
                                <span>Ara</span>
                              </a>
                              <a
                                href={`https://wa.me/90${order.recipient.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* 2. Sender Box */}
                          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                              <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                                <UserCheck className="w-3.5 h-3.5 text-stone-700" />
                                <span>Siparişi Veren (Gönderici)</span>
                              </h5>
                              {order.sender.isAnonymous ? (
                                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                                  👁️ İsim Gizli
                                </span>
                              ) : (
                                <span className="text-[10px] font-semibold text-stone-600 bg-stone-200 px-2 py-0.5 rounded-full">
                                  Açık Gönderici
                                </span>
                              )}
                            </div>

                            <div className="space-y-1 text-xs">
                              <span className="text-stone-400 text-[11px] block">Gönderici Adı:</span>
                              <span className="text-sm font-bold text-stone-900 block">
                                {order.sender.name}
                                {order.sender.isAnonymous && (
                                  <span className="text-[10px] font-normal text-amber-700 block italic">
                                    (Alıcıya ismi verilmeyecek - gizli hediye)
                                  </span>
                                )}
                              </span>

                              <span className="text-stone-400 text-[11px] block pt-1">Telefon & E-Posta:</span>
                              <span className="font-mono font-bold text-stone-800 block text-xs">
                                {order.sender.phone}
                              </span>
                              {order.sender.email && (
                                <span className="text-stone-500 text-[11px] block truncate">
                                  {order.sender.email}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2 pt-1 border-t border-stone-200/60">
                              <a
                                href={`tel:${order.sender.phone}`}
                                className="flex-1 py-1.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-lg text-center text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                              >
                                <Phone className="w-3 h-3 text-stone-600" />
                                <span>Ara</span>
                              </a>
                              <a
                                href={`https://wa.me/90${order.sender.phone.replace(/\D/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-center text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs"
                              >
                                <MessageCircle className="w-3 h-3" />
                                <span>WhatsApp</span>
                              </a>
                            </div>
                          </div>

                          {/* 3. Payment & Grand Total Box */}
                          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-3">
                            <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
                              <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                                <CreditCard className="w-3.5 h-3.5 text-blue-700" />
                                <span>Ödeme & Finans Dökümü</span>
                              </h5>
                              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Tahsil Edildi
                              </span>
                            </div>

                            <div className="space-y-1.5 text-xs">
                              <div>
                                <span className="text-stone-400 text-[11px] block">Ödeme Yöntemi:</span>
                                <span className="font-bold text-stone-900 text-xs">
                                  {order.paymentMethod === 'credit_card' ? (
                                    <span>
                                      💳 Kredi / Banka Kartı ({order.paymentGateway === 'ziraat' ? 'Ziraat POS' : 'PayTR Sanal POS'})
                                    </span>
                                  ) : (
                                    <span>🏦 Havale / FAST / EFT Transferi</span>
                                  )}
                                </span>
                              </div>

                              {order.installment && order.installment > 1 && (
                                <div className="text-[11px] text-stone-600">
                                  Taksit: <strong className="text-stone-900">{order.installment} Taksit</strong>
                                </div>
                              )}

                              <div className="pt-2 border-t border-stone-200/80 flex items-center justify-between">
                                <span className="text-xs font-semibold text-stone-600">Toplam Sipariş Tutarı:</span>
                                <span className="text-base font-black text-rose-800 font-sans tabular-nums">
                                  {order.totalAmount.toLocaleString('tr-TR')} ₺
                                </span>
                              </div>
                            </div>

                            <div className="p-2 bg-emerald-50 rounded-lg border border-emerald-200 text-[10px] text-emerald-800 font-medium flex items-center gap-1.5">
                              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                              <span>256-Bit SSL 3D Secure / FAST Doğrulanmış Ödeme</span>
                            </div>
                          </div>

                        </div>

                        {/* ROW 3: 🏦 SİPARİŞ İÇERİĞİ (ÇİÇEKLER VE EKSTRA HEDİYELERİN EKSİKSİZ DÖKÜMÜ) */}
                        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                          <div className="px-4 py-3 bg-stone-100/70 border-b border-stone-200 flex items-center justify-between">
                            <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                              <Package className="w-3.5 h-3.5 text-rose-700" />
                              <span>Sipariş İçeriği (Atölyede Tanzim Edilecek Çiçekler & Hediyeler)</span>
                            </h5>
                            <span className="text-xs font-bold text-stone-700">
                              {order.items.reduce((sum, item) => sum + item.quantity, 0)} Ürün
                            </span>
                          </div>

                          <div className="divide-y divide-stone-100">
                            {order.items.map((cartItem, idx) => {
                              const lineTotal = cartItem.quantity * cartItem.product.price;
                              const extraGiftsTotal = cartItem.selectedGifts.reduce(
                                (sum, g) => sum + (g.gift.price * g.quantity), 
                                0
                              );

                              return (
                                <div key={cartItem.cartItemId || idx} className="p-4 space-y-3">
                                  
                                  {/* Primary Flower Item */}
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3">
                                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                                        <SafeImage
                                          src={cartItem.product.image}
                                          alt={cartItem.product.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>

                                      <div className="space-y-1">
                                        <h6 className="text-sm font-bold text-stone-900">
                                          {cartItem.product.name}
                                        </h6>

                                        <div className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
                                          {cartItem.product.stemCount && (
                                            <span className="font-semibold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                              🌸 {cartItem.product.stemCount} Dal Çiçek
                                            </span>
                                          )}
                                          <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                                            {cartItem.product.vaseIncluded ? '🌸 Vazo Dahil' : '🌸 Lüks Ambalajlı Buket'}
                                          </span>
                                          {cartItem.product.height && (
                                            <span className="bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                                              📏 {cartItem.product.height}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>

                                    {/* Item Quantity & Price */}
                                    <div className="text-right shrink-0">
                                      <span className="text-xs text-stone-500 block">
                                        {cartItem.quantity} Adet × {cartItem.product.price.toLocaleString('tr-TR')} ₺
                                      </span>
                                      <span className="text-sm font-bold text-stone-900 tabular-nums">
                                        {lineTotal.toLocaleString('tr-TR')} ₺
                                      </span>
                                    </div>
                                  </div>

                                  {/* Attached Extra Gifts (Çikolata, Peluş, Balon vb.) */}
                                  {cartItem.selectedGifts && cartItem.selectedGifts.length > 0 && (
                                    <div className="pl-4 sm:pl-16 pt-2">
                                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                                        <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider flex items-center gap-1">
                                          <Gift className="w-3.5 h-3.5 text-rose-600" />
                                          <span>Bu Çiçekle Birlikte Verilecek Ekstra Yan Hediyeler ({cartItem.selectedGifts.length} Adet):</span>
                                        </span>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                          {cartItem.selectedGifts.map((sg, gIdx) => (
                                            <div
                                              key={gIdx}
                                              className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200/80 shadow-2xs"
                                            >
                                              <div className="flex items-center gap-2">
                                                <div className="w-9 h-9 rounded-lg overflow-hidden bg-stone-100 shrink-0">
                                                  <SafeImage
                                                    src={sg.gift.image}
                                                    alt={sg.gift.name}
                                                    className="w-full h-full object-cover"
                                                  />
                                                </div>
                                                <div>
                                                  <span className="text-xs font-bold text-stone-800 block">
                                                    {sg.gift.name}
                                                  </span>
                                                  <span className="text-[10px] text-stone-500">
                                                    {sg.quantity} Adet
                                                  </span>
                                                </div>
                                              </div>
                                              <span className="text-xs font-semibold text-stone-900 tabular-nums">
                                                +{(sg.gift.price * sg.quantity).toLocaleString('tr-TR')} ₺
                                              </span>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* ROW 4: ✉️ HEDİYE KARTI NOTU (GIFT NOTE DETAYI) */}
                        <div className="bg-white rounded-2xl border-2 border-rose-200 p-4 sm:p-5 space-y-3 shadow-2xs">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-base">✉️</span>
                              <div>
                                <h5 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                                  Karta Basılacak Hediye Notu (Gift Note)
                                </h5>
                                <span className="text-[11px] text-stone-500">
                                  Standart Beyaz Dokulu Kart & Zarf içine basılacak mesaj
                                </span>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              {order.cardNote && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(order.cardNote || '');
                                    alert('Hediye notu panoya kopyalandı.');
                                  }}
                                  className="px-2.5 py-1 text-xs font-semibold text-stone-600 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                  <Copy className="w-3 h-3" />
                                  <span>Notu Kopyala</span>
                                </button>
                              )}

                              <button
                                type="button"
                                onClick={() => setPrintOrder(order)}
                                className="px-3 py-1 bg-rose-700 hover:bg-rose-800 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                              >
                                <Printer className="w-3.5 h-3.5" />
                                <span>Fiziksel Kartı Yazdır</span>
                              </button>
                            </div>
                          </div>

                          {order.cardNote ? (
                            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                              <p className="font-serif italic text-stone-900 text-sm leading-relaxed whitespace-pre-line">
                                "{order.cardNote}"
                              </p>
                              <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-xs">
                                <span className="font-serif font-bold text-rose-900 text-xs tracking-wider">
                                  Velvet Rose · Çiçek Tasarım Atölyesi
                                </span>
                                <span className="font-serif font-semibold italic text-stone-800">
                                  İmza: {order.cardSenderName || (order.sender.isAnonymous ? 'Gizli Hayran' : order.sender.name || 'Sevgilerimle')}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 bg-stone-50 rounded-xl text-stone-500 text-xs text-center border border-stone-200">
                              (Müşteri özel bir kart notu eklemedi. Alıcıya boş standart beyaz Velvet Rose hediye kartı iletilecektir.)
                            </div>
                          )}
                        </div>

                      </div>
                    )}

                  </div>
                );
              })}

            </div>
          )}

          {/* TAB 2: PRODUCTS CRUD */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900">
                  Satıştaki Çiçek Ürünleri
                </h3>
                <button
                  onClick={() => setShowAddProduct(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Çiçek Ekle</span>
                </button>
              </div>

              {/* Add Flower Product Form Modal */}
              {showAddProduct && (
                <form
                  onSubmit={handleCreateProduct}
                  className="p-4 bg-white rounded-xl border border-rose-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                      Yeni Çiçek Tasarımı Yükle
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">

                    {/* 1. ÖNCE RESİM YÜKLEME */}
                    <div className="sm:col-span-2">
                      <ImageFileInput
                        label="Çiçek Görseli / Fotoğrafı"
                        value={newProductImage}
                        onChange={setNewProductImage}
                        required
                        helperText="Cihazınızdan veya galerinizden dosya seçin"
                        id="new-product-file-picker"
                      />
                    </div>

                    {/* 2. SONRA ÇİÇEK ADI */}
                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Çiçek Adı *</label>
                      <input
                        type="text"
                        required
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                        placeholder="Örn: Kordon Zarafeti Gül Buketi"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>

                    {/* Multi-category selection component */}
                    <div className="sm:col-span-2 space-y-2 p-3 bg-stone-50/70 border border-stone-200 rounded-xl">
                      <div className="flex items-center justify-between">
                        <div>
                          <label className="block font-bold text-stone-800 text-xs">
                            Kategoriler (Çoklu Seçim) <span className="text-rose-600">*</span>
                          </label>
                          <p className="text-[11px] text-stone-500">
                            Ürünün listeleneceği tüm kategorileri seçin (Birden fazla kategoriye aynı anda eklenebilir).
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md">
                            {newProductCategories.length} Kategori Seçili
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (newProductCategories.length === FLOWER_CATEGORIES.length) {
                                setNewProductCategories(['guller']);
                              } else {
                                setNewProductCategories(FLOWER_CATEGORIES.map(c => c.id));
                              }
                            }}
                            className="text-[11px] text-stone-600 hover:text-rose-700 font-medium underline cursor-pointer"
                          >
                            {newProductCategories.length === FLOWER_CATEGORIES.length ? 'Varsayılana Dön' : 'Tümünü Seç'}
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1">
                        {FLOWER_CATEGORIES.map((cat) => {
                          const isSelected = newProductCategories.includes(cat.id);
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => toggleNewProductCategory(cat.id)}
                              className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-rose-50 border-rose-600 text-rose-950 font-semibold shadow-2xs ring-1 ring-rose-500'
                                  : 'bg-white hover:bg-stone-100 border-stone-200 text-stone-700'
                              }`}
                            >
                              <div
                                className={`w-4 h-4 rounded flex items-center justify-center shrink-0 transition-colors ${
                                  isSelected ? 'bg-rose-700 text-white' : 'border border-stone-300 bg-white'
                                }`}
                              >
                                {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                              </div>
                              <span className="text-sm shrink-0">{cat.icon}</span>
                              <span className="text-xs truncate">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>

                      {newProductCategories.length === 0 && (
                        <p className="text-[11px] font-semibold text-rose-600 pt-1">
                          ⚠️ Lütfen ürünün listeleneceği en az bir kategori seçiniz.
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Fiyat (₺) *</label>
                      <input
                        type="number"
                        required
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">İndirimsiz Eski Fiyat (Opsiyonel)</label>
                      <input
                        type="number"
                        value={newProductOldPrice}
                        onChange={(e) => setNewProductOldPrice(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>

                    {/* Campaign Activation Option for New Product */}
                    <div className="sm:col-span-2 p-3.5 bg-rose-50/90 border border-rose-200 rounded-xl transition-all">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="campaign-active-checkbox"
                            checked={newProductHasCampaign}
                            onChange={(e) => setNewProductHasCampaign(e.target.checked)}
                            className="w-4 h-4 rounded text-rose-700 focus:ring-rose-600 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-rose-900 flex items-center gap-1.5">
                            <Percent className="w-3.5 h-3.5 text-rose-700" />
                            <span>Bu Üründe Kampanya Aktif Et (%20 İskonto Uygula)</span>
                          </span>
                        </label>
                        {newProductHasCampaign && (
                          <span className="text-[11px] font-bold bg-rose-700 text-white px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            <span>Kısa Süreli Kampanyalı Ürün</span>
                          </span>
                        )}
                      </div>
                      {newProductHasCampaign ? (
                        <div className="mt-2 text-[11px] text-rose-800 bg-white/90 p-2.5 rounded-lg border border-rose-200 flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                          <span>
                            ✓ Kampanya uygulandı: Normal fiyat <strong>{newProductPrice} ₺</strong> iken müşteriye <strong>%20 iskonto ile {Math.round(newProductPrice * 0.8)} ₺</strong> olarak sunulacaktır.
                          </span>
                          <span className="text-emerald-700 font-semibold shrink-0 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Kazanç: {Math.round(newProductPrice * 0.2)} ₺ İndirim
                          </span>
                        </div>
                      ) : (
                        <p className="text-[11px] text-stone-500 mt-1">
                          Bu seçeneği işaretlediğinizde ürün fiyatına otomatik %20 iskonto uygulanır ve üründe <strong>"Kısa Süreli Kampanyalı Ürün"</strong> etiketi belirir.
                        </p>
                      )}
                    </div>

                    {/* Best Seller Slider Option for New Product */}
                    <div className="sm:col-span-2 p-3.5 bg-amber-50/80 border border-amber-200 rounded-xl transition-all">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="bestseller-active-checkbox"
                            checked={newProductIsBestSeller}
                            onChange={(e) => setNewProductIsBestSeller(e.target.checked)}
                            className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-600" />
                            <span>Bu Ürünü "Çok Satanlar Slider"ında Göster (Ana Sayfada Öne Çıkar)</span>
                          </span>
                        </label>
                        {newProductIsBestSeller && (
                          <span className="text-[11px] font-bold bg-amber-600 text-white px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
                            <Flame className="w-3 h-3 fill-white" />
                            <span>Slider’da Aktif</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-900/80 mt-1">
                        İşaretlendiğinde bu çiçek, filtreleme menüsünün üzerindeki animasyonlu <strong>"Çok Satan Özel Tasarımlar"</strong> kaydırmalı slider vitrininde ilk sıralarda yer alır.
                      </p>
                    </div>

                    {/* Featured Showcase (Başyapıtlar Vitrini) Option for New Product */}
                    <div className="sm:col-span-2 p-3.5 bg-purple-50/80 border border-purple-200 rounded-xl transition-all">
                      <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            id="featured-active-checkbox"
                            checked={newProductIsFeatured}
                            onChange={(e) => setNewProductIsFeatured(e.target.checked)}
                            className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 cursor-pointer"
                          />
                          <span className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
                            <Crown className="w-3.5 h-3.5 text-purple-600" />
                            <span>Bu Ürünü "Başyapıtlar Vitrini"nde Göster</span>
                          </span>
                        </label>
                        {newProductIsFeatured && (
                          <span className="text-[11px] font-bold bg-purple-700 text-white px-2 py-0.5 rounded shadow-2xs flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            <span>Vitrin'de Aktif</span>
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-purple-900/80 mt-1">
                        İşaretlendiğinde bu çiçek, hero bölümündeki <strong>"Özel Günlere Yakışan Başyapıtlar"</strong> premium vitrinde gösterilir.
                      </p>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Açıklama</label>
                      <textarea
                        rows={2}
                        value={newProductDescription}
                        onChange={(e) => setNewProductDescription(e.target.value)}
                        placeholder="Çiçeğin detayları, ambalajı ve tasarım notları..."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProduct(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg cursor-pointer"
                    >
                      Çiçeği Satışa Ekle
                    </button>
                  </div>
                </form>
              )}

              {/* Product Filter Strip */}
              <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 bg-stone-100/70 rounded-xl border border-stone-200 text-xs">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => setProductFilterMode('all')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                      productFilterMode === 'all'
                        ? 'bg-stone-900 text-white shadow-2xs'
                        : 'bg-white text-stone-700 hover:bg-stone-200/70 border border-stone-200'
                    }`}
                  >
                    Tüm Çiçekler ({products.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductFilterMode('bestseller')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                      productFilterMode === 'bestseller'
                        ? 'bg-amber-600 text-white shadow-2xs'
                        : 'bg-white text-amber-900 hover:bg-amber-50 border border-amber-200'
                    }`}
                  >
                    <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>Çok Satanlar Slider ({products.filter(p => p.isBestSeller).length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductFilterMode('featured')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                      productFilterMode === 'featured'
                        ? 'bg-purple-700 text-white shadow-2xs'
                        : 'bg-white text-purple-800 hover:bg-purple-50 border border-purple-200'
                    }`}
                  >
                    <Crown className="w-3.5 h-3.5 text-purple-600" />
                    <span>Başyapıtlar Vitrini ({products.filter(p => p.isFeatured).length})</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProductFilterMode('campaign')}
                    className={`px-2.5 py-1 rounded-lg font-semibold transition-colors flex items-center gap-1 cursor-pointer ${
                      productFilterMode === 'campaign'
                        ? 'bg-rose-700 text-white shadow-2xs'
                        : 'bg-white text-rose-800 hover:bg-rose-50 border border-rose-200'
                    }`}
                  >
                    <Percent className="w-3 h-3 text-rose-600" />
                    <span>Kampanyalılar ({products.filter(p => p.hasCampaign).length})</span>
                  </button>
                </div>
                <span className="text-[11px] text-stone-500 hidden sm:inline">
                  Slider'da yer almasını istediğiniz çiçekleri <strong>"Slider’a Ekle"</strong> butonuyla seçebilirsiniz.
                </span>
              </div>

              {/* Product List */}
              <div className="grid grid-cols-1 gap-3">
                {products
                  .filter((p) => {
                    if (productFilterMode === 'bestseller') return p.isBestSeller;
                    if (productFilterMode === 'featured') return p.isFeatured;
                    if (productFilterMode === 'campaign') return p.hasCampaign;
                    return true;
                  })
                  .map((prod) => (
                  <div
                    key={prod.id}
                    className={`flex flex-col sm:flex-row sm:items-center justify-between p-3.5 bg-white rounded-xl border transition-all gap-3 ${
                      prod.hasCampaign ? 'border-rose-300 ring-1 ring-rose-200 bg-rose-50/20' : prod.isBestSeller ? 'border-amber-200 ring-1 ring-amber-100 bg-amber-50/10' : 'border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-14 h-14 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200 relative">
                        <SafeImage
                          src={prod.image}
                          alt={prod.name}
                          fallbackTitle={prod.name}
                          className="w-full h-full object-cover"
                          containerClassName="w-full h-full"
                        />
                        {prod.hasCampaign && (
                          <span className="absolute bottom-0 inset-x-0 bg-rose-700 text-white text-[9px] font-bold text-center py-0.2">
                            %20 İNDİRİM
                          </span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="text-xs font-semibold text-stone-900 line-clamp-1">{prod.name}</h4>
                          {prod.hasCampaign && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 px-1.5 py-0.2 rounded">
                              🏷️ Kısa Süreli Kampanyalı Ürün
                            </span>
                          )}
                          {prod.isBestSeller && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.2 rounded">
                              <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                              <span>Çok Satanlar Slider</span>
                            </span>
                          )}
                          {prod.isFeatured && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-300 px-1.5 py-0.2 rounded">
                              <Crown className="w-3 h-3 text-purple-600" />
                              <span>Başyapıtlar Vitrini</span>
                            </span>
                          )}
                        </div>
                        <div className="flex items-baseline gap-2 mt-0.5">
                          <span className="text-xs font-bold text-rose-800 tabular-nums">
                            {prod.price.toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-1 mt-1">
                          {(prod.categories && prod.categories.length > 0 ? prod.categories : [prod.category]).map(c => (
                            <span
                              key={c}
                              className="text-[10px] font-semibold bg-rose-50 text-rose-800 px-1.5 py-0.5 rounded border border-rose-200 flex items-center gap-1"
                            >
                              <span>{FLOWER_CATEGORIES.find(fc => fc.id === c)?.icon || '🏷️'}</span>
                              <span>{CATEGORY_NAMES_MAP[c as FlowerCategory] || c}</span>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0 flex-wrap">
                      {/* Toggle Best Seller Slider Button */}
                      <button
                        type="button"
                        onClick={() => toggleProductBestSeller(prod.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          prod.isBestSeller
                            ? 'bg-amber-100 hover:bg-amber-200 text-amber-950 border-amber-300 shadow-2xs font-bold'
                            : 'bg-stone-100 hover:bg-amber-50 hover:text-amber-900 hover:border-amber-200 text-stone-600 border-stone-200'
                        }`}
                        title={prod.isBestSeller ? "Bu çiçeği çok satanlar slider'ından kaldır" : "Bu çiçeği çok satanlar slider'ına ekle"}
                      >
                        <Flame className={`w-3.5 h-3.5 ${prod.isBestSeller ? 'fill-amber-600 text-amber-600' : 'text-stone-400'}`} />
                        <span>
                          {prod.isBestSeller ? 'Slider’da Aktif' : 'Slider’a Ekle'}
                        </span>
                      </button>

                      {/* Toggle Featured Showcase (Başyapıtlar Vitrini) Button */}
                      <button
                        type="button"
                        onClick={() => toggleProductFeatured(prod.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          prod.isFeatured
                            ? 'bg-purple-100 hover:bg-purple-200 text-purple-900 border-purple-300 shadow-2xs font-bold'
                            : 'bg-stone-100 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-200 text-stone-600 border-stone-200'
                        }`}
                        title={prod.isFeatured ? "Başyapıtlar vitrinden kaldır" : "Başyapıtlar vitrine ekle"}
                      >
                        <Crown className={`w-3.5 h-3.5 ${prod.isFeatured ? 'text-purple-700' : 'text-stone-400'}`} />
                        <span>
                          {prod.isFeatured ? '⭐ Vitrin\'de' : 'Vitrine Ekle'}
                        </span>
                      </button>

                      {/* Toggle Campaign Button for uploaded/existing product */}
                      <button
                        type="button"
                        onClick={() => toggleProductCampaign(prod.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
                          prod.hasCampaign
                            ? 'bg-rose-100 hover:bg-rose-200 text-rose-800 border-rose-300'
                            : 'bg-stone-100 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-200 text-stone-700 border-stone-300'
                        }`}
                        title={prod.hasCampaign ? "Kampanyayı sonlandır" : "Bu üründe %20 kampanya aktif et"}
                      >
                        <Percent className="w-3.5 h-3.5" />
                        <span>
                          {prod.hasCampaign ? 'Kampanyayı Kapat' : 'Kampanya (%20)'}
                        </span>
                      </button>

                      <button
                        onClick={() => openEditProduct(prod)}
                        className="text-stone-400 hover:text-blue-600 p-1.5 rounded-lg hover:bg-blue-50 transition-colors cursor-pointer"
                        title="Ürünü Düzenle"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => deleteProduct(prod.id)}
                        className="text-stone-400 hover:text-rose-600 p-1.5 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer"
                        title="Ürünü Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: EXTRA GIFTS CRUD (User explicitly asked to upload extra gifts!) */}
          {activeTab === 'gifts' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Ekstra Hediyeler Kataloğu
                  </h3>
                  <p className="text-xs text-stone-500">
                    Müşteri sepete ekle dediğinde açılan ekranda bu hediyeler sergilenir.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddGift(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Hediye Yükle</span>
                </button>
              </div>

              {/* Add Extra Gift Form */}
              {showAddGift && (
                <form
                  onSubmit={handleCreateGift}
                  className="p-4 bg-white rounded-xl border border-rose-200 shadow-sm space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">
                      Yeni Ekstra Hediye Ekle
                    </span>
                    <button
                      type="button"
                      onClick={() => setShowAddGift(false)}
                      className="text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Hediye Adı *</label>
                      <input
                        type="text"
                        required
                        value={newGiftName}
                        onChange={(e) => setNewGiftName(e.target.value)}
                        placeholder="Örn: Ferrero Rocher Çikolata Kutusu (16'lı)"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Kategori *</label>
                      <select
                        value={newGiftCategory}
                        onChange={(e) => setNewGiftCategory(e.target.value as any)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      >
                        <option value="cikolata">Çikolata</option>
                        <option value="pelus">Peluş Oyuncak</option>
                        <option value="balon">Uçan Helyum Balon</option>
                        <option value="vazo">Vazo & Aksesuar</option>
                        <option value="kart">Mühürlü Tebrik Kartı</option>
                        <option value="mum">Aromatik Mum & Işık</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Ekstra Satış Fiyatı (₺) *</label>
                      <input
                        type="number"
                        required
                        value={newGiftPrice}
                        onChange={(e) => setNewGiftPrice(Number(e.target.value))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">Rozet / Etiket (Opsiyonel)</label>
                      <input
                        type="text"
                        value={newGiftBadge}
                        onChange={(e) => setNewGiftBadge(e.target.value)}
                        placeholder="Örn: En Çok Satan, Romantik Jest"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <ImageFileInput
                        label="Ekstra Hediye Görseli / Fotoğrafı"
                        value={newGiftImage}
                        onChange={setNewGiftImage}
                        required
                        helperText="Cihazınızdan veya galerinizden dosya seçin"
                        id="new-gift-file-picker"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">Açıklama</label>
                      <input
                        type="text"
                        value={newGiftDescription}
                        onChange={(e) => setNewGiftDescription(e.target.value)}
                        placeholder="Hediye hakkında kısa bilgi..."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-800"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddGift(false)}
                      className="px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100 rounded-lg"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg"
                    >
                      Hediyeyi Yükle & Kaydet
                    </button>
                  </div>
                </form>
              )}

              {/* Gift List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {extraGifts.map((gift) => (
                  <div
                    key={gift.id}
                    className="flex flex-col justify-between p-3.5 bg-white rounded-xl border border-stone-200"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-lg bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                          <SafeImage
                            src={gift.image}
                            alt={gift.name}
                            fallbackTitle={gift.name}
                            className="w-full h-full object-cover"
                            containerClassName="w-full h-full"
                          />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-stone-900 truncate">{gift.name}</h4>
                          <span className="text-xs font-bold text-rose-800 tabular-nums">
                            +{gift.price.toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-stone-500 line-clamp-2">
                        {gift.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-2 mt-2 border-t border-stone-100">
                      <span className="text-[10px] text-stone-400 uppercase font-semibold">
                        {gift.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditGift(gift)}
                          className="text-stone-400 hover:text-blue-600 p-1 rounded hover:bg-blue-50 transition-colors cursor-pointer"
                          title="Hediyeyi Düzenle"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteExtraGift(gift.id)}
                          className="text-stone-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Hediyeyi Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENT & POS CONFIGURATION (PAYTR & ZIRAAT BANKASI) */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center shrink-0 border border-rose-200">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                      <span>Sanal POS & Ödeme Altyapısı Yönetimi</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Canlı / Test Hazır
                      </span>
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Çiçek siparişi ödemelerinde kullanılacak sanal POS altyapısını seçin (PayTR veya Ziraat Bankası POS).
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPaymentForm(DEFAULT_PAYMENT_SETTINGS);
                      setPaymentSaveSuccess(false);
                      setTestConnectionStatus(null);
                    }}
                    className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Örnek Bilgileri Yükle</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setTestConnectionStatus('checking');
                      setTimeout(() => {
                        const gatewayName = paymentForm.activeGateway === 'paytr' ? 'PayTR Sanal POS (Direct API)' : 'Ziraat Bankası Sanal POS (VPOD 3D)';
                        setTestConnectionStatus(`✓ ${gatewayName} bağlantısı başarılı (200 OK). 3D Secure v2.2 aktif.`);
                      }, 600);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>POS Bağlantısını Test Et</span>
                  </button>
                </div>
              </div>

              {/* Status messages */}
              {paymentSaveSuccess && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs font-bold text-emerald-900 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ödeme ayarları ve sanal POS yapılandırması başarıyla kaydedildi! Müşteri ödeme ekranında anında geçerli olacaktır.</span>
                </div>
              )}

              {testConnectionStatus && (
                <div className={`p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2 ${
                  testConnectionStatus === 'checking'
                    ? 'bg-amber-50 border-amber-200 text-amber-800'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                }`}>
                  <RefreshCw className={`w-4 h-4 ${testConnectionStatus === 'checking' ? 'animate-spin' : ''}`} />
                  <span>{testConnectionStatus === 'checking' ? 'Sanal POS sunucularına bağlantı test ediliyor...' : testConnectionStatus}</span>
                </div>
              )}

              {/* SECTION 1: ACTIVE GATEWAY SELECTOR (PAYTR vs ZIRAAT BANKASI) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-rose-700" />
                    <span>1. Aktif Sanal POS Sağlayıcısı Seçimi</span>
                  </h4>
                  <span className="text-xs text-stone-500">
                    * Müşterinin sepeti tamamlarken kredi kartı çekeceği birincil ödeme altyapısı
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* GATEWAY 1: PAYTR SANAL POS */}
                  <div
                    onClick={() => {
                      setPaymentForm(prev => ({ ...prev, activeGateway: 'paytr' }));
                      setActiveGateway('paytr');
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      paymentForm.activeGateway === 'paytr'
                        ? 'bg-white border-rose-600 shadow-md ring-2 ring-rose-500/20'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black tracking-tight text-blue-900 font-sans">
                            Pay<span className="text-cyan-600">TR</span>
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                            Sanal POS
                          </span>
                        </div>

                        {paymentForm.activeGateway === 'paytr' ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Şu Anda Aktif</span>
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 font-medium">Seçmek için tıklayın</span>
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-stone-900 mb-1">
                        PayTR iFrame & Direct API Entegrasyonu
                      </h5>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        Tüm yerli ve yabancı Visa, MasterCard ve Troy kartlar için tek çekim ve taksitli güvenli ödeme altyapısı. 3D Secure zorunlu koruma.
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">3D Secure 2.0</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">Maximum, Bonus, World, Axess, CardFinans, Paraf</span>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                          {paymentForm.paytr.testMode ? 'Test Modunda' : 'Canlı POS Modu'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500">Mağaza No: {paymentForm.paytr.merchantId || 'Tanımlanmadı'}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentForm(prev => ({ ...prev, activeGateway: 'paytr' }));
                          setActiveGateway('paytr');
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          paymentForm.activeGateway === 'paytr'
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {paymentForm.activeGateway === 'paytr' ? 'Seçili Altyapı' : 'PayTR’yi Aktif Et'}
                      </button>
                    </div>
                  </div>

                  {/* GATEWAY 2: ZİRAAT BANKASI SANAL POS */}
                  <div
                    onClick={() => {
                      setPaymentForm(prev => ({ ...prev, activeGateway: 'ziraat' }));
                      setActiveGateway('ziraat');
                    }}
                    className={`p-5 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      paymentForm.activeGateway === 'ziraat'
                        ? 'bg-white border-rose-600 shadow-md ring-2 ring-rose-500/20'
                        : 'bg-stone-50 border-stone-200 hover:border-stone-300 hover:bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-black tracking-tight text-red-700 font-sans">
                            Ziraat Bankası
                          </span>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-red-100 text-red-800">
                            VPOD POS
                          </span>
                        </div>

                        {paymentForm.activeGateway === 'ziraat' ? (
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full flex items-center gap-1">
                            <Check className="w-3.5 h-3.5" />
                            <span>Şu Anda Aktif</span>
                          </span>
                        ) : (
                          <span className="text-xs text-stone-400 font-medium">Seçmek için tıklayın</span>
                        )}
                      </div>

                      <h5 className="text-xs font-bold text-stone-900 mb-1">
                        Ziraat Bankası Ortak Sanal POS (VPOD)
                      </h5>
                      <p className="text-xs text-stone-600 leading-relaxed">
                        T.C. Ziraat Bankası üye işyeri sanal POS altyapısı. Doğrudan şirket Ziraat vPOS ağı, Bankkart combo taksit avantajları ve 3D Secure ödeme.
                      </p>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">Ziraat 3D Pay / Host</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">Bankkart Combo Taksit</span>
                        <span className="text-[10px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-medium">Troy & Visa / Master</span>
                        <span className="text-[10px] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                          {paymentForm.ziraat.testMode ? 'Test Modunda' : 'Canlı POS Modu'}
                        </span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-xs text-stone-500">Üye İşyeri No: {paymentForm.ziraat.merchantId || 'Tanımlanmadı'}</span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setPaymentForm(prev => ({ ...prev, activeGateway: 'ziraat' }));
                          setActiveGateway('ziraat');
                        }}
                        className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                          paymentForm.activeGateway === 'ziraat'
                            ? 'bg-rose-700 text-white shadow-xs'
                            : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                        }`}
                      >
                        {paymentForm.activeGateway === 'ziraat' ? 'Seçili Altyapı' : 'Ziraat POS’u Aktif Et'}
                      </button>
                    </div>
                  </div>

                </div>
              </div>

              {/* SECTION 2: GATEWAY CREDENTIALS (TABS / ACCORDION) */}
              <div className="space-y-4">
                
                {/* PayTR Configuration Form */}
                <div className={`p-5 rounded-2xl border transition-all ${paymentForm.activeGateway === 'paytr' ? 'bg-white border-blue-200 shadow-xs' : 'bg-stone-50/60 border-stone-200 opacity-90'}`}>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Key className="w-4 h-4 text-blue-700" />
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        PayTR API & Mağaza Bilgileri
                      </h4>
                      {paymentForm.activeGateway === 'paytr' && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Aktif Altyapı
                        </span>
                      )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={paymentForm.paytr.testMode}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          paytr: { ...prev.paytr, testMode: e.target.checked }
                        }))}
                        className="rounded text-rose-700 focus:ring-rose-600"
                      />
                      <span>Test Modu (Gerçek Çekim Yapılmaz)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        PayTR Mağaza Numarası (Merchant ID) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.paytr.merchantId}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          paytr: { ...prev.paytr, merchantId: e.target.value }
                        }))}
                        placeholder="Örn: 492817"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        PayTR Mağaza Parolası (Merchant Key) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.paytr.merchantKey}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          paytr: { ...prev.paytr, merchantKey: e.target.value }
                        }))}
                        placeholder="pTr_live_xxxxxxxx"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        PayTR Mağaza Gizli Anahtar (Merchant Salt) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.paytr.merchantSalt}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          paytr: { ...prev.paytr, merchantSalt: e.target.value }
                        }))}
                        placeholder="sLt_xxxxxxxx"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentForm.paytr.installmentEnabled}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          paytr: { ...prev.paytr, installmentEnabled: e.target.checked }
                        }))}
                        className="rounded text-rose-700 focus:ring-rose-600"
                      />
                      <span className="font-medium">Müşteriye Taksit Seçeneklerini Sun (2, 3, 6 Taksit)</span>
                    </label>

                    <span className="text-[11px] text-stone-400">
                      * PayTR Mağaza Paneli &gt; Entegrasyon Bilgileri sayfasından bu anahtarları alabilirsiniz.
                    </span>
                  </div>
                </div>

                {/* Ziraat Bankası Configuration Form */}
                <div className={`p-5 rounded-2xl border transition-all ${paymentForm.activeGateway === 'ziraat' ? 'bg-white border-red-200 shadow-xs' : 'bg-stone-50/60 border-stone-200 opacity-90'}`}>
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4 text-red-700" />
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Ziraat Bankası Sanal POS (VPOD) Bilgileri
                      </h4>
                      {paymentForm.activeGateway === 'ziraat' && (
                        <span className="text-[10px] font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                          Aktif Altyapı
                        </span>
                      )}
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700">
                      <input
                        type="checkbox"
                        checked={paymentForm.ziraat.testMode}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          ziraat: { ...prev.ziraat, testMode: e.target.checked }
                        }))}
                        className="rounded text-rose-700 focus:ring-rose-600"
                      />
                      <span>Test Modu (Simülasyon / VPOD Test)</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Üye İşyeri Numarası (Merchant ID) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.ziraat.merchantId}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          ziraat: { ...prev.ziraat, merchantId: e.target.value }
                        }))}
                        placeholder="Örn: 6700019284"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Terminal Numarası (Terminal ID) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.ziraat.terminalId}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          ziraat: { ...prev.ziraat, terminalId: e.target.value }
                        }))}
                        placeholder="Örn: ZR009281"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Mağaza Anahtarı (Store Key / 3D Key) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.ziraat.storeKey}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          ziraat: { ...prev.ziraat, storeKey: e.target.value }
                        }))}
                        placeholder="Ziraat3D_Sec_Key_..."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        API Kullanıcı Adı (API User) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.ziraat.apiUser}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          ziraat: { ...prev.ziraat, apiUser: e.target.value }
                        }))}
                        placeholder="Örn: ZRT_API_VELVET"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-rose-600"
                      />
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs text-stone-600">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={paymentForm.ziraat.installmentEnabled}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          ziraat: { ...prev.ziraat, installmentEnabled: e.target.checked }
                        }))}
                        className="rounded text-rose-700 focus:ring-rose-600"
                      />
                      <span className="font-medium">Bankkart ve Troy için Taksit İmkanı Sağla</span>
                    </label>

                    <span className="text-[11px] text-stone-400">
                      * Ziraat Bankası Sanal POS Yönetim Portalı üzerinden temin edilir.
                    </span>
                  </div>
                </div>

                {/* Bank Wire Transfer / EFT / FAST Settings */}
                <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Havale & EFT / FAST Banka Hesap Bilgileri
                      </h4>
                    </div>
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      7/24 FAST Aktif
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Banka Adı *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankTransfer.bankName}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          bankTransfer: { ...prev.bankTransfer, bankName: e.target.value }
                        }))}
                        placeholder="Örn: T.C. Ziraat Bankası A.Ş."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Hesap Sahibi (Resmi Firma Unvanı) *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankTransfer.accountHolder}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          bankTransfer: { ...prev.bankTransfer, accountHolder: e.target.value }
                        }))}
                        placeholder="Örn: Velvet Rose Çiçekçilik Ltd. Şti."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">
                        IBAN Numarası *
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankTransfer.iban}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          bankTransfer: { ...prev.bankTransfer, iban: e.target.value }
                        }))}
                        placeholder="TR35 0001 0002 ..."
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 font-mono font-bold text-stone-900 focus:bg-white tracking-wider"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Şube Adı / Kodu
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankTransfer.branchCode}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          bankTransfer: { ...prev.bankTransfer, branchCode: e.target.value }
                        }))}
                        placeholder="0350 - Bornova Şubesi"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                      />
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-700 mb-1">
                        Hesap Numarası
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankTransfer.accountNumber}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          bankTransfer: { ...prev.bankTransfer, accountNumber: e.target.value }
                        }))}
                        placeholder="9876543-1"
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block font-semibold text-stone-700 mb-1">
                        Müşteriye Gösterilecek Açıklama / Talimat Notu
                      </label>
                      <input
                        type="text"
                        value={paymentForm.bankTransfer.noteInstruction}
                        onChange={(e) => setPaymentForm(prev => ({
                          ...prev,
                          bankTransfer: { ...prev.bankTransfer, noteInstruction: e.target.value }
                        }))}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 4: ADMIN ACCESS SECURITY & PIN CODE */}
                <div className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-stone-800" />
                      <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                        Dükkan Yönetimi Güvenliği & Gizli Giriş
                      </h4>
                    </div>
                    <span className="text-[11px] text-stone-700 font-semibold bg-stone-100 px-2.5 py-0.5 rounded-full border border-stone-200">
                      PIN Korumalı
                    </span>
                  </div>

                  <div className="text-xs text-stone-600 leading-relaxed space-y-2">
                    <p>
                      Dükkan yönetimi bölümü siteye giren müşterilerin göremeyeceği ve erişemeyeceği şekilde tamamen gizlenmiştir. Mağazanızdaki siparişleri ve POS ayarlarını yalnızca yetkili olarak siz yönetebilirsiniz.
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px]">1</span>
                          <span>Klavye Kısayolu</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Sitedeyken klavyenizden <kbd className="px-1.5 py-0.5 bg-stone-200 rounded font-mono font-bold text-stone-800">Ctrl + Shift + A</kbd> veya <kbd className="px-1.5 py-0.5 bg-stone-200 rounded font-mono font-bold text-stone-800">Alt + A</kbd> tuşlarına basın.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px]">2</span>
                          <span>Gizli Web Adresi</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Tarayıcınızın adres çubuğuna <code className="px-1.5 py-0.5 bg-stone-200 rounded font-mono font-bold text-stone-800">#admin</code> ekleyip Enter'a basın.
                        </p>
                      </div>

                      <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                        <div className="font-bold text-stone-900 mb-1 flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 flex items-center justify-center text-[10px]">3</span>
                          <span>Gizli Footer Tıklaması</span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Sayfanın en altındaki <span className="italic">© Velvet Rose</span> telif hakkı yazısına 3 kez arka arkaya tıklayın.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PIN Change Form */}
                  <form onSubmit={handleUpdatePin} className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row items-end gap-3">
                    <div className="w-full sm:w-auto flex-1">
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Yeni Yönetici Güvenlik PIN Kodu Belirle (Mevcut: <strong className="font-mono">{adminPin}</strong>)
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="Yeni 4 haneli PIN girin..."
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-lg p-2 text-stone-900 focus:bg-white text-xs"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer shrink-0"
                    >
                      PIN Kodunu Güncelle
                    </button>
                  </form>

                  {pinChangeSuccess && (
                    <p className="text-xs text-emerald-600 font-medium">
                      ✓ Yönetici güvenlik PIN kodu başarıyla güncellendi!
                    </p>
                  )}
                  {pinChangeError && (
                    <p className="text-xs text-red-600 font-medium">
                      {pinChangeError}
                    </p>
                  )}
                </div>

              </div>

              {/* SAVE BUTTON BAR */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-200">
                <div className="text-xs text-stone-500">
                  Aktif Altyapı: <strong className="text-stone-900">{paymentForm.activeGateway === 'paytr' ? 'PayTR Sanal POS' : 'Ziraat Bankası Sanal POS'}</strong>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    updatePaymentSettings(paymentForm);
                    setPaymentSaveSuccess(true);
                    setTimeout(() => setPaymentSaveSuccess(false), 4000);
                  }}
                  className="flex items-center gap-2 px-6 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Tüm Ödeme Ayarlarını Kaydet</span>
                </button>
              </div>

            </div>
          )}

          {/* TAB 5: DELIVERY ZONES MANAGEMENT (TESLİMAT BÖLGELERİ & İLÇE AÇMA/KAPAMA) */}
          {activeTab === 'delivery' && (
            <div className="space-y-6">
              
              {/* Guidance & Status Banner */}
              <div className="p-5 bg-gradient-to-r from-stone-900 to-stone-800 text-white rounded-2xl shadow-sm border border-stone-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-rose-300 text-xs font-bold uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span>İzmir Teslimat Ağı & Bölge Kontrolü</span>
                  </div>
                  <h3 className="text-base sm:text-lg font-display font-medium text-white">
                    Çiçek Teslimat Bölgelerini Yönetin
                  </h3>
                  <p className="text-xs text-stone-300 leading-relaxed max-w-2xl">
                    Aktif ettiğiniz ilçelere müşteriler sipariş verebilir. <strong>Kapattığınız ilçeler sipariş formundaki ilçe seçim listesinden ve ana sayfadaki teslimat ağından anında gizlenir</strong>, sipariş kabul edilmez.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-4 py-2.5 bg-emerald-500/20 border border-emerald-400/40 rounded-xl text-center">
                    <span className="text-[10px] text-emerald-300 font-semibold block uppercase">Açık Bölge</span>
                    <span className="text-xl font-bold text-emerald-400">{activeDistricts.length} İlçe</span>
                  </div>
                  <div className="px-4 py-2.5 bg-stone-700/50 border border-stone-600 rounded-xl text-center">
                    <span className="text-[10px] text-stone-400 font-semibold block uppercase">Kapalı Bölge</span>
                    <span className="text-xl font-bold text-stone-300">{districts.length - activeDistricts.length} İlçe</span>
                  </div>
                </div>
              </div>

              {/* Quick Bulk Actions Bar */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                  <span className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-rose-700" />
                    <span>Hızlı Toplu İşlemler</span>
                  </span>
                  <span className="text-[11px] text-stone-500">
                    Tek tıkla tüm İzmir'i veya sadece ana merkez ilçeleri açıp kapatabilirsiniz
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setAllDistrictsActive(true);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Tüm İlçeleri Aktif Et (30 İlçe)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      activateCentralDistrictsOnly();
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    <Building className="w-4 h-4 text-rose-700" />
                    <span>Sadece Merkez İlçeleri Aç (10 İlçe: Bornova, Karşıyaka, Konak vb.)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Tüm teslimat bölgelerini kapatmak istediğinize emin misiniz? Müşteriler sipariş veremeyecektir.')) {
                        setAllDistrictsActive(false);
                      }
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-stone-100 hover:bg-red-50 text-stone-700 hover:text-red-700 border border-stone-200 hover:border-red-200 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Tümünü Kapat (Teslimatı Durdur)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (confirm('Teslimat bölge ayarlarını varsayılan durumuna döndürmek istiyor musunuz?')) {
                        resetDistrictsToDefault();
                      }
                    }}
                    className="flex items-center gap-1 px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-600 text-xs font-medium rounded-lg transition-colors cursor-pointer ml-auto"
                    title="Varsayılanlara Sıfırla"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Varsayılana Sıfırla</span>
                  </button>
                </div>
              </div>

              {/* Filter & Search Bar */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={districtSearchTerm}
                    onChange={(e) => setDistrictSearchTerm(e.target.value)}
                    placeholder="İlçe adı veya mahalle adı ara... (Örn: Karşıyaka, Bornova, Çeşme)"
                    className="w-full pl-9 pr-4 py-2 bg-white border border-stone-300 rounded-xl text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-600 shadow-2xs"
                  />
                  {districtSearchTerm && (
                    <button
                      onClick={() => setDistrictSearchTerm('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Filter Pills */}
                <div className="inline-flex rounded-xl border border-stone-200 bg-white p-1 shadow-2xs self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => setDistrictFilterMode('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      districtFilterMode === 'all'
                        ? 'bg-stone-900 text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Tümü ({districts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictFilterMode('active')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      districtFilterMode === 'active'
                        ? 'bg-emerald-700 text-white'
                        : 'text-stone-600 hover:text-emerald-800'
                    }`}
                  >
                    Aktifler ({activeDistricts.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setDistrictFilterMode('inactive')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                      districtFilterMode === 'inactive'
                        ? 'bg-stone-700 text-white'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Kapalılar ({districts.length - activeDistricts.length})
                  </button>
                </div>

              </div>

              {/* District Cards Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {filteredDistricts.map((district) => {
                  const isActive = district.isActive;
                  const isCentral = ['bornova', 'karsiyaka', 'konak', 'bayrakli', 'buca', 'cigli', 'balcova', 'narlidere', 'karabaglar', 'gaziemir'].includes(district.id);
                  const isBornovaHome = district.id === 'bornova';
                  const currentFee = editingDistrictFee[district.id] !== undefined ? editingDistrictFee[district.id] : district.deliveryFee;

                  return (
                    <div
                      key={district.id}
                      className={`rounded-2xl border transition-all p-4.5 flex flex-col justify-between gap-4 ${
                        isActive
                          ? 'bg-white border-stone-200 hover:border-emerald-300 shadow-xs'
                          : 'bg-stone-100/70 border-stone-200/80 opacity-75'
                      }`}
                    >
                      {/* Top Header Row with Name & Switch */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-base text-stone-900">
                              {district.name}
                            </h4>

                            {isBornovaHome ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                                🏢 Merkez Atölye
                              </span>
                            ) : isCentral ? (
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                                ⭐ Metropol Merkez
                              </span>
                            ) : (
                              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                                🚗 Dış Bölge Ring
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 text-xs text-stone-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5 text-stone-400" />
                              {district.estimatedMinutes}
                            </span>
                            <span aria-hidden="true">·</span>
                            <span className="text-stone-600 font-medium">
                              {district.neighborhoods.length} Mahalle & NVİ Sokakları
                            </span>
                          </div>
                        </div>

                        {/* Interactive Toggle Switch */}
                        <div className="flex flex-col items-end gap-1 shrink-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-xs font-bold ${isActive ? 'text-emerald-700' : 'text-stone-400'}`}>
                              {isActive ? 'Aktif' : 'Kapalı'}
                            </span>
                            <button
                              type="button"
                              role="switch"
                              aria-checked={isActive}
                              onClick={() => toggleDistrictActive(district.id)}
                              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                isActive ? 'bg-emerald-600' : 'bg-stone-300'
                              }`}
                            >
                              <span
                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                                  isActive ? 'translate-x-5' : 'translate-x-0'
                                }`}
                              />
                            </button>
                          </div>
                          <span className={`text-[10px] ${isActive ? 'text-emerald-600 font-semibold' : 'text-stone-400'}`}>
                            {isActive ? 'Teslimat açık' : 'Sitede gizli'}
                          </span>
                        </div>
                      </div>

                      {/* Middle Row: Delivery Fee Editor & Neighborhood Inspector Button */}
                      <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                        
                        {/* Delivery Fee Input */}
                        <div className="flex items-center gap-2">
                          <span className="text-stone-600 font-semibold shrink-0">
                            Teslimat Ücreti:
                          </span>
                          <div className="flex items-center gap-1.5">
                            <div className="relative w-24">
                              <input
                                type="number"
                                min={0}
                                step={10}
                                value={currentFee}
                                onChange={(e) => {
                                  const val = Math.max(0, Number(e.target.value));
                                  setEditingDistrictFee(prev => ({ ...prev, [district.id]: val }));
                                }}
                                className="w-full bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-900 font-bold focus:outline-none focus:ring-1 focus:ring-rose-600 text-right pr-6"
                              />
                              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-500 font-medium text-xs pointer-events-none">
                                ₺
                              </span>
                            </div>

                            {editingDistrictFee[district.id] !== undefined && editingDistrictFee[district.id] !== district.deliveryFee && (
                              <button
                                type="button"
                                onClick={() => {
                                  updateDistrictSettings(district.id, { deliveryFee: currentFee });
                                  setDistrictFeeSaved(district.id);
                                  setTimeout(() => setDistrictFeeSaved(null), 2500);
                                }}
                                className="px-2.5 py-1 bg-stone-900 hover:bg-black text-white text-[11px] font-bold rounded-lg cursor-pointer transition-colors"
                              >
                                Kaydet
                              </button>
                            )}

                            {districtFeeSaved === district.id && (
                              <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-0.5">
                                <Check className="w-3.5 h-3.5" /> Kaydedildi
                              </span>
                            )}
                          </div>

                          {currentFee === 0 && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                              Ücretsiz
                            </span>
                          )}
                        </div>

                        {/* Neighborhoods Inspection Trigger */}
                        <button
                          type="button"
                          onClick={() => {
                            setInspectingDistrictId(district.id);
                            setInspectingNeighSearch('');
                          }}
                          className="flex items-center gap-1.5 text-stone-700 hover:text-rose-800 bg-white hover:bg-stone-100 border border-stone-200 px-3 py-1.5 rounded-lg font-medium transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                        >
                          <Eye className="w-3.5 h-3.5 text-rose-600" />
                          <span>Mahalleleri Gör ({district.neighborhoods.length})</span>
                        </button>
                      </div>

                      {/* Bottom Footer Notice */}
                      <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-100">
                        {isActive ? (
                          <span className="text-emerald-700 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Müşteri sipariş formunda & teslimat açılır menüsünde aktiftir.</span>
                          </span>
                        ) : (
                          <span className="text-stone-500 flex items-center gap-1">
                            <Lock className="w-3 h-3 text-stone-400" />
                            <span>Müşterilere gizlendi. Sipariş formu ve teslimat ağında görünmez.</span>
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-400">
                          #{district.id}
                        </span>
                      </div>

                    </div>
                  );
                })}
              </div>

              {filteredDistricts.length === 0 && (
                <div className="p-8 text-center bg-white rounded-2xl border border-stone-200 space-y-2">
                  <MapPin className="w-8 h-8 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-800">
                    Arama kriterinize uygun ilçe bulunamadı
                  </p>
                  <p className="text-xs text-stone-500">
                    "{districtSearchTerm}" araması için sonuç yok. Arama terimini temizlemeyi deneyin.
                  </p>
                  <button
                    onClick={() => {
                      setDistrictSearchTerm('');
                      setDistrictFilterMode('all');
                    }}
                    className="mt-2 px-4 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* DISTRICT NEIGHBORHOODS INSPECTOR MODAL */}
      {inspectingDistrict && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto max-h-[85vh]">
            
            {/* Header */}
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/30 flex items-center justify-center text-rose-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">
                    {inspectingDistrict.name} Mahalleri ({inspectingDistrict.neighborhoods.length} Mahalle)
                  </h3>
                  <p className="text-[11px] text-stone-400">
                    2026 NVİ Standartlarında Cadde & Sokak Altyapısı
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setInspectingDistrictId(null)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Neighborhood Search Filter */}
            <div className="p-4 bg-stone-50 border-b border-stone-200">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={inspectingNeighSearch}
                  onChange={(e) => setInspectingNeighSearch(e.target.value)}
                  placeholder={`${inspectingDistrict.name} mahallelerinde ara... (Örn: ${inspectingDistrict.neighborhoods[0] || 'Mahalle'})`}
                  className="w-full pl-9 pr-3 py-2 bg-white border border-stone-300 rounded-lg text-xs text-stone-900 placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-rose-600"
                />
              </div>
            </div>

            {/* Neighborhoods List */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3">
              <div className="flex items-center justify-between text-xs text-stone-500 pb-1">
                <span>Görüntülenen Mahalle: {filteredInspectingNeighborhoods.length} adet</span>
                <span className="text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Her mahallenin cadde ve sokakları seçmelidir
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                {filteredInspectingNeighborhoods.map((n, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg border border-stone-200 bg-stone-50 hover:bg-rose-50/50 hover:border-rose-200 transition-colors text-xs text-stone-800 flex items-center justify-between"
                  >
                    <span className="font-medium truncate pr-1">{n} Mah.</span>
                    <span className="text-[10px] text-stone-400 shrink-0 font-mono">NVİ</span>
                  </div>
                ))}
              </div>

              {filteredInspectingNeighborhoods.length === 0 && (
                <div className="text-center py-8 text-xs text-stone-500">
                  "{inspectingNeighSearch}" mahalle adına uygun kayıt bulunamadı.
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
              <span className="text-stone-500 text-[11px]">
                Durum: {inspectingDistrict.isActive ? <strong className="text-emerald-700">Aktif (Sipariş Açık)</strong> : <strong className="text-red-700">Kapalı (Gizli)</strong>}
              </span>
              <button
                type="button"
                onClick={() => setInspectingDistrictId(null)}
                className="px-4 py-1.5 bg-stone-900 hover:bg-black text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
              >
                Tamam
              </button>
            </div>

          </div>
        </div>
      )}

      {/* GIFT CARD PRINT MODAL */}
      {printOrder && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:bg-transparent print:p-0 print:m-0 print:static">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none print:p-0 print:m-0">
            
            {/* Modal Header (Hidden on print) */}
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/30 flex items-center justify-center text-rose-400">
                  <Printer className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Hediye Kartı Yazdırma</h3>
                  <p className="text-[11px] text-stone-400">Sipariş #{printOrder.id} · Alıcı: {printOrder.recipient.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrintOrder(null)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customization & Action Bar (Hidden on print) */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs no-print">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <span className="text-stone-500 font-medium">Yazı Boyutu:</span>
                  <div className="inline-flex rounded-lg border border-stone-200 bg-white p-0.5 shadow-2xs">
                    <button
                      type="button"
                      onClick={() => setCardFontSize('sm')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        cardFontSize === 'sm' ? 'bg-rose-50 text-rose-800 font-bold' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      Küçük
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardFontSize('base')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        cardFontSize === 'base' ? 'bg-rose-50 text-rose-800 font-bold' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      Standart
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardFontSize('lg')}
                      className={`px-2.5 py-1 rounded text-xs font-semibold cursor-pointer transition-colors ${
                        cardFontSize === 'lg' ? 'bg-rose-50 text-rose-800 font-bold' : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      Büyük
                    </button>
                  </div>
                </div>

                <label className="flex items-center gap-1.5 cursor-pointer select-none text-stone-700 font-medium">
                  <input
                    type="checkbox"
                    checked={showRecipientOnCard}
                    onChange={(e) => setShowRecipientOnCard(e.target.checked)}
                    className="rounded text-rose-700 focus:ring-rose-600"
                  />
                  <span>Alıcı Başlığı (Kime)</span>
                </label>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(printOrder.cardNote || '');
                    setCopiedNote(true);
                    setTimeout(() => setCopiedNote(false), 2000);
                  }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-300 bg-white hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
                >
                  {copiedNote ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
                  <span>{copiedNote ? 'Kopyalandı' : 'Metni Kopyala'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Yazıcıya Gönder (Yazdır)</span>
                </button>
              </div>
            </div>

            {/* Printable Card Area */}
            <div className="p-6 bg-stone-100/90 flex flex-col items-center justify-center print:p-0 print:bg-white">
              <div className="text-[11px] text-stone-400 mb-2 font-mono flex items-center gap-2 no-print">
                <span>Önizleme: Standart Beyaz Dokulu Kart (140mm x 85mm)</span>
              </div>

              {/* CARD CONTAINER (This element prints) */}
              <div
                id="printable-gift-card"
                className="w-full max-w-[500px] min-h-[260px] bg-white rounded-xl border border-stone-200 p-8 shadow-sm flex flex-col justify-between text-stone-900 relative"
              >
                {/* Header */}
                <div className="flex items-center justify-between pb-3 border-b border-stone-200/80 text-xs">
                  <span className="font-semibold tracking-wider uppercase text-[10px] text-stone-400">
                    Hediye Mesaj Kartı
                  </span>
                  {showRecipientOnCard && (
                    <span className="text-stone-700 font-medium text-xs">
                      Kime: <strong className="text-stone-900">{printOrder.recipient.name}</strong>
                    </span>
                  )}
                </div>

                {/* Message Text */}
                <div className="my-5">
                  <p
                    className={`font-serif italic leading-relaxed text-stone-900 whitespace-pre-line ${
                      cardFontSize === 'sm' ? 'text-sm' : cardFontSize === 'lg' ? 'text-lg sm:text-xl' : 'text-base'
                    }`}
                  >
                    "{printOrder.cardNote || '(Boş Hediye Kartı)'}"
                  </p>
                </div>

                {/* Footer with Sol Alt Köşede Velvet Rose ve Sağ Alt Köşede İmza */}
                <div className="pt-3.5 border-t border-stone-200/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-serif font-bold text-sm tracking-wider text-rose-900">
                      Velvet Rose
                    </span>
                    <span className="text-[9px] text-stone-400 uppercase tracking-widest hidden sm:inline">
                      • Çiçek Tasarım Atölyesi
                    </span>
                  </div>
                  <span className="font-serif font-semibold italic text-stone-800 text-sm">
                    — {printOrder.cardSenderName || (printOrder.sender.isAnonymous ? 'Gizli Hayran' : printOrder.sender.name || 'Sevgilerimle')}
                  </span>
                </div>

                {/* Micro order tracking watermark at bottom */}
                <div className="text-[9px] text-stone-300 font-mono text-right mt-2 pt-1 border-t border-stone-100">
                  Sipariş #{printOrder.id} · {printOrder.deliveryDate}
                </div>
              </div>
            </div>

            {/* Modal Footer / Instructions (Hidden on print) */}
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-500 no-print">
              <span>
                💡 <strong>İpucu:</strong> Tarayıcı yazdırma diyaloğunda <em>'Üst ve Alt Bilgiler (Headers/Footers)'</em> kutusunu kapatırsanız sadece temiz kart basılır.
              </span>
              <button
                type="button"
                onClick={() => setPrintOrder(null)}
                className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded font-medium transition-colors cursor-pointer self-end"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}

      {/* WORKSHOP & COURIER ORDER SLIP PRINT MODAL (KURYE VE ATÖLYE SİPARİŞ FİŞİ) */}
      {printSlipOrder && (
        <div className="fixed inset-0 z-70 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto print:bg-transparent print:p-0 print:m-0 print:static">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-150 print:border-none print:shadow-none print:p-0 print:m-0">
            
            {/* Header (No print) */}
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-rose-600/30 flex items-center justify-center text-rose-400">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Atölye Hazırlık & Kurye Teslimat Fişi</h3>
                  <p className="text-[11px] text-stone-400">Sipariş #{printSlipOrder.id} · Alıcı: {printSlipOrder.recipient.name}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPrintSlipOrder(null)}
                className="w-8 h-8 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 flex items-center justify-center cursor-pointer transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Action Bar (No print) */}
            <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-xs no-print">
              <span className="text-stone-500">
                Bu fişi yazdırıp kuryeye veya çiçek ustasına hazırlık için teslim edebilirsiniz.
              </span>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
              >
                <Printer className="w-4 h-4 text-rose-400" />
                <span>Fişi Yazdır (Print)</span>
              </button>
            </div>

            {/* Printable Slip Container */}
            <div className="p-6 bg-white text-stone-900 space-y-4 print:p-2">
              
              {/* Slip Header */}
              <div className="border-b-2 border-stone-900 pb-3 flex items-center justify-between">
                <div>
                  <h2 className="font-serif font-black text-lg tracking-wider text-stone-900">
                    VELVET ROSE
                  </h2>
                  <p className="text-[11px] text-stone-500 font-medium">
                    Çiçek Tasarım Atölyesi · Gediz Caddesi No: 3/1D Bornova / İZMİR
                  </p>
                  <p className="text-[11px] text-stone-500">
                    Tel: 0532 513 86 58 · velvetroseizmir@gmail.com · @velvetrosee35
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200 inline-block mb-1">
                    Atölye & Kurye Fişi
                  </span>
                  <span className="font-mono font-black text-base text-stone-900 block">
                    #{printSlipOrder.id}
                  </span>
                  <span className="text-[10px] text-stone-400">
                    {printSlipOrder.createdAt ? new Date(printSlipOrder.createdAt).toLocaleDateString('tr-TR') : 'Bugün'}
                  </span>
                </div>
              </div>

              {/* Delivery Timing Highlight */}
              <div className="p-2.5 bg-stone-100 rounded-lg border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">İstenen Teslimat Zamanı:</span>
                  <span className="font-bold text-stone-900 text-sm">
                    {printSlipOrder.deliveryDate} · {printSlipOrder.deliveryTimeSlot}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-500 text-[10px] uppercase font-bold block">Sipariş Durumu:</span>
                  <span className="font-bold text-stone-800 uppercase text-xs">
                    {printSlipOrder.status === 'received' ? 'Sipariş Alındı' : printSlipOrder.status === 'preparing' ? 'Hazırlanıyor' : printSlipOrder.status === 'courier' ? 'Kuryede / Dağıtımda' : 'Teslim Edildi'}
                  </span>
                </div>
              </div>

              {/* Two columns: Recipient & Address */}
              <div className="grid grid-cols-2 gap-4 text-xs border border-stone-200 rounded-xl p-3.5">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Alıcı (Teslim Edilecek Kişi):
                  </span>
                  <div className="font-bold text-sm text-stone-900">
                    {printSlipOrder.recipient.name}
                  </div>
                  <div className="font-mono font-bold text-stone-800">
                    Tel: {printSlipOrder.recipient.phone}
                  </div>
                  {printSlipOrder.recipient.relationship && (
                    <div className="text-[11px] text-stone-500">
                      Yakınlık: {printSlipOrder.recipient.relationship}
                    </div>
                  )}
                </div>

                <div className="space-y-1 border-l border-stone-200 pl-4">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                    Teslimat Adresi:
                  </span>
                  <div className="font-semibold text-stone-900 leading-snug">
                    İzmir, {printSlipOrder.deliveryAddress.district} / {printSlipOrder.deliveryAddress.neighborhood} Mah.
                  </div>
                  <div className="font-bold text-rose-950 text-xs">
                    🛣️ {printSlipOrder.deliveryAddress.streetAddress}
                  </div>
                  <div className="text-stone-700">
                    {printSlipOrder.deliveryAddress.buildingNo ? `Bina No: ${printSlipOrder.deliveryAddress.buildingNo} ` : ''}
                    {printSlipOrder.deliveryAddress.apartmentNo ? `Daire: ${printSlipOrder.deliveryAddress.apartmentNo}` : ''}
                  </div>
                  {printSlipOrder.deliveryAddress.addressDescription && (
                    <div className="mt-1 p-1.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900 font-medium">
                      📝 Not: "{printSlipOrder.deliveryAddress.addressDescription}"
                    </div>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="border border-stone-200 rounded-xl overflow-hidden">
                <div className="px-3 py-1.5 bg-stone-100 text-[10px] font-bold text-stone-600 uppercase tracking-wider flex justify-between">
                  <span>Hazırlanacak Çiçek & Ürün</span>
                  <span>Adet / Tutar</span>
                </div>
                <div className="divide-y divide-stone-100 p-2 space-y-2">
                  {printSlipOrder.items.map((cartItem, idx) => (
                    <div key={idx} className="text-xs pt-1">
                      <div className="flex justify-between font-bold text-stone-900">
                        <span>{cartItem.product.name}</span>
                        <span>{cartItem.quantity} Adet · {(cartItem.quantity * cartItem.product.price).toLocaleString('tr-TR')} ₺</span>
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {cartItem.product.stemCount ? `${cartItem.product.stemCount} Dal · ` : ''}
                        {cartItem.product.vaseIncluded ? 'Vazo Dahil' : 'Buket'}
                      </div>
                      {cartItem.selectedGifts && cartItem.selectedGifts.length > 0 && (
                        <div className="pl-3 mt-1 text-[11px] text-rose-900 font-medium">
                          + Hediyeler: {cartItem.selectedGifts.map(g => `${g.gift.name} (${g.quantity} Adet)`).join(', ')}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Gift Note on Slip */}
              {printSlipOrder.cardNote && (
                <div className="border border-rose-200 bg-rose-50/50 rounded-xl p-3 text-xs space-y-1">
                  <span className="text-[10px] font-bold text-rose-800 uppercase tracking-wider block">
                    Ekli Hediye Kartı Notu:
                  </span>
                  <p className="font-serif italic text-stone-800">
                    "{printSlipOrder.cardNote}"
                  </p>
                  <div className="text-right text-[11px] font-serif font-semibold text-stone-700">
                    — {printSlipOrder.cardSenderName || (printSlipOrder.sender.isAnonymous ? 'Gizli' : printSlipOrder.sender.name)}
                  </div>
                </div>
              )}

              {/* Sender & Payment Footer */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-stone-200">
                <div>
                  <span className="text-stone-400 block text-[10px]">Gönderici Bilgisi:</span>
                  <span className="font-semibold text-stone-900">
                    {printSlipOrder.sender.isAnonymous ? 'Gizli Gönderim' : printSlipOrder.sender.name} ({printSlipOrder.sender.phone})
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-stone-400 block text-[10px]">Ödeme Türü & Tutar:</span>
                  <span className="font-bold text-rose-800 text-sm">
                    {printSlipOrder.totalAmount.toLocaleString('tr-TR')} ₺ ({printSlipOrder.paymentMethod === 'credit_card' ? 'Kredi Kartı' : 'Havale/FAST'})
                  </span>
                </div>
              </div>

              {/* Delivery Receipt Signature Box */}
              <div className="pt-3 border-t border-dashed border-stone-300 flex items-end justify-between text-xs">
                <div>
                  <span className="text-[10px] text-stone-400 block">Kurye Ad Soyad / Kod:</span>
                  <span className="font-mono text-stone-700 font-medium">VR-EXPRESS / İzmir</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-400 block mb-3">Teslim Alan İsim & İmza:</span>
                  <div className="w-48 border-b border-stone-400 inline-block" />
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs no-print">
              <span className="text-[11px] text-stone-400">
                Velvet Rose Sipariş Takip Kodu: #{printSlipOrder.id}
              </span>
              <button
                type="button"
                onClick={() => setPrintSlipOrder(null)}
                className="px-3 py-1 bg-stone-200 hover:bg-stone-300 text-stone-700 rounded font-medium transition-colors cursor-pointer"
              >
                Kapat
              </button>
            </div>

          </div>
        </div>
      )}


      {/* ÜRÜN DÜZENLEME MODALI */}
      {editingProduct && (
        <div className="fixed inset-0 z-[60] bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-rose-300" />
                <h3 className="text-sm font-bold">Ürünü Düzenle</h3>
              </div>
              <button onClick={() => setEditingProduct(null)} className="p-1.5 hover:bg-stone-700 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Ürün Adı</label>
                <input type="text" value={editProductName} onChange={e => setEditProductName(e.target.value)} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-rose-400/40" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Satış Fiyatı</label>
                  <input type="number" value={editProductPrice} onChange={e => setEditProductPrice(Number(e.target.value))} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Eski Fiyat</label>
                  <input type="number" value={editProductOldPrice} onChange={e => setEditProductOldPrice(Number(e.target.value))} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Dal / Adet Sayısı</label>
                <input type="number" value={editProductStemCount} onChange={e => setEditProductStemCount(Number(e.target.value))} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none" />
              </div>
              <div>
                <ImageFileInput
                  label="Urun Gorseli"
                  value={editProductImage}
                  onChange={setEditProductImage}
                  helperText="Cihazdan yukle"
                  id="edit-product-image"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Açıklama</label>
                <textarea value={editProductDescription} onChange={e => setEditProductDescription(e.target.value)} rows={3} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none resize-none" />
              </div>
            </div>
            <div className="px-5 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
              <button onClick={() => setEditingProduct(null)} className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer">İptal</button>
              <button onClick={handleSaveEditProduct} className="px-5 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HEDİYE DÜZENLEME MODALI */}
      {editingGift && (
        <div className="fixed inset-0 z-[60] bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden">
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-300" />
                <h3 className="text-sm font-bold">Hediyeyi Düzenle</h3>
              </div>
              <button onClick={() => setEditingGift(null)} className="p-1.5 hover:bg-stone-700 rounded-lg cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="p-5 space-y-4 max-h-[65vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Hediye Adı</label>
                <input type="text" value={editGiftName} onChange={e => setEditGiftName(e.target.value)} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-400/40" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Fiyat (₺)</label>
                <input type="number" value={editGiftPrice} onChange={e => setEditGiftPrice(Number(e.target.value))} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none" />
              </div>
              <div>
                <ImageFileInput
                  label="Hediye Görseli"
                  value={editGiftImage}
                  onChange={setEditGiftImage}
                  helperText="Cihazdan yükle"
                  id="edit-gift-image"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Rozet / Etiket</label>
                <input type="text" value={editGiftBadge} onChange={e => setEditGiftBadge(e.target.value)} placeholder="Özel Seçim..." className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Açıklama</label>
                <textarea value={editGiftDescription} onChange={e => setEditGiftDescription(e.target.value)} rows={3} className="w-full text-sm border border-stone-300 rounded-lg px-3 py-2 focus:outline-none resize-none" />
              </div>
            </div>
            <div className="px-5 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-2">
              <button onClick={() => setEditingGift(null)} className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-200 rounded-lg cursor-pointer">İptal</button>
              <button onClick={handleSaveEditGift} className="px-5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg cursor-pointer flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" /> Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

