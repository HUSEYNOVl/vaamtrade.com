'use client';

import { useState } from 'react';
import { Car } from '@/types/car';

interface CarFilterProps {
  cars: Car[];
  onFilterChange: (filteredCars: Car[]) => void;
}

export default function CarFilter({ cars, onFilterChange }: CarFilterProps) {
  const [filters, setFilters] = useState({
    brand: '',
    minYear: '',
    maxYear: '',
    minPrice: '',
    maxPrice: '',
    condition: '',
  });

  const brands = Array.from(new Set(cars.map(car => car.make))).sort();
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 30 }, (_, i) => currentYear - i);

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Apply filters
    let filtered = [...cars];

    if (newFilters.brand) {
      filtered = filtered.filter(car => car.make.toLowerCase().includes(newFilters.brand.toLowerCase()));
    }

    if (newFilters.minYear) {
      filtered = filtered.filter(car => car.year >= parseInt(newFilters.minYear));
    }

    if (newFilters.maxYear) {
      filtered = filtered.filter(car => car.year <= parseInt(newFilters.maxYear));
    }

    if (newFilters.minPrice) {
      filtered = filtered.filter(car => car.price >= parseFloat(newFilters.minPrice));
    }

    if (newFilters.maxPrice) {
      filtered = filtered.filter(car => car.price <= parseFloat(newFilters.maxPrice));
    }

    if (newFilters.condition) {
      filtered = filtered.filter(car => car.condition === newFilters.condition);
    }

    onFilterChange(filtered);
  };

  const clearFilters = () => {
    setFilters({
      brand: '',
      minYear: '',
      maxYear: '',
      minPrice: '',
      maxPrice: '',
      condition: '',
    });
    onFilterChange(cars);
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-md mb-8 border border-gray-200">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900 mb-4 md:mb-0">Filter Cars</h3>
        <button
          onClick={clearFilters}
          className="text-red-600 hover:text-red-700 font-medium text-sm"
        >
          Clear Filters
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Brand</label>
          <select
            value={filters.brand}
            onChange={(e) => handleFilterChange('brand', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          >
            <option value="">All Brands</option>
            {brands.map(brand => (
              <option key={brand} value={brand}>{brand}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Min Year</label>
          <select
            value={filters.minYear}
            onChange={(e) => handleFilterChange('minYear', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          >
            <option value="">Any</option>
            {years.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Max Year</label>
          <select
            value={filters.maxYear}
            onChange={(e) => handleFilterChange('maxYear', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          >
            <option value="">Any</option>
            {years.map(year => (
              <option key={year} value={year.toString()}>{year}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Min Price</label>
          <input
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange('minPrice', e.target.value)}
            placeholder="0"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Max Price</label>
          <input
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
            placeholder="No limit"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2 text-gray-700">Condition</label>
          <select
            value={filters.condition}
            onChange={(e) => handleFilterChange('condition', e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Used">Used</option>
          </select>
        </div>
      </div>
    </div>
  );
}
