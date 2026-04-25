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
  createdAt: string;
}

export default function AdminDashboard() {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/cars')
      .then((r) => r.json())
      .then((data) => { setCars(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const stats = {
    total: cars.length,
    featured: cars.filter((c) => c.featured).length,
    newCars: cars.filter((c) => c.condition === 'New').length,
    used: cars.filter((c) => c.condition !== 'New').length,
  };

  const recent = [...cars].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 6);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-[var(--text-muted)]">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>Dashboard</h1>
        <p className="text-sm text-[var(--text-muted)] mt-1">Welcome back — here&apos;s your inventory overview.</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Inventory', value: stats.total, color: '#1a1a18', sub: 'vehicles listed' },
          { label: 'Featured', value: stats.featured, color: '#d4a843', sub: 'highlighted listings' },
          { label: 'New Cars', value: stats.newCars, color: '#1a6b3c', sub: 'new condition' },
          { label: 'Used Cars', value: stats.used, color: '#c8321a', sub: 'pre-owned' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-[var(--border)] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-3">{s.label}</p>
            <p className="text-4xl font-black mb-1" style={{ fontFamily: 'Syne, sans-serif', color: s.color }}>{s.value}</p>
            <p className="text-xs text-[var(--text-muted)]">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div>
        <h2 className="text-base font-bold text-[var(--text)] mb-4" style={{ fontFamily: 'Syne, sans-serif' }}>Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { href: '/admin/cars/new', label: 'Add New Car', desc: 'List a new vehicle', icon: '+', accent: true },
            { href: '/admin/cars', label: 'Manage Inventory', desc: 'Edit or remove listings', icon: '📋', accent: false },
            { href: '/admin/cms', label: 'CMS Settings', desc: 'Edit site content', icon: '✏', accent: false },
          ].map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[var(--border)] hover:border-[var(--accent)] transition-all group"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 transition-colors"
                style={{
                  background: a.accent ? 'var(--accent)' : 'var(--accent-light)',
                  color: a.accent ? 'white' : 'var(--accent)',
                }}
              >
                {a.icon}
              </div>
              <div>
                <p className="font-semibold text-[var(--text)] text-sm group-hover:text-[var(--accent)] transition-colors">{a.label}</p>
                <p className="text-xs text-[var(--text-muted)]">{a.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent listings */}
      {recent.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>Recent Listings</h2>
            <Link href="/admin/cars" className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent)' }}>View all →</Link>
          </div>
          <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
            <table className="min-w-full">
              <thead>
                <tr style={{ background: 'var(--bg)' }}>
                  {['Vehicle', 'Year', 'Price', 'Condition', ''].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border)]">
                {recent.map((car) => (
                  <tr key={car.id} className="hover:bg-[var(--bg)] transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-sm text-[var(--text)]">{car.make} {car.model}</p>
                        {car.featured && <span className="badge text-xs" style={{ background: '#fef3c7', color: '#92400e' }}>⭐</span>}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-[var(--text-muted)]">{car.year}</td>
                    <td className="px-5 py-3.5 text-sm font-bold" style={{ color: 'var(--accent)', fontFamily: 'Syne, sans-serif' }}>
                      {formatPrice(car.price, car.currency)}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="badge" style={{
                        background: car.condition === 'New' ? '#dcfce7' : '#fff0ed',
                        color: car.condition === 'New' ? '#166534' : 'var(--accent)',
                      }}>
                        {car.condition}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <Link href={`/admin/cars/${car.id}`} className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent)' }}>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {cars.length === 0 && (
        <div className="bg-white rounded-xl border border-[var(--border)] p-16 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <h3 className="text-lg font-bold text-[var(--text)] mb-2" style={{ fontFamily: 'Syne, sans-serif' }}>No cars yet</h3>
          <p className="text-sm text-[var(--text-muted)] mb-6">Add your first vehicle to get started.</p>
          <Link href="/admin/cars/new" className="btn btn-primary text-sm px-6">Add Your First Car</Link>
        </div>
      )}
    </div>
  );
}
