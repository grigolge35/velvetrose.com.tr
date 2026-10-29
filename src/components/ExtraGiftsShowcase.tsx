import React from 'react';
import { Gift, Sparkles, Check, Heart, Plus } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

export const ExtraGiftsShowcase: React.FC = () => {
  const { extraGifts, setActiveModal } = useShop();

  return (
    <section id="ekstra-hediyeler" className="py-14 bg-stone-100/60 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-1">
              <Gift className="w-3.5 h-3.5 text-rose-600" />
              <span>Sürprizi Taçlandırın</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 tracking-tight">
              Çiçeğinize Eşlik Edecek Ekstra Hediyeler
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-xl">
              Beğendiğiniz çiçeği sepete eklediğiniz anda karşınıza çıkan hediye seçimi ekranından 
              aşağıdaki gurme lezzetleri, peluşları ve balonları tek tıkla bukete dahil edebilirsiniz.
            </p>
          </div>

          <div className="text-xs text-stone-500 bg-white px-3.5 py-2 rounded-xl border border-stone-200 shrink-0">
            <span className="font-semibold text-stone-800">Dükkanımızdan taze temin:</span> Çikolatalar, peluşlar & balonlar
          </div>
        </div>

        {/* Gifts Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {extraGifts.map((gift) => (
            <div
              key={gift.id}
              className="bg-white rounded-xl border border-stone-200/90 overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="relative aspect-square bg-stone-50 overflow-hidden">
                <SafeImage
                  src={gift.image}
                  alt={gift.name}
                  fallbackTitle={gift.name}
                  className="w-full h-full object-cover hover:scale-104 transition-transform duration-300"
                  containerClassName="w-full h-full"
                />
                {gift.badge && (
                  <span className="absolute top-2.5 left-2.5 bg-stone-900/90 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    {gift.badge}
                  </span>
                )}
              </div>

              <div className="p-4 flex flex-col flex-1 justify-between">
                <div>
                  <span className="text-[10px] text-stone-400 uppercase font-semibold tracking-wider block mb-1">
                    {gift.category === 'cikolata' ? 'Gurme Çikolata' :
                     gift.category === 'pelus' ? 'Yumuşak Peluş' :
                     gift.category === 'balon' ? 'Helyum Balon' :
                     gift.category === 'vazo' ? 'Özel Vazo' :
                     gift.category === 'kart' ? 'El Yazılı Kart' : 'Mum & Ambiyans'}
                  </span>
                  <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1 mb-1" title={gift.name}>
                    {gift.name}
                  </h4>
                  <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                    {gift.description}
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-stone-900 tabular-nums">
                    +{gift.price.toLocaleString('tr-TR')} ₺
                  </span>
                  <span className="text-[10px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded">
                    Buketle Birlikte
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
