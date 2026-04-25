'use client';

import { Link } from '@/i18n/routing';
import { formatPrice, parseImages } from '@/lib/utils';
import { Car } from '@/types/car';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  let images = parseImages(car.images as any);
  images = images.filter((img: string) => {
    if (!img || typeof img !== 'string') return false;
    if (img.startsWith('file://')) return false;
    return img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://');
  });
  const firstImage = images.length > 0 ? images[0] : null;

  return (
    <Link href={`/cars/${car.id}`} className="block group">
      <div
        className="shimmer-card card-3d rounded-2xl overflow-hidden border border-white/8 hover:border-red-600/50 transition-all duration-500 cursor-pointer"
        style={{ background: 'rgba(255,255,255,0.04)' }}
      >
        {/* Image */}
        <div className="relative h-56 w-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {firstImage ? (
            <Image
              src={firstImage}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              unoptimized={firstImage.startsWith('/uploads/') || firstImage.startsWith('/')}
              priority={false}
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-600">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Condition badge */}
          <div className="absolute top-3 right-3">
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg tracking-wider uppercase ${
                car.condition === 'New'
                  ? 'bg-emerald-500/90 text-white'
                  : 'bg-red-600/90 text-white'
              }`}
            >
              {car.condition}
            </span>
          </div>

          {/* Price overlay on image bottom */}
          <div className="absolute bottom-3 left-3">
            <span className="text-2xl font-black text-white drop-shadow-lg">
              {formatPrice(car.price, car.currency)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Name & Year */}
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="text-lg font-bold text-white group-hover:text-red-400 transition-colors duration-300">
                {car.make} {car.model}
              </h3>
              <p className="text-gray-500 text-sm">{car.year}</p>
            </div>
          </div>

          {/* Specs */}
          <div className="flex flex-wrap gap-2 mb-5">
            {car.mileage && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                {car.mileage.toLocaleString()} mi
              </span>
            )}
            {car.transmission && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {car.transmission}
              </span>
            )}
            {car.fuelType && (
              <span className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/8 px-3 py-1.5 rounded-lg">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {car.fuelType}
              </span>
            )}
          </div>

          {/* CTA */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <span className="text-sm text-gray-500">View Details</span>
            <div className="w-8 h-8 rounded-full bg-red-600/20 border border-red-600/30 flex items-center justify-center text-red-400 group-hover:bg-red-600 group-hover:text-white group-hover:border-red-600 transition-all duration-300 group-hover:translate-x-1">
              →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
