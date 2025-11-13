'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CMSDashboard() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">CMS Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage all website content and settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Settings */}
        <Link
          href="/admin/cms/settings"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">⚙️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Global Settings</h3>
          <p className="text-gray-600 text-sm">
            Manage website colors, fonts, branding, and contact information
          </p>
        </Link>

        {/* Pages */}
        <Link
          href="/admin/cms/pages"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">📄</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Pages</h3>
          <p className="text-gray-600 text-sm">
            Create and manage dynamic pages with the page builder
          </p>
        </Link>

        {/* Media */}
        <Link
          href="/admin/cms/media"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Media Manager</h3>
          <p className="text-gray-600 text-sm">
            Upload and organize images, videos, and other media files
          </p>
        </Link>

        {/* Translations */}
        <Link
          href="/admin/cms/translations"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">🌍</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Translations</h3>
          <p className="text-gray-600 text-sm">
            Manage multi-language content for all pages
          </p>
        </Link>

        {/* Certificates */}
        <Link
          href="/admin/cms/certificates"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">📜</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Certificates</h3>
          <p className="text-gray-600 text-sm">
            Manage company certificates and legal documents
          </p>
        </Link>

        {/* Videos */}
        <Link
          href="/admin/cms/videos"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">🎥</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Videos</h3>
          <p className="text-gray-600 text-sm">
            Manage introduction videos and promotional content
          </p>
        </Link>

        {/* Testimonials */}
        <Link
          href="/admin/cms/testimonials"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">💬</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Testimonials</h3>
          <p className="text-gray-600 text-sm">
            Manage customer testimonials and reviews
          </p>
        </Link>

        {/* FAQs */}
        <Link
          href="/admin/cms/faqs"
          className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-all border border-gray-200 hover:border-red-200"
        >
          <div className="text-4xl mb-4">❓</div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">FAQs</h3>
          <p className="text-gray-600 text-sm">
            Manage frequently asked questions
          </p>
        </Link>
      </div>
    </div>
  );
}

