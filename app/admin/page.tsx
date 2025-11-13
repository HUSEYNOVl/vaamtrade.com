'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalCars: 0,
    featuredCars: 0,
    newCars: 0,
    usedCars: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/cars');
      if (response.ok) {
        const cars = await response.json();
        setStats({
          totalCars: cars.length,
          featuredCars: cars.filter((c: any) => c.featured).length,
          newCars: cars.filter((c: any) => c.condition === 'New').length,
          usedCars: cars.filter((c: any) => c.condition === 'Used').length,
        });
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-gray-600 font-semibold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your admin panel. Manage your car inventory here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Cars</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalCars}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🚗</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Featured</p>
              <p className="text-3xl font-bold text-yellow-600 mt-2">{stats.featuredCars}</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">⭐</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">New Cars</p>
              <p className="text-3xl font-bold text-green-600 mt-2">{stats.newCars}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🆕</span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Used Cars</p>
              <p className="text-3xl font-bold text-orange-600 mt-2">{stats.usedCars}</p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <span className="text-2xl">🔧</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <p className="text-sm text-gray-600 mt-1">Common tasks to manage your inventory</p>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/admin/cars/new"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition group"
          >
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
              <span className="text-2xl">➕</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-red-600 transition">Add New Car</h3>
              <p className="text-sm text-gray-600">Add a new vehicle to your inventory</p>
            </div>
          </Link>

          <Link
            href="/admin/cars"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-gray-500 hover:bg-gray-50 transition group"
          >
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gray-200 transition">
              <span className="text-2xl">📋</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-gray-700 transition">Manage Cars</h3>
              <p className="text-sm text-gray-600">View, edit, or delete existing cars</p>
            </div>
          </Link>

          <Link
            href="/admin/contact"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
          >
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition">
              <span className="text-2xl">📞</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">Contact Settings</h3>
              <p className="text-sm text-gray-600">Update your contact information</p>
            </div>
          </Link>

          <Link
            href="/admin/cms"
            className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition group"
          >
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-200 transition">
              <span className="text-2xl">🎨</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 group-hover:text-purple-600 transition">CMS System</h3>
              <p className="text-sm text-gray-600">Manage all website content and settings</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
