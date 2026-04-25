'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <div className="scroll-progress" style={{ width: `${progress}%` }} />

      <nav
        className="sticky top-0 z-50 bg-white transition-shadow duration-300"
        style={{
          borderBottom: '1.5px solid var(--border)',
          boxShadow: scrolled ? '0 2px 20px rgba(0,0,0,0.07)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 group">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black"
                style={{ background: 'var(--accent)' }}
              >
                V
              </div>
              <span className="font-extrabold text-lg tracking-tight text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
                VAAM <span style={{ color: 'var(--accent)' }}>Motors</span>
              </span>
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-7">
              <Link href="/" className="nav-link">{t('home')}</Link>
              <Link href="/about" className="nav-link">{t('about')}</Link>
              <Link href="/contact" className="nav-link">{t('contact')}</Link>
            </div>

            {/* Right */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <Link
                href="/contact"
                className="hidden md:inline-flex btn btn-primary text-sm"
              >
                Get a Quote
              </Link>
              <button
                className="md:hidden p-2 rounded-lg hover:bg-[var(--bg)] transition-colors"
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <div className="w-5 flex flex-col gap-1.5">
                  <span className={`block h-0.5 bg-[var(--text)] rounded transition-all duration-200 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block h-0.5 bg-[var(--text)] rounded transition-all duration-200 ${mobileOpen ? 'opacity-0' : ''}`} />
                  <span className={`block h-0.5 bg-[var(--text)] rounded transition-all duration-200 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileOpen && (
            <div className="md:hidden border-t border-[var(--border)] py-4 flex flex-col gap-1">
              {[
                { href: '/' as const, label: t('home') },
                { href: '/about' as const, label: t('about') },
                { href: '/contact' as const, label: t('contact') },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg text-[var(--text)] font-medium hover:bg-[var(--bg)] transition-colors"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </nav>
    </>
  );
}
