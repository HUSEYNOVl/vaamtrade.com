'use client';

import { createContext, useContext, useEffect, useState } from 'react';

interface CMSContent {
  settings: Record<string, any>;
  translations: Record<string, Record<string, string>>;
}

const CMSContentContext = createContext<CMSContent>({
  settings: {},
  translations: {},
});

export function CMSContentProvider({ children, initialSettings, initialTranslations }: {
  children: React.ReactNode;
  initialSettings?: Record<string, any>;
  initialTranslations?: Record<string, Record<string, string>>;
}) {
  const [settings, setSettings] = useState<Record<string, any>>(initialSettings || {});
  const [translations, setTranslations] = useState<Record<string, Record<string, string>>>(initialTranslations || {});

  return (
    <CMSContentContext.Provider value={{ settings, translations }}>
      {children}
    </CMSContentContext.Provider>
  );
}

export function useCMSContent() {
  return useContext(CMSContentContext);
}

export function useSetting(key: string, defaultValue: any = null) {
  const { settings } = useCMSContent();
  return settings[key] ?? defaultValue;
}

export function useTranslation(key: string, locale: string, namespace: string = 'common', defaultValue: string = '') {
  const { translations } = useCMSContent();
  return translations[locale]?.[`${namespace}.${key}`] || translations[locale]?.[key] || defaultValue;
}

