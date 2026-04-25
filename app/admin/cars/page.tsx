'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatPrice } from '@/lib/utils';

interface Car {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  condition: string;
  featured: boolean;
  mileage?: number;
  transmission?: string;
  createdAt: string;
}

export default function AdminCarsPage() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { fetchCars(); }, []);

  const fetchCars = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/cars');
      if (res.ok) setCars(await res.json());
      else setError('Failed to load cars');
    } catch { setError('Connection error'); }
    finally { setLoading(false); }
  };

  const deleteCar = async (id: string, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/cars/${id}`, { method: 'DELETE' });
      if (res.ok) setCars((prev) => prev.filter((c) => c.id !== id));
      else alert('Failed to delete. Please try again.');
    } catch { alert('Error deleting car.'); }
    finally { setDeleting(null); }
  };

  const filtered = cars.filter((c) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return c.make.toLowerCase().includes(q) || c.model.toLowerCase().includes(q) || c.year.toString().includes(q);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Loading inventory…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-extrabold text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>Inventory</h1>
          <p className="text-sm text-[var(--text-muted)] mt-1">{cars.length} vehicles total</p>
        </div>
        <Link href="/admin/cars/new" className="btn btn-primary text-sm px-5">+ Add New Car</Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl text-sm font-medium" style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}>
          {error}
        </div>
      )}

      {cars.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-16 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <p className="font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>No cars yet</p>
          <Link href="/admin/cars/new" className="btn btn-primary text-sm mt-4 px-6">Add First Car</Link>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-4">
            <div className="relative max-w-sm">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search inventory…"
                className="input-base pl-9"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr style={{ background: 'var(--bg)' }}>
                    {['Vehicle', 'Year', 'Price', 'Condition', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border)]">
                  {filtered.map((car) => (
                    <tr key={car.id} className="hover:bg-[var(--bg)] transition-colors group">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div>
                            <p className="font-semibold text-sm text-[var(--text)]">{car.make} {car.model}</p>
                            {car.transmission && <p className="text-xs text-[var(--text-muted)]">{car.transmission}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--text-muted)]">{car.year}</td>
                      <td className="px-5 py-4">
                        <span className="text-sm font-bold" style={{ color: 'var(--accent)', fontFamily: 'Syne, sans-serif' }}>
                          {formatPrice(car.price, car.currency)}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="badge" style={{
                          background: car.condition === 'New' ? '#dcfce7' : '#fff0ed',
                          color: car.condition === 'New' ? '#166534' : 'var(--accent)',
                        }}>
                          {car.condition}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {car.featured ? (
                          <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>⭐ Featured</span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <Link
                            href={`/admin/cars/${car.id}`}
                            className="text-xs font-semibold hover:underline"
                            style={{ color: 'var(--accent)' }}
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => deleteCar(car.id, `${car.make} ${car.model}`)}
                            disabled={deleting === car.id}
                            className="text-xs font-semibold text-gray-400 hover:text-red-600 transition-colors disabled:opacity-50"
                          >
                            {deleting === car.id ? '…' : 'Delete'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filtered.length === 0 && search && (
              <div className="text-center py-10 text-sm text-[var(--text-muted)]">
                No results for &quot;{search}&quot;
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
