import React from 'react';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck, Gift } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

export const CartDrawer: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    cart,
    cartTotal,
    cartItemCount,
    updateCartItemQuantity,
    removeCartItem
  } = useShop();

  if (activeModal !== 'cart_drawer') {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-900/60 backdrop-blur-xs flex justify-end animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-5 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-700" />
            <h2 className="text-lg font-display font-semibold text-stone-900">
              Sepetim ({cartItemCount} Ürün)
            </h2>
          </div>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Bar */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-100 flex items-center gap-2 text-xs text-emerald-800">
          <Truck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">Tebrikler! İzmir içi aynı gün teslimatınız ücretsizdir.</span>
        </div>

        {/* Cart Item List */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {cart.length === 0 ? (
            <div className="py-20 text-center">
              <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-700 mb-1">Sepetiniz Boş</p>
              <p className="text-xs text-stone-400 max-w-xs mx-auto mb-6">
                İzmir atölyemizin taptaze çiçek buketlerinden sevdiklerinize bir demet seçin.
              </p>
              <button
                onClick={() => setActiveModal('none')}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
              >
                Çiçekleri İncele
              </button>
            </div>
          ) : (
            cart.map((item) => {
              const productTotal = item.product.price * item.quantity;
              const giftsTotal = item.selectedGifts.reduce((s, g) => s + (g.gift.price * g.quantity), 0);
              const itemTotal = productTotal + giftsTotal;

              return (
                <div
                  key={item.cartItemId}
                  className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-3"
                >
                  {/* Flower Info */}
                  <div className="flex gap-3">
                    <div className="w-16 h-16 rounded-lg bg-stone-200 overflow-hidden shrink-0 border border-stone-200">
                      <SafeImage
                        src={item.product.image}
                        alt={item.product.name}
                        fallbackTitle={item.product.name}
                        className="w-full h-full object-cover"
                        containerClassName="w-full h-full"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-semibold text-stone-900 leading-snug line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeCartItem(item.cartItemId)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                          title="Ürünü Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-baseline gap-2 mt-1">
                        <span className={`text-xs font-bold tabular-nums ${item.product.hasCampaign ? 'text-rose-700' : 'text-stone-900'}`}>
                          {item.product.price.toLocaleString('tr-TR')} ₺
                        </span>
                        {item.product.oldPrice && (
                          <span className="text-[11px] text-stone-400 line-through tabular-nums">
                            {item.product.oldPrice.toLocaleString('tr-TR')} ₺
                          </span>
                        )}
                        {item.product.hasCampaign && (
                          <span className="text-[10px] font-bold bg-rose-100 text-rose-700 px-1 py-0.2 rounded border border-rose-200">
                            -%20
                          </span>
                        )}
                      </div>

                      {/* Quantity Stepper */}
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center bg-white border border-stone-200 rounded-lg p-0.5">
                          <button
                            onClick={() => updateCartItemQuantity(item.cartItemId, -1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold px-2 tabular-nums">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartItemQuantity(item.cartItemId, 1)}
                            className="w-5 h-5 flex items-center justify-center text-stone-600 hover:bg-stone-100 rounded"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Attached Extra Gifts List */}
                  {item.selectedGifts.length > 0 && (
                    <div className="pt-2.5 border-t border-stone-200/80 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-800 uppercase tracking-wider">
                        <Gift className="w-3 h-3 text-rose-600" />
                        <span>Eklenen Hediyeler:</span>
                      </div>
                      {item.selectedGifts.map((g) => (
                        <div
                          key={g.gift.id}
                          className="flex items-center justify-between text-xs text-stone-600 bg-white/70 px-2.5 py-1.5 rounded-lg border border-stone-200/50"
                        >
                          <span className="line-clamp-1 flex-1 pr-2">
                            {g.quantity > 1 ? `${g.quantity}x ` : ''}{g.gift.name}
                          </span>
                          <span className="font-semibold text-stone-900 tabular-nums shrink-0">
                            +{(g.gift.price * g.quantity).toLocaleString('tr-TR')} ₺
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Item Subtotal */}
                  <div className="pt-2 border-t border-stone-200/60 flex justify-between text-xs font-semibold text-stone-800">
                    <span>Bu Paketin Toplamı:</span>
                    <span className="tabular-nums font-bold text-rose-800">
                      {itemTotal.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>

                </div>
              );
            })
          )}
        </div>

        {/* Footer Checkout Summary */}
        {cart.length > 0 && (
          <div className="p-6 border-t border-stone-200 bg-stone-50 space-y-3">
            <div className="space-y-1.5 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Ara Toplam</span>
                <span className="font-semibold text-stone-900 tabular-nums">
                  {cartTotal.toLocaleString('tr-TR')} ₺
                </span>
              </div>
              <div className="flex justify-between">
                <span>İzmir İçi Teslimat</span>
                <span className="font-semibold text-emerald-700">Ücretsiz (0 ₺)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-stone-800">Ödenecek Tutar</span>
              <span className="text-2xl font-bold text-stone-900 tabular-nums">
                {cartTotal.toLocaleString('tr-TR')} ₺
              </span>
            </div>

            <button
              onClick={() => setActiveModal('checkout')}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-700 hover:bg-rose-800 active:scale-98 text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer"
            >
              <span>Siparişi Tamamla & Adres Gir</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[11px] text-center text-stone-500">
              Kredi/Banka Kartı (Sanal POS 3D Secure) ve Havale/FAST ile güvenli ödeme.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
