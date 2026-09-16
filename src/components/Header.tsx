import React, { useState } from 'react';
import { ScreenId } from '../types';
import { LanguageSelectorModal } from './LanguageSelectorModal';
import { setGoogleTranslateLanguage } from '../lib/translateHelper';
import { useTranslation } from '../lib/i18n';

interface HeaderProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
  onOpenVoiceAssistant?: () => void;
  onOpenSmsCenter?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentScreen,
  onNavigate,
  selectedLanguage,
  onLanguageChange,
  onOpenVoiceAssistant,
  onOpenSmsCenter,
}) => {
  const { t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [regionDropdownOpen, setRegionDropdownOpen] = useState(false);
  const [currentRegion, setCurrentRegion] = useState('Nashik / Pune Region (15 km)');
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [langModalOpen, setLangModalOpen] = useState(false);

  const navItems: { id: ScreenId; label: string; icon?: string }[] = [
    { id: 'welcome-role-select', label: t.home },
    { id: 'sell-crops-kisan', label: t.sellCrops },
    { id: 'buy-crops-mandi-retail', label: t.buyMandi },
    { id: 'kisan-truck-transport', label: t.farmTrucks, icon: 'local_shipping' },
    { id: 'truck-driver-portal', label: t.driverDesk, icon: 'badge' },
    { id: 'farmer-dashboard-orders', label: t.dashboard },
  ];

  const regions = [
    'Nashik / Pune Region (15 km)',
    'Vashi / Mumbai APMC (25 km)',
    'Lasalgaon / Niphad Belt (10 km)',
    'Punjab / Malwa Cluster (30 km)',
    'Indore / Malwa Agro Hub (20 km)',
  ];

  const logoUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Xd0eDDAxg6_C50ZZRb4UkV0JnV4F3QGr9H8bzLsY8ywcCmfSiCPZnNRBxb9QcYXzQ3GeVDSgBsMMH9S2iS-UI5zuXaiC6iMawUkTWj5sL3YboS-xtpoahLCO3UtczCT1KEzFaxGDtg7a3GCPbR38UgRmmC20uCBPP-UsFMXBNxcs9317RRsn0ZnVgO4-oDmaQTXQEBAVcx-RXo5XxCpVoFwXgNRsADUcdN16W4SedNG2IdHNY3E';

  return (
    <header className="fixed top-0 w-full z-50 bg-surface-container-lowest/95 backdrop-blur-md shadow-[0_1px_8px_rgba(0,0,0,0.04)]">
      {/* Tiranga National Flag Strip */}
      <div className="w-full h-1 flex">
        <div className="w-1/3 bg-secondary-container" />
        <div className="w-1/3 bg-surface-container-lowest" />
        <div className="w-1/3 bg-primary-container" />
      </div>

      <div className="h-20 max-w-7xl mx-auto px-4 md:px-margin-desktop flex items-center justify-between gap-space-md">
        {/* Logo & Brand */}
        <div className="flex items-center gap-space-lg">
          <button
            onClick={() => onNavigate('welcome-role-select')}
            className="flex items-center gap-space-sm text-left focus:outline-none group"
            id="brand-logo-btn"
          >
            <img
              alt="FarmSync Logo"
              className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              src={logoUrl}
            />
            <div className="flex flex-col">
              <div className="flex items-center gap-space-xs">
                <span className="font-headline-sm text-headline-sm text-primary font-bold leading-none">
                  FarmSync
                </span>
                <span className="px-space-xs py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-sm text-label-sm font-bold uppercase tracking-wider">
                  Direct Trade
                </span>
              </div>
              <span className="font-label-sm text-label-sm text-on-surface-variant">
                Kisan Se Sidhe Dukandar Tak
              </span>
            </div>
          </button>

          {/* Micro Location Badge with Popover */}
          <div className="relative hidden xl:block">
            <button
              onClick={() => setRegionDropdownOpen(!regionDropdownOpen)}
              className="flex items-center gap-space-xs px-space-sm py-1.5 rounded-full bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors cursor-pointer"
              id="region-selector-btn"
            >
              <span className="material-symbols-outlined text-[16px] text-secondary">
                location_on
              </span>
              <span className="font-label-md text-label-md font-semibold">{currentRegion}</span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                arrow_drop_down
              </span>
            </button>

            {regionDropdownOpen && (
              <div className="absolute top-full mt-1.5 left-0 w-64 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="font-label-sm text-label-sm text-on-surface-variant px-2 py-1 uppercase font-bold tracking-wider">
                  Select Agro-Hub
                </div>
                {regions.map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setCurrentRegion(r);
                      setRegionDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-label-md text-label-md transition-colors ${
                      currentRegion === r
                        ? 'bg-primary-fixed text-on-primary-fixed-variant font-bold'
                        : 'hover:bg-surface-container text-on-surface'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                id={`nav-${item.id}`}
                className={`transition-all font-label-lg text-label-lg px-3 py-2 rounded-xl text-left cursor-pointer ${
                  isActive
                    ? 'bg-primary-container text-on-primary font-bold shadow-sm'
                    : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low font-medium'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Section: Hotline, Language, Profile */}
        <div className="flex items-center gap-space-sm md:gap-space-md">
          {/* Toll Free Helpline */}
          <div className="hidden 2xl:flex flex-col text-right">
            <span className="font-label-sm text-label-sm text-on-surface-variant">
              Kisan Support Hotline
            </span>
            <a
              href="tel:18003276796"
              className="font-label-md text-label-md text-primary font-bold flex items-center gap-1 hover:underline"
            >
              <span className="material-symbols-outlined text-[14px]">call</span>
              1800-FARMSYNC
            </a>
          </div>

          {/* Language Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangMenuOpen(!langMenuOpen)}
              className="flex items-center gap-space-xs px-2.5 py-1.5 rounded-lg bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors font-label-md text-label-md cursor-pointer"
              id="header-lang-btn"
              type="button"
            >
              <span className="material-symbols-outlined text-[18px] text-primary">
                translate
              </span>
              <span className="font-bold">
                {selectedLanguage.toUpperCase()}
              </span>
              <span className="material-symbols-outlined text-[14px] text-on-surface-variant">
                keyboard_arrow_down
              </span>
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-52 bg-surface-container-lowest rounded-xl shadow-xl border border-surface-container-high p-1.5 z-50">
                <button
                  onClick={() => {
                    onLanguageChange('hi');
                    setGoogleTranslateLanguage('hi');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'hi'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>हिन्दी (Hindi)</span>
                  {selectedLanguage === 'hi' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('mr');
                    setGoogleTranslateLanguage('mr');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'mr'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>मराठी (Marathi)</span>
                  {selectedLanguage === 'mr' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('pa');
                    setGoogleTranslateLanguage('pa');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'pa'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>ਪੰਜਾਬੀ (Punjabi)</span>
                  {selectedLanguage === 'pa' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('gu');
                    setGoogleTranslateLanguage('gu');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'gu'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>ગુજરાતી (Gujarati)</span>
                  {selectedLanguage === 'gu' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('kn');
                    setGoogleTranslateLanguage('kn');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'kn'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>ಕನ್ನಡ (Kannada)</span>
                  {selectedLanguage === 'kn' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('te');
                    setGoogleTranslateLanguage('te');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'te'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>తెలుగు (Telugu)</span>
                  {selectedLanguage === 'te' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('ta');
                    setGoogleTranslateLanguage('ta');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'ta'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>தமிழ் (Tamil)</span>
                  {selectedLanguage === 'ta' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    onLanguageChange('en');
                    setGoogleTranslateLanguage('en');
                    setLangMenuOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg font-label-md flex items-center justify-between ${
                    selectedLanguage === 'en'
                      ? 'bg-primary-fixed text-primary font-bold'
                      : 'hover:bg-surface-container text-on-surface'
                  }`}
                >
                  <span>English (Global)</span>
                  {selectedLanguage === 'en' && (
                    <span className="material-symbols-outlined text-[16px]">check</span>
                  )}
                </button>
                <div className="pt-1.5 mt-1 border-t border-surface-container">
                  <button
                    onClick={() => {
                      setLangMenuOpen(false);
                      setLangModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg font-label-md text-primary font-bold hover:bg-primary-fixed/30 flex items-center gap-1.5"
                  >
                    <span className="material-symbols-outlined text-[16px]">language</span>
                    <span>All Indian Languages</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Voice Assistant Header Trigger Button */}
          {onOpenVoiceAssistant && (
            <button
              onClick={onOpenVoiceAssistant}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-secondary text-on-secondary font-label-md text-xs font-bold hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-xs border border-secondary-container"
              id="header-voice-assistant-btn"
              title="Activate FarmSync Voice Assistant (बोलकर बताएं)"
            >
              <span className="material-symbols-outlined text-[18px] animate-pulse">mic</span>
              <span className="hidden sm:inline">Voice Sahayak</span>
            </button>
          )}

          {/* SMS Confirmation Center Button */}
          {onOpenSmsCenter && (
            <button
              onClick={onOpenSmsCenter}
              className="p-2 rounded-xl bg-surface-container-low hover:bg-surface-container text-on-surface transition-colors relative cursor-pointer"
              id="header-sms-center-btn"
              title="View Sent SMS Confirmations & OTP History"
              aria-label="SMS Confirmations & OTPs"
            >
              <span className="material-symbols-outlined text-[20px] text-primary">sms</span>
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white" />
            </button>
          )}

          {/* User Profile Pill */}
          <button
            onClick={() => onNavigate('farmer-dashboard-orders')}
            className="flex items-center gap-space-sm pl-1 py-1 pr-2 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer text-left"
            id="user-profile-header-btn"
          >
            <div className="hidden sm:flex flex-col text-right">
              <span className="font-label-md text-label-md text-on-surface font-semibold leading-tight">
                Ramesh Patil
              </span>
              <span className="font-label-sm text-label-sm text-primary font-medium">
                Verified Kisan (MH)
              </span>
            </div>
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-sm text-on-primary">
              <span className="material-symbols-outlined text-[18px]">person</span>
            </div>
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg text-on-surface hover:bg-surface-container-low"
            id="mobile-nav-toggle"
            aria-label="Toggle navigation menu"
          >
            <span className="material-symbols-outlined text-[24px]">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-surface-container-lowest border-t border-surface-container-high px-4 py-3 shadow-lg space-y-1">
          {navItems.map((item) => {
            const isActive = currentScreen === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl font-label-lg transition-colors flex items-center justify-between ${
                  isActive
                    ? 'bg-primary text-on-primary font-bold'
                    : 'text-on-surface hover:bg-surface-container-low'
                }`}
              >
                <span>{item.label}</span>
                <span className="material-symbols-outlined text-[18px]">
                  chevron_right
                </span>
              </button>
            );
          })}
          {/* Mobile Voice & SMS triggers */}
          <div className="pt-2 border-t border-surface-container-high grid grid-cols-2 gap-2">
            {onOpenVoiceAssistant && (
              <button
                onClick={() => {
                  onOpenVoiceAssistant();
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-xl bg-secondary text-on-secondary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">mic</span>
                <span>Voice Sahayak</span>
              </button>
            )}

            {onOpenSmsCenter && (
              <button
                onClick={() => {
                  onOpenSmsCenter();
                  setMobileMenuOpen(false);
                }}
                className="py-2 px-3 rounded-xl bg-primary text-on-primary font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs"
              >
                <span className="material-symbols-outlined text-[18px]">sms</span>
                <span>SMS Center</span>
              </button>
            )}
          </div>

          <div className="pt-2 border-t border-surface-container-high flex items-center justify-between text-on-surface-variant font-label-sm px-2">
            <span>Helpline: 1800-FARMSYNC</span>
            <span className="text-primary font-bold">24x7 Escrow Protected</span>
          </div>
        </div>
      )}

      {/* Google Translate & Indian Languages Picker Modal */}
      <LanguageSelectorModal
        isOpen={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        currentLanguage={selectedLanguage}
        onSelectLanguage={onLanguageChange}
      />
    </header>
  );
};
