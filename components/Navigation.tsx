'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (y / total) * 100 : 0);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

      <nav
        className="sticky top-0 z-50 transition-all duration-500"
        style={{
          background: scrolled ? 'rgba(5,5,5,0.92)' : 'rgba(10,10,10,0.82)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
          boxShadow: scrolled ? '0 8px 40px rgba(0,0,0,0.5)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center gap-4 md:gap-10">
              <Link href="/" className="group flex items-center gap-2.5">
                <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/50 group-hover:scale-110 group-hover:shadow-red-600/50 transition-all duration-300">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                  </svg>
                </div>
                <span className="text-xl md:text-2xl font-black text-white tracking-tight">
                  VAAM <span className="text-red-500">Motors</span>
                </span>
              </Link>

              <div className="hidden md:flex items-center gap-1">
                {[
                  { href: '/' as const, label: t('home') },
                  { href: '/about' as const, label: t('about') },
                ].map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="animated-underline text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 hover:bg-white/5"
                  >
                    {link.label}
                  </Link>
                ))}
                <Link
                  href="/contact"
                  className="btn-glow ml-2 bg-red-600 text-white px-5 py-2.5 rounded-lg font-semibold shadow-lg shadow-red-900/40"
                >
                  {t('contact')}
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden relative w-10 h-10 flex flex-col justify-center items-center gap-1.5"
                aria-label="Toggle menu"
              >
                <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 w-0' : 'w-5'}`} />
                <span className={`block h-0.5 w-6 bg-white rounded transition-all duration-300 ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
              </button>
            </div>
          </div>

          <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileMenuOpen ? 'max-h-64 pb-4' : 'max-h-0'}`}>
            <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
              {[
                { href: '/' as const, label: t('home') },
                { href: '/about' as const, label: t('about') },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white px-4 py-2 rounded-lg font-medium transition-colors hover:bg-white/5"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="/contact"
                className="bg-red-600 text-white px-4 py-3 rounded-lg font-semibold text-center hover:bg-red-700 transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('contact')}
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
