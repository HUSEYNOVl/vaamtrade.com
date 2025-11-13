'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewPagePage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    const data = {
      slug: formData.get('slug'),
      title: formData.get('title'),
      status: formData.get('status'),
      seoTitle: formData.get('seoTitle'),
      seoDesc: formData.get('seoDesc'),
      seoKeywords: formData.get('seoKeywords'),
      sections: '[]',
    };

    try {
      const response = await fetch('/api/cms/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const page = await response.json();
        router.push(`/admin/cms/pages/${page.id}`);
      }
    } catch (error) {
      console.error('Error creating page:', error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/cms/pages" className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-block">
          ← Back to Pages
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Page</h1>
        <p className="text-gray-600 mt-2">Set up basic page information, then use the page builder to add sections</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Page Title *</label>
            <input
              type="text"
              name="title"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              placeholder="e.g., Our Services"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">URL Slug *</label>
            <input
              type="text"
              name="slug"
              required
              pattern="[a-z0-9-]+"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              placeholder="e.g., our-services"
            />
            <p className="text-xs text-gray-500 mt-1">Only lowercase letters, numbers, and hyphens</p>
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Status</label>
            <select
              name="status"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div className="border-t border-gray-200 pt-4">
            <h3 className="text-lg font-bold text-gray-900 mb-4">SEO Settings</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">SEO Title</label>
                <input
                  type="text"
                  name="seoTitle"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">SEO Description</label>
                <textarea
                  name="seoDesc"
                  rows={3}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">SEO Keywords</label>
                <input
                  type="text"
                  name="seoKeywords"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition disabled:opacity-50"
            >
              {saving ? 'Creating...' : 'Create Page'}
            </button>
            <Link
              href="/admin/cms/pages"
              className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition"
            >
              Cancel
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}

