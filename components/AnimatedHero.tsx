'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';
import HeroCanvas from './HeroCanvas';

export default function AnimatedHero() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const locale = useLocale();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    router.push(`/${locale}/cars${params}`);
  };

  const setQuick = (brand: string) => setSearch(brand);

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '520px' }}>
      {/* Animated canvas background */}
      <HeroCanvas />

      {/* Dark vignette overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.55) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade into page background */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        {/* Eyebrow badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold mb-7 tracking-widest uppercase"
          style={{
            background: 'rgba(200,50,26,0.18)',
            color: '#f0856a',
            border: '1px solid rgba(200,50,26,0.3)',
            animation: 'fadeUp 0.5s ease both',
            backdropFilter: 'blur(8px)',
          }}
        >
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: '#f0856a', animation: 'pulse-dot 2s ease infinite' }}
          />
          Licensed Global Car Export Platform
        </div>

        {/* Headline */}
        <h1
          className="text-white text-5xl md:text-7xl font-extrabold leading-[1.05] mb-5"
          style={{
            fontFamily: 'Syne, sans-serif',
            animation: 'fadeUp 0.6s 0.1s ease both',
            textShadow: '0 4px 40px rgba(0,0,0,0.6)',
          }}
        >
          Find Your Next Car.
          <br />
          <span style={{ color: 'var(--accent)' }}>Ship It Anywhere.</span>
        </h1>

        {/* Sub */}
        <p
          className="text-gray-300 text-lg md:text-xl mb-10 max-w-xl mx-auto leading-relaxed"
          style={{ animation: 'fadeUp 0.6s 0.2s ease both', textShadow: '0 2px 12px rgba(0,0,0,0.5)' }}
        >
          500+ premium vehicles. 50+ countries served.
          Certified inspections &amp; door-to-door delivery.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-lg mx-auto mb-6"
          style={{ animation: 'fadeUp 0.6s 0.3s ease both' }}
        >
          <div
            className="flex-1 flex items-center bg-white rounded-xl overflow-hidden border-2 border-transparent focus-within:border-[var(--accent)] transition-all"
            style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
          >
            <svg className="w-5 h-5 ml-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, year…"
              className="flex-1 px-3 py-4 text-[var(--text)] text-sm outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary px-6 py-4 rounded-xl text-sm shrink-0"
            style={{ boxShadow: '0 4px 20px rgba(200,50,26,0.5)' }}
          >
            Search
          </button>
        </form>

        {/* Quick brand pills */}
        <div
          className="flex flex-wrap justify-center gap-2"
          style={{ animation: 'fadeUp 0.6s 0.4s ease both' }}
        >
          {['BMW', 'Mercedes', 'Toyota', 'Lexus', 'Audi', 'Porsche'].map((brand) => (
            <button
              key={brand}
              onClick={() => setQuick(brand)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={{
                color: '#aaa',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'rgba(255,255,255,0.05)',
                backdropFilter: 'blur(4px)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)';
                e.currentTarget.style.color = '#f0856a';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = '#aaa';
              }}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ animation: 'fadeUp 1s 0.8s ease both' }}
      >
        <span className="text-xs tracking-widest uppercase text-gray-500">Scroll</span>
        <div className="w-px h-8 rounded" style={{ background: 'linear-gradient(to bottom, rgba(200,50,26,0.6), transparent)' }} />
      </div>
    </section>
  );
}
