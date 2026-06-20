import React, { createContext, useContext } from 'react';
import { useAppState } from '../context/StateContext';
import { translations } from './translations';

const I18nContext = createContext();

export function I18nProvider({ children }) {
  const { language } = useAppState();

  const t = (key) => {
    const lang = language || 'en';
    const section = translations[lang] || translations['en'];
    return section[key] || translations['en'][key] || key;
  };

  return (
    <I18nContext.Provider value={{ t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
