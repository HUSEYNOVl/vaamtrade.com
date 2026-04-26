'use client';

import { useState, useEffect, useRef } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import LanguageSwitcher from './LanguageSwitcher';

export default function Navigation() {
  const t = useTranslations('Navigation');
  const rawPath = usePathname() ?? '';
  const path = rawPath.replace(/^\/(en|zh|ru|ar)/, '') || '/';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
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
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');

        .nav-root {
          position: sticky;
          top: 0;
          z-index: 50;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .nav-root.scrolled {
          background: rgba(10, 8, 8, 0.92);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-bottom: 1px solid rgba(200, 50, 26, 0.15);
          box-shadow: 0 8px 40px rgba(0,0,0,0.4), 0 1px 0 rgba(200,50,26,0.1);
        }

        .nav-root.top {
          background: rgba(255,255,255,1);
          border-bottom: 1px solid rgba(0,0,0,0.07);
          box-shadow: none;
        }

        .nav-link {
          position: relative;
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 13px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 6px 0;
          transition: color 0.2s ease;
        }

        .nav-link::before {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 100%;
          height: 1.5px;
          background: linear-gradient(90deg, #c8321a, #ff6b4a);
          transition: right 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          border-radius: 2px;
        }

        .nav-link:hover::before,
        .nav-link.active::before { right: 0; }

        .nav-link-dot {
          display: inline-block;
          width: 4px; height: 4px;
          background: #c8321a;
          border-radius: 50%;
          margin-right: 6px;
          opacity: 0;
          transform: scale(0);
          transition: all 0.2s ease;
          vertical-align: middle;
          margin-bottom: 1px;
        }

        .nav-link.active .nav-link-dot {
          opacity: 1;
          transform: scale(1);
        }

        .quote-btn {
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
          font-weight: 600;
          font-size: 12px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          padding: 10px 22px;
          border-radius: 4px;
          color: white;
          background: linear-gradient(135deg, #c8321a 0%, #a02518 100%);
          transition: all 0.3s ease;
          border: 1px solid rgba(255,255,255,0.1);
        }

        .quote-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 60%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .quote-btn::after {
          content: '';
          position: absolute;
          top: 50%; left: -60%;
          width: 40%; height: 200%;
          background: rgba(255,255,255,0.12);
          transform: translateY(-50%) skewX(-20deg);
          transition: left 0.5s ease;
        }

        .quote-btn:hover::before { opacity: 1; }
        .quote-btn:hover::after { left: 130%; }
        .quote-btn:hover {
          box-shadow: 0 4px 24px rgba(200,50,26,0.5), 0 0 0 1px rgba(200,50,26,0.3);
          transform: translateY(-1px);
        }
        .quote-btn:active { transform: translateY(0); }

        .hamburger-line {
          display: block;
          height: 1.5px;
          background: currentColor;
          border-radius: 2px;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          transform-origin: center;
        }

        .mobile-menu {
          overflow: hidden;
          transition: max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
        }

        .mobile-link {
          font-family: 'Outfit', sans-serif;
          font-weight: 500;
          font-size: 15px;
          letter-spacing: 0.05em;
          padding: 14px 16px;
          border-radius: 6px;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .mobile-link:hover {
          background: rgba(200,50,26,0.08);
        }

        .progress-bar {
          position: fixed;
          top: 0; left: 0;
          height: 2px;
          z-index: 60;
          pointer-events: none;
          background: linear-gradient(90deg, #c8321a, #ff6b4a, #c8321a);
          background-size: 200% 100%;
          animation: shimmer 2s linear infinite;
          box-shadow: 0 0 12px rgba(200,50,26,0.7), 0 0 4px rgba(255,107,74,0.4);
          transition: width 0.1s linear;
        }

        @keyframes shimmer {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }

        .logo-img {
          height: 44px;
          width: auto;
          transition: all 0.3s ease;
          filter: drop-shadow(0 0 0px rgba(200,50,26,0));
        }

        .logo-img:hover {
          transform: scale(1.04);
          filter: drop-shadow(0 2px 12px rgba(200,50,26,0.3));
        }

        .nav-enter {
          opacity: 0;
          transform: translateY(-8px);
          animation: navEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes navEnter {
          to { opacity: 1; transform: translateY(0); }
        }

        .nav-link-item {
          animation: navEnter 0.5s cubic-bezier(0.16, 1, 0.3, 1) both;
        }
        .nav-link-item:nth-child(1) { animation-delay: 0.05s; }
        .nav-link-item:nth-child(2) { animation-delay: 0.1s; }
        .nav-link-item:nth-child(3) { animation-delay: 0.15s; }

        .scrolled .nav-link { color: rgba(255,255,255,0.7); }
        .scrolled .nav-link:hover,
        .scrolled .nav-link.active { color: #fff; }
        .top .nav-link { color: rgba(30,20,20,0.55); }
        .top .nav-link:hover,
        .top .nav-link.active { color: #1a1008; }
      `}</style>

      {/* Progress bar */}
      {progress > 0 && (
        <div className="progress-bar" style={{ width: `${progress}%` }} />
      )}

      <nav ref={navRef} className={`nav-root ${scrolled ? 'scrolled' : 'top'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between" style={{ height: '70px' }}>

            {/* Logo */}
            <Link href="/" className="shrink-0 flex items-center">
              <img
                src="https://res.cloudinary.com/dvoojvo7i/image/upload/v1777192196/uploads/sijqy34v6h0qlw9a5jbo.png"
                alt="VAAM Motors"
                className="logo-img"
                style={{ filter: scrolled ? 'brightness(1)' : 'brightness(0) saturate(100%) invert(18%) sepia(90%) saturate(1200%) hue-rotate(340deg) brightness(80%)' }}
              />
            </Link>

            {/* Desktop links */}
            <div className="hidden md:flex items-center gap-10">
              {navLinks.map((l, i) => (
                <div key={l.href} className="nav-link-item">
                  <Link
                    href={l.href}
                    className={`nav-link ${isActive(l.href) ? 'active' : ''}`}
                    style={{ color: scrolled ? (isActive(l.href) ? '#fff' : 'rgba(255,255,255,0.65)') : (isActive(l.href) ? '#1a0808' : 'rgba(30,20,20,0.5)') }}
                    onMouseEnter={() => setHovered(l.href)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    <span className="nav-link-dot" />
                    {l.label}
                  </Link>
                </div>
              ))}
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <div style={{ opacity: scrolled ? 0.9 : 1, transition: 'opacity 0.3s ease' }}>
                <LanguageSwitcher />
              </div>

              <Link href="/contact" className="quote-btn hidden md:inline-flex items-center gap-2">
                Get a Quote
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </Link>

              {/* Hamburger */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex flex-col items-center justify-center gap-[5px] w-9 h-9 rounded-md"
                style={{ color: scrolled ? 'white' : 'var(--text)', background: 'transparent', border: `1px solid ${scrolled ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)'}` }}
                aria-label="Menu"
              >
                <span className="hamburger-line w-[16px]" style={{ transform: mobileOpen ? 'translateY(6.5px) rotate(45deg)' : 'none' }} />
                <span className="hamburger-line w-[16px]" style={{ opacity: mobileOpen ? 0 : 1, transform: mobileOpen ? 'scaleX(0)' : 'none' }} />
                <span className="hamburger-line w-[16px]" style={{ transform: mobileOpen ? 'translateY(-6.5px) rotate(-45deg)' : 'none' }} />
              </button>
            </div>
          </div>

          {/* Mobile menu */}
          <div
            className="mobile-menu md:hidden"
            style={{ maxHeight: mobileOpen ? '340px' : '0', opacity: mobileOpen ? 1 : 0 }}
          >
            <div
              className="py-3 pb-5 flex flex-col gap-1 border-t"
              style={{ borderColor: scrolled ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)' }}
            >
              {navLinks.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="mobile-link"
                  style={{
                    background: isActive(l.href) ? 'rgba(200,50,26,0.1)' : 'transparent',
                    color: scrolled
                      ? (isActive(l.href) ? '#ff8060' : 'rgba(255,255,255,0.75)')
                      : (isActive(l.href) ? '#c8321a' : 'var(--text)'),
                  }}
                >
                  {isActive(l.href) && (
                    <span style={{ width: 3, height: 18, background: '#c8321a', borderRadius: 2, display: 'inline-block', flexShrink: 0 }} />
                  )}
                  {l.label}
                </Link>
              ))}

              <Link
                href="/contact"
                onClick={() => setMobileOpen(false)}
                className="quote-btn mt-2 flex items-center justify-center gap-2"
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
