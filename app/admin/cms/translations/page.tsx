'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Translation {
  id: string;
  key: string;
  locale: string;
  value: string;
  namespace: string | null;
}

const locales = ['en', 'zh', 'ru', 'ar'];
const localeNames: Record<string, string> = {
  en: 'English',
  zh: '中文',
  ru: 'Русский',
  ar: 'العربية',
};

export default function TranslationsPage() {
  const [translations, setTranslations] = useState<Translation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedNamespace, setSelectedNamespace] = useState<string>('common');
  const [namespaces, setNamespaces] = useState<string[]>([]);

  useEffect(() => {
    fetchTranslations();
  }, [selectedNamespace]);

  const fetchTranslations = async () => {
    try {
      const response = await fetch(`/api/cms/translations?namespace=${selectedNamespace}`);
      if (response.ok) {
        const data = await response.json();
        setTranslations(data);
        const uniqueNamespaces = Array.from(new Set(data.map((t: Translation) => t.namespace || 'common')));
        setNamespaces(uniqueNamespaces as string[]);
      }
    } catch (error) {
      console.error('Error fetching translations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (id: string, value: string) => {
    try {
      const translation = translations.find((t) => t.id === id);
      if (!translation) return;

      const response = await fetch(`/api/cms/translations/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });

      if (response.ok) {
        fetchTranslations();
      }
    } catch (error) {
      console.error('Error updating translation:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 font-semibold">Loading translations...</div>
      </div>
    );
  }

  // Group translations by key
  const grouped = translations.reduce((acc, t) => {
    if (!acc[t.key]) {
      acc[t.key] = {};
    }
    acc[t.key][t.locale] = t;
    return acc;
  }, {} as Record<string, Record<string, Translation>>);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/cms" className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-block">
          ← Back to CMS
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Translations</h1>
        <p className="text-gray-600 mt-2">Manage multi-language content for all pages</p>
      </div>

      <div className="mb-6 flex gap-2 flex-wrap">
        <button
          onClick={() => setSelectedNamespace('common')}
          className={`px-4 py-2 rounded-lg font-medium transition ${
            selectedNamespace === 'common'
              ? 'bg-red-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        {namespaces.map((ns) => (
          <button
            key={ns}
            onClick={() => setSelectedNamespace(ns)}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              selectedNamespace === ns
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {ns}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">Key</th>
                {locales.map((locale) => (
                  <th key={locale} className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase">
                    {localeNames[locale]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(grouped).map(([key, translationsByLocale]) => (
                <tr key={key} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <code className="text-sm text-gray-600">{key}</code>
                  </td>
                  {locales.map((locale) => {
                    const translation = translationsByLocale[locale];
                    return (
                      <td key={locale} className="px-6 py-4">
                        {translation ? (
                          <input
                            type="text"
                            defaultValue={translation.value}
                            onBlur={(e) => handleSave(translation.id, e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900 text-sm"
                          />
                        ) : (
                          <span className="text-gray-400 text-sm">—</span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {Object.keys(grouped).length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No translations found for this namespace.</p>
        </div>
      )}
    </div>
  );
}

