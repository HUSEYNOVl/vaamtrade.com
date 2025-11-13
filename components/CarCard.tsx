'use client';

import { Link } from '@/i18n/routing';
import { formatPrice, parseImages } from '@/lib/utils';
import { Car } from '@/types/car';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  // Parse images - handle both string and array formats
  let images = parseImages(car.images as any);
  
  // Filter out invalid URLs (like file://) and ensure valid image paths
  images = images.filter((img: string) => {
    if (!img || typeof img !== 'string') return false;
    if (img.startsWith('file://')) return false;
    // Allow relative paths starting with /uploads/ or http/https URLs
    return img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://');
  });

  // Get the first valid image
  const firstImage = images.length > 0 ? images[0] : null;

  return (
    <Link href={`/cars/${car.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-200 hover:border-red-300 group cursor-pointer">
        {/* Image Section - Larger, Premium */}
        <div className="relative h-64 w-full bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={`${car.make} ${car.model}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized={firstImage.startsWith('/uploads/') || firstImage.startsWith('/')}
              priority={false}
              onError={(e) => {
                console.error('Image load error for car:', car.id, 'Image URL:', firstImage);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          {/* Condition Badge */}
          <div className="absolute top-4 right-4">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold shadow-lg ${
              car.condition === 'New' 
                ? 'bg-green-500 text-white' 
                : 'bg-red-600 text-white'
            }`}>
              {car.condition}
            </span>
          </div>
        </div>

        {/* Content Section - Clean & Organized */}
        <div className="p-6">
          {/* Car Name & Year */}
          <div className="mb-3">
            <h3 className="text-2xl font-bold text-gray-900 mb-1 group-hover:text-red-600 transition-colors">
              {car.make} {car.model}
            </h3>
            <p className="text-gray-500 text-sm font-medium">{car.year}</p>
          </div>

          {/* Price - Prominent */}
          <div className="mb-4 pb-4 border-b border-gray-100">
            <span className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
              {formatPrice(car.price, car.currency)}
            </span>
          </div>

          {/* Specs - Clean Icons */}
          <div className="flex flex-wrap gap-2 mb-4">
            {car.mileage && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{car.mileage.toLocaleString()} mi</span>
              </div>
            )}
            {car.transmission && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-medium">{car.transmission}</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-1.5 text-sm text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="font-medium">{car.fuelType}</span>
              </div>
            )}
          </div>

          {/* CTA Button */}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="bg-red-600 text-white text-center py-2.5 rounded-lg font-semibold group-hover:bg-red-700 transition-colors">
              View Details →
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
