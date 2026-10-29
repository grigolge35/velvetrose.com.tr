import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(true);

  const whatsappUrl = "https://wa.me/905325138658?text=Merhaba%2C%20Velvet%20Rose%20%C3%A7i%C3%A7ek%20sipari%C5%9Fi%20veya%20sorum%20hakk%C4%B1nda%20bilgi%20almak%20istiyorum.";

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {/* Expandable Friendly Tooltip */}
      {showTooltip && (
        <div className="relative bg-white text-stone-800 text-xs py-2 px-3.5 rounded-xl shadow-lg border border-stone-200 flex items-center gap-2 max-w-xs animate-in fade-in slide-in-from-bottom-2 duration-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-medium text-[11px] leading-tight">
            Sorunuz mu var? <strong className="text-emerald-700">WhatsApp</strong> ile anında danışın veya hızlı sipariş verin.
          </span>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-stone-400 hover:text-stone-600 p-0.5 rounded ml-1 shrink-0"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          
          {/* Arrow pointing down */}
          <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-white border-r border-b border-stone-200 rotate-45" />
        </div>
      )}

      {/* Primary Floating Action Button */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noreferrer"
        className="group flex items-center gap-2.5 px-4 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full shadow-xl hover:shadow-2xl transition-all duration-200 active:scale-95 cursor-pointer"
        aria-label="WhatsApp ile Destek Al"
      >
        <MessageCircle className="w-5 h-5 fill-white text-[#25D366]" />
        <span className="text-xs font-bold whitespace-nowrap tracking-tight">
          WhatsApp ile Destek Al
        </span>
      </a>
    </div>
  );
};
