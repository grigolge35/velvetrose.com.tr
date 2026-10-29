import React, { useState } from 'react';
import { ShoppingBag, Truck, Search, X, MessageCircle, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Navbar: React.FC = () => {
  const { 
    cartItemCount, 
    setActiveModal, 
    searchQuery, 
    setSearchQuery,
    favoriteCount,
    showFavoritesOnly,
    setShowFavoritesOnly,
    activeDistricts
  } = useShop();
  const [showPromo, setShowPromo] = useState(true);
  const [showSearchInput, setShowSearchInput] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Slim Top Announcement Bar (<= 40px) */}
      {showPromo && (
        <div className="bg-[#1C1917] text-stone-200 text-xs px-4 py-2 flex items-center justify-between transition-all">
          <div className="mx-auto flex items-center gap-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>İzmir geneline bugün 19:30’a kadar verilen siparişlerde aynı gün teslimat garantisi!</span>
            <span aria-hidden="true" className="text-stone-500 hidden md:inline">·</span>
            <span className="text-rose-300 font-semibold hidden md:inline">🏷️ Seçili çiçeklerde kısa süreli %20 kampanya fırsatı!</span>
          </div>
          <button
            onClick={() => setShowPromo(false)}
            className="text-stone-400 hover:text-white p-0.5 rounded transition-colors"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Navigation: Top Bar 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="min-h-[5rem] sm:min-h-[5.5rem] lg:min-h-[6rem] flex items-center justify-between gap-4 py-2">
          
          {/* Zone 1: Official Brand Logo */}
          <div className="flex items-center gap-6 shrink-0">
            <a
              href="#"
              className="flex items-center hover:opacity-95 transition-opacity"
              title="Velvet Rose – İzmir Aynı Gün Çiçek Siparişi"
            >
              <img
                src="/assets/aistudio/velvet-rose-premium-logo_a1210b70.png"
                alt="Velvet Rose Çiçek Tasarım Atölyesi"
                className="h-14 sm:h-16 md:h-18 lg:h-20 w-auto object-contain max-w-[180px] sm:max-w-[230px] md:max-w-[270px] lg:max-w-[320px] drop-shadow-sm transition-all duration-200"
              />
            </a>
          </div>

          {/* Zone 2: 4-5 concise single-line text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#koleksiyon" className="hover:text-rose-700 transition-colors whitespace-nowrap">
              Tüm Ürünler
            </a>
            <a href="#ekstra-hediyeler" className="hover:text-rose-700 transition-colors whitespace-nowrap">
              Ekstra Hediyeler
            </a>
            <a href="#izmir-teslimat" className="hover:text-rose-700 transition-colors whitespace-nowrap flex items-center gap-1.5">
              <span>İzmir Teslimat</span>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                {activeDistricts.length} Bölge
              </span>
            </a>
            <a href="#cicek-rehberi" className="hover:text-rose-700 transition-colors whitespace-nowrap">
              Çiçek Bakım Rehberi
            </a>
            <button
              onClick={() => setActiveModal('order_tracking')}
              className="hover:text-rose-700 transition-colors flex items-center gap-1.5 text-stone-800 font-semibold cursor-pointer whitespace-nowrap"
            >
              <Truck className="w-4 h-4 text-rose-600" />
              Sipariş Takibi
            </button>
          </nav>

          {/* Zone 3: Primary Action & Controls */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Quick Search */}
            <div className="relative hidden md:block">
              {showSearchInput ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Gül, orkide, çikolata ara..."
                    className="w-56 text-xs bg-stone-100 border border-stone-300 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600 focus:bg-white"
                    autoFocus
                  />
                  <button
                    onClick={() => {
                      setShowSearchInput(false);
                      setSearchQuery('');
                    }}
                    className="ml-1 text-stone-400 hover:text-stone-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-stone-600 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                  title="Ürün Ara"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* WhatsApp Quick Support CTA */}
            <a
              href="https://wa.me/905325138658?text=Merhaba%2C%20Velvet%20Rose%20%C3%A7i%C3%A7ek%20sipari%C5%9Fi%20veya%20sorum%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-semibold rounded-lg shadow-2xs transition-colors whitespace-nowrap cursor-pointer"
              title="WhatsApp: 0532 513 86 58"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-[#25D366]" />
              <span className="hidden xl:inline">WhatsApp: 0532 513 86 58</span>
              <span className="xl:hidden hidden md:inline">WhatsApp Destek</span>
            </a>

            {/* Order Tracking (Mobile view button) */}
            <button
              onClick={() => setActiveModal('order_tracking')}
              className="lg:hidden p-2 text-stone-700 hover:text-rose-700 rounded-lg hover:bg-stone-100 transition-colors"
              title="Sipariş Takibi"
            >
              <Truck className="w-5 h-5" />
            </button>

            {/* Favorites CTA */}
            <a
              href="#koleksiyon"
              onClick={() => {
                setShowFavoritesOnly(!showFavoritesOnly);
              }}
              className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all cursor-pointer whitespace-nowrap ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                  : 'bg-white hover:bg-stone-50 border-stone-200 text-stone-700 hover:text-rose-700'
              }`}
              title="Favorilerim"
            >
              <Heart className={`w-4 h-4 ${favoriteCount > 0 ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="hidden sm:inline">Favorilerim</span>
              {favoriteCount > 0 && (
                <span className="bg-rose-600 text-white text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {favoriteCount}
                </span>
              )}
            </a>

            {/* Shopping Bag CTA */}
            <button
              onClick={() => setActiveModal('cart_drawer')}
              className="relative flex items-center gap-2 px-4 py-2 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-lg shadow-sm transition-all whitespace-nowrap cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Sepetim</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-rose-800 text-[11px] font-bold px-1.5 py-0.2 rounded-full min-w-4 text-center">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
