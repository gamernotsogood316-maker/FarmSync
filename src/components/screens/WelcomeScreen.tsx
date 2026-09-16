import React, { useState } from 'react';
import { ScreenId, LanguageOption } from '../../types';
import { setGoogleTranslateLanguage } from '../../lib/translateHelper';
import { useTranslation } from '../../lib/i18n';

interface WelcomeScreenProps {
  onNavigate: (screen: ScreenId) => void;
  selectedLanguage: string;
  onLanguageChange: (lang: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onNavigate,
  selectedLanguage,
  onLanguageChange,
}) => {
  const { t } = useTranslation();
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const heroImageUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuDeUHEXjq-64CEtxKlUyRLyYAxOSj4ztbyl0WY7CAtKDiqY8chFpNi2HjRqEshod4M1QggvccEIvqOTHAvqFzZRlx1HqJZ5yFWaeNRt5qlyETfU-nsWDlVknq5MCsnWgbJLjykIz_ZStlqN0Vgtmj1AB8BA50ecrzwBW28NPAhROcQulvPLnv-F7aNbiH6QpSrp7CqmvTm9CqLzNneS7x1t-r_2ZvdXMVCVwQYl70nU-2gGX06_k78';

  const languages: LanguageOption[] = [
    { code: 'hi', native: 'हिन्दी', english: 'Hindi', audioVoice: 'किसान भाईयों के लिए सीधी मंडी' },
    { code: 'mr', native: 'मराठी', english: 'Marathi', audioVoice: 'शेतकऱ्यांसाठी थेट व्यापारी व्यासपीठ' },
    { code: 'kn', native: 'ಕನ್ನಡ', english: 'Kannada', audioVoice: 'ರೈತರಿಗೆ ನೇರ ಕೃಷಿ ಮಾರುಕಟ್ಟೆ ವೇದಿಕೆ' },
    { code: 'pa', native: 'ਪੰਜਾਬੀ', english: 'Punjabi', audioVoice: 'ਕਿਸਾਨਾਂ ਲਈ ਸਿੱਧਾ ਮੰਡੀ ਬਾਜ਼ਾਰ' },
    { code: 'gu', native: 'ગુજરાતી', english: 'Gujarati', audioVoice: 'ખેડૂતો માટે સીધું વેચાણ' },
    { code: 'te', native: 'తెలుగు', english: 'Telugu', audioVoice: 'రೈతులకు నేరుగా మార్కెట్ సౌకర్యం' },
    { code: 'ta', native: 'தமிழ்', english: 'Tamil', audioVoice: 'விவசாயிகளுக்கு நேரடி சந்தை' },
    { code: 'bn', native: 'বাংলা', english: 'Bengali', audioVoice: 'কৃষকদের জন্য সরাসরি বাজার' },
    { code: 'en', native: 'English', english: 'English', audioVoice: 'Direct Agrarian Commerce for India' },
  ];

  const playVoiceSample = (lang: LanguageOption) => {
    setPlayingAudio(lang.code);
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(lang.audioVoice);
      const voiceLangs: Record<string, string> = {
        hi: 'hi-IN',
        mr: 'mr-IN',
        kn: 'kn-IN',
        pa: 'pa-IN',
        gu: 'gu-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        bn: 'bn-IN',
        en: 'en-IN',
      };
      utterance.lang = voiceLangs[lang.code] || 'en-IN';
      utterance.rate = 0.95;
      utterance.onend = () => setPlayingAudio(null);
      utterance.onerror = () => setPlayingAudio(null);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setPlayingAudio(null), 2000);
    }
  };

  const faqs = [
    {
      q: 'How does the FarmSync Digital Escrow protect both parties?',
      a: 'When a retailer places an order, their funds are locked securely in an RBI-compliant bank escrow account. The farmer receives an instant notification of funds reserved. Once the truck loads at the farm gate and weighbridge weight is confirmed, 100% of the payment is disbursed directly into the farmer bank account via DBT within 24 hours.',
    },
    {
      q: 'How is quality tested without visiting the farm physically?',
      a: 'Farmers upload mandatory 5-angle geo-tagged photos: digital vernier caliper for caliber scale, inserted probe reading for moisture percentage, field stack in ventilated bags, cross-section transverse cut, and Agronomy/KVK soil lab certificates. AI & agronomist rules verify compliance before listing goes live.',
    },
    {
      q: 'Who manages the logistics and transport vehicle?',
      a: 'FarmSync partners with verified rural logistics operators (Eicher, Tata 407, Piaggio Ape). The app calculates live freight according to distance (km) and tonnage. Retailers can track the truck via live GPS from farm gate loading to mandi warehouse delivery.',
    },
    {
      q: 'Is there any hidden middleman cut or dalali deduction?',
      a: 'Zero! Traditional mandis charge 6% to 12% in agent commission, katoti, and hamali cuts. FarmSync operates on 0% farmer commission, ensuring Annadatas receive the complete agreed farm-gate price.',
    },
  ];

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-6">
        <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Column: Headline & Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md font-bold shadow-xs">
                <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
                <span>{t.heroTagline}</span>
              </div>

              {/* Display Headline */}
              <div className="space-y-2">
                <h1 className="font-display-lg text-4xl sm:text-5xl font-black text-on-surface tracking-tight leading-[1.15]">
                  {t.heroHeadline1} <br className="hidden sm:inline" />
                  <span className="text-primary underline decoration-secondary-container decoration-4 underline-offset-8">
                    {t.heroHeadlineHighlight}
                  </span>
                </h1>
                <p className="font-headline-md text-xl sm:text-2xl text-secondary font-bold">
                  {t.heroSubheadline}
                </p>
              </div>

              {/* Subtitle */}
              <p className="font-body-lg text-base sm:text-lg text-on-surface-variant max-w-2xl leading-relaxed">
                {t.heroDescription}
              </p>

              {/* Metric Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="material-symbols-outlined text-primary text-[22px]">
                    gavel
                  </span>
                  <div>
                    <span className="font-label-md font-bold text-on-surface block">e-NAM Standard</span>
                    <span className="font-body-sm text-on-surface-variant text-xs">Govt Grade Benchmarking</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="material-symbols-outlined text-secondary text-[22px]">
                    account_balance
                  </span>
                  <div>
                    <span className="font-label-md font-bold text-on-surface block">{t.dbtEscrow}</span>
                    <span className="font-body-sm text-on-surface-variant text-xs">T+1 Direct Bank Deposit</span>
                  </div>
                </div>
                <div className="flex items-center gap-2.5 p-3 rounded-xl bg-surface-container-low border border-surface-container">
                  <span className="material-symbols-outlined text-tertiary text-[22px]">
                    local_shipping
                  </span>
                  <div>
                    <span className="font-label-md font-bold text-on-surface block">{t.farmTrucks}</span>
                    <span className="font-body-sm text-on-surface-variant text-xs">Pickup At Your Field</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Button Group */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onNavigate('sell-crops-kisan')}
                  className="px-6 py-3.5 rounded-xl bg-primary text-on-primary font-label-lg font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all cursor-pointer"
                  id="welcome-kisan-btn"
                >
                  <span className="material-symbols-outlined text-[20px]">agriculture</span>
                  {t.enterAsKisan}
                </button>
                <button
                  onClick={() => onNavigate('buy-crops-mandi-retail')}
                  className="px-6 py-3.5 rounded-xl bg-secondary text-on-secondary font-label-lg font-bold flex items-center gap-2 shadow-lg shadow-secondary/20 hover:bg-secondary/90 transition-all cursor-pointer"
                  id="welcome-retail-btn"
                >
                  <span className="material-symbols-outlined text-[20px]">storefront</span>
                  {t.enterAsRetailer}
                </button>
              </div>
            </div>

            {/* Right Column: Hero Visual with Overlays */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-surface-container-high shadow-2xl bg-surface-container">
                <img
                  src={heroImageUrl}
                  alt="Indian farmer and retailer shaking hands over direct harvest trade"
                  className="w-full h-full object-cover min-h-[380px] max-h-[460px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Top Floating Badge */}
                <div className="absolute top-4 right-4 bg-surface-container-lowest/90 backdrop-blur-md px-3.5 py-2 rounded-2xl shadow-lg border border-white/40 flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00450d] text-[20px]">
                    trending_up
                  </span>
                  <div className="text-left">
                    <span className="font-label-sm font-bold text-primary block text-xs">
                      Farmer Income Uplift
                    </span>
                    <span className="font-headline-sm font-black text-on-surface leading-none">
                      +28.4% Net
                    </span>
                  </div>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-4 inset-x-4 p-4 rounded-2xl bg-black/70 backdrop-blur-md text-white space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm uppercase tracking-wider text-primary-fixed font-bold">
                      Direct Farm Gate Trade
                    </span>
                    <span className="font-label-sm text-white/80">Nashik Agro Zone</span>
                  </div>
                  <p className="font-title-md font-bold">
                    Shri Ramesh Patil & Balaji Traders, Mumbai
                  </p>
                  <p className="font-body-sm text-white/80 text-xs">
                    "Sold 150 Quintals Red Onions at ₹2,450/Qtl. Full payment received in my Bank of Maharashtra account in 24 hours."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive 8-Indian-Language Voice Selector */}
      <section className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div className="bg-surface-container-low rounded-2xl p-6 border border-surface-container space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  record_voice_over
                </span>
                <h3 className="font-title-lg font-bold text-on-surface">
                  {t.bhashaTitle}
                </h3>
              </div>
              <p className="font-body-sm text-on-surface-variant">
                {t.bhashaSubtitle}
              </p>
            </div>
            {playingAudio && (
              <div className="flex items-center gap-2 text-primary font-label-md bg-primary-fixed px-3 py-1 rounded-full animate-pulse">
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
                <span>{t.playingVoiceGuidance}</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2.5">
            {languages.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              const isPlaying = playingAudio === lang.code;
              return (
                <div
                  key={lang.code}
                  className={`group relative p-3 rounded-xl border transition-all text-center flex flex-col justify-between ${
                    isSelected
                      ? 'bg-primary text-on-primary border-primary shadow-md'
                      : 'bg-surface-container-lowest text-on-surface border-surface-container-high hover:border-primary/50'
                  }`}
                >
                  <button
                    onClick={() => {
                      onLanguageChange(lang.code);
                      setGoogleTranslateLanguage(lang.code);
                    }}
                    className="w-full text-center focus:outline-none cursor-pointer"
                  >
                    <span className="font-title-md font-bold block leading-tight">
                      {lang.native}
                    </span>
                    <span
                      className={`font-label-sm text-xs block ${
                        isSelected ? 'text-white/80' : 'text-on-surface-variant'
                      }`}
                    >
                      {lang.english}
                    </span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      playVoiceSample(lang);
                    }}
                    title={`Listen in ${lang.english}`}
                    className={`mt-2 py-1 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer ${
                      isPlaying
                        ? 'bg-secondary text-white'
                        : isSelected
                        ? 'bg-white/20 text-white hover:bg-white/30'
                        : 'bg-surface-container text-on-surface hover:bg-primary-fixed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[14px]">
                      {isPlaying ? 'graphic_eq' : 'volume_up'}
                    </span>
                    <span>{isPlaying ? 'Playing' : 'Listen'}</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dual Role Track Cards */}
      <section className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <span className="font-label-md font-bold uppercase tracking-wider text-secondary">
            {t.selectRole}
          </span>
          <h2 className="font-headline-lg text-3xl sm:text-4xl font-black text-on-surface">
            {t.tailoredWorkflows}
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Whether you cultivate the harvest or supply the city, FarmSync provides a dedicated,
            transparent direct ecosystem.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Card 1: Annadata / Kisan Track */}
          <div className="relative rounded-3xl bg-surface-container-lowest border-2 border-primary/20 hover:border-primary transition-all p-8 shadow-md flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-primary-fixed flex items-center justify-center text-primary shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">agriculture</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed-variant font-label-md font-bold">
                  {t.zeroBrokerage}
                </span>
              </div>

              <div>
                <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                  {t.kisanTrackTitle}
                </h3>
                <p className="font-title-md text-primary font-semibold mt-0.5">
                  {t.kisanTrackSubtitle}
                </p>
                <p className="font-body-md text-on-surface-variant mt-2 leading-relaxed">
                  {t.kisanTrackDesc}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <strong className="font-label-md text-on-surface">MSP Fair Value Guard:</strong>
                    <span className="font-body-sm text-on-surface-variant ml-1">
                      Our dynamic price slider alerts you when bids cross below fair cost-of-production thresholds.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <strong className="font-label-md text-on-surface">DBT Escrow Guarantee:</strong>
                    <span className="font-body-sm text-on-surface-variant ml-1">
                      Buyer funds are locked before dispatch. Payment arrives in your bank account in 24 hours.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <strong className="font-label-md text-on-surface">Farm-Gate Weighing:</strong>
                    <span className="font-body-sm text-on-surface-variant ml-1">
                      No expensive transportation to crowded mandi yards. Verified trucks pick up directly from your farm.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-surface-container-high">
              <button
                onClick={() => onNavigate('sell-crops-kisan')}
                className="w-full py-4 rounded-xl bg-primary text-on-primary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                id="kisan-track-cta-btn"
              >
                <span className="material-symbols-outlined text-[20px]">add_box</span>
                {t.sellCrops}
              </button>
              <button
                onClick={() => onNavigate('farmer-dashboard-orders')}
                className="w-full py-3 rounded-xl bg-surface-container text-on-surface font-label-md font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                {t.dashboard}
              </button>
            </div>
          </div>

          {/* Card 2: Dukandar / Retailer Track */}
          <div className="relative rounded-3xl bg-surface-container-lowest border-2 border-secondary/20 hover:border-secondary transition-all p-8 shadow-md flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-secondary-fixed flex items-center justify-center text-secondary shadow-sm">
                  <span className="material-symbols-outlined text-[32px]">storefront</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-label-md font-bold">
                  {t.zeroBrokerage}
                </span>
              </div>

              <div>
                <h3 className="font-headline-md text-2xl font-bold text-on-surface">
                  {t.retailerTrackTitle}
                </h3>
                <p className="font-title-md text-secondary font-semibold mt-0.5">
                  {t.retailerTrackSubtitle}
                </p>
                <p className="font-body-md text-on-surface-variant mt-2 leading-relaxed">
                  {t.retailerTrackDesc}
                </p>
              </div>

              {/* Feature Checklist */}
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <strong className="font-label-md text-on-surface">5-Angle Verified Photos:</strong>
                    <span className="font-body-sm text-on-surface-variant ml-1">
                      Caliber, moisture probe, cut-test, bagging & lab tests visible before ordering.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <strong className="font-label-md text-on-surface">Live GPS Freight Tracking:</strong>
                    <span className="font-body-sm text-on-surface-variant ml-1">
                      Real-time vehicle location and ETA straight to your retail shop or mandi godown.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                    check_circle
                  </span>
                  <div>
                    <strong className="font-label-md text-on-surface">Zero Brokerage Savings:</strong>
                    <span className="font-body-sm text-on-surface-variant ml-1">
                      Save ₹180 to ₹350 per quintal compared to traditional APMC middleman markups.
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-surface-container-high">
              <button
                onClick={() => onNavigate('buy-crops-mandi-retail')}
                className="w-full py-4 rounded-xl bg-secondary text-on-secondary font-label-lg font-bold flex items-center justify-center gap-2 shadow-md hover:bg-secondary/90 transition-all cursor-pointer"
                id="retail-track-cta-btn"
              >
                <span className="material-symbols-outlined text-[20px]">shopping_cart</span>
                {t.buyMandi}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Kisan Truck Transport & Driver Partner Section (Direct Agri-Logistics) */}
      <section className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div className="rounded-3xl bg-gradient-to-br from-surface-container-lowest to-primary-fixed/20 border-2 border-primary/30 p-8 md:p-10 shadow-lg space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary text-on-primary font-label-sm font-bold text-xs mb-2">
                <span className="material-symbols-outlined text-[16px]">local_shipping</span>
                <span>{t.farmTrucksLogisticsTitle}</span>
              </div>
              <h2 className="font-headline-lg text-2xl sm:text-3xl font-black text-on-surface">
                {t.farmTrucksLogisticsSubtitle}
              </h2>
              <p className="font-body-md text-on-surface-variant max-w-2xl mt-1 text-sm">
                Real-time Google Maps telemetry, upfront per-quintal rates, digital weighbridge integration, and bulk orders directly connecting farms to city retail buyers.
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs font-bold text-primary bg-surface-container-lowest px-4 py-2 rounded-2xl border border-primary/20 shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
              <span>Google Cloud Database Synced</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card A: For Farmers - Book Farm Trucks */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-primary-fixed text-primary flex items-center justify-center font-bold text-xl">
                    <span className="material-symbols-outlined text-[28px]">local_shipping</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary-fixed text-primary font-bold text-xs">
                    On-Demand Trucks
                  </span>
                </div>

                <h3 className="font-title-lg font-bold text-on-surface text-lg">
                  {t.kisanTruckBooking}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {t.kisanTruckBookingDesc}
                </p>

                <ul className="space-y-1.5 text-xs text-on-surface-variant pt-1">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                    <span>Live Google Maps GPS speed & Kasara/Highway corridor tracking</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                    <span>Transparent freight rate per quintal with zero middleman dalali</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                    <span>Dharam Kanta (Weighbridge) slip upload before highway departure</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('kisan-truck-transport')}
                className="w-full py-3.5 rounded-xl bg-primary text-on-primary font-label-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-primary/90 transition-all cursor-pointer"
                id="kisan-truck-welcome-btn"
              >
                <span className="material-symbols-outlined text-[18px]">navigation</span>
                <span>{t.bookFarmTruckBtn}</span>
              </button>
            </div>

            {/* Card B: For Truck Drivers - Driver Partner Desk */}
            <div className="p-6 rounded-2xl bg-surface-container-lowest border border-surface-container-high shadow-sm space-y-5 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-secondary-fixed text-on-secondary-fixed flex items-center justify-center font-bold text-xl">
                    <span className="material-symbols-outlined text-[28px]">badge</span>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-secondary-fixed text-on-secondary-fixed font-bold text-xs">
                    Driver Partner Portal
                  </span>
                </div>

                <h3 className="font-title-lg font-bold text-on-surface text-lg">
                  {t.driverDeskTitle}
                </h3>
                <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                  {t.driverDeskDesc}
                </p>

                <ul className="space-y-1.5 text-xs text-on-surface-variant pt-1">
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                    <span>Instant diesel / FASTag advance credited upon farm-gate arrival</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                    <span>Bulk orders directly from farmers to Vashi, Pune, Surat, Delhi</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[16px]">check</span>
                    <span>100% Escrow-backed DBT freight settlement on delivery OTP</span>
                  </li>
                </ul>
              </div>

              <button
                onClick={() => onNavigate('truck-driver-portal')}
                className="w-full py-3.5 rounded-xl bg-secondary text-on-secondary font-label-md font-bold flex items-center justify-center gap-2 shadow-md hover:bg-secondary/90 transition-all cursor-pointer"
                id="driver-portal-welcome-btn"
              >
                <span className="material-symbols-outlined text-[18px]">assignment</span>
                <span>{t.openDriverDeskBtn}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Live National Network Stats Ribbon */}
      <section className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        <div className="rounded-3xl bg-primary text-on-primary p-8 md:p-10 shadow-xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div>
              <div className="font-display-lg text-3xl md:text-4xl font-black text-primary-fixed">
                ₹48.6 Cr
              </div>
              <p className="font-label-md text-white/90 mt-1">Direct Farmer DBT Settled</p>
            </div>
            <div>
              <div className="font-display-lg text-3xl md:text-4xl font-black text-primary-fixed">
                45,200+
              </div>
              <p className="font-label-md text-white/90 mt-1">Verified Annadatas Registered</p>
            </div>
            <div>
              <div className="font-display-lg text-3xl md:text-4xl font-black text-secondary-fixed">
                18,400+
              </div>
              <p className="font-label-md text-white/90 mt-1">Retailers & Kirana Partners</p>
            </div>
            <div>
              <div className="font-display-lg text-3xl md:text-4xl font-black text-primary-fixed">
                0%
              </div>
              <p className="font-label-md text-white/90 mt-1">Dalali Commission Taken</p>
            </div>
          </div>
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(#acf4a4_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8 space-y-2">
          <span className="font-label-md font-bold uppercase tracking-wider text-primary">
            Clear Transparency
          </span>
          <h2 className="font-headline-md text-2xl sm:text-3xl font-bold text-on-surface">
            Common Questions by Farmers & Retailers
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-surface-container-lowest border border-surface-container-high overflow-hidden shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-surface-container-low transition-colors"
                >
                  <span className="font-title-md font-bold text-on-surface">
                    {faq.q}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[24px] text-on-surface-variant transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  >
                    keyboard_arrow_down
                  </span>
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 font-body-md text-on-surface-variant border-t border-surface-container leading-relaxed animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
