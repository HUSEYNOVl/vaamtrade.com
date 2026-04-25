'use client';

import { Link } from '@/i18n/routing';
import { formatPrice, parseImages } from '@/lib/utils';
import { Car } from '@/types/car';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
  layout?: 'grid' | 'list';
}

export default function CarCard({ car, layout = 'grid' }: CarCardProps) {
  let images = parseImages(car.images as any);
  images = images.filter((img: string) => {
    if (!img || typeof img !== 'string') return false;
    if (img.startsWith('file://')) return false;
    return img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://');
  });
  const firstImage = images.length > 0 ? images[0] : null;

  if (layout === 'list') {
    return (
      <Link href={`/cars/${car.id}`} className="block group">
        <div className="card-lift bg-white rounded-xl border border-[var(--border)] overflow-hidden flex gap-0">
          <div className="relative w-56 shrink-0 bg-gray-100">
            {firstImage ? (
              <Image
                src={firstImage}
                alt={`${car.make} ${car.model}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                unoptimized
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
            ) : (
              <div className="h-full flex items-center justify-center text-gray-300">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            {car.condition && (
              <span
                className="badge absolute top-3 left-3 text-white"
                style={{ background: car.condition === 'New' ? 'var(--green)' : 'var(--accent)' }}
              >
                {car.condition}
              </span>
            )}
          </div>
          <div className="flex-1 p-5 flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--accent)] transition-colors" style={{ fontFamily: 'Syne, sans-serif' }}>
                  {car.make} {car.model}
                </h3>
                {car.featured && (
                  <span className="badge ml-2 shrink-0" style={{ background: '#fef3c7', color: '#92400e' }}>
                    ⭐ Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--text-muted)] mb-3">{car.year}</p>
              <div className="flex flex-wrap gap-2">
                {car.mileage && <span className="tag">🏁 {car.mileage.toLocaleString()} mi</span>}
                {car.transmission && <span className="tag">⚙️ {car.transmission}</span>}
                {car.fuelType && <span className="tag">⛽ {car.fuelType}</span>}
                {car.color && <span className="tag">🎨 {car.color}</span>}
              </div>
            </div>
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]">
              <span className="text-2xl font-black text-[var(--accent)]" style={{ fontFamily: 'Syne, sans-serif' }}>
                {formatPrice(car.price, car.currency)}
              </span>
              <span className="btn btn-outline text-sm">View Details →</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div className="card-lift bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {/* Image */}
        <div className="relative h-52 bg-gray-100">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
              unoptimized
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-300">
              <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className="absolute top-3 left-3 flex gap-1.5">
            {car.condition && (
              <span
                className="badge text-white"
                style={{ background: car.condition === 'New' ? 'var(--green)' : 'var(--accent)' }}
              >
                {car.condition}
              </span>
            )}
            {car.featured && (
              <span className="badge" style={{ background: '#fef3c7', color: '#92400e' }}>⭐</span>
            )}
          </div>
          {images.length > 1 && (
            <div
              className="absolute bottom-3 right-3 px-2 py-1 rounded-lg text-white text-xs font-medium"
              style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)' }}
            >
              +{images.length - 1} photos
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3
            className="font-bold text-[var(--text)] text-base mb-0.5 group-hover:text-[var(--accent)] transition-colors line-clamp-1"
            style={{ fontFamily: 'Syne, sans-serif' }}
          >
            {car.make} {car.model}
          </h3>
          <p className="text-xs text-[var(--text-muted)] mb-3">{car.year}</p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {car.mileage && <span className="tag">🏁 {car.mileage.toLocaleString()} mi</span>}
            {car.transmission && <span className="tag">⚙️ {car.transmission}</span>}
            {car.fuelType && <span className="tag">⛽ {car.fuelType}</span>}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[var(--border)]">
            <span className="text-xl font-black text-[var(--accent)]" style={{ fontFamily: 'Syne, sans-serif' }}>
              {formatPrice(car.price, car.currency)}
            </span>
            <span className="text-xs font-semibold text-[var(--text-muted)] group-hover:text-[var(--accent)] transition-colors">
              View →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
