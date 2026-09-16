import React from 'react';
import { ScreenId } from '../types';

interface FooterProps {
  onNavigate: (screen: ScreenId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const logoUrl =
    'https://lh3.googleusercontent.com/aida-public/AB6AXuB3Xd0eDDAxg6_C50ZZRb4UkV0JnV4F3QGr9H8bzLsY8ywcCmfSiCPZnNRBxb9QcYXzQ3GeVDSgBsMMH9S2iS-UI5zuXaiC6iMawUkTWj5sL3YboS-xtpoahLCO3UtczCT1KEzFaxGDtg7a3GCPbR38UgRmmC20uCBPP-UsFMXBNxcs9317RRsn0ZnVgO4-oDmaQTXQEBAVcx-RXo5XxCpVoFwXgNRsADUcdN16W4SedNG2IdHNY3E';

  return (
    <footer className="w-full bg-surface-container-lowest border-t border-surface-container-high mt-16">
      {/* Tiranga Accent Line */}
      <div className="w-full h-1 flex">
        <div className="w-1/3 bg-secondary-container" />
        <div className="w-1/3 bg-surface-container-lowest" />
        <div className="w-1/3 bg-primary-container" />
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <img
                src={logoUrl}
                alt="FarmSync"
                className="h-8 w-auto object-contain"
              />
              <span className="font-headline-sm font-bold text-primary">
                FarmSync
              </span>
            </div>
            <p className="font-body-md text-on-surface-variant leading-relaxed">
              Kisan Se Sidhe Dukandar Tak. Empowering Indian Annadatas with zero-commission
              marketplace access, verified 5-point photo grading, and secure digital escrow.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-fixed text-on-primary-fixed font-label-sm font-bold">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                Govt Standards Compliant
              </span>
            </div>
          </div>

          {/* Col 2: National Agrarian Portals */}
          <div className="space-y-3">
            <h4 className="font-title-md text-on-surface font-bold">
              National Portals
            </h4>
            <ul className="space-y-2 font-body-md text-on-surface-variant">
              <li>
                <a
                  href="https://enam.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  e-NAM Integrated Rates
                </a>
              </li>
              <li>
                <a
                  href="https://agmarknet.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  Agmarknet Daily Mandi Ticker
                </a>
              </li>
              <li>
                <a
                  href="https://pmkisan.gov.in"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-primary transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[16px]">open_in_new</span>
                  PM-Kisan DBT Verification
                </a>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('farmer-dashboard-orders')}
                  className="hover:text-primary transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">speed</span>
                  MSP Fair Value Calculator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Support & Kisan Helpline */}
          <div className="space-y-3">
            <h4 className="font-title-md text-on-surface font-bold">
              Farmer Support Desk
            </h4>
            <div className="p-3 bg-surface-container rounded-xl border border-surface-container-high space-y-1.5">
              <span className="font-label-sm text-on-surface-variant uppercase font-bold tracking-wider">
                Toll-Free Kisan Line
              </span>
              <a
                href="tel:18003276796"
                className="font-title-md text-primary font-bold flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
                1800-FARMSYNC
              </a>
              <span className="font-body-sm text-on-surface-variant block">
                Available 6:00 AM – 10:00 PM (IST) in Hindi, Marathi, Punjabi, Gujarati & English.
              </span>
            </div>
            <p className="font-body-sm text-on-surface-variant">
              Field offices: Nashik Mandi Yard, Lasalgaon APMC Gate 3, Vashi Navi Mumbai Sector 19.
            </p>
          </div>

          {/* Col 4: Tiranga Assurance */}
          <div className="space-y-3">
            <h4 className="font-title-md text-on-surface font-bold">
              Tiranga Assurance
            </h4>
            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-primary text-[20px] shrink-0 mt-0.5">
                  lock
                </span>
                <div>
                  <span className="font-label-md text-on-surface font-bold block">
                    Zero Dalali / 0% Brokerage
                  </span>
                  <span className="font-body-sm text-on-surface-variant">
                    Direct transparent trade without unauthorized cuts.
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px] shrink-0 mt-0.5">
                  currency_rupee
                </span>
                <div>
                  <span className="font-label-md text-on-surface font-bold block">
                    T+1 Digital Escrow
                  </span>
                  <span className="font-body-sm text-on-surface-variant">
                    Buyer funds locked upfront; credited to kisan bank account upon gate dispatch.
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-surface-container-high flex flex-col md:flex-row items-center justify-between gap-4 font-body-sm text-on-surface-variant">
          <p>© {new Date().getFullYear()} FarmSync India Agritech Initiative. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-6">
            <button
              onClick={() => onNavigate('welcome-role-select')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Platform Overview
            </button>
            <button
              onClick={() => onNavigate('sell-crops-kisan')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              List Produce (Kisan)
            </button>
            <button
              onClick={() => onNavigate('buy-crops-mandi-retail')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Direct Marketplace (Retail)
            </button>
            <button
              onClick={() => onNavigate('farmer-dashboard-orders')}
              className="hover:text-primary transition-colors cursor-pointer"
            >
              Kisan Dashboard
            </button>
            <button
              onClick={() => onNavigate('kisan-truck-transport')}
              className="hover:text-primary transition-colors cursor-pointer text-primary font-bold"
            >
              🚚 Farm Trucks (सारथी)
            </button>
            <button
              onClick={() => onNavigate('truck-driver-portal')}
              className="hover:text-secondary transition-colors cursor-pointer text-secondary font-bold"
            >
              🚛 Driver Desk
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
