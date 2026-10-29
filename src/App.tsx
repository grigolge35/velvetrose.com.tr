/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { ShopProvider, useShop } from './context/ShopContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProductGrid } from './components/ProductGrid';
import { ExtraGiftsShowcase } from './components/ExtraGiftsShowcase';
import { SeoArticlesSection } from './components/SeoArticlesSection';
import { Footer } from './components/Footer';
import { ExtraGiftModal } from './components/ExtraGiftModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderTrackingModal } from './components/OrderTrackingModal';
import { AdminPanelModal } from './components/AdminPanelModal';
import { ProductDetailModal } from './components/ProductDetailModal';
import { ArticleModal } from './components/ArticleModal';
import { WhatsAppFloatingButton } from './components/WhatsAppFloatingButton';

function AppContent() {
  const { setActiveModal } = useShop();

  useEffect(() => {
    // Secret keyboard shortcut: Ctrl + Shift + A or Alt + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) ||
        (e.altKey && (e.key === 'a' || e.key === 'A'))
      ) {
        e.preventDefault();
        setActiveModal('admin');
      }
    };

    // Secret URL detection (#admin or ?admin=1 / ?yonetim=1)
    const checkUrl = () => {
      const hash = window.location.hash.toLowerCase();
      const search = window.location.search.toLowerCase();
      if (
        hash === '#admin' ||
        hash === '#yonetim' ||
        search.includes('admin=') ||
        search.includes('yonetim=')
      ) {
        setActiveModal('admin');
      }
    };

    checkUrl();
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', checkUrl);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', checkUrl);
    };
  }, [setActiveModal]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFA] text-[#1C1917]">
      {/* Navigation */}
      <Navbar />

      {/* Main Content Sections */}
      <main className="flex-1">
        <HeroSection />
        <ProductGrid />
        <ExtraGiftsShowcase />
        <SeoArticlesSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Floating WhatsApp Quick Support Widget */}
      <WhatsAppFloatingButton />

      {/* All Interactive Modals & Drawers */}
      <ExtraGiftModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderTrackingModal />
      <AdminPanelModal />
      <ProductDetailModal />
      <ArticleModal />
    </div>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
