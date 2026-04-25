'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from 'next-intl';

export default function AnimatedHero() {
  const [search, setSearch] = useState('');
  const router = useRouter();
  const locale = useLocale();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    router.push(`/${locale}/cars${params}`);
  };

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #1a1a18 0%, #2d1a10 50%, #1a1814 100%)',
        minHeight: '420px',
      }}
    >
      {/* Decorative pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: 'radial-gradient(circle, #c8321a 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />
      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }} />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        {/* Eyebrow */}
        <div
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6 tracking-wider uppercase"
          style={{
            background: 'rgba(200,50,26,0.15)',
            color: '#f0856a',
            border: '1px solid rgba(200,50,26,0.25)',
            animation: 'fadeUp 0.5s ease forwards',
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#f0856a]" style={{ animation: 'pulse-dot 2s ease infinite' }} />
          Licensed Global Car Export Platform
        </div>

        <h1
          className="text-white text-4xl md:text-6xl font-extrabold leading-tight mb-4"
          style={{
            fontFamily: 'Syne, sans-serif',
            animation: 'fadeUp 0.6s 0.1s ease both',
          }}
        >
          Find Your Next Car.
          <br />
          <span style={{ color: 'var(--accent)' }}>Ship It Anywhere.</span>
        </h1>

        <p
          className="text-gray-400 text-lg mb-10 max-w-xl mx-auto"
          style={{ animation: 'fadeUp 0.6s 0.2s ease both' }}
        >
          500+ premium vehicles. 50+ countries served. Certified inspections, secure payments, door-to-door delivery.
        </p>

        {/* Search bar */}
        <form
          onSubmit={handleSearch}
          className="flex items-center gap-2 max-w-xl mx-auto"
          style={{ animation: 'fadeUp 0.6s 0.3s ease both' }}
        >
          <div className="flex-1 flex items-center bg-white rounded-xl shadow-xl overflow-hidden border-2 border-transparent focus-within:border-[var(--accent)] transition-all">
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
          <button type="submit" className="btn btn-primary px-6 py-4 rounded-xl text-sm shrink-0">
            Search
          </button>
        </form>

        {/* Quick filters */}
        <div
          className="flex flex-wrap justify-center gap-2 mt-5"
          style={{ animation: 'fadeUp 0.6s 0.4s ease both' }}
        >
          {['BMW', 'Mercedes', 'Toyota', 'Lexus', 'Audi', 'Porsche'].map((brand) => (
            <button
              key={brand}
              onClick={() => { setSearch(brand); }}
              className="px-4 py-1.5 rounded-full text-xs font-medium text-gray-400 border border-gray-700 hover:border-[var(--accent)] hover:text-[var(--accent)] transition-colors"
            >
              {brand}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
