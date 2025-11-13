'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import CarCard from '@/components/CarCard';
import CarFilter, { FilterState } from '@/components/CarFilter';
import { Car } from '@/types/car';

export default function CarsPage() {
  const t = useTranslations('Cars');
  const locale = useLocale();
  const [cars, setCars] = useState<Car[]>([]);
  const [filteredCars, setFilteredCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
    condition: '',
    transmission: '',
    fuelType: '',
  });

  useEffect(() => {
    fetchCars();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, cars]);

  const fetchCars = async () => {
    try {
      const response = await fetch('/api/cars');
      if (response.ok) {
        const data = await response.json();
        setCars(data);
        setFilteredCars(data);
      }
    } catch (error) {
      console.error('Error fetching cars:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...cars];

    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (car) =>
          car.make.toLowerCase().includes(searchLower) ||
          car.model.toLowerCase().includes(searchLower) ||
          car.year.toString().includes(searchLower)
      );
    }

    if (filters.minPrice) {
      filtered = filtered.filter((car) => car.price >= parseFloat(filters.minPrice));
    }

    if (filters.maxPrice) {
      filtered = filtered.filter((car) => car.price <= parseFloat(filters.maxPrice));
    }

    if (filters.minYear) {
      filtered = filtered.filter((car) => car.year >= parseInt(filters.minYear));
    }

    if (filters.maxYear) {
      filtered = filtered.filter((car) => car.year <= parseInt(filters.maxYear));
    }

    if (filters.condition) {
      filtered = filtered.filter((car) => car.condition === filters.condition);
    }

    if (filters.transmission) {
      filtered = filtered.filter((car) => car.transmission === filters.transmission);
    }

    if (filters.fuelType) {
      filtered = filtered.filter((car) => car.fuelType === filters.fuelType);
    }

    setFilteredCars(filtered);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">{t('loading')}</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold mb-8">{t('allCars')}</h1>

      <CarFilter onFilterChange={setFilters} />

      <div className="mb-4 text-gray-600">
        {t('showing')} {filteredCars.length} {t('of')} {cars.length} {t('cars')}
      </div>

      {filteredCars.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500">{t('noCarsFound')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <CarCard key={car.id} car={car} />
          ))}
        </div>
      )}
    </div>
  );
}

