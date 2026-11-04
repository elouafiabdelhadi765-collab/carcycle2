import React, { useEffect } from 'react';
import { useAppStore } from './store/useAppStore';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { Toast } from './components/common/Toast';

// Client screens
import { ClientHome } from './components/client/ClientHome';
import { CategoryExploreView } from './components/client/CategoryExploreView';
import { PharmacyDetailView } from './components/client/PharmacyDetailView';
import { ClientOrdersView } from './components/client/ClientOrdersView';
import { ClientProfileView } from './components/client/ClientProfileView';
import { CartDrawer } from './components/client/CartDrawer';
import { CheckoutModal } from './components/client/CheckoutModal';
import { ProductDetailModal } from './components/client/ProductDetailModal';
import { QrScannerModal } from './components/client/QrScannerModal';

// Merchant screens
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { DlcUrgencyView } from './components/merchant/DlcUrgencyView';
import { MerchantProductsView } from './components/merchant/MerchantProductsView';
import { MerchantOrdersView } from './components/merchant/MerchantOrdersView';
import { MerchantSettingsView } from './components/merchant/MerchantSettingsView';
import { MerchantReviewsView } from './components/merchant/MerchantReviewsView';
import { ValidationRetraitModal } from './components/merchant/ValidationRetraitModal';
import { MerchantQrPosterModal } from './components/merchant/MerchantQrPosterModal';
import { ProductFormModal } from './components/merchant/ProductFormModal';
import { AuthModal } from './components/auth/AuthModal';

export const App: React.FC = () => {
  const { role, currentTab, initSupabaseSync, activeModal, setActiveModal } = useAppStore();

  useEffect(() => {
    // Automatically initialize live Supabase sync when app starts
    initSupabaseSync();
  }, [initSupabaseSync]);

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1E2A28] flex flex-col antialiased">
      {/* Navigation Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {role === 'client' ? (
          <>
            {currentTab === 'home' && <ClientHome />}
            {currentTab === 'explore' && <CategoryExploreView />}
            {currentTab === 'pharmacies' && <PharmacyDetailView />}
            {currentTab === 'orders' && <ClientOrdersView />}
            {currentTab === 'profile' && <ClientProfileView />}
          </>
        ) : (
          <>
            {currentTab === 'dashboard' && <MerchantDashboard />}
            {currentTab === 'dlc' && <DlcUrgencyView />}
            {currentTab === 'products' && <MerchantProductsView />}
            {currentTab === 'orders' && <MerchantOrdersView />}
            {currentTab === 'settings' && <MerchantSettingsView />}
            {currentTab === 'reviews' && <MerchantReviewsView />}
          </>
        )}
      </main>

      {/* Modals & Drawers */}
      <CartDrawer />
      <CheckoutModal />
      <ProductDetailModal />
      <QrScannerModal />
      <ValidationRetraitModal />
      <MerchantQrPosterModal />
      {activeModal === 'add-product' && (
        <ProductFormModal onClose={() => setActiveModal(null)} />
      )}
      <AuthModal />

      {/* Global Toast */}
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default App;
