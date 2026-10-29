import React, { useState } from 'react';
import { X, Plus, Minus, Check, Gift, Sparkles, ArrowRight, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SelectedGift } from '../types';
import { SafeImage } from './SafeImage';

export const ExtraGiftModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    pendingFlowerForGift,
    extraGifts,
    confirmAddToCartWithGifts
  } = useShop();

  const [selectedGiftMap, setSelectedGiftMap] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (activeModal !== 'extra_gift' || !pendingFlowerForGift) {
    return null;
  }

  const giftCategories = [
    { id: 'all', label: 'Tüm Hediyeler' },
    { id: 'cikolata', label: 'Çikolatalar' },
    { id: 'pelus', label: 'Peluş Oyuncaklar' },
    { id: 'balon', label: 'Uçan Balonlar' },
    { id: 'vazo', label: 'Vazo & Tasarım' },
    { id: 'kart', label: 'Mühürlü Kartlar' },
    { id: 'mum', label: 'Mum & Işık' }
  ];

  const filteredGifts = extraGifts.filter(g => {
    if (!g.inStock) return false;
    if (activeCategory === 'all') return true;
    return g.category === activeCategory;
  });

  const handleQuantityChange = (giftId: string, delta: number) => {
    setSelectedGiftMap(prev => {
      const current = prev[giftId] || 0;
      const nextVal = Math.max(0, current + delta);
      const updated = { ...prev };
      if (nextVal === 0) {
        delete updated[giftId];
      } else {
        updated[giftId] = nextVal;
      }
      return updated;
    });
  };

  // Calculate extra gifts total
  const selectedGiftsList: SelectedGift[] = Object.entries(selectedGiftMap).map(([id, qty]) => {
    const giftObj = extraGifts.find(g => g.id === id)!;
    return {
      gift: giftObj,
      quantity: qty
    };
  }).filter(item => item.gift && item.quantity > 0);

  const extraGiftsTotal = selectedGiftsList.reduce((sum, item) => sum + (item.gift.price * item.quantity), 0);
  const totalWithFlower = pendingFlowerForGift.price + extraGiftsTotal;
  const totalExtraItemsCount = selectedGiftsList.reduce((sum, item) => sum + item.quantity, 0);

  const handleContinueWithGifts = () => {
    confirmAddToCartWithGifts(selectedGiftsList);
    setSelectedGiftMap({});
  };

  const handleContinueWithoutGifts = () => {
    confirmAddToCartWithGifts([]);
    setSelectedGiftMap({});
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50/80 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-0.5">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Sürprizinizi Katlayın</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-medium text-stone-900">
              Çiçeğinize Özel Ekstra Hediyeler Ekleyin
            </h2>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
            title="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Flower Snapshot Bar */}
        <div className="px-6 py-3 bg-rose-50/60 border-b border-rose-100 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 border border-rose-200 bg-white">
              <SafeImage
                src={pendingFlowerForGift.image}
                alt={pendingFlowerForGift.name}
                fallbackTitle={pendingFlowerForGift.name}
                className="w-full h-full object-cover"
                containerClassName="w-full h-full"
              />
            </div>
            <div>
              <span className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                Seçtiğiniz Çiçek
              </span>
              <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">
                {pendingFlowerForGift.name}
              </h4>
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-sm font-bold text-stone-900 tabular-nums">
              {pendingFlowerForGift.price.toLocaleString('tr-TR')} ₺
            </span>
            <div className="text-[10px] text-emerald-700 font-medium">İzmir İçi Teslimat</div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="px-6 py-3 border-b border-stone-100 flex items-center gap-1.5 overflow-x-auto scrollbar-none bg-white">
          {giftCategories.map((c) => {
            const isActive = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200 hover:text-stone-900'
                }`}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Gift Cards Grid */}
        <div className="p-6 overflow-y-auto flex-1 bg-stone-50/40">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredGifts.map((gift) => {
              const currentQty = selectedGiftMap[gift.id] || 0;
              const isSelected = currentQty > 0;

              return (
                <div
                  key={gift.id}
                  className={`flex flex-col bg-white rounded-xl border p-3.5 transition-all ${
                    isSelected
                      ? 'border-rose-600 ring-1 ring-rose-600/30 shadow-xs'
                      : 'border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {/* Gift Image */}
                  <div className="relative aspect-square rounded-lg bg-stone-100 overflow-hidden mb-2.5">
                    <SafeImage
                      src={gift.image}
                      alt={gift.name}
                      fallbackTitle={gift.name}
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                    {gift.badge && (
                      <span className="absolute top-2 left-2 bg-stone-900/90 text-white text-[10px] font-medium px-2 py-0.5 rounded tracking-wide">
                        {gift.badge}
                      </span>
                    )}
                    {isSelected && (
                      <span className="absolute top-2 right-2 bg-rose-700 text-white rounded-full p-1 shadow-xs">
                        <Check className="w-3.5 h-3.5" />
                      </span>
                    )}
                  </div>

                  {/* Gift Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-semibold text-stone-900 mb-1 line-clamp-1" title={gift.name}>
                        {gift.name}
                      </h4>
                      <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed mb-3">
                        {gift.description}
                      </p>
                    </div>

                    {/* Price and Counter Action */}
                    <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                      <span className="text-sm font-bold text-stone-900 tabular-nums">
                        +{gift.price.toLocaleString('tr-TR')} ₺
                      </span>

                      {isSelected ? (
                        <div className="flex items-center gap-2 bg-stone-100 rounded-lg p-1">
                          <button
                            onClick={() => handleQuantityChange(gift.id, -1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-white text-stone-700 hover:bg-stone-200 shadow-xs transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-stone-900 px-1 tabular-nums">
                            {currentQty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(gift.id, 1)}
                            className="w-6 h-6 flex items-center justify-center rounded bg-rose-700 text-white hover:bg-rose-800 shadow-xs transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleQuantityChange(gift.id, 1)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-white bg-rose-50 hover:bg-rose-700 rounded-lg transition-colors cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Ekle</span>
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

        {/* Modal Footer Summary & Confirmations */}
        <div className="px-6 py-4 bg-white border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          <div className="flex items-baseline gap-2 text-stone-700">
            <span className="text-xs text-stone-500">Genel Toplam:</span>
            <span className="text-xl sm:text-2xl font-bold text-stone-900 tabular-nums">
              {totalWithFlower.toLocaleString('tr-TR')} ₺
            </span>
            {totalExtraItemsCount > 0 && (
              <span className="text-xs text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                +{totalExtraItemsCount} Ekstra Hediye
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleContinueWithoutGifts}
              className="flex-1 sm:flex-initial px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors cursor-pointer"
            >
              Hediyesiz Devam Et
            </button>

            <button
              onClick={handleContinueWithGifts}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-6 py-2.5 bg-rose-700 hover:bg-rose-800 active:scale-98 text-white text-xs font-semibold rounded-lg shadow-sm transition-all cursor-pointer"
            >
              <span>{totalExtraItemsCount > 0 ? 'Hediyelerle Sepete Ekle' : 'Sepete Ekle & İlerle'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
