import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

export const ScrollNavButtons: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed bottom-5 left-4 sm:bottom-6 sm:left-6 z-40 flex flex-col gap-2">
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Sayfanın en üstüne git"
        title="En Üste Çık"
        className="w-10 h-10 rounded-full bg-white/95 hover:bg-rose-700 text-stone-700 hover:text-white border border-stone-200 hover:border-rose-700 shadow-lg backdrop-blur-xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <ArrowUp className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={scrollToBottom}
        aria-label="Sayfanın en altına git"
        title="En Alta İn"
        className="w-10 h-10 rounded-full bg-white/95 hover:bg-rose-700 text-stone-700 hover:text-white border border-stone-200 hover:border-rose-700 shadow-lg backdrop-blur-xs flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
      >
        <ArrowDown className="w-4 h-4" />
      </button>
    </div>
  );
};
