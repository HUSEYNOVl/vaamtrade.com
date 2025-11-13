'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  seoTitle: string | null;
  seoDesc: string | null;
  sections: any[];
}

export default function PagesPage() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/cms/pages');
      if (response.ok) {
        const data = await response.json();
        // Parse sections for each page
        const parsedPages = data.map((page: any) => ({
          ...page,
          sections: typeof page.sections === 'string' ? JSON.parse(page.sections) : page.sections,
        }));
        setPages(parsedPages);
      }
    } catch (error) {
      console.error('Error fetching pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this page?')) return;

    try {
      const response = await fetch(`/api/cms/pages/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchPages();
      }
    } catch (error) {
      console.error('Error deleting page:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 font-semibold">Loading pages...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link href="/admin/cms" className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-block">
            ← Back to CMS
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Pages</h1>
          <p className="text-gray-600 mt-2">Create and manage dynamic pages with the page builder</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              if (confirm('This will create default pages (Home, About, Contact) if they don\'t exist. Continue?')) {
                try {
                  const response = await fetch('/api/cms/seed', { method: 'POST' });
                  if (response.ok) {
                    alert('Pages seeded successfully!');
                    fetchPages();
                  } else {
                    alert('Error seeding pages');
                  }
                } catch (error) {
                  alert('Error seeding pages');
                }
              }
            }}
            className="bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 font-semibold transition text-sm"
          >
            Seed Default Pages
          </button>
          <Link
            href="/admin/cms/pages/new"
            className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition"
          >
            + Create Page
          </Link>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Slug</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-semibold text-gray-900 uppercase tracking-wider">Sections</th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-900 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pages.map((page) => (
              <tr key={page.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-gray-900">{page.title}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <code className="text-sm text-gray-600">/{page.slug}</code>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${
                    page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {page.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {Array.isArray(page.sections) ? page.sections.length : 0} sections
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/cms/pages/${page.id}`}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(page.id)}
                      className="text-red-600 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pages.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500 mb-4">No pages yet. Create your first page to get started.</p>
          <Link
            href="/admin/cms/pages/new"
            className="inline-block bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition"
          >
            Create Page
          </Link>
        </div>
      )}
    </div>
  );
}

