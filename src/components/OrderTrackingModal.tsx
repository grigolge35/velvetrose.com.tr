import React, { useState } from 'react';
import { X, Search, CheckCircle2, Clock, Truck, ShieldCheck, MapPin, Package, Heart, Phone, MessageCircle, CreditCard } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import { SafeImage } from './SafeImage';

export const OrderTrackingModal: React.FC = () => {
  const {
    activeModal,
    setActiveModal,
    activeTrackingOrder,
    setActiveTrackingOrder,
    orders,
    trackOrder
  } = useShop();

  const [searchCode, setSearchCode] = useState('');
  const [searchError, setSearchError] = useState('');

  if (activeModal !== 'order_tracking') {
    return null;
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError('');
    if (!searchCode.trim()) {
      setSearchError('Lütfen bir sipariş kodu veya telefon numarası girin.');
      return;
    }

    const found = trackOrder(searchCode);
    if (!found) {
      setSearchError('Bu sipariş kodu veya telefon ile kayıtlı sipariş bulunamadı. Lütfen kontrol ediniz (Örn: IZM-3501).');
    }
  };

  const handleQuickLoadSample = () => {
    if (orders.length > 0) {
      setActiveTrackingOrder(orders[0]);
      setSearchCode(orders[0].id);
      setSearchError('');
    }
  };

  const order: Order | null = activeTrackingOrder || (orders.length > 0 ? orders[0] : null);

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'received':
        return { label: 'Sipariş Alındı', bg: 'bg-stone-100 text-stone-800' };
      case 'preparing':
        return { label: 'Atölyede Hazırlanıyor', bg: 'bg-amber-100 text-amber-800' };
      case 'courier':
        return { label: 'Özel Kurye Dağıtımda', bg: 'bg-blue-100 text-blue-800' };
      case 'delivered':
        return { label: 'Teslim Edildi', bg: 'bg-emerald-100 text-emerald-800' };
      default:
        return { label: 'İşleniyor', bg: 'bg-stone-100 text-stone-800' };
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[94vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Truck className="w-5 h-5 text-rose-700" />
            <div>
              <h2 className="text-lg sm:text-xl font-display font-semibold text-stone-900">
                Velvet Rose Canlı Sipariş Takip Sistemi
              </h2>
              <p className="text-xs text-stone-500">
                velvetrose.com.tr · İzmir atölyemizden alıcının kapısına kadar her anı adım adım izleyin.
              </p>
            </div>
          </div>

          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Quick Sample */}
        <div className="px-6 py-4 bg-white border-b border-stone-100">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="Sipariş Kodu (Örn: IZM-3501) veya Telefon Numarası..."
                className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-lg pl-9 pr-3 py-2.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-rose-600 focus:bg-white"
              />
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Siparişi Sorgula
            </button>

            {orders.length > 0 && (
              <button
                type="button"
                onClick={handleQuickLoadSample}
                className="px-3 py-2 text-xs text-rose-700 hover:text-rose-900 hover:bg-rose-50 rounded-lg border border-rose-200 transition-colors whitespace-nowrap"
              >
                Son Siparişi Göster
              </button>
            )}
          </form>

          {searchError && (
            <p className="mt-2 text-xs text-rose-600 font-medium">{searchError}</p>
          )}
        </div>

        {/* Active Order Details */}
        {order ? (
          <div className="p-6 overflow-y-auto flex-1 space-y-6">
            
            {/* Order Status Banner */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] text-stone-500 font-semibold uppercase tracking-wider block">
                  Sipariş Numarası
                </span>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xl font-bold font-mono text-stone-900 tracking-wide">
                    #{order.id}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadge(order.status).bg}`}>
                    {getStatusBadge(order.status).label}
                  </span>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-xs text-stone-500 block">Planlanan Teslimat</span>
                <span className="text-xs font-semibold text-stone-800">
                  {order.deliveryDate} · {order.deliveryTimeSlot}
                </span>
              </div>
            </div>

            {/* Stepper Timeline */}
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-4">
                Hazırlık & Teslimat Aşamaları
              </h4>

              <div className="space-y-4">
                {order.statusHistory.map((step, idx) => {
                  const isCurrent = order.status === step.status;
                  return (
                    <div key={idx} className="flex items-start gap-3.5 relative">
                      {/* Vertical line connecting steps */}
                      {idx < order.statusHistory.length - 1 && (
                        <div
                          className={`absolute left-3.5 top-7 bottom-0 w-0.5 -mb-4 ${
                            step.completed ? 'bg-emerald-500' : 'bg-stone-200'
                          }`}
                        />
                      )}

                      {/* Icon */}
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 z-10 ${
                          step.completed
                            ? 'bg-emerald-600 text-white'
                            : isCurrent
                            ? 'bg-rose-600 text-white ring-4 ring-rose-100'
                            : 'bg-stone-200 text-stone-400'
                        }`}
                      >
                        {step.completed ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span className="text-xs font-bold">{idx + 1}</span>
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 pb-3">
                        <div className="flex items-baseline justify-between gap-2">
                          <h5
                            className={`text-xs font-semibold ${
                              isCurrent ? 'text-rose-800 font-bold' : 'text-stone-900'
                            }`}
                          >
                            {step.title}
                          </h5>
                          <span className="text-[11px] text-stone-400 tabular-nums font-mono">
                            {step.timestamp}
                          </span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Exact Product Delivery Guarantee (Müşteri gördüğü ürünü alacak) */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200/90 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-semibold text-stone-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Birebir Görseldeki Ürün Teslimat Güvencesi</span>
                </div>
                <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded border border-emerald-200">
                  %100 Tasarım Garantisi
                </span>
              </div>

              <div className="flex items-center gap-3.5 bg-white p-3 rounded-lg border border-stone-200">
                {order.items[0]?.product.image && (
                  <div className="w-16 h-16 rounded-md bg-stone-100 overflow-hidden shrink-0 border border-stone-200">
                    <SafeImage
                      src={order.items[0].product.image}
                      alt={order.items[0].product.name}
                      fallbackTitle="Sipariş Edilen Çiçek"
                      className="w-full h-full object-cover"
                      containerClassName="w-full h-full"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0 text-xs">
                  <div className="font-semibold text-stone-900 truncate">
                    {order.items[0]?.product.name || 'Özel Tasarım Çiçek'}
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5 leading-relaxed">
                    Sitede inceleyip sipariş verdiğiniz tasarım, çiçek türü, adedi ve aksesuarları birebir korunarak özenle hazırlanmakta ve teslim edilmektedir.
                  </p>
                </div>
              </div>
            </div>

            {/* Recipient & Address Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex items-center gap-1.5 font-bold text-stone-900 uppercase tracking-wider mb-2">
                  <MapPin className="w-3.5 h-3.5 text-rose-700" />
                  <span>Teslimat Adresi</span>
                </div>
                <div><span className="text-stone-500">İl:</span> <span className="font-semibold">{order.deliveryAddress.city}</span></div>
                <div><span className="text-stone-500">İlçe / Mahalle:</span> <span className="font-semibold">{order.deliveryAddress.district} / {order.deliveryAddress.neighborhood} Mah.</span></div>
                <div><span className="text-stone-500">Açık Adres:</span> <span className="font-semibold">{order.deliveryAddress.streetAddress} {order.deliveryAddress.buildingNo ? `No:${order.deliveryAddress.buildingNo}` : ''} {order.deliveryAddress.apartmentNo ? `D:${order.deliveryAddress.apartmentNo}` : ''}</span></div>
                {order.deliveryAddress.addressDescription && (
                  <div className="text-[11px] text-stone-500 italic mt-1">
                    Tarif: {order.deliveryAddress.addressDescription}
                  </div>
                )}
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1.5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5 font-bold text-stone-900 uppercase tracking-wider">
                    <Heart className="w-3.5 h-3.5 text-rose-700" />
                    <span>Alıcı & Hediye Kartı Notu</span>
                  </div>
                  <span className="text-[10px] text-rose-800 font-bold bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Baskılı Kart
                  </span>
                </div>
                <div><span className="text-stone-500">Alıcı:</span> <span className="font-semibold">{order.recipient.name} ({order.recipient.phone})</span></div>
                <div><span className="text-stone-500">Gönderici:</span> <span className="font-semibold">{order.sender.isAnonymous ? 'Gizli Gönderim (Anonim)' : order.sender.name}</span></div>
                
                {/* Gift Note card block */}
                <div className="pt-2">
                  <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block mb-1">
                    Baskıya Alınan Hediye Notu (Gift Note):
                  </span>
                  <div className="p-3.5 rounded-xl border border-stone-200 bg-white text-stone-900 shadow-2xs">
                    <p className="italic font-serif leading-relaxed text-xs sm:text-sm text-stone-800">
                      "{order.cardNote || 'Sevdikleriniz için özel hazırlandı.'}"
                    </p>
                    <div className="pt-2.5 mt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                      <span className="font-serif font-bold tracking-wider text-rose-900 text-[11px]">
                        Velvet Rose
                      </span>
                      <span className="font-serif italic font-semibold text-stone-700">
                        — {order.cardSenderName || (order.sender.isAnonymous ? 'Gizli Gönderici' : order.sender.name)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Ordered Items Summary */}
            <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
              <div className="bg-stone-100 px-4 py-2 font-semibold text-stone-800">
                Sipariş Edilen Çiçek ve Hediyeler
              </div>
              <div className="p-4 space-y-3 bg-white">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-stone-900">{item.product.name}</span>
                      <span className="text-stone-500 ml-2 font-mono">x{item.quantity}</span>
                      {item.selectedGifts.length > 0 && (
                        <div className="text-[11px] text-stone-500 pl-2 mt-0.5">
                          Ekstra Hediyeler: {item.selectedGifts.map(g => `${g.quantity}x ${g.gift.name}`).join(', ')}
                        </div>
                      )}
                    </div>
                    <span className="font-bold text-stone-900 tabular-nums">
                      {order.totalAmount.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                ))}

                <div className="pt-2.5 mt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-600">
                  <span className="flex items-center gap-1.5 font-medium">
                    <CreditCard className="w-3.5 h-3.5 text-rose-700" />
                    <span>Ödeme Yöntemi & Durumu:</span>
                  </span>
                  <span className="font-semibold text-stone-900">
                    {order.paymentMethod === 'credit_card'
                      ? `${order.paymentGateway === 'ziraat' ? 'Ziraat Bankası Sanal POS (3D Secure)' : 'PayTR Sanal POS (3D Secure)'}${order.installment && order.installment > 1 ? ` · ${order.installment} Taksit` : ' · Tek Çekim'}`
                      : order.paymentMethod === 'bank_transfer'
                      ? 'Havale & EFT / FAST Transferi'
                      : 'Kapıda Ödeme (Eski Sipariş)'}
                  </span>
                </div>
              </div>
            </div>

            {/* Courier / Florist Hotline */}
            <div className="p-4 bg-stone-900 text-white rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-rose-700 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h5 className="text-xs font-semibold">Özel Çiçekçi Destek Hattı</h5>
                  <p className="text-[11px] text-stone-300">
                    Siparişinizle ilgili anında bilgi almak için İzmir Bornova atölyemizle görüşün.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/905325138658"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap"
              >
                <MessageCircle className="w-4 h-4" />
                <span>WhatsApp: 0532 513 86 58</span>
              </a>
            </div>

          </div>
        ) : (
          <div className="p-12 text-center">
            <Package className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h4 className="text-sm font-semibold text-stone-800">Kayıtlı Sipariş Bulunamadı</h4>
            <p className="text-xs text-stone-400 mt-1">
              Lütfen arama çubuğuna sipariş kodunuzu yazarak sorgulayın.
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
