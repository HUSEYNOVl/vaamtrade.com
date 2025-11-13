'use client';

import { useLocale } from 'next-intl';

const languages = [
  { code: 'en', name: 'EN' },
  { code: 'zh', name: '中文' },
  { code: 'ru', name: 'RU' },
  { code: 'ar', name: 'AR' },
];

export default function LanguageSwitcher() {
  const locale = useLocale();

  const handleLanguageChange = (newLocale: string) => {
    if (newLocale === locale) return;
    
    // Get current full path from browser
    const currentFullPath = window.location.pathname;
    
    // Extract path without locale (remove /en, /zh, /ru, /ar prefix)
    let pathWithoutLocale = currentFullPath.replace(/^\/(en|zh|ru|ar)/, '') || '/';
    
    // Ensure path starts with /
    if (!pathWithoutLocale.startsWith('/')) {
      pathWithoutLocale = '/' + pathWithoutLocale;
    }
    
    // Normalize path - if it's empty, use /
    if (pathWithoutLocale === '' || pathWithoutLocale === '/') {
      pathWithoutLocale = '/';
    }
    
    // Build the new URL with the new locale
    const newPath = pathWithoutLocale === '/' 
      ? `/${newLocale}` 
      : `/${newLocale}${pathWithoutLocale}`;
    
    // Use window.location for reliable navigation
    // This ensures the language change always works
    window.location.href = newPath;
  };

  return (
    <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
      {languages.map((lang) => (
        <button
          key={lang.code}
          onClick={() => handleLanguageChange(lang.code)}
          disabled={locale === lang.code}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
            locale === lang.code
              ? 'bg-white text-red-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          } cursor-pointer`}
        >
          {lang.name}
        </button>
      ))}
    </div>
  );
}

