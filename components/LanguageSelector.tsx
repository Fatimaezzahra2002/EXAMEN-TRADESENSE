import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslation } from 'react-i18next';

const LanguageSelector: React.FC = () => {
  const { language, changeLanguage } = useLanguage();
  const { t } = useTranslation();

  const handleLanguageChange = (lng: string) => {
    changeLanguage(lng);
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition">
        <span className="text-lg">
          {language === 'en' ? 'English' : language === 'ar' ? 'العربية' : 'Français'}
        </span>
        <span>{language === 'en' ? '🇺🇸' : language === 'ar' ? '🇸🇦' : '🇫🇷'}</span>
      </button>
      <div className="absolute right-0 mt-2 w-40 bg-slate-800 border border-slate-700 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
        <button
          onClick={() => handleLanguageChange('fr')}
          className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-slate-700 transition ${
            language === 'fr' ? 'bg-slate-700 text-white' : 'text-slate-300'
          }`}
        >
          <span>🇫🇷</span>
          <span>Français</span>
        </button>
        <button
          onClick={() => handleLanguageChange('en')}
          className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-slate-700 transition ${
            language === 'en' ? 'bg-slate-700 text-white' : 'text-slate-300'
          }`}
        >
          <span>🇺🇸</span>
          <span>English</span>
        </button>
        <button
          onClick={() => handleLanguageChange('ar')}
          className={`flex items-center gap-2 w-full px-4 py-2 text-sm text-left hover:bg-slate-700 transition ${
            language === 'ar' ? 'bg-slate-700 text-white' : 'text-slate-300'
          }`}
        >
          <span>🇸🇦</span>
          <span>العربية</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;