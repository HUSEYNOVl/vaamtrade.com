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
    let result = [...list];
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) =>
        c.make.toLowerCase().includes(q) ||
        c.model.toLowerCase().includes(q) ||
        c.year.toString().includes(q)
      );
    }
    if (condition) result = result.filter((c) => c.condition === condition);
    if (transmission) result = result.filter((c) => c.transmission === transmission);
    if (fuelType) result = result.filter((c) => c.fuelType === fuelType);
    if (minPrice) result = result.filter((c) => c.price >= parseFloat(minPrice));
    if (maxPrice) result = result.filter((c) => c.price <= parseFloat(maxPrice));

    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    else if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'year-desc') result.sort((a, b) => b.year - a.year);

    return result;
  };

  const clearFilters = () => {
    setSearch(''); setCondition(''); setTransmission('');
    setFuelType(''); setMinPrice(''); setMaxPrice(''); setSortBy('newest');
  };

  const hasFilters = search || condition || transmission || fuelType || minPrice || maxPrice;

  const transmissions = [...new Set((cars || []).map((c) => c.transmission).filter(Boolean))].sort() as string[];
  const fuels = [...new Set((cars || []).map((c) => c.fuelType).filter(Boolean))].sort() as string[];

  const FilterPanel = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-[var(--text)] text-base" style={{ fontFamily: 'Syne, sans-serif' }}>Filters</h3>
        {hasFilters && (
          <button onClick={clearFilters} className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
            Clear all
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Search</label>
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Make, model, year…" className="input-base pl-9" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Condition</label>
        <div className="flex gap-2">
          {['', 'New', 'Used'].map((v) => (
            <button
              key={v}
              onClick={() => setCondition(v)}
              className="flex-1 py-2 text-sm rounded-lg border transition-all font-medium"
              style={{
                borderColor: condition === v ? 'var(--accent)' : 'var(--border)',
                background: condition === v ? 'var(--accent-light)' : 'white',
                color: condition === v ? 'var(--accent)' : 'var(--text-muted)',
              }}
            >
              {v || 'All'}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Price (USD)</label>
        <div className="flex gap-2">
          <input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min" className="input-base" />
          <input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max" className="input-base" />
        </div>
      </div>

      {transmissions.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Transmission</label>
          <select value={transmission} onChange={(e) => setTransmission(e.target.value)} className="input-base">
            <option value="">Any</option>
            {transmissions.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      )}

      {fuels.length > 0 && (
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>Fuel Type</label>
          <select value={fuelType} onChange={(e) => setFuelType(e.target.value)} className="input-base">
            <option value="">Any</option>
            {fuels.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
        </div>
      )}
    </div>
  );

  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-20 h-20 bg-[var(--bg)] rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10l1 1h10a1 1 0 001-1zm0 0l1.5-5H18a2 2 0 012 2v3h-7z" />
          </svg>
        </div>
        <p className="font-medium mb-2" style={{ color: 'var(--text-muted)' }}>No cars in inventory yet</p>
        <p className="text-sm text-gray-400">Check back soon or contact us to source a vehicle</p>
      </div>
    );
  }

  return (
    <div className="flex gap-8">
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="bg-white rounded-xl border border-[var(--border)] p-5 sticky top-24">
          <FilterPanel />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden btn btn-outline text-sm gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h18v2H3V4zm3 7h12v2H6v-2zm4 7h4v2h-4v-2z" />
              </svg>
              Filters {hasFilters && <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />}
            </button>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              <span className="font-bold" style={{ color: 'var(--text)' }}>{filtered.length}</span> vehicles found
            </p>
          </div>
          <div className="flex items-center gap-3">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="input-base !w-auto text-sm py-2">
              <option value="newest">Newest First</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="year-desc">Year: Newest</option>
            </select>
            <div className="hidden sm:flex border border-[var(--border)] rounded-lg overflow-hidden">
              {(['grid', 'list'] as Layout[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLayout(l)}
                  className="p-2 transition-colors"
                  style={{ background: layout === l ? 'var(--accent)' : 'white', color: layout === l ? 'white' : 'var(--text-muted)' }}
                >
                  {l === 'grid' ? (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 7h18v2H3v-2zm0 7h18v2H3v-2z" /></svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div className="lg:hidden bg-white rounded-xl border border-[var(--border)] p-5 mb-5">
            <FilterPanel />
          </div>
        )}

        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {search && <span className="tag">🔍 &quot;{search}&quot; <button onClick={() => setSearch('')} className="ml-1">×</button></span>}
            {condition && <span className="tag">{condition} <button onClick={() => setCondition('')} className="ml-1">×</button></span>}
            {transmission && <span className="tag">{transmission} <button onClick={() => setTransmission('')} className="ml-1">×</button></span>}
            {fuelType && <span className="tag">{fuelType} <button onClick={() => setFuelType('')} className="ml-1">×</button></span>}
            {(minPrice || maxPrice) && <span className="tag">Price filtered <button onClick={() => { setMinPrice(''); setMaxPrice(''); }} className="ml-1">×</button></span>}
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-[var(--border)]">
            <p className="font-medium mb-2" style={{ color: 'var(--text-muted)' }}>No results match your filters</p>
            <button onClick={clearFilters} className="btn btn-primary text-sm mt-2">Clear Filters</button>
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
