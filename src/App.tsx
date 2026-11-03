import React from 'react';
import { AppProvider, useApp } from './context/AppContext.js';
import { Header } from './components/common/Header.js';
import { Footer } from './components/common/Footer.js';
import { LandingPage } from './components/landing/LandingPage.js';
import { CustomerMenu } from './components/customer/CustomerMenu.js';
import { OwnerDashboard } from './components/owner/OwnerDashboard.js';
import { SuperAdminDashboard } from './components/admin/SuperAdminDashboard.js';
import { SuperAdminLogin } from './components/admin/SuperAdminLogin.js';

const MainContent: React.FC = () => {
  const { currentView, isSuperAdminAuthenticated } = useApp();

  const isIsolatedView = currentView === 'CUSTOMER_MENU' || currentView === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5ED]">
      {!isIsolatedView && <Header />}

      <div className="flex-1">
        {currentView === 'LANDING' && <LandingPage />}
        {currentView === 'CUSTOMER_MENU' && <CustomerMenu />}
        {currentView === 'OWNER_DASHBOARD' && <OwnerDashboard />}
        {currentView === 'SUPER_ADMIN' && (
          isSuperAdminAuthenticated ? <SuperAdminDashboard /> : <SuperAdminLogin />
        )}
      </div>

      {!isIsolatedView && <Footer />}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
