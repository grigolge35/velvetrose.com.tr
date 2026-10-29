import React, { useState, useMemo } from 'react';
import { useShop } from '../context/ShopContext';
import { ProductCard } from './ProductCard';
import { BestSellersSlider } from './BestSellersSlider';
import { 
  Search, 
  SlidersHorizontal, 
  Sparkles, 
  X, 
  Filter, 
  Flame, 
  ArrowUpDown, 
  Check, 
  RotateCcw,
  Tag,
  Banknote,
  Star,
  Heart
} from 'lucide-react';

export const ProductGrid: React.FC = () => {
  const { 
    products, 
    selectedCategory, 
    setSelectedCategory, 
    searchQuery, 
    setSearchQuery,
    favorites,
    favoriteCount,
    showFavoritesOnly,
    setShowFavoritesOnly
  } = useShop();

  // Filter States
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(true);
  const [priceRange, setPriceRange] = useState<'all' | 'under1000' | '1000to1500' | 'above1500' | 'custom'>('all');
  const [customMinPrice, setCustomMinPrice] = useState<string>('');
  const [customMaxPrice, setCustomMaxPrice] = useState<string>('');
  const [popularityFilter, setPopularityFilter] = useState<'all' | 'campaign' | 'bestsellers' | 'top_rated' | 'price_asc' | 'price_desc'>('all');
  const [onlyBestsellers, setOnlyBestsellers] = useState(false);
  const [onlySameDay, setOnlySameDay] = useState(false);

  // Amaca ve Özel Günlere Yönelik Kategoriler (Doğum Günü, Evlilik Yıldönümü, Özel Tasarım & Çelenk vb.)
  const categoryFilters = [
    { id: 'all', label: 'Tüm Ürünler', icon: '🌸' },
    { id: 'dogum_gunu', label: 'Doğum Günü', icon: '🎂' },
    { id: 'yildonumu', label: 'Evlilik Yıldönümü', icon: '💍' },
    { id: 'ask_romantik', label: 'Aşk & Sevgiliye', icon: '❤️' },
    { id: 'yeni_is', label: 'Yeni İş & Tebrik', icon: '💼' },
    { id: 'ozel_tasarim_celenk', label: 'Özel Tasarım & Çelenk', icon: '🎗️' },
    { id: 'gecmis_olsun', label: 'Geçmiş Olsun', icon: '🌿' },
    { id: 'ozur', label: 'Özür Dilerim & Barışma', icon: '🕊️' },
    { id: 'icimden_geldi', label: 'İçimden Geldi', icon: '✨' },
    { id: 'kampanya', label: 'Kampanyadaki Ürünler', icon: '🏷️' }
  ];

  // Price tier definitions
  const priceTiers = [
    { id: 'all', label: 'Tüm Fiyatlar' },
    { id: 'under1000', label: '1.000 ₺ altı (Ekonomik)' },
    { id: '1000to1500', label: '1.000 ₺ – 1.500 ₺' },
    { id: 'above1500', label: '1.500 ₺ üzeri (Lüks)' }
  ];

  // Popularity and Sorting options (including Kampanyadaki Ürünler)
  const popularityOptions = [
    { id: 'all', label: 'Varsayılan Sıralama' },
    { id: 'campaign', label: '🏷️ Kampanyadaki Ürünler (%20 İndirimli)' },
    { id: 'bestsellers', label: 'En Popüler / Çok Satanlar' },
    { id: 'top_rated', label: 'En Yüksek Puanlılar (5.0★)' },
    { id: 'price_asc', label: 'Fiyat: Düşükten Yükseğe' },
    { id: 'price_desc', label: 'Fiyat: Yüksekten Düşüğe' }
  ];

  // Filtering Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // 1. Amaca Yönelik Kategori Filtresi (Doğum Günü, Yıldönümü, Çelenk, Aşk vb.)
      let matchesCategory = true;
      if (selectedCategory !== 'all') {
        const prodCats: string[] = product.categories && product.categories.length > 0
          ? product.categories
          : [product.category];

        if (selectedCategory === 'kampanya') {
          matchesCategory = !!product.hasCampaign;
        } else if (selectedCategory === 'dogum_gunu') {
          matchesCategory = prodCats.includes('dogum_gunu') || 
            product.tags.some(t => /doğum|dogum|kutlama/i.test(t)) || 
            /doğum günü|kutlama/i.test(product.name + ' ' + product.description);
        } else if (selectedCategory === 'yildonumu') {
          matchesCategory = prodCats.includes('yildonumu') || 
            product.tags.some(t => /yıldönümü|yildonumu|solmayan/i.test(t)) || 
            /yıldönümü|yildonumu|solmayan/i.test(product.name + ' ' + product.description);
        } else if (selectedCategory === 'ask_romantik') {
          matchesCategory = prodCats.includes('ask_romantik') || 
            prodCats.includes('guller') || 
            product.tags.some(t => /aşk|sevgili|tutku|gül|kalp/i.test(t)) || 
            /aşk|tutku|kırmızı gül|sevgili/i.test(product.name + ' ' + product.description);
        } else if (selectedCategory === 'yeni_is') {
          matchesCategory = prodCats.includes('yeni_is') || 
            prodCats.includes('orkideler') || 
            product.tags.some(t => /iş|ofis|tebrik|bonsai|seramik/i.test(t)) || 
            /yeni iş|ofis|tebrik|bonsai|orkide/i.test(product.name + ' ' + product.description);
        } else if (selectedCategory === 'ozel_tasarim_celenk') {
          matchesCategory = prodCats.includes('ozel_tasarim_celenk') || 
            product.tags.some(t => /çelenk|celenk|ferforje|özel tasarım|vip|açılış|merasim|cenaze/i.test(t)) || 
            /çelenk|celenk|ferforje|özel tasarım|vip|merasim|cenaze|düğün çelengi/i.test(product.name + ' ' + product.description);
        } else if (selectedCategory === 'gecmis_olsun') {
          matchesCategory = prodCats.includes('gecmis_olsun') || 
            product.tags.some(t => /şifa|moral|enerji|taze|kır/i.test(t)) || 
            /geçmiş olsun|şifa|moral|ayçiçeği|papatya/i.test(product.name + ' ' + product.description);
        } else if (selectedCategory === 'ozur') {
          matchesCategory = prodCats.includes('ozur') || 
            product.tags.some(t => /özür|barışma|gül|kalp/i.test(t)) || 
            /özür|barışma|af/i.test(product.name + ' ' + product.description);
        } else if (selectedCategory === 'icimden_geldi') {
          matchesCategory = prodCats.includes('icimden_geldi') || 
            product.tags.some(t => /sürpriz|jest|samimi|kır/i.test(t)) || 
            /sürpriz|samimi|jest|papatya/i.test(product.name + ' ' + product.description);
        } else {
          matchesCategory = prodCats.includes(selectedCategory);
        }
      }

      // 2. Search Filter
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      // 3. Price Filter
      let matchesPrice = true;
      if (priceRange === 'under1000') {
        matchesPrice = product.price <= 1000;
      } else if (priceRange === '1000to1500') {
        matchesPrice = product.price > 1000 && product.price <= 1500;
      } else if (priceRange === 'above1500') {
        matchesPrice = product.price > 1500;
      } else if (priceRange === 'custom') {
        const min = customMinPrice ? parseFloat(customMinPrice) : 0;
        const max = customMaxPrice ? parseFloat(customMaxPrice) : Infinity;
        matchesPrice = product.price >= min && product.price <= max;
      }

      // 4. Popularity / Bestseller Checkboxes
      let matchesBestseller = true;
      if (onlyBestsellers) {
        matchesBestseller = !!product.isBestSeller;
      }

      let matchesSameDay = true;
      if (onlySameDay) {
        matchesSameDay = !!product.isSameDay;
      }

      // 5. Favorites Filter
      let matchesFavorites = true;
      if (showFavoritesOnly) {
        matchesFavorites = favorites.includes(product.id);
      }

      return matchesCategory && matchesSearch && matchesPrice && matchesBestseller && matchesSameDay && matchesFavorites;
    });
  }, [products, selectedCategory, searchQuery, priceRange, customMinPrice, customMaxPrice, onlyBestsellers, onlySameDay, showFavoritesOnly, favorites]);

  // Sorting Logic (Applied over filtered list)
  const sortedProducts = useMemo(() => {
    return [...filteredProducts].sort((a, b) => {
      if (popularityFilter === 'campaign') {
        return (b.hasCampaign ? 1 : 0) - (a.hasCampaign ? 1 : 0) || (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      }
      if (popularityFilter === 'bestsellers') {
        return (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0) || b.reviewsCount - a.reviewsCount;
      }
      if (popularityFilter === 'top_rated') {
        return b.rating - a.rating || b.reviewsCount - a.reviewsCount;
      }
      if (popularityFilter === 'price_asc') {
        return a.price - b.price;
      }
      if (popularityFilter === 'price_desc') {
        return b.price - a.price;
      }
      // 'all' default: campaign and bestsellers prioritized
      return (b.hasCampaign ? 1 : 0) - (a.hasCampaign ? 1 : 0) || (b.isBestSeller ? 1 : 0) - (a.isBestSeller ? 1 : 0);
    });
  }, [filteredProducts, popularityFilter]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedCategory !== 'all') count++;
    if (priceRange !== 'all') count++;
    if (popularityFilter !== 'all') count++;
    if (onlyBestsellers) count++;
    if (onlySameDay) count++;
    if (showFavoritesOnly) count++;
    if (searchQuery.trim() !== '') count++;
    return count;
  }, [selectedCategory, priceRange, popularityFilter, onlyBestsellers, onlySameDay, showFavoritesOnly, searchQuery]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setPriceRange('all');
    setCustomMinPrice('');
    setCustomMaxPrice('');
    setPopularityFilter('all');
    setOnlyBestsellers(false);
    setOnlySameDay(false);
    setShowFavoritesOnly(false);
    setSearchQuery('');
  };

  return (
    <section id="koleksiyon" className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-1">
              <span>İzmir Atölye Tasarımları</span>
              <span aria-hidden="true">·</span>
              <span>Velvet Rose Çiçek Tasarımları</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 tracking-tight">
              Öne Çıkan Tüm Ürünlerimiz
            </h2>
          </div>

          {/* Quick Search & Filter Toggle Header */}
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Gül, orkide, buket ara..."
                className="w-48 sm:w-64 text-xs bg-stone-50 border border-stone-200 rounded-xl pl-8 pr-3 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Quick Favorites Toggle Button */}
            <button
              onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                showFavoritesOnly
                  ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-2xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              title="Favorilerimi Göster"
            >
              <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly || favoriteCount > 0 ? 'fill-rose-600 text-rose-600' : 'text-stone-400'}`} />
              <span className="hidden sm:inline">Favorilerim</span>
              {favoriteCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  showFavoritesOnly ? 'bg-rose-600 text-white' : 'bg-stone-200 text-stone-800'
                }`}>
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Toggle Filter Menu Button */}
            <button
              onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap ${
                isFilterMenuOpen
                  ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Filtreleme Menüsü</span>
              {activeFilterCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ml-0.5">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Çok Satan Ürünler Slider (Seçilen & Öne Çıkarılan Tasarımlar) */}
        <BestSellersSlider />

        {/* Hızlı Gönderim Amacı & Kategori Çubuğu (Doğum Günü, Evlilik Yıldönümü, vb.) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 mb-6 scrollbar-thin">
          {categoryFilters.map((cat) => {
            const isActive = selectedCategory === cat.id;
            const isCampaign = cat.id === 'kampanya';
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-xl border transition-all cursor-pointer whitespace-nowrap shrink-0 shadow-2xs ${
                  isActive
                    ? 'bg-rose-700 text-white border-rose-700 shadow-xs'
                    : isCampaign
                    ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200'
                    : 'bg-white hover:bg-stone-50 text-stone-700 border-stone-200 hover:border-stone-300'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* COMPREHENSIVE FILTERING MENU (Kategori, Fiyat Aralığı, Popülerlik) */}
        {isFilterMenuOpen && (
          <div className="bg-stone-50/90 border border-stone-200 rounded-2xl p-5 mb-8 shadow-2xs space-y-5 animate-in fade-in duration-200">
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* 1. GÖNDERİM AMACI VE KATEGORİ (Doğum Günü, Evlilik Yıldönümü, Aşk vb.) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-rose-700" />
                    <span>1. Gönderim Amacı (Özel Günler)</span>
                  </span>
                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => setSelectedCategory('all')}
                      className="text-[11px] text-rose-700 hover:underline"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {categoryFilters.map((cat) => {
                    const isActive = selectedCategory === cat.id;
                    const isCampaign = cat.id === 'kampanya';
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-rose-700 text-white border-rose-700 shadow-2xs font-semibold'
                            : isCampaign
                            ? 'bg-rose-50 hover:bg-rose-100 text-rose-800 border-rose-200 font-semibold shadow-2xs'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                        }`}
                      >
                        <span>{cat.icon}</span>
                        <span>{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. FİYAT ARALIĞI FİLTRESİ */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Banknote className="w-3.5 h-3.5 text-emerald-700" />
                    <span>2. Fiyat Aralığı</span>
                  </span>
                  {priceRange !== 'all' && (
                    <button
                      onClick={() => {
                        setPriceRange('all');
                        setCustomMinPrice('');
                        setCustomMaxPrice('');
                      }}
                      className="text-[11px] text-rose-700 hover:underline"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>

                {/* Price quick radio chips */}
                <div className="flex flex-wrap gap-1.5">
                  {priceTiers.map((tier) => {
                    const isActive = priceRange === tier.id;
                    return (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setPriceRange(tier.id as any)}
                        className={`px-3 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                          isActive
                            ? 'bg-stone-900 text-white border-stone-900 font-semibold shadow-2xs'
                            : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200 font-medium'
                        }`}
                      >
                        {tier.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom Min / Max inputs */}
                <div className="pt-1 flex items-center gap-2 text-xs">
                  <input
                    type="number"
                    value={customMinPrice}
                    onChange={(e) => {
                      setCustomMinPrice(e.target.value);
                      setPriceRange('custom');
                    }}
                    placeholder="Min ₺"
                    className="w-20 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-rose-600 font-mono"
                  />
                  <span className="text-stone-400">—</span>
                  <input
                    type="number"
                    value={customMaxPrice}
                    onChange={(e) => {
                      setCustomMaxPrice(e.target.value);
                      setPriceRange('custom');
                    }}
                    placeholder="Max ₺"
                    className="w-20 bg-white border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 text-xs focus:outline-none focus:ring-1 focus:ring-rose-600 font-mono"
                  />
                  {priceRange === 'custom' && (
                    <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-1 rounded">
                      Özel Aralık
                    </span>
                  )}
                </div>
              </div>

              {/* 3. POPÜLERLİK & SIRALAMA FİLTRESİ */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>3. Popülerlik & Sıralama</span>
                  </span>
                  {popularityFilter !== 'all' && (
                    <button
                      onClick={() => setPopularityFilter('all')}
                      className="text-[11px] text-rose-700 hover:underline"
                    >
                      Sıfırla
                    </button>
                  )}
                </div>

                {/* Popularity selector dropdown */}
                <select
                  value={popularityFilter}
                  onChange={(e) => setPopularityFilter(e.target.value as any)}
                  className="w-full text-xs bg-white border border-stone-300 rounded-lg px-3 py-2 text-stone-800 font-medium focus:outline-none focus:ring-1 focus:ring-rose-600"
                >
                  {popularityOptions.map((opt) => (
                    <option key={opt.id} value={opt.id}>
                      {opt.label}
                    </option>
                  ))}
                </select>

                {/* Quick Checkbox toggles */}
                <div className="pt-1 flex flex-col sm:flex-row gap-3 text-xs text-stone-700">
                  <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={onlyBestsellers}
                      onChange={(e) => setOnlyBestsellers(e.target.checked)}
                      className="rounded text-rose-700 focus:ring-rose-600"
                    />
                    <span>🔥 Sadece En Çok Satanlar</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-stone-900">
                    <input
                      type="checkbox"
                      checked={onlySameDay}
                      onChange={(e) => setOnlySameDay(e.target.checked)}
                      className="rounded text-rose-700 focus:ring-rose-600"
                    />
                    <span>⚡ Aynı Gün Teslim</span>
                  </label>

                  <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-rose-700">
                    <input
                      type="checkbox"
                      checked={showFavoritesOnly}
                      onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                      className="rounded text-rose-700 focus:ring-rose-600"
                    />
                    <span className="flex items-center gap-1">
                      <Heart className={`w-3.5 h-3.5 ${showFavoritesOnly ? 'fill-rose-600 text-rose-600' : 'text-stone-500'}`} />
                      <span>Sadece Favorilerim {favoriteCount > 0 ? `(${favoriteCount})` : ''}</span>
                    </span>
                  </label>
                </div>
              </div>

            </div>

            {/* Bottom Bar of Filter Menu: Summary & Reset */}
            {activeFilterCount > 0 && (
              <div className="pt-3 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                
                {/* Active Badges */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-stone-500 font-semibold mr-1">Uygulanan Filtreler:</span>
                  
                  {showFavoritesOnly && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-[11px] font-medium">
                      <Heart className="w-3 h-3 fill-rose-600 text-rose-600" />
                      Favorilerim ({favoriteCount})
                      <button onClick={() => setShowFavoritesOnly(false)} className="hover:text-rose-900 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {selectedCategory !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-[11px]">
                      Kategori: {categoryFilters.find(c => c.id === selectedCategory)?.label}
                      <button onClick={() => setSelectedCategory('all')} className="hover:text-rose-700 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {priceRange !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-[11px]">
                      Fiyat: {priceRange === 'custom' ? `${customMinPrice || '0'} - ${customMaxPrice || '∞'} ₺` : priceTiers.find(p => p.id === priceRange)?.label}
                      <button onClick={() => setPriceRange('all')} className="hover:text-rose-700 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {popularityFilter !== 'all' && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-[11px]">
                      Sıralama: {popularityOptions.find(o => o.id === popularityFilter)?.label}
                      <button onClick={() => setPopularityFilter('all')} className="hover:text-rose-700 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {onlyBestsellers && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-[11px]">
                      En Çok Satanlar
                      <button onClick={() => setOnlyBestsellers(false)} className="hover:text-rose-700 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {onlySameDay && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-[11px]">
                      Aynı Gün Teslim
                      <button onClick={() => setOnlySameDay(false)} className="hover:text-rose-700 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-stone-300 text-stone-800 text-[11px]">
                      Arama: "{searchQuery}"
                      <button onClick={() => setSearchQuery('')} className="hover:text-rose-700 ml-0.5">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>

                {/* Reset all button */}
                <button
                  onClick={handleResetFilters}
                  className="flex items-center gap-1 text-rose-700 hover:text-rose-900 font-semibold hover:underline cursor-pointer ml-auto"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Tüm Filtreleri Temizle ({activeFilterCount})</span>
                </button>
              </div>
            )}

          </div>
        )}

        {/* Product Count indicator */}
        <div className="flex items-center justify-between text-xs text-stone-500 mb-6">
          <span className="font-medium text-stone-700">
            {showFavoritesOnly ? (
              <span className="text-rose-700 font-semibold">
                Favori listenizdeki <strong className="tabular-nums">{sortedProducts.length}</strong> çiçek listeleniyor
              </span>
            ) : (
              <>
                Toplam <strong className="text-stone-900 tabular-nums">{sortedProducts.length}</strong> adet çiçek tasarımı listeleniyor
              </>
            )}
          </span>
          {activeFilterCount > 0 && !isFilterMenuOpen && (
            <button
              onClick={handleResetFilters}
              className="text-rose-700 hover:underline font-medium"
            >
              Filtreleri Temizle ({activeFilterCount})
            </button>
          )}
        </div>

        {/* 3-Column Desktop / 2-Column Tablet Grid with generous whitespace (gap-6 to gap-8) */}
        {sortedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : showFavoritesOnly ? (
          <div className="py-16 text-center bg-rose-50/50 rounded-2xl border border-dashed border-rose-200 p-6">
            <div className="w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mx-auto mb-3">
              <Heart className="w-6 h-6 text-rose-600 fill-rose-100" />
            </div>
            <h3 className="text-base font-semibold text-stone-800 mb-1">
              Henüz favori çiçek eklemediniz
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mb-5 leading-relaxed">
              Çiçek kartlarının sağ üst köşesindeki kalp ikonuna tıklayarak beğendiğiniz tasarımları favorilerinize ekleyebilir, dilediğiniz zaman buradan tek tıkla listeleyebilirsiniz.
            </p>
            <button
              onClick={() => setShowFavoritesOnly(false)}
              className="px-5 py-2.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Tüm Çiçek Koleksiyonunu Keşfet
            </button>
          </div>
        ) : (
          <div className="py-16 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300 p-6">
            <Sparkles className="w-10 h-10 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-stone-800 mb-1">
              Seçtiğiniz filtrelere uygun çiçek bulunamadı
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto mb-5 leading-relaxed">
              Fiyat aralığını genişletebilir, kategori seçimini 'Tüm Koleksiyon' yapabilir veya uygulanan filtreleri tek tıkla sıfırlayabilirsiniz.
            </p>
            <button
              onClick={handleResetFilters}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Filtreleri Sıfırla ve Tüm Çiçekleri Göster
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
