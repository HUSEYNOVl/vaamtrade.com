'use client';

import { Link } from '@/i18n/routing';
import { formatPrice, parseImages } from '@/lib/utils';
import { Car } from '@/types/car';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
  layout?: 'grid' | 'list';
}

const SPEC_ICONS: Record<string, string> = {
  Automatic: '⚙', Manual: '🔧', Electric: '⚡', Hybrid: '🌿',
  Gasoline: '⛽', Diesel: '🛢', Petrol: '⛽',
};

function SpecTag({ label }: { label: string }) {
  const icon = SPEC_ICONS[label] ?? '•';
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium"
      style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}
    >
      <span className="text-[10px]">{icon}</span>
      {label}
    </span>
  );
}

export default function CarCard({ car, layout = 'grid' }: CarCardProps) {
  let images = parseImages(car.images as any);
  images = images.filter((img: string) => {
    if (!img || typeof img !== 'string') return false;
    if (img.startsWith('file://')) return false;
    return img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://');
  });
  const firstImage = images.length > 0 ? images[0] : null;
  const isNew = car.condition === 'New';

  /* ── LIST LAYOUT ───────────────────────────────────────────────── */
  if (layout === 'list') {
    return (
      <Link href={`/cars/${car.id}`} className="block group">
        <div
          className="bg-white rounded-2xl border overflow-hidden flex transition-all duration-300 group-hover:shadow-lg"
          style={{ borderColor: 'var(--border)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
        >
          {/* Photo */}
          <div className="relative w-52 sm:w-64 shrink-0 overflow-hidden" style={{ background: '#f0ece4' }}>
            {firstImage ? (
              <Image
                src={firstImage} alt={`${car.make} ${car.model}`} fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                unoptimized onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
            <span
              className="absolute top-3 left-3 text-xs font-bold px-2.5 py-1 rounded-md text-white"
              style={{ background: isNew ? '#16a34a' : 'var(--accent)' }}
            >
              {car.condition}
            </span>
          </div>

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
            <div>
              <div className="flex items-start justify-between gap-2 mb-1">
                <div>
                  <h3
                    className="font-extrabold text-lg text-[var(--text)] leading-tight group-hover:text-[var(--accent)] transition-colors"
                    style={{ fontFamily: 'Syne, sans-serif' }}
                  >
                    {car.year} {car.make} {car.model}
                  </h3>
                </div>
                {car.featured && (
                  <span className="shrink-0 text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: '#fef3c7', color: '#92400e' }}>
                    Featured
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-1.5 mt-3">
                {car.transmission && <SpecTag label={car.transmission} />}
                {car.fuelType && <SpecTag label={car.fuelType} />}
                {car.mileage && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    🏁 {car.mileage.toLocaleString()} mi
                  </span>
                )}
                {car.color && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                    🎨 {car.color}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 mt-3 border-t border-[var(--border)]">
              <div>
                <p className="text-xs text-[var(--text-muted)] mb-0.5">Price</p>
                <p className="text-2xl font-black" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--accent)' }}>
                  {formatPrice(car.price, car.currency)}
                </p>
              </div>
              <div
                className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-xl transition-all duration-200"
                style={{ background: 'var(--accent-light)', color: 'var(--accent)' }}
              >
                View Details
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  /* ── GRID LAYOUT ───────────────────────────────────────────────── */
  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div
        className="bg-white rounded-2xl border overflow-hidden flex flex-col transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1"
        style={{ borderColor: 'var(--border)' }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,50,26,0.35)'; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; }}
      >
        {/* Photo */}
        <div className="relative overflow-hidden" style={{ height: '200px', background: '#f0ece4' }}>
          {firstImage ? (
            <Image
              src={firstImage} alt={`${car.make} ${car.model}`} fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-300">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs text-gray-400">No photo</span>
            </div>
          )}

          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-1.5">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-md text-white"
              style={{ background: isNew ? '#16a34a' : 'var(--accent)', backdropFilter: 'blur(4px)' }}
            >
              {car.condition}
            </span>
            {car.featured && (
              <span className="text-xs font-bold px-2.5 py-1 rounded-md" style={{ background: 'rgba(254,243,199,0.92)', color: '#92400e' }}>
                ★ Featured
              </span>
            )}
          </div>

          {/* Photo count */}
          {images.length > 1 && (
            <div
              className="absolute bottom-3 right-3 flex items-center gap-1 px-2.5 py-1 rounded-lg text-white text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)' }}
            >
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {images.length}
            </div>
          )}

          {/* Price overlay on photo */}
          <div className="absolute bottom-3 left-3">
            <span className="text-xl font-black text-white drop-shadow-md" style={{ fontFamily: 'Syne, sans-serif', textShadow: '0 2px 8px rgba(0,0,0,0.6)' }}>
              {formatPrice(car.price, car.currency)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col flex-1">
          <h3
            className="font-extrabold text-[var(--text)] text-base leading-snug mb-0.5 group-hover:text-[var(--accent)] transition-colors line-clamp-1"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {car.year} {car.make} {car.model}
          </h3>

          {/* Specs row */}
          <div className="flex flex-wrap gap-1.5 mt-2.5 mb-4">
            {car.transmission && <SpecTag label={car.transmission} />}
            {car.fuelType && <SpecTag label={car.fuelType} />}
            {car.mileage && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium" style={{ background: 'var(--bg)', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                🏁 {car.mileage.toLocaleString()}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="mt-auto pt-3 border-t border-[var(--border)] flex items-center justify-between">
            <span className="text-xs text-[var(--text-muted)]">{car.currency}</span>
            <span
              className="text-xs font-semibold flex items-center gap-1 transition-colors"
              style={{ color: 'var(--accent)' }}
            >
              View listing
              <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
