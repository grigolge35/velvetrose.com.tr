import React, { useState, useRef } from 'react';
import { Phone, Mail, MapPin, Clock, Truck, ShieldCheck, Heart, MessageCircle, Instagram } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveModal, setSelectedCategory, activeDistricts } = useShop();
  const [clickCount, setClickCount] = useState(0);
  const clickTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleDiscreetAdminTrigger = () => {
    setClickCount((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        setActiveModal('admin');
        return 0;
      }
      if (clickTimerRef.current) clearTimeout(clickTimerRef.current);
      clickTimerRef.current = setTimeout(() => {
        setClickCount(0);
      }, 1500);
      return next;
    });
  };

  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          
          {/* Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <a 
              href="#" 
              className="inline-block hover:opacity-90 transition-opacity"
              title="Velvet Rose – İzmir"
            >
              <img
                src="/assets/aistudio/velvet-rose-premium-logo_a1210b70.png"
                alt="Velvet Rose Çiçek Tasarım Atölyesi"
                className="h-20 sm:h-24 md:h-28 w-auto object-contain max-w-[260px] sm:max-w-[320px] drop-shadow-lg"
              />
            </a>
            <p className="text-xs text-stone-400 leading-relaxed max-w-sm">
              Velvet Rose (velvetrose.com.tr) - İzmir’in yerel butik çiçek tasarım atölyesi. Dükkanımızda siparişe özel taze tanzim edilen güller, orkideler, şakayıklar ve seçkin hediyeleri aynı gün İzmir’in tüm ilçelerine kendi özel kuryelerimizle ulaştırıyoruz.
            </p>
            
            <div className="pt-2 space-y-2 text-xs text-stone-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Gediz caddesi no: 3/1D Bornova / İZMİR</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="tel:+905325138658" className="hover:text-white transition-colors">
                  0532 513 86 58
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <a href="mailto:velvetroseizmir@gmail.com" className="hover:text-white transition-colors">
                  velvetroseizmir@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Instagram className="w-4 h-4 text-rose-400 shrink-0" />
                <a
                  href="https://instagram.com/velvetrosee35"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-rose-300 transition-colors flex items-center gap-1 font-medium text-stone-300"
                >
                  <span>@velvetrosee35</span>
                  <span className="text-[10px] text-stone-500">(Instagram)</span>
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Haftanın 7 Günü: 08:30 – 22:00 Açık</span>
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://wa.me/905325138658?text=Merhaba%2C%20Velvet%20Rose%20%C3%A7i%C3%A7ek%20sipari%C5%9Fi%20veya%20sorum%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
                <span>WhatsApp: 0532 513 86 58</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          {/* Quick Occasion Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Gönderim Amacına Göre
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('dogum_gunu');
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🎂 Doğum Günü Çiçekleri
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('yildonumu');
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  💍 Evlilik Yıldönümü Çiçekleri
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('ask_romantik');
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  ❤️ Aşk & Sevgiliye Çiçekler
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('yeni_is');
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  💼 Yeni İş & Tebrik Çiçekleri
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('ozel_tasarim_celenk');
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🎗️ Özel Tasarım & Çelenk
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('gecmis_olsun');
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🌿 Geçmiş Olsun Çiçekleri
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setSelectedCategory('ozur');
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  🕊️ Özür Dilerim & Barışma
                </button>
              </li>
            </ul>
          </div>

          {/* District SEO Links (Dinamik Aktif Teslimat Bölgeleri) */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>İzmir Teslimat Bölgeleri</span>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                {activeDistricts.length} Aktif
              </span>
            </h4>
            {activeDistricts.length > 0 ? (
              <ul className="space-y-2 text-xs text-stone-400">
                {activeDistricts.slice(0, 6).map((d) => (
                  <li key={d.id} className="flex items-center justify-between">
                    <a
                      href="#izmir-teslimat"
                      className="text-stone-300 hover:text-white transition-colors truncate pr-2 font-medium"
                    >
                      {d.name} Çiçek Siparişi
                    </a>
                    <span className="text-[10px] text-stone-500 shrink-0 font-mono">
                      {d.deliveryFee === 0 ? 'Ücretsiz' : `+${d.deliveryFee} ₺`}
                    </span>
                  </li>
                ))}
                {activeDistricts.length > 6 && (
                  <li className="pt-1">
                    <a href="#izmir-teslimat" className="text-rose-400 hover:underline text-[11px] font-semibold">
                      + Diğer {activeDistricts.length - 6} Açık Bölgeyi Gör →
                    </a>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-stone-500 italic">
                Tüm teslimat bölgeleri şu an kapalıdır.
              </p>
            )}
          </div>

          {/* Customer Self-Service */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">
              Müşteri & Sipariş
            </h4>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActiveModal('order_tracking')}
                  className="text-rose-400 font-semibold hover:underline flex items-center gap-1.5 cursor-pointer"
                >
                  <Truck className="w-3.5 h-3.5" />
                  Siparişimi Takip Et
                </button>
              </li>
              <li>
                <a href="#cicek-rehberi" className="hover:text-white transition-colors">
                  Çiçek Bakım Rehberi & İpuçları
                </a>
              </li>
              <li className="pt-2 text-[11px] text-stone-500">
                %100 Taze Kesim Çiçek & Güvenli Teslimat Garantisi
              </li>
            </ul>
          </div>

        </div>

        {/* WhatsApp Live Support & Quick Order Strip */}
        <div className="my-8 p-5 rounded-2xl bg-stone-800/80 border border-stone-700/80 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 text-center md:text-left">
            <div className="w-10 h-10 rounded-full bg-[#25D366]/20 text-[#25D366] flex items-center justify-center shrink-0">
              <MessageCircle className="w-5 h-5 fill-current" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                Özel Tasarım Çiçek veya Hızlı Sipariş mi Vermek İstiyorsunuz?
              </h4>
              <p className="text-xs text-stone-400 mt-0.5">
                Bornova çiçek atölyemize WhatsApp üzerinden anında yazabilir, özel sipariş detayları ve teslimat saatleri hakkında bilgi alabilirsiniz.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/905325138658?text=Merhaba%2C%20Velvet%20Rose%20%C3%A7i%C3%A7ek%20sipari%C5%9Fi%20veya%20sorum%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum."
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold rounded-xl transition-all shadow-md active:scale-98 whitespace-nowrap cursor-pointer shrink-0"
          >
            <MessageCircle className="w-4 h-4 fill-white text-[#25D366]" />
            <span>WhatsApp: 0532 513 86 58</span>
          </a>
        </div>

        {/* Bottom Bar: Clean copyright, developer credit, and unboxed metadata */}
        <div className="pt-8 border-t border-stone-800/80 mt-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div
            onClick={handleDiscreetAdminTrigger}
            onDoubleClick={() => setActiveModal('admin')}
            className="cursor-default select-none transition-colors hover:text-stone-400 text-center md:text-left"
            title=""
          >
            © {new Date().getFullYear()} Velvet Rose (velvetrose.com.tr) · Tüm hakları saklıdır.
          </div>

          <div className="text-center">
            <a
              href="https://devstudioyazilim.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 group transition-all hover:scale-105"
            >
              <span className="text-stone-400 group-hover:text-stone-300">Site Tasarımı:</span>
              <span className="font-extrabold tracking-wide bg-gradient-to-r from-pink-500 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent group-hover:brightness-125">
                DEVSTUDIO YAZILIM
              </span>
            </a>
          </div>

          <div className="flex items-center gap-2 justify-center md:justify-end">
            <span>İzmir / Türkiye</span>
            <span aria-hidden="true">·</span>
            <span>velvetrose.com.tr</span>
            <span aria-hidden="true">·</span>
            <span>Bornova Atölyesi</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
