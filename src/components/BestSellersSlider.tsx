import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Flame, Star, Sparkles, Heart, ShoppingBag, Eye, Truck, Check } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { FlowerProduct } from '../types';
import { SafeImage } from './SafeImage';

export const BestSellersSlider: React.FC = () => {
  const { 
    products, 
    setSelectedProductDetail, 
    startAddToCart, 
    toggleFavorite, 
    isFavorite 
  } = useShop();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  // Filter products chosen as Best Sellers
  const bestSellers = useMemo(() => {
    const selected = products.filter(p => p.isBestSeller);
    if (selected.length > 0) return selected;
    // Fallback: If no products are marked yet, show top rated products
    return [...products].sort((a, b) => b.rating - a.rating).slice(0, 6);
  }, [products]);

  // Check scroll boundary
  const updateScrollButtons = useCallback(() => {
    const el = sliderRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);

    // Approximate active dot
    const cardWidth = 300; // estimated card + gap
    const idx = Math.round(scrollLeft / cardWidth);
    setActiveIndex(Math.min(Math.max(idx, 0), bestSellers.length - 1));
  }, [bestSellers.length]);

  useEffect(() => {
    const el = sliderRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [updateScrollButtons, bestSellers]);

  // Auto-scroll carousel every 4.5s
  useEffect(() => {
    if (isPaused || bestSellers.length <= 1) return;

    const timer = setInterval(() => {
      const el = sliderRef.current;
      if (!el) return;
      const { scrollLeft, scrollWidth, clientWidth } = el;
      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        // Loop back to start smoothly
        el.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        el.scrollBy({ left: 300, behavior: 'smooth' });
      }
    }, 4500);

    return () => clearInterval(timer);
  }, [isPaused, bestSellers.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollAmount = direction === 'left' ? -320 : 320;
    el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const scrollToItem = (index: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const scrollPos = index * 320;
    el.scrollTo({ left: scrollPos, behavior: 'smooth' });
  };

  if (bestSellers.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative mb-8 bg-gradient-to-br from-[#1a0a0e] via-[#2d0f18] to-[#1c0c10] text-white rounded-2xl p-5 sm:p-7 shadow-lg overflow-hidden border border-rose-950/60"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      {/* Decorative ambient glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-800/25 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-800/20 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-rose-900/10 rounded-full blur-3xl pointer-events-none"></div>

      {/* Header bar */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-1.5">
            <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400 animate-pulse" />
            <span>İzmir’de En Çok Tercih Edilenler</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-display font-medium text-white tracking-tight flex items-center gap-2">
            <span>Çok Satan Özel Tasarımlar</span>
            <span className="text-xs font-sans font-normal text-rose-300 bg-rose-950/60 px-2.5 py-0.5 rounded-full border border-rose-800/50">
              {bestSellers.length} Seçkin Ürün
            </span>
          </h3>
          <p className="text-xs text-stone-300 max-w-xl mt-0.5">
            İzmirli çiçekseverlerin en beğendiği, en taze ve popüler atölye aranjmanları.
          </p>
        </div>

        {/* Navigation Arrows */}
        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={() => handleScroll('left')}
            disabled={!canScrollLeft}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              canScrollLeft
                ? 'bg-rose-950/80 hover:bg-rose-900 text-rose-200 border-rose-800/60 hover:border-rose-600 shadow-md active:scale-95'
                : 'bg-rose-950/30 text-rose-900 border-rose-950/40 cursor-not-allowed opacity-40'
            }`}
            aria-label="Önceki çok satan çiçekler"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={() => handleScroll('right')}
            disabled={!canScrollRight}
            className={`w-9 h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
              canScrollRight
                ? 'bg-rose-700 hover:bg-rose-600 text-white border-rose-600 hover:border-rose-500 shadow-md active:scale-95'
                : 'bg-rose-950/30 text-rose-900 border-rose-950/40 cursor-not-allowed opacity-40'
            }`}
            aria-label="Sonraki çok satan çiçekler"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Horizontal Slider Track */}
      <div
        ref={sliderRef}
        className="relative z-10 flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-3 pt-1 scrollbar-none"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {bestSellers.map((prod) => {
          const isFav = isFavorite(prod.id);
          return (
            <div
              key={prod.id}
              className="group/card w-[260px] sm:w-[280px] md:w-[300px] shrink-0 snap-start bg-white rounded-xl border border-stone-200 overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 flex flex-col text-stone-900"
            >
              {/* Product Image */}
              <div 
                className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
                onClick={() => setSelectedProductDetail(prod)}
              >
                <SafeImage
                  src={prod.image}
                  alt={prod.name}
                  fallbackTitle={prod.name}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-500 ease-out"
                  containerClassName="w-full h-full"
                />

                {/* Top Badges */}
                <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 items-start">
                  <span className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center gap-1 uppercase tracking-wide">
                    <Flame className="w-3 h-3 fill-amber-300 text-amber-300" />
                    <span>Çok Satan</span>
                  </span>
                  {prod.hasCampaign && (
                    <span className="bg-rose-700 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-md flex items-center gap-1">
                      <span>🏷️ %20 İndirim</span>
                    </span>
                  )}
                </div>

                {/* Favorite Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(prod.id);
                  }}
                  className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs flex items-center justify-center shadow-md hover:bg-white transition-all cursor-pointer text-stone-600 hover:text-rose-600 active:scale-90"
                  aria-label={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
                </button>

                {/* Delivery Indicator Bottom Bar */}
                <div className="absolute bottom-2 inset-x-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center justify-between">
                  <span className="flex items-center gap-1 text-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Aynı Gün Teslimat</span>
                  </span>
                  <span className="text-stone-300">İzmir İçi</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-3.5 flex flex-col justify-between flex-1 bg-white">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <div className="flex items-center text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="ml-1 text-stone-800 text-[11px] tabular-nums">{prod.rating}</span>
                      <span className="text-stone-400 text-[10px] ml-1 font-normal">({prod.reviewsCount})</span>
                    </div>
                    {prod.stemCount && (
                      <span className="text-[10px] font-semibold text-rose-800 bg-rose-50 px-1.5 py-0.2 rounded border border-rose-200">
                        {prod.stemCount} Dal Çiçek
                      </span>
                    )}
                  </div>

                  <h4 
                    onClick={() => setSelectedProductDetail(prod)}
                    className="font-medium text-stone-900 text-sm line-clamp-1 hover:text-rose-800 cursor-pointer transition-colors"
                    title={prod.name}
                  >
                    {prod.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                    {prod.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-sm sm:text-base font-bold text-stone-900 tabular-nums">
                      {prod.price.toLocaleString('tr-TR')} ₺
                    </div>
                    {prod.oldPrice && (
                      <span className="text-[10px] text-stone-400 line-through tabular-nums block -mt-0.5">
                        {prod.oldPrice.toLocaleString('tr-TR')} ₺
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedProductDetail(prod)}
                      className="p-2 text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors cursor-pointer"
                      title="Detaylı İncele"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => startAddToCart(prod)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-2xs hover:shadow transition-all cursor-pointer active:scale-95"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Sepete Ekle</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination Dots */}
      {bestSellers.length > 1 && (
        <div className="relative z-10 flex items-center justify-center gap-1.5 mt-2">
          {bestSellers.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToItem(idx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                activeIndex === idx
                  ? 'w-6 bg-rose-500'
                  : 'w-1.5 bg-rose-900/60 hover:bg-rose-700/80'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
