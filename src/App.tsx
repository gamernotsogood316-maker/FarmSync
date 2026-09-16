import React, { useState, useEffect } from 'react';
import { ScreenId } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { BuyCropsScreen } from './components/screens/BuyCropsScreen';
import { SellCropsScreen } from './components/screens/SellCropsScreen';
import { FarmerDashboardScreen } from './components/screens/FarmerDashboardScreen';
import { KisanTransportScreen } from './components/screens/KisanTransportScreen';
import { TruckDriverPortalScreen } from './components/screens/TruckDriverPortalScreen';
import { AiChatbotModal } from './components/AiChatbotModal';
import { SmsNotificationCenter } from './components/SmsNotificationCenter';
import { useTranslation } from './lib/i18n.tsx';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('welcome-role-select');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isVoiceMode, setIsVoiceMode] = useState(false);
  const [isSmsCenterOpen, setIsSmsCenterOpen] = useState(false);
  const { language, setLanguage, t } = useTranslation();

  // Keyboard shortcut listener for rapid screen hopping
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey) {
        if (e.key === '1') setCurrentScreen('welcome-role-select');
        if (e.key === '2') setCurrentScreen('sell-crops-kisan');
        if (e.key === '3') setCurrentScreen('buy-crops-mandi-retail');
        if (e.key === '4') setCurrentScreen('kisan-truck-transport');
        if (e.key === '5') setCurrentScreen('truck-driver-portal');
        if (e.key === '6') setCurrentScreen('farmer-dashboard-orders');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Smooth scroll to top on screen change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentScreen]);

  return (
    <div className="min-h-screen flex flex-col bg-[#f9f9ff] text-[#111c2d]">
      {/* Universal Fixed Header */}
      <Header
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        selectedLanguage={language}
        onLanguageChange={setLanguage}
        onOpenVoiceAssistant={() => {
          setIsVoiceMode(true);
          setIsChatOpen(true);
        }}
        onOpenSmsCenter={() => setIsSmsCenterOpen(true)}
      />

      {/* Main Content Area (padding-top to accommodate fixed header) */}
      <main className="flex-1 pt-24">
        {currentScreen === 'welcome-role-select' && (
          <WelcomeScreen
            onNavigate={setCurrentScreen}
            selectedLanguage={language}
            onLanguageChange={setLanguage}
          />
        )}

        {currentScreen === 'sell-crops-kisan' && (
          <SellCropsScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'buy-crops-mandi-retail' && (
          <BuyCropsScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'kisan-truck-transport' && (
          <KisanTransportScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'truck-driver-portal' && (
          <TruckDriverPortalScreen onNavigate={setCurrentScreen} />
        )}

        {currentScreen === 'farmer-dashboard-orders' && (
          <FarmerDashboardScreen
            onNavigate={setCurrentScreen}
            selectedLanguage={language}
            onLanguageChange={setLanguage}
          />
        )}
      </main>

      {/* Floating Quick Role Switcher Pill Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-2 rounded-full shadow-2xl border border-surface-container-high flex items-center gap-1 sm:gap-2 max-w-[95vw] overflow-x-auto">
        <span className="font-label-sm text-[11px] font-bold text-on-surface-variant px-2 hidden lg:inline whitespace-nowrap">
          {t.quickScreens}
        </span>

        <button
          onClick={() => setCurrentScreen('welcome-role-select')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            currentScreen === 'welcome-role-select'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          title="Welcome & Role Selection"
        >
          {t.home}
        </button>

        <button
          onClick={() => setCurrentScreen('sell-crops-kisan')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            currentScreen === 'sell-crops-kisan'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          title="Kisan Crop Listing"
        >
          {t.sellCrops}
        </button>

        <button
          onClick={() => setCurrentScreen('buy-crops-mandi-retail')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            currentScreen === 'buy-crops-mandi-retail'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          title="Buy Produce Marketplace"
        >
          {t.buyMandi}
        </button>

        <button
          onClick={() => setCurrentScreen('kisan-truck-transport')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            currentScreen === 'kisan-truck-transport'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-primary bg-primary-fixed/40 hover:bg-primary-fixed font-bold'
          }`}
          title="Kisan Farm Truck Booking (Direct Agri-Logistics)"
        >
          <span className="material-symbols-outlined text-[14px]">local_shipping</span>
          <span>{t.farmTrucks}</span>
        </button>

        <button
          onClick={() => setCurrentScreen('truck-driver-portal')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer flex items-center gap-1 whitespace-nowrap ${
            currentScreen === 'truck-driver-portal'
              ? 'bg-secondary text-on-secondary shadow-xs'
              : 'text-secondary bg-secondary-fixed/40 hover:bg-secondary-fixed font-bold'
          }`}
          title="Truck Driver Portal (Bulk Loads for Drivers)"
        >
          <span className="material-symbols-outlined text-[14px]">badge</span>
          <span>{t.driverDesk}</span>
        </button>

        <button
          onClick={() => setCurrentScreen('farmer-dashboard-orders')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
            currentScreen === 'farmer-dashboard-orders'
              ? 'bg-primary text-on-primary shadow-xs'
              : 'text-on-surface-variant hover:bg-surface-container'
          }`}
          title="Farmer Orders & Bids Dashboard"
        >
          {t.dashboard}
        </button>
      </div>

      {/* Multilingual Voice & AI Chatbot Assistant */}
      <AiChatbotModal
        onNavigate={setCurrentScreen}
        isOpen={isChatOpen}
        initialVoiceMode={isVoiceMode}
        onToggle={() => {
          setIsChatOpen(!isChatOpen);
          setIsVoiceMode(false);
        }}
      />

      {/* SMS Confirmations & OTP Outbox Center */}
      <SmsNotificationCenter
        isOpen={isSmsCenterOpen}
        onClose={() => setIsSmsCenterOpen(false)}
      />

      {/* Footer */}
      <Footer onNavigate={setCurrentScreen} />
    </div>
  );
}
