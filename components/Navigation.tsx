'use client';

import { useState } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('Navigation');
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center gap-4 md:gap-10">
            <Link href="/" className="text-xl md:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              VAAM Motors
            </Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                {t('home')}
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors">
                {t('about')}
              </Link>
              <Link href="/contact" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold transition-colors shadow-md">
                {t('contact')}
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-gray-700 hover:text-red-600"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col gap-4">
              <Link href="/" className="text-gray-700 hover:text-red-600 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {t('home')}
              </Link>
              <Link href="/about" className="text-gray-700 hover:text-red-600 font-medium transition-colors" onClick={() => setMobileMenuOpen(false)}>
                {t('about')}
              </Link>
              <Link href="/contact" className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold transition-colors shadow-md text-center" onClick={() => setMobileMenuOpen(false)}>
                {t('contact')}
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

