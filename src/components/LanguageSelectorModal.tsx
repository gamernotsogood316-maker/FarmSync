import React from 'react';
import { SUPPORTED_LANGUAGES, SupportedLanguage, setGoogleTranslateLanguage } from '../lib/translateHelper';

interface LanguageSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLanguage: string;
  onSelectLanguage: (code: string) => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  isOpen,
  onClose,
  currentLanguage,
  onSelectLanguage,
}) => {
  if (!isOpen) return null;

  const handleSelect = (lang: SupportedLanguage) => {
    onSelectLanguage(lang.code);
    setGoogleTranslateLanguage(lang.code);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest rounded-3xl p-6 max-w-xl w-full border border-surface-container-high shadow-2xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-surface-container">
          <div className="flex items-center gap-2.5">
            <span className="w-10 h-10 rounded-2xl bg-primary-fixed text-primary flex items-center justify-center">
              <span className="material-symbols-outlined text-[24px]">translate</span>
            </span>
            <div>
              <h2 className="font-headline-sm text-lg font-bold text-on-surface">
                Choose Your Language (भाषा चुनें)
              </h2>
              <p className="font-body-sm text-xs text-on-surface-variant">
                Powered by Google Translate for all Indian farmer communities
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Languages Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 overflow-y-auto pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => handleSelect(lang)}
                className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'border-primary bg-primary-fixed/30 text-primary font-bold shadow-xs'
                    : 'border-surface-container hover:bg-surface-container-low text-on-surface'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-title-md font-bold text-base">
                      {lang.nativeName}
                    </span>
                    <span className="text-xs text-on-surface-variant">
                      ({lang.name})
                    </span>
                  </div>
                  <span className="text-[11px] text-on-surface-variant block mt-0.5">
                    {lang.region}
                  </span>
                </div>

                {isSelected && (
                  <span className="material-symbols-outlined text-primary text-[20px]">
                    check_circle
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-surface-container flex items-center justify-between text-xs text-on-surface-variant">
          <span>Automatic real-time translation across all screens</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-surface-container hover:bg-surface-container-high text-on-surface font-bold"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
