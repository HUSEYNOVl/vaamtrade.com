'use client';

import { useState, useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const rawPath = usePathname() ?? '';
  // strip locale prefix for comparison
  const path = rawPath.replace(/^\/(en|zh|ru|ar)/, '') || '/';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { href: '/' as const, label: t('home') },
    { href: '/about' as const, label: t('about') },
    { href: '/contact' as const, label: t('contact') },
  ];

  const isActive = (href: string) => href === '/' ? path === '/' : path.startsWith(href);

  return (
    <>
      <style>{`
        .nav-pill-link { position:relative; }
        .nav-pill-link::after {
          content:'';
          position:absolute;
          bottom:-2px; left:50%; right:50%;
          height:2px;
          background:var(--accent);
          border-radius:2px;
          transition:left 0.25s ease, right 0.25s ease;
        }
        .nav-pill-link:hover::after,
        .nav-pill-link.active::after { left:0; right:0; }
        .nav-pill-link.active { color:var(--accent); }
      `}</style>

      {/* scroll progress bar */}
      <div
        className="fixed top-0 left-0 h-[2px] z-[60] pointer-events-none"
        style={{
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #c8321a, #ff6b4a)',
          transition: 'width 0.1s linear',
          boxShadow: '0 0 8px rgba(200,50,26,0.6)',
        }}
      />

      <nav
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,1)',
          backdropFilter: scrolled ? 'blur(16px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
          borderBottom: scrolled ? '1px solid rgba(0,0,0,0.06)' : '1px solid var(--border)',
          boxShadow: scrolled ? '0 4px 30px rgba(0,0,0,0.06)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: '68px' }}>

            {/* ── Logo ─────────────────────────────────── */}
            <Link href="/" className="flex items-center gap-3 group shrink-0">
              <div
                className="relative w-9 h-9 rounded-xl flex items-center justify-center text-white font-black text-base transition-transform duration-200 group-hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #c8321a 0%, #a02518 100%)',
                  boxShadow: '0 2px 12px rgba(200,50,26,0.35)',
                }}
              >
                V
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white" style={{ background: '#22c55e' }} />
              </div>
              <div className="leading-none">
                <span className="font-black text-[17px] tracking-tight" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
                  VAAM
                </span>
                <span className="font-black text-[17px] tracking-tight ml-1.5" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}>
                  Motors
                </span>
              </div>
            </Link>

            {/* ── Desktop links ─────────────────────────── */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`nav-pill-link text-sm font-semibold pb-0.5 transition-colors duration-150 ${isActive(l.href) ? 'active' : ''}`}
                  style={{ color: isActive(l.href) ? 'var(--accent)' : 'var(--text-muted)' }}
                >
                  {l.label}
                </Link>
              ))}
            </div>

            {/* ── Right side ───────────────────────────── */}
            <div className="flex items-center gap-3">
              <LanguageSwitcher />

              <Link
                href="/contact"
                className="hidden md:inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, #c8321a 0%, #a02518 100%)',
                  boxShadow: '0 2px 14px rgba(200,50,26,0.3)',
                  fontFamily: 'Syne, sans-serif',
                }}
              >
                Get a Quote
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Hamburger */}
              <button
                className="md:hidden w-9 h-9 rounded-xl flex flex-col items-center justify-center gap-[5px] transition-colors"
                style={{ background: mobileOpen ? 'var(--bg)' : 'transparent', border: '1px solid var(--border)' }}
                onClick={() => setMobileOpen(!mobileOpen)}
                aria-label="Menu"
              >
                <span
                  className="block w-4 h-[1.5px] rounded-full transition-all duration-200"
                  style={{ background: 'var(--text)', transform: mobileOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }}
                />
                <span
                  className="block w-4 h-[1.5px] rounded-full transition-all duration-200"
                  style={{ background: 'var(--text)', opacity: mobileOpen ? 0 : 1 }}
                />
                <span
                  className="block w-4 h-[1.5px] rounded-full transition-all duration-200"
                  style={{ background: 'var(--text)', transform: mobileOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }}
                />
              </button>
            </div>
          </div>

          {/* ── Mobile menu ─────────────────────────────── */}
          <div
            className="md:hidden overflow-hidden transition-all duration-300"
            style={{ maxHeight: mobileOpen ? '320px' : '0', opacity: mobileOpen ? 1 : 0 }}
          >
            <div className="border-t border-[var(--border)] py-3 flex flex-col gap-1">
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150"
                  style={{
                    background: isActive(l.href) ? 'var(--accent-light)' : 'transparent',
                    color: isActive(l.href) ? 'var(--accent)' : 'var(--text)',
                  }}
                >
                  {isActive(l.href) && (
                    <span className="w-1 h-4 rounded-full shrink-0" style={{ background: 'var(--accent)' }} />
                  )}
                  {l.label}
                </Link>
              ))}
              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="mt-2 mx-0 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-white"
                style={{ background: 'linear-gradient(135deg, #c8321a, #a02518)', fontFamily: 'Syne, sans-serif' }}
              >
                Get a Quote →
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}
