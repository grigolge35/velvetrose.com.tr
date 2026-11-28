import React from 'react';
import { Plus, Star, Gift, Clock, Heart } from 'lucide-react';
import { FlowerProduct } from '../types';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

interface ProductCardProps {
  product: FlowerProduct;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { startAddToCart, setSelectedProductDetail, toggleFavorite, isFavorite } = useShop();

  const isFav = isFavorite(product.id);

  const categoryNames: Record<string, string> = {
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
    <div className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-all duration-200">
      
      {/* Product Image slot: 65-75% height on neutral backdrop */}
      <div 
        className="relative aspect-[4/3] bg-stone-100 overflow-hidden cursor-pointer"
        onClick={() => setSelectedProductDetail(product)}
      >
        <SafeImage
          src={product.image}
          alt={product.name}
          fallbackTitle={product.name}
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          containerClassName="w-full h-full"
        />

        {/* Campaign badge or Best seller tag */}
        {product.hasCampaign ? (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-rose-700/95 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded shadow-md tracking-wide flex items-center gap-1 z-10">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-200 animate-pulse hidden sm:inline-block"></span>
            <span className="hidden sm:inline">Kısa Süreli Kampanyalı Ürün</span>
            <span className="sm:hidden">Kampanya</span>
            <span className="bg-white/20 text-white text-[9px] sm:text-[10px] px-1 py-0.2 rounded font-bold">-%20</span>
          </div>
        ) : product.isBestSeller ? (
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-stone-900/90 backdrop-blur-xs text-white text-[10px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded tracking-wide">
            En Çok Satan
          </div>
        ) : null}

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(product.id);
          }}
          aria-label={isFav ? "Favorilerden çıkar" : "Favorilere ekle"}
          className={`absolute top-2 right-2 sm:top-3 sm:right-3 z-10 w-7 h-7 sm:w-8.5 sm:h-8.5 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer shadow-sm ${
            isFav
              ? 'bg-white text-rose-600 shadow-md scale-105'
              : 'bg-white/85 backdrop-blur-xs text-stone-500 hover:text-rose-600 hover:bg-white hover:scale-105'
          }`}
          title={isFav ? "Favorilerden Çıkar" : "Favorilere Ekle"}
        >
          <Heart
            className={`w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 transition-transform duration-150 ${
              isFav ? 'fill-rose-600 text-rose-600 scale-105' : 'hover:scale-110'
            }`}
          />
        </button>

        {product.isSameDay && (
          <div className="absolute bottom-2 left-2 sm:bottom-3 sm:left-3 bg-white/95 backdrop-blur-xs text-stone-700 text-[9px] sm:text-[11px] font-medium px-1.5 sm:px-2 py-0.5 rounded shadow-xs flex items-center gap-1">
            <Clock className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-rose-600" />
            <span>Bugün Teslim</span>
          </div>
        )}
      </div>

      {/* Card Content & Metadata */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1">
        
        {/* Unboxed metadata with typographic dot separators */}
        <div className="flex items-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs text-stone-500 mb-1 sm:mb-1.5 flex-wrap">
          <span className="font-medium text-stone-600 uppercase tracking-wider text-[9px] sm:text-[11px] truncate max-w-full sm:max-w-[220px]" title={
            product.categories && product.categories.length > 0
              ? product.categories.map(c => categoryNames[c] || c).join(', ')
              : (categoryNames[product.category] || 'Buket')
          }>
            {product.categories && product.categories.length > 0
              ? product.categories.map(c => categoryNames[c] || c).join(' · ')
              : (categoryNames[product.category] || 'Buket')}
          </span>
          {product.stemCount && (
            <span className="hidden sm:inline-flex items-center gap-2">
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{product.stemCount} Dal</span>
            </span>
          )}
          {product.height && (
            <span className="hidden sm:inline-flex items-center gap-2">
              <span aria-hidden="true" className="text-stone-300">·</span>
              <span>{product.height}</span>
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 
          onClick={() => setSelectedProductDetail(product)}
          className="text-xs sm:text-base font-semibold text-stone-900 line-clamp-2 sm:line-clamp-1 leading-snug hover:text-rose-700 transition-colors cursor-pointer mb-1 sm:mb-1.5"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Product Excerpt */}
        <p className="hidden sm:line-clamp-2 text-xs text-stone-500 mb-3 leading-relaxed">
          {product.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs text-stone-600 mb-2.5 sm:mb-4">
          <div className="flex items-center text-amber-500">
            <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-400 text-amber-400" />
            <span className="ml-0.5 sm:ml-1 font-semibold tabular-nums text-stone-800">{product.rating}</span>
          </div>
          <span aria-hidden="true" className="text-stone-300">·</span>
          <span className="text-stone-400 text-[10px] sm:text-[11px] truncate">({product.reviewsCount})</span>
        </div>

        {/* Price & Primary CTA Row */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
          <div>
            <div className="flex items-baseline gap-1 sm:gap-1.5 flex-wrap">
              <span className={`text-sm sm:text-lg font-bold tabular-nums ${product.hasCampaign ? 'text-rose-700' : 'text-stone-900'}`}>
                {product.price.toLocaleString('tr-TR')} ₺
              </span>
              {product.oldPrice && (
                <span className="text-[10px] sm:text-xs text-stone-400 line-through tabular-nums">
                  {product.oldPrice.toLocaleString('tr-TR')} ₺
                </span>
              )}
              {product.hasCampaign && (
                <span className="text-[9px] sm:text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 px-1 py-0.2 rounded">
                  -%20
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] text-emerald-700 font-medium block">İzmir İçi Ücretsiz Teslimat</span>
          </div>

          <button
            onClick={() => startAddToCart(product)}
            className="w-full sm:w-auto flex items-center justify-center gap-1 sm:gap-1.5 px-2.5 sm:px-3 py-1.5 sm:py-2 bg-rose-700 hover:bg-rose-800 active:scale-97 text-white text-[11px] sm:text-xs font-semibold rounded-lg shadow-xs transition-all cursor-pointer whitespace-nowrap"
            title="Çiçeği seçip ekstra hediye ekle"
          >
            <Gift className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span>Sepete Ekle</span>
          </button>
        </div>

      </div>

    </div>
  );
};
