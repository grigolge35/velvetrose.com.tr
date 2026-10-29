import React from 'react';
import { X, Calendar, User, Clock, ArrowRight } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

export const ArticleModal: React.FC = () => {
  const { activeModal, setActiveModal, selectedArticle } = useShop();

  if (activeModal !== 'article_detail' || !selectedArticle) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 bg-white flex items-center justify-between">
          <span className="text-xs font-semibold text-rose-800 uppercase tracking-wider">
            Velvet Rose Botanik Kılavuzu (velvetrose.com.tr)
          </span>
          <button
            onClick={() => setActiveModal('none')}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          <div>
            <div className="flex items-center gap-3 text-xs text-stone-400 mb-2">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {selectedArticle.date}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1 text-stone-600">
                <User className="w-3.5 h-3.5" />
                {selectedArticle.author}
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {selectedArticle.readTime}
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl font-display font-medium text-stone-900 leading-snug">
              {selectedArticle.title}
            </h1>
          </div>

          <div className="aspect-[16/9] rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
            <SafeImage
              src={selectedArticle.image}
              alt={selectedArticle.title}
              fallbackTitle={selectedArticle.title}
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-stone-700 leading-relaxed">
            {selectedArticle.content.map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          {/* Keywords Tagging for SEO relevance */}
          <div className="pt-4 border-t border-stone-100">
            <span className="text-xs font-semibold text-stone-500 block mb-2">
              İlgili Anahtar Kelimeler & Konular:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {selectedArticle.keywords.map((kw, i) => (
                <span key={i} className="text-xs text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md">
                  #{kw}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between">
          <span className="text-xs text-stone-500">
            İzmir Bornova atölyemizden adrese teslim taze çiçekler
          </span>
          <button
            onClick={() => setActiveModal('none')}
            className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
          >
            <span>Koleksiyonu İncele</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
