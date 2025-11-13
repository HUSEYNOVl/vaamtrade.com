'use client';

import { useState, useEffect } from 'react';
import { Car } from '@/types/car';
import CarCard from './CarCard';
import CarFilter from './CarFilter';

interface HomePageClientProps {
  cars?: Car[];
  car?: Car;
}

export default function HomePageClient({ cars, car }: HomePageClientProps) {
  const [filteredCars, setFilteredCars] = useState<Car[]>(cars || []);
  const [displayedCars, setDisplayedCars] = useState<Car[]>(cars || []);

  useEffect(() => {
    if (cars) {
      setFilteredCars(cars);
      setDisplayedCars(cars);
    }
  }, [cars]);

  // If single car prop, render just that car
  if (car) {
    return <CarCard car={car} />;
  }

  // If no cars, show empty state
  if (!cars || cars.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-xl text-gray-500 mb-2">No cars available at the moment.</p>
        <p className="text-gray-400">Check back soon or contact us for more information.</p>
      </div>
    );
  }

  return (
    <>
      <CarFilter cars={cars} onFilterChange={setFilteredCars} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
      {filteredCars.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg text-gray-500">No cars match your filters. Try adjusting your search criteria.</p>
        </div>
      )}
    </>
  );
}

