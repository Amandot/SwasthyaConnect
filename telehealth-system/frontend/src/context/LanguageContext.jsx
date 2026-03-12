import { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'mr', label: 'मराठी' },
];

const STORAGE_KEY = 'swasthya_language';

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && SUPPORTED_LANGUAGES.some(l => l.code === saved)) {
      setLanguage(saved);
    }
  }, []);

  const changeLanguage = (code) => {
    setLanguage(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages: SUPPORTED_LANGUAGES }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return ctx;
}

