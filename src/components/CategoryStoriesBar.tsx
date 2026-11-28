import React from 'react';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

interface CategoryStoryItem {
  id: string;
  label: string;
  image: string;
  badge?: string;
}

const CATEGORY_STORIES: CategoryStoryItem[] = [
  {
    id: 'all',
    label: 'Tüm Ürünler',
    image: 'https://images.pexels.com/photos/30742308/pexels-photo-30742308.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'dogum_gunu',
    label: 'Doğum Günü',
    image: 'https://images.pexels.com/photos/15535847/pexels-photo-15535847.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'yildonumu',
    label: 'Evlilik Yıldönümü',
    image: 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ask_romantik',
    label: 'Aşk & Sevgiliye',
    image: 'https://images.pexels.com/photos/20621378/pexels-photo-20621378.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'yeni_is',
    label: 'Yeni İş & Tebrik',
    image: 'https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ozel_tasarim_celenk',
    label: 'Özel Tasarım & Çelenk',
    image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'gecmis_olsun',
    label: 'Geçmiş Olsun',
    image: 'https://images.unsplash.com/photo-1597848212624-a19eb35e2651?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'ozur',
    label: 'Özür & Barışma',
    image: 'https://images.pexels.com/photos/39243788/pexels-photo-39243788.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'icimden_geldi',
    label: 'İçimden Geldi',
    image: 'https://images.pexels.com/photos/30020993/pexels-photo-30020993.jpeg?auto=compress&cs=tinysrgb&w=400',
  },
  {
    id: 'kampanya',
    label: 'Kampanyadaki Ürünler',
    image: 'https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?auto=format&fit=crop&w=400&q=80',
    badge: '-%20',
  },
];

export const CategoryStoriesBar: React.FC = () => {
  const { selectedCategory, setSelectedCategory } = useShop();

  const handleSelect = (id: string) => {
    setSelectedCategory(id);
    const el = document.getElementById('koleksiyon');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      aria-label="Gönderim Amacına Göre Kategoriler"
      className="bg-white border-b border-stone-100 pt-5 pb-4 sm:pt-7 sm:pb-5"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-start gap-3 sm:gap-4 lg:justify-between overflow-x-auto pb-2 snap-x scrollbar-thin">
          {CATEGORY_STORIES.map((cat) => {
            const isActive = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleSelect(cat.id)}
                className="group flex flex-col items-center shrink-0 w-[76px] sm:w-[96px] snap-start cursor-pointer focus:outline-none"
              >
                <div
                  className={`relative w-[72px] h-[72px] sm:w-[88px] sm:h-[88px] rounded-2xl p-1.5 transition-all duration-200 flex items-center justify-center ${
                    isActive
                      ? 'bg-rose-100 ring-2 ring-rose-700 shadow-sm scale-[1.03]'
                      : 'bg-[#dff5dc]/80 group-hover:bg-[#d1f0cd] group-hover:-translate-y-0.5 shadow-2xs'
                  }`}
                >
                  <div className="w-full h-full rounded-xl overflow-hidden bg-white">
                    <SafeImage
                      src={cat.image}
                      alt={cat.label}
                      fallbackTitle={cat.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      containerClassName="w-full h-full"
                    />
                  </div>

                  {cat.badge && (
                    <span className="absolute -top-1.5 -right-1.5 bg-rose-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full shadow-sm">
                      {cat.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`mt-2 text-[11px] sm:text-xs text-center leading-tight line-clamp-2 transition-colors ${
                    isActive
                      ? 'font-bold text-rose-800'
                      : 'font-medium text-stone-700 group-hover:text-stone-950'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};
