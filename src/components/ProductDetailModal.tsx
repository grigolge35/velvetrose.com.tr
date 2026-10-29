import React from 'react';
import { X, Star, Gift, Truck, CheckCircle2, ShieldCheck, Clock, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

export const ProductDetailModal: React.FC = () => {
  const { selectedProductDetail, setSelectedProductDetail, startAddToCart, toggleFavorite, isFavorite } = useShop();

  if (!selectedProductDetail) {
    return null;
  }

  const product = selectedProductDetail;
  const isFav = isFavorite(product.id);

  const handleStartAdd = () => {
    setSelectedProductDetail(null);
    startAddToCart(product);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider">
            <span>İzmir Atölye Tasarımı</span>
            <span aria-hidden="true">·</span>
            <span>Taze Çiçek</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleFavorite(product.id)}
              className={`px-2.5 py-1.5 rounded-lg border transition-all cursor-pointer flex items-center gap-1.5 text-xs font-medium ${
                isFav
                  ? 'bg-rose-50 border-rose-200 text-rose-700'
                  : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
              }`}
              title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
            >
              <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="hidden sm:inline">
                {isFav ? 'Favorilerinizde' : 'Favorilere Ekle'}
              </span>
            </button>

            <button
              onClick={() => setSelectedProductDetail(null)}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Split: Left Image, Right Details */}
        <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-8">
          
          {/* Product Image */}
          <div className="relative aspect-square sm:aspect-auto rounded-xl bg-stone-100 overflow-hidden border border-stone-200">
            <SafeImage
              src={product.image}
              alt={product.name}
              fallbackTitle={product.name}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
            {product.hasCampaign ? (
              <span className="absolute top-3 left-3 bg-rose-700 text-white text-[11px] font-semibold px-2.5 py-1 rounded shadow-md tracking-wide flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-200 animate-pulse"></span>
                <span>🏷️ Kısa Süreli Kampanyalı Ürün (-%20)</span>
              </span>
            ) : product.isBestSeller ? (
              <span className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-medium px-2.5 py-1 rounded">
                En Çok Tercih Edilen
              </span>
            ) : null}
          </div>

          {/* Product Info */}
          <div className="flex flex-col justify-between">
            <div>
              {/* Category Badges */}
              <div className="flex flex-wrap gap-1.5 mb-2">
                {(product.categories && product.categories.length > 0 ? product.categories : [product.category]).map(c => {
                  const labelMap: Record<string, string> = {
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
                  return (
                    <span key={c} className="text-[11px] font-semibold text-rose-800 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                      {labelMap[c] || c}
                    </span>
                  );
                })}
              </div>

              <h2 className="text-xl sm:text-2xl font-display font-medium text-stone-900 mb-2">
                {product.name}
              </h2>

              <div className="flex items-center gap-2 text-xs text-stone-600 mb-4">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="ml-1 font-bold tabular-nums text-stone-900">{product.rating}</span>
                </div>
                <span aria-hidden="true" className="text-stone-300">·</span>
                <span className="text-stone-500">{product.reviewsCount} gerçek müşteri yorumu</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 mb-4 flex-wrap">
                <span className={`text-2xl sm:text-3xl font-bold tabular-nums ${product.hasCampaign ? 'text-rose-700' : 'text-stone-900'}`}>
                  {product.price.toLocaleString('tr-TR')} ₺
                </span>
                {product.oldPrice && (
                  <span className="text-sm text-stone-400 line-through tabular-nums">
                    {product.oldPrice.toLocaleString('tr-TR')} ₺
                  </span>
                )}
                {product.hasCampaign && (
                  <span className="text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded">
                    %20 İskonto Uygulandı
                  </span>
                )}
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                  İzmir İçi Teslimat Dahil
                </span>
              </div>

              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed mb-6">
                {product.description}
              </p>

              {/* Specifications Strip */}
              <div className="bg-stone-50 rounded-xl p-3.5 border border-stone-200/80 space-y-2 text-xs text-stone-700 mb-6">
                {product.stemCount && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Çiçek / Dal Sayısı:</span>
                    <span className="font-semibold">{product.stemCount} Dal Taze Çiçek</span>
                  </div>
                )}
                {product.height && (
                  <div className="flex justify-between">
                    <span className="text-stone-500">Yaklaşık Boyut:</span>
                    <span className="font-semibold">{product.height}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-stone-500">Vazo Durumu:</span>
                  <span className="font-semibold">
                    {product.vaseIncluded ? 'Özel Vazo Dahil' : 'Lüks Mat Ambalaj Kağıdında'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Teslimat Şekli:</span>
                  <span className="font-semibold text-rose-800">Klimalı Kendi Kuryemizle</span>
                </div>
              </div>

              {/* Freshness & Design Guarantee Note */}
              <div className="flex items-start gap-2.5 text-xs text-stone-500 mb-6">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  Tasarım ve tazelik garantisi: Çiçekler canlı ve doğal varlıklar olduğundan tomurcuk ve tonlarında küçük doğal farklılıklar olabilmekle birlikte, seçtiğiniz aranjmanın konseptine, adetlerine ve kalitesine sadık kalınarak özenle hazırlanır.
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={() => toggleFavorite(product.id)}
                className={`p-3.5 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  isFav
                    ? 'bg-rose-50 border-rose-300 text-rose-700 shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-rose-600'
                }`}
                title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
              >
                <Heart className={`w-5 h-5 ${isFav ? 'fill-rose-600 text-rose-600' : ''}`} />
              </button>

              <button
                onClick={handleStartAdd}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-rose-700 hover:bg-rose-800 active:scale-98 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer"
              >
                <Gift className="w-4 h-4" />
                <span>Sepete Ekle & Ekstra Hediye Seç</span>
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
