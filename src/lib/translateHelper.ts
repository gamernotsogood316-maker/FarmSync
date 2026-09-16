export interface SupportedLanguage {
  code: string;
  name: string;
  nativeName: string;
  region: string;
}

export const SUPPORTED_LANGUAGES: SupportedLanguage[] = [
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', region: 'National / North & Central India' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', region: 'Maharashtra (Nashik, Pune, Mumbai)' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ', region: 'Punjab & Haryana' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી', region: 'Gujarat (Surat, Ahmedabad, Rajkot)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు', region: 'Andhra Pradesh & Telangana' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்', region: 'Tamil Nadu' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ', region: 'Karnataka (Bengaluru, Hubballi)' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা', region: 'West Bengal' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം', region: 'Kerala' },
  { code: 'or', name: 'Odia', nativeName: 'ଓଡ଼ିଆ', region: 'Odisha' },
  { code: 'ur', name: 'Urdu', nativeName: 'اردو', region: 'National' },
  { code: 'en', name: 'English', nativeName: 'English', region: 'Global / All India' },
];

/**
 * Triggers Google Translate by updating the googtrans cookie and firing the combo selector
 */
export function setGoogleTranslateLanguage(langCode: string): void {
  try {
    // 1. Set Google Translate cookie
    const cookieValue = `/en/${langCode}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname};`;
    document.cookie = `googtrans=${cookieValue}; path=/; domain=.${window.location.hostname};`;

    // 2. Select in the hidden Google Translate dropdown if available
    const selectElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (selectElem) {
      selectElem.value = langCode;
      selectElem.dispatchEvent(new Event('change', { bubbles: true }));
    } else {
      // Fallback: If combo is still loading, force reload with cookie set
      setTimeout(() => {
        const retryElem = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (retryElem) {
          retryElem.value = langCode;
          retryElem.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }, 500);
    }
  } catch (err) {
    console.warn('Google Translate change error:', err);
  }
}
