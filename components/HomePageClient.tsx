'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/types/car';
import CarCard from './CarCard';

interface HomePageClientProps {
  cars?: Car[];
  car?: Car;
}

type Layout = 'grid' | 'list';

export default function HomePageClient({ cars, car }: HomePageClientProps) {
  const [filtered, setFiltered] = useState<Car[]>(cars || []);
  const [search, setSearch] = useState('');
  const [condition, setCondition] = useState('');
  const [transmission, setTransmission] = useState('');
  const [fuelType, setFuelType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [layout, setLayout] = useState<Layout>('grid');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (cars) setFiltered(applyFilters(cars));
  }, [cars, search, condition, transmission, fuelType, minPrice, maxPrice, sortBy]);

  if (car) return <CarCard car={car} />;

  const applyFilters = (list: Car[]) => {
    let r = [...list];
    if (search) {
      const q = search.toLowerCase();
      r = r.filter((c) => c.make.toLowerCase().includes(q) || c.model.toLowerCase().includes(q) || c.year.toString().includes(q));
    }
    if (condition) r = r.filter((c) => c.condition === condition);
    if (transmission) r = r.filter((c) => c.transmission === transmission);
    if (fuelType) r = r.filter((c) => c.fuelType === fuelType);
    if (minPrice) r = r.filter((c) => c.price >= parseFloat(minPrice));
    if (maxPrice) r = r.filter((c) => c.price <= parseFloat(maxPrice));
    if (sortBy === 'newest') r.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'price-asc') r.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') r.sort((a, b) => b.price - a.price);
    else if (sortBy === 'year-desc') r.sort((a, b) => b.year - a.year);
    return r;
  };

  const clearFilters = () => { setSearch(''); setCondition(''); setTransmission(''); setFuelType(''); setMinPrice(''); setMaxPrice(''); setSortBy('newest'); };
  const hasFilters = !!(search || condition || transmission || fuelType || minPrice || maxPrice);
  const transmissions = [...new Set((cars || []).map((c) => c.transmission).filter(Boolean))].sort() as string[];
  const fuels = [...new Set((cars || []).map((c) => c.fuelType).filter(Boolean))].sort() as string[];

  /* ── Filter Panel ─────────────────────────────────── */
  const FilterPanel = () => (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4" style={{ borderBottom: '1.5px solid var(--border)' }}>
        <div className="flex items-center gap-2">
          <svg className="w-4 h-4" style={{ color: 'var(--accent)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          <span className="font-bold text-sm text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>Filters</span>
          {hasFilters && (
            <span className="w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center" style={{ background: 'var(--accent)' }}>
              {[search, condition, transmission, fuelType, minPrice || maxPrice ? 'p' : ''].filter(Boolean).length}
            </span>
          )}
        </div>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
            Reset
          </button>
        )}
      </div>

      <div className="space-y-5">
        {/* Search */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Keyword</label>
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text" value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Make, model, year…" className="input-base pl-9 text-sm"
            />
          </div>
        </div>

        {/* Condition pills */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Condition</label>
          <div className="flex gap-2">
            {[
              { v: '', label: 'All' },
              { v: 'New', label: '🆕 New' },
              { v: 'Used', label: '🔧 Used' },
            ].map(({ v, label }) => (
              <button
                key={v} onClick={() => setCondition(v)}
                className="flex-1 py-2 text-xs rounded-lg border font-semibold transition-all duration-150"
                style={{
                  borderColor: condition === v ? 'var(--accent)' : 'var(--border)',
                  background: condition === v ? 'var(--accent-light)' : 'white',
                  color: condition === v ? 'var(--accent)' : 'var(--text-muted)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Price range */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Price Range (USD)</label>
          <div className="flex gap-2 items-center">
            <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="input-base text-sm" />
            <span className="text-gray-300 text-sm shrink-0">—</span>
            <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="input-base text-sm" />
          </div>
        </div>

        {/* Transmission */}
        {transmissions.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Transmission</label>
            <div className="flex flex-wrap gap-1.5">
              {['', ...transmissions].map((t) => (
                <button
                  key={t} onClick={() => setTransmission(t)}
                  className="px-3 py-1.5 rounded-lg text-xs border font-medium transition-all duration-150"
                  style={{
                    borderColor: transmission === t ? 'var(--accent)' : 'var(--border)',
                    background: transmission === t ? 'var(--accent-light)' : 'white',
                    color: transmission === t ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {t || 'Any'}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fuel type */}
        {fuels.length > 0 && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Fuel Type</label>
            <div className="flex flex-wrap gap-1.5">
              {['', ...fuels].map((f) => (
                <button
                  key={f} onClick={() => setFuelType(f)}
                  className="px-3 py-1.5 rounded-lg text-xs border font-medium transition-all duration-150"
                  style={{
                    borderColor: fuelType === f ? 'var(--accent)' : 'var(--border)',
                    background: fuelType === f ? 'var(--accent-light)' : 'white',
                    color: fuelType === f ? 'var(--accent)' : 'var(--text-muted)',
                  }}
                >
                  {f || 'Any'}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-24 rounded-2xl border border-dashed border-[var(--border)]">
        <div className="text-5xl mb-4">🚗</div>
        <p className="font-semibold text-[var(--text-muted)] mb-1">No vehicles yet</p>
        <p className="text-sm text-gray-400">Check back soon or contact us to source a vehicle</p>
      </div>
    );
  }

  return (
    <div className="flex gap-7">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div
          className="rounded-2xl border p-5 sticky top-24"
          style={{ background: 'white', borderColor: 'var(--border)' }}
        >
          <FilterPanel />
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 min-w-0">

        {/* Toolbar */}
        <div
          className="flex items-center justify-between gap-3 flex-wrap mb-5 px-4 py-3 rounded-xl border bg-white"
          style={{ borderColor: 'var(--border)' }}
        >
          <div className="flex items-center gap-3">
            {/* Mobile filter btn */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors"
              style={{
                borderColor: sidebarOpen || hasFilters ? 'var(--accent)' : 'var(--border)',
                color: sidebarOpen || hasFilters ? 'var(--accent)' : 'var(--text-muted)',
                background: sidebarOpen || hasFilters ? 'var(--accent-light)' : 'white',
              }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
              </svg>
              Filters
              {hasFilters && <span className="w-4 h-4 rounded-full text-white text-[10px] font-bold flex items-center justify-center" style={{ background: 'var(--accent)' }}>!</span>}
            </button>

            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="font-bold" style={{ color: 'var(--text)' }}>{filtered.length}</span>
              <span className="ml-1">vehicle{filtered.length !== 1 ? 's' : ''}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={sortBy} onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border rounded-lg px-3 py-1.5 outline-none cursor-pointer transition-colors"
              style={{ borderColor: 'var(--border)', color: 'var(--text)', background: 'white' }}
            >
              <option value="newest">Newest First</option>
              <option value="price-asc">Price ↑</option>
              <option value="price-desc">Price ↓</option>
              <option value="year-desc">Newest Year</option>
            </select>

            {/* Layout toggle */}
            <div className="hidden sm:flex rounded-lg overflow-hidden border" style={{ borderColor: 'var(--border)' }}>
              {(['grid', 'list'] as Layout[]).map((l) => (
                <button
                  key={l} onClick={() => setLayout(l)}
                  className="p-2 transition-all duration-150"
                  style={{
                    background: layout === l ? 'var(--accent)' : 'white',
                    color: layout === l ? 'white' : 'var(--text-muted)',
                  }}
                  title={l === 'grid' ? 'Grid view' : 'List view'}
                >
                  {l === 'grid' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M1 2.5A1.5 1.5 0 012.5 1h3A1.5 1.5 0 017 2.5v3A1.5 1.5 0 015.5 7h-3A1.5 1.5 0 011 5.5v-3zm8 0A1.5 1.5 0 0110.5 1h3A1.5 1.5 0 0115 2.5v3A1.5 1.5 0 0113.5 7h-3A1.5 1.5 0 019 5.5v-3zm-8 8A1.5 1.5 0 012.5 9h3A1.5 1.5 0 017 10.5v3A1.5 1.5 0 015.5 15h-3A1.5 1.5 0 011 13.5v-3zm8 0A1.5 1.5 0 0110.5 9h3A1.5 1.5 0 0115 10.5v3A1.5 1.5 0 0113.5 15h-3A1.5 1.5 0 019 13.5v-3z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M2 2.5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h12a.5.5 0 00.5-.5V3a.5.5 0 00-.5-.5H2zm0 5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h12a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5H2zm0 5a.5.5 0 00-.5.5v1a.5.5 0 00.5.5h12a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5H2z" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile filter drawer */}
        {sidebarOpen && (
          <div className="lg:hidden bg-white rounded-2xl border border-[var(--border)] p-5 mb-5">
            <FilterPanel />
          </div>
        )}

        {/* Active chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderColor: 'rgba(200,50,26,0.2)' }}>
                🔍 &quot;{search}&quot;
                <button onClick={() => setSearch('')} className="hover:opacity-70 font-bold">×</button>
              </span>
            )}
            {condition && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderColor: 'rgba(200,50,26,0.2)' }}>
                {condition}
                <button onClick={() => setCondition('')} className="hover:opacity-70 font-bold">×</button>
              </span>
            )}
            {transmission && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderColor: 'rgba(200,50,26,0.2)' }}>
                {transmission}
                <button onClick={() => setTransmission('')} className="hover:opacity-70 font-bold">×</button>
              </span>
            )}
            {fuelType && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderColor: 'rgba(200,50,26,0.2)' }}>
                {fuelType}
                <button onClick={() => setFuelType('')} className="hover:opacity-70 font-bold">×</button>
              </span>
            )}
            {(minPrice || maxPrice) && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ background: 'var(--accent-light)', color: 'var(--accent)', borderColor: 'rgba(200,50,26,0.2)' }}>
                ${minPrice || '0'} – ${maxPrice || '∞'}
                <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="hover:opacity-70 font-bold">×</button>
              </span>
            )}
          </div>
        )}

        {/* Results */}
        {filtered.length === 0 ? (
          <div className="text-center py-16 rounded-2xl border border-dashed border-[var(--border)] bg-white">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-semibold text-[var(--text-muted)] mb-3">No vehicles match your filters</p>
            <button onClick={clearFilters} className="btn btn-primary text-sm px-5">Clear All Filters</button>
          </div>
        ) : layout === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((c) => <CarCard key={c.id} car={c} layout="grid" />)}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filtered.map((c) => <CarCard key={c.id} car={c} layout="list" />)}
          </div>
        )}
      </div>
    </div>
  );
}
