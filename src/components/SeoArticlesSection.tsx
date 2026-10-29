import React, { useState } from 'react';
import { BookOpen, MapPin, ChevronDown, ChevronUp, Sparkles, Clock, CheckCircle2 } from 'lucide-react';
import { SEO_ARTICLES, SEO_FAQS } from '../data/seoArticles';
import { IZMIR_DISTRICTS } from '../data/izmirDistricts';
import { Article } from '../types';
import { useShop } from '../context/ShopContext';
import { SafeImage } from './SafeImage';

export const SeoArticlesSection: React.FC = () => {
  const { setSelectedArticle, setActiveModal, activeDistricts, setSelectedDistrictFilter } = useShop();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  const handleReadArticle = (article: Article) => {
    setSelectedArticle(article);
    setActiveModal('article_detail');
  };

  return (
    <section id="cicek-rehberi" className="py-16 bg-stone-50 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* PART 1: SEO EDITORIAL ARTICLES */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-1">
              <BookOpen className="w-3.5 h-3.5 text-rose-600" />
              <span>Velvet Rose Botanik & Yaşam (velvetrose.com.tr)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-medium text-stone-900 tracking-tight">
              İzmir Çiçek Siparişi & Bakım Kılavuzu
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-2">
              Çiçeklerin ömrünü uzatan profesyonel sırlar, özel gün tüyoları ve İzmir ilçelerine teslimat tavsiyeleri.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SEO_ARTICLES.map((article) => (
              <article
                key={article.id}
                onClick={() => handleReadArticle(article)}
                className="group flex flex-col bg-white rounded-xl border border-stone-200 overflow-hidden hover:shadow-md transition-all cursor-pointer"
              >
                <div className="relative aspect-[16/9] bg-stone-100 overflow-hidden">
                  <SafeImage
                    src={article.image}
                    alt={article.title}
                    fallbackTitle={article.title}
                    className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                    containerClassName="w-full h-full"
                  />
                  <div className="absolute bottom-2 left-2 bg-stone-900/80 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                    {article.readTime}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
                    <span>{article.date}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-stone-600">{article.author}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-semibold text-stone-900 group-hover:text-rose-700 transition-colors line-clamp-2 mb-2 leading-snug">
                    {article.title}
                  </h3>

                  <p className="text-xs text-stone-500 line-clamp-3 leading-relaxed mb-4">
                    {article.excerpt}
                  </p>

                  <div className="mt-auto pt-3 border-t border-stone-100 flex items-center justify-between">
                    <span className="text-xs font-semibold text-rose-800 group-hover:underline">
                      Rehberi Oku →
                    </span>

                    <div className="flex items-center gap-1">
                      {article.keywords.slice(0, 2).map((k, i) => (
                        <span key={i} className="text-[10px] text-stone-400">
                          #{k.replace(/\s+/g, '')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* PART 2: IZMIR DISTRICTS COVERAGE MATRIX (DİNAMİK TESLİMAT AĞI) */}
        <div id="izmir-teslimat" className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 tracking-wider uppercase mb-1">
                <MapPin className="w-3.5 h-3.5 text-rose-600" />
                <span>Bölgesel Teslimat Ağı</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display font-medium text-stone-900">
                {activeDistricts.length === 30 
                  ? 'İzmir’in Tüm İlçelerine Aynı Gün Kendi Kuryelerimizle'
                  : `Aktif Teslimat Ağımız (${activeDistricts.length} İlçe) · Aynı Gün Adrese Teslim`}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Gediz Caddesi Bornova merkez atölyemizden klimalı özel araçlarla yola çıkan çiçekleriniz solmadan ve formu bozulmadan adrese ulaştırılır.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs shrink-0">
              <span className="px-3 py-1.5 bg-emerald-50 text-emerald-800 font-bold rounded-full border border-emerald-200 flex items-center gap-1.5 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>{activeDistricts.length} Aktif Teslimat Bölgesi</span>
              </span>
            </div>
          </div>

          {activeDistricts.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 text-xs">
              {activeDistricts.map((dist) => (
                <div
                  key={dist.id}
                  onClick={() => {
                    setSelectedDistrictFilter(dist.id);
                    const el = document.getElementById('koleksiyon');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 hover:border-rose-400 hover:bg-rose-50/20 hover:shadow-xs transition-all flex flex-col justify-between cursor-pointer group"
                  title={`${dist.name} çiçek tasarımlarını inceleyin`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-1.5 gap-1">
                      <span className="font-bold text-stone-900 group-hover:text-rose-800 transition-colors truncate">
                        {dist.name}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100 shrink-0">
                        {dist.deliveryFee === 0 ? 'Ücretsiz' : `+${dist.deliveryFee} ₺`}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-500 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-stone-400" />
                      <span>{dist.estimatedMinutes}</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-stone-400 truncate mt-2.5 pt-1.5 border-t border-stone-200/60 flex items-center justify-between">
                    <span>📍 {dist.neighborhoods.length} Mahalle</span>
                    <span className="text-rose-700 opacity-0 group-hover:opacity-100 font-semibold transition-opacity">
                      Seç →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-200 text-stone-600 text-xs space-y-1">
              <p className="font-semibold text-stone-800 text-sm">
                ⚠️ Şu anda tüm teslimat bölgelerimiz geçici olarak siparişe kapatılmıştır.
              </p>
              <p className="text-stone-500">
                Özel teslimat talepleri ve sorularınız için lütfen WhatsApp hattımız üzerinden iletişime geçiniz.
              </p>
            </div>
          )}
        </div>

        {/* PART 3: SEO FREQUENTLY ASKED QUESTIONS (FAQ) */}
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-xl sm:text-2xl font-display font-medium text-stone-900">
              Sıkça Sorulan Sorular
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              İzmir çiçek siparişi hakkında en çok merak edilen detaylar
            </p>
          </div>

          <div className="space-y-3">
            {SEO_FAQS.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl border border-stone-200 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 hover:bg-stone-50/60 transition-colors cursor-pointer"
                  >
                    <span className="text-xs sm:text-sm font-semibold text-stone-900">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-stone-500 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-4 text-xs text-stone-600 leading-relaxed border-t border-stone-100 pt-3">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
