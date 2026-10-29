import React, { useState, useEffect, useRef } from 'react';
import { Truck, Sparkles, ShieldCheck, MapPin, Clock, ArrowRight, CheckCircle2, ChevronLeft, ChevronRight, Star, ShoppingBag, Crown } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

export const HeroSection: React.FC = () => {
  const { setSelectedDistrictFilter, setActiveModal, activeDistricts, products, startAddToCart } = useShop();
  const [selectedQuickDistrict, setSelectedQuickDistrict] = useState('konak');
  const [showcaseIndex, setShowcaseIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Premium showcase: isFeatured ürünler, fiyat yüksekten düşüğe
  const showcaseProducts = [...(products || [])]
    .filter(p => p.isFeatured)
    .sort((a, b) => b.price - a.price)
    .slice(0, 8);

  const totalSlides = showcaseProducts.length;

  const goNext = () => setShowcaseIndex(i => (i + 1) % totalSlides);
  const goPrev = () => setShowcaseIndex(i => (i - 1 + totalSlides) % totalSlides);

  useEffect(() => {
    if (totalSlides === 0 || isHovered) return;
    autoPlayRef.current = setInterval(goNext, 3800);
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [totalSlides, isHovered, showcaseIndex]);

  const currentDistrict = activeDistricts.find(d => d.id === selectedQuickDistrict) || activeDistricts[0];

  return (
    <section className="relative bg-gradient-to-b from-stone-50 via-white to-stone-50 pt-8 pb-14 border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main 2-Column Split: Editorial Storytelling + Hero Visual */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column: Headlines & District Lookup */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            
            {/* Quiet metadata line */}
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-3">
              <span>Velvet Rose</span>
              <span aria-hidden="true">·</span>
              <span>velvetrose.com.tr</span>
              <span aria-hidden="true">·</span>
              <span>İzmir Aynı Gün Teslimat</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-display font-medium text-stone-900 tracking-tight leading-[1.15] mb-5 text-balance">
              İzmir’de Sevdiklerinize <br className="hidden sm:inline" />
              <span className="italic font-normal text-rose-800">Taze Çiçekler</span> & Özel Hediyeler
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-xl mb-7">
              Her siparişiniz, usta tasarımcılarımız tarafından ilhamla hayata geçirilir; yalnızca taze ve özenle seçilmiş çiçeklerle, size özel benzersiz bir kompozisyona dönüştürülür.
              Bornova, Alsancak, Karşıyaka ve tüm İzmir ilçelerine kendi özel kuryelerimizle bozulmadan teslim ediyoruz.
            </p>

            {/* Quick District Delivery Checker Bar */}
            <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-xs mb-8 max-w-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-stone-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  Teslimat Bölgenizi Seçin:
                </span>
                <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded">
                  {currentDistrict ? (currentDistrict.isFastDelivery ? '⚡ 90 Dk Ekspres Aktif' : 'Özel Ring Seferi') : 'Teslimat Kapalı'}
                </span>
              </div>
              {activeDistricts.length > 0 && currentDistrict ? (
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                  <div className="sm:col-span-8">
                    <select
                      value={currentDistrict.id}
                      onChange={(e) => {
                        setSelectedQuickDistrict(e.target.value);
                        setSelectedDistrictFilter(e.target.value);
                      }}
                      className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:outline-none focus:ring-1 focus:ring-rose-600 focus:bg-white"
                    >
                      {activeDistricts.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-4 flex items-center justify-center bg-stone-100 rounded-lg px-3 py-2 text-xs font-semibold text-stone-700">
                    <Clock className="w-3.5 h-3.5 text-stone-500 mr-1.5 shrink-0" />
                    <span>{currentDistrict.estimatedMinutes}</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                  Şu an için aktif teslimat bölgesi bulunmamaktadır.
                </div>
              )}
            </div>

            {/* Primary Action Row */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#koleksiyon"
                className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all"
              >
                <span>Tüm Ürünleri İncele</span>
                <ArrowRight className="w-4 h-4" />
              </a>

              <button
                onClick={() => setActiveModal('order_tracking')}
                className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 text-sm font-semibold rounded-lg transition-colors cursor-pointer"
              >
                <Truck className="w-4 h-4 text-rose-700" />
                <span>Siparişimi Takip Et</span>
              </button>
            </div>

          </div>

          {/* Right Column: Hero Visual Showcase */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-stone-200 bg-white aspect-[4/3] lg:aspect-auto lg:h-full">
              <SafeImage
                src="https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=1200&q=80"
                alt="Velvet Rose İzmir Çiçek Atölyesi ve Taze Buketler"
                fallbackTitle="Velvet Rose Atölyesi"
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                <div className="flex items-center gap-2 text-xs text-rose-200 font-medium mb-1">
                  <Sparkles className="w-3.5 h-3.5 text-rose-300" />
                  <span>İzmir Bornova Atölye Çekimi</span>
                </div>
                <h3 className="text-lg sm:text-xl font-display font-medium leading-snug">
                  "Çiçek bir tebessümle başlar, sevgiyle teslim edilir."
                </h3>
                <p className="text-xs text-stone-300 mt-1">
                  Özel soğutmalı vitrinimizden taze kesilen güller, şakayıklar ve orkideler.
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* ═══════════════════════════════════════════════════════
            PREMIUM SHOWCASE SLIDER — Editörün Seçkisi
            Hero image ile trust badges arasında konumlanır
        ════════════════════════════════════════════════════════ */}
        {showcaseProducts.length > 0 && (
          <div className="mt-14 mb-2">
            {/* Başlık Bandı */}
            <div className="flex items-end justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-amber-600">
                    Editörün Seçkisi · Velvet Rose Koleksiyonu
                  </span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 leading-tight">
                  Özel Günlere Yakışan <span className="italic text-rose-800">Başyapıtlar</span>
                </h2>
                <p className="text-sm text-stone-500 mt-1.5 max-w-lg">
                  Usta tasarımcılarımızın en çok beğenilen, taze ithal çiçeklerle özenle tanzim edilen imza koleksiyonu.
                </p>
              </div>
              <a
                href="#koleksiyon"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 transition-colors whitespace-nowrap"
              >
                Tüm Koleksiyona Göz At
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Slider Konteyner */}
            <div
              className="relative"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Kart Bandı */}
              <div className="overflow-hidden rounded-2xl">
                <div
                  className="flex transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateX(-${showcaseIndex * (100 / Math.min(totalSlides, 3))}%)` }}
                >
                  {showcaseProducts.map((product, idx) => (
                    <div
                      key={product.id}
                      className="shrink-0 w-full sm:w-1/2 lg:w-1/3 px-2"
                    >
                      <div className="group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                        {/* Ürün Görseli */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading={idx < 3 ? 'eager' : 'lazy'}
                          />
                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                          {/* Rozetler */}
                          <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.hasCampaign && (
                              <span className="px-2 py-0.5 bg-rose-600 text-white text-[10px] font-bold rounded-full shadow-sm">
                                %{product.campaignDiscountPercent} İndirim
                              </span>
                            )}
                            <span className="px-2 py-0.5 bg-amber-500/90 backdrop-blur-xs text-white text-[10px] font-bold rounded-full shadow-sm flex items-center gap-1">
                              <Crown className="w-2.5 h-2.5" />
                              Editör Seçimi
                            </span>
                          </div>

                          {/* Hızlı Ekle — hover'da göster */}
                          <button
                            onClick={() => startAddToCart(product)}
                            className="absolute bottom-3 left-3 right-3 py-2.5 bg-white/95 backdrop-blur-sm text-stone-900 text-xs font-semibold rounded-xl shadow-md flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-rose-700 hover:text-white cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5" />
                            Sepete Ekle
                          </button>
                        </div>

                        {/* Ürün Bilgisi */}
                        <div className="p-4">
                          {/* Rating */}
                          <div className="flex items-center gap-1 mb-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.round(product.rating || 5) ? 'fill-amber-400 text-amber-400' : 'text-stone-200'}`}
                              />
                            ))}
                            <span className="text-[10px] text-stone-400 ml-1">({product.reviewsCount})</span>
                          </div>

                          <h3 className="text-sm font-semibold text-stone-900 leading-snug line-clamp-2 mb-3 group-hover:text-rose-800 transition-colors">
                            {product.name}
                          </h3>

                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1.5">
                              <span className="text-lg font-bold text-rose-700">
                                {product.price.toLocaleString('tr-TR')} ₺
                              </span>
                              {product.oldPrice && (
                                <span className="text-xs text-stone-400 line-through">
                                  {product.oldPrice.toLocaleString('tr-TR')} ₺
                                </span>
                              )}
                            </div>
                            {product.isSameDay && (
                              <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                Aynı Gün
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sol / Sağ Ok */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={goPrev}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 sm:-translate-x-5 z-10 w-10 h-10 bg-white border border-stone-200 rounded-full shadow-md flex items-center justify-center text-stone-700 hover:text-rose-700 hover:border-rose-300 transition-all cursor-pointer"
                    aria-label="Önceki"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={goNext}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 sm:translate-x-5 z-10 w-10 h-10 bg-white border border-stone-200 rounded-full shadow-md flex items-center justify-center text-stone-700 hover:text-rose-700 hover:border-rose-300 transition-all cursor-pointer"
                    aria-label="Sonraki"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}

              {/* Nokta Navigasyon */}
              <div className="flex justify-center gap-1.5 mt-5">
                {Array.from({ length: Math.min(totalSlides, 8) }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setShowcaseIndex(i)}
                    className={`rounded-full transition-all duration-300 cursor-pointer ${
                      i === showcaseIndex
                        ? 'w-5 h-1.5 bg-rose-600'
                        : 'w-1.5 h-1.5 bg-stone-300 hover:bg-stone-400'
                    }`}
                    aria-label={`Slayt ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3-Point Florist Guarantee Row */}
        <div className="mt-10 pt-8 border-t border-stone-200 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-stone-200/80">
            <div className="p-2.5 rounded-lg bg-rose-50 text-rose-700 shrink-0">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 mb-0.5">%100 Taze Kesim Çiçek</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Stokta beklemiş çiçek değil; siparişiniz bize ulaştığı an özenle hazırlanır.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-stone-200/80">
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-700 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 mb-0.5">Birebir Gördüğünüz Ürün</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Sitede incelediğiniz tasarım, renk ve çiçek adediyle birebir aynı hazırlanır.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-stone-200/80">
            <div className="p-2.5 rounded-lg bg-blue-50 text-blue-700 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-stone-900 mb-0.5">Özel Çiçek Kuryesi</h4>
              <p className="text-xs text-stone-500 leading-relaxed">
                Kargo firması değil; çiçek taşımaya uygun klimalı kendi kuryelerimiz teslim eder.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
