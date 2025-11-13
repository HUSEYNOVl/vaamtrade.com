'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import PageBuilder from '@/components/PageBuilder';

interface Page {
  id: string;
  slug: string;
  title: string;
  status: string;
  seoTitle: string | null;
  seoDesc: string | null;
  seoKeywords: string | null;
  sections: any[];
}

export default function EditPagePage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const [page, setPage] = useState<Page | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSectionEditor, setShowSectionEditor] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);

  useEffect(() => {
    fetchPage();
  }, [id]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/cms/pages/${id}`);
      if (response.ok) {
        const data = await response.json();
        // Parse sections if it's a string
        if (data.sections && typeof data.sections === 'string') {
          try {
            data.sections = JSON.parse(data.sections);
          } catch (e) {
            console.error('Error parsing sections:', e);
            data.sections = [];
          }
        }
        setPage(data);
      } else if (response.status === 404) {
        console.error('Page not found:', id);
        // Don't redirect immediately, show error message instead
        setPage(null);
        setLoading(false);
        return;
      } else {
        console.error('Error fetching page:', response.status);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBasicInfo = async (e: React.FormEvent<HTMLFormElement>) => {
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
    };

    try {
      const response = await fetch(`/api/cms/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchPage();
        alert('Page updated successfully!');
      }
    } catch (error) {
      console.error('Error updating page:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSaveSections = async (sections: any[]) => {
    setSaving(true);
    try {
      const response = await fetch(`/api/cms/pages/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sections: JSON.stringify(sections) }),
      });

      if (response.ok) {
        fetchPage();
        setShowSectionEditor(false);
        setEditingSection(null);
      }
    } catch (error) {
      console.error('Error updating sections:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSectionVisibility = async (sectionId: string, visible: boolean) => {
    if (!page) return;
    const sections = Array.isArray(page.sections) ? [...page.sections] : [];
    const updated = sections.map((s: any) => 
      s.id === sectionId ? { ...s, visible } : s
    );
    await handleSaveSections(updated);
  };

  const handleSectionReorder = async (sectionId: string, direction: 'up' | 'down') => {
    if (!page) return;
    const sections = Array.isArray(page.sections) ? [...page.sections] : [];
    const index = sections.findIndex((s: any) => s.id === sectionId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= sections.length) return;

    [sections[index], sections[newIndex]] = [sections[newIndex], sections[index]];
    await handleSaveSections(sections);
  };

  const handleEditSection = (section: any) => {
    setEditingSection(section);
    setShowSectionEditor(true);
  };

  const handleSaveSection = async (updatedSection: any) => {
    if (!page) return;
    const sections = Array.isArray(page.sections) ? [...page.sections] : [];
    const updated = sections.map((s: any) => 
      s.id === updatedSection.id ? updatedSection : s
    );
    await handleSaveSections(updated);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 font-semibold">Loading page...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-500 mb-4">Page not found</p>
        <Link href="/admin/cms/pages" className="text-red-600 hover:text-red-700 font-semibold">
          ← Back to Pages
        </Link>
      </div>
    );
  }

  const sections = Array.isArray(page.sections) ? page.sections : [];
  const sortedSections = [...sections].sort((a: any, b: any) => a.order - b.order);

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/cms/pages" className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-block">
          ← Back to Pages
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Page: {page.title}</h1>
        <p className="text-gray-600 mt-2">Edit page information and manage sections</p>
      </div>

      {/* Basic Info Form */}
      <form onSubmit={handleSaveBasicInfo} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Basic Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Page Title *</label>
            <input
              type="text"
              name="title"
              defaultValue={page.title}
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">URL Slug *</label>
            <input
              type="text"
              name="slug"
              defaultValue={page.slug}
              required
              pattern="[a-z0-9-]+"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Status</label>
            <select
              name="status"
              defaultValue={page.status}
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
                  defaultValue={page.seoTitle || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">SEO Description</label>
                <textarea
                  name="seoDesc"
                  rows={3}
                  defaultValue={page.seoDesc || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">SEO Keywords</label>
                <input
                  type="text"
                  name="seoKeywords"
                  defaultValue={page.seoKeywords || ''}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
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
              {saving ? 'Saving...' : 'Save Changes'}
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

      {/* Page Builder */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Page Builder</h2>
        <PageBuilder
          pageId={id}
          initialSections={sections.map((s: any, idx: number) => ({
            ...s,
            order: s.order ?? idx,
          }))}
          onSave={(updatedSections) => {
            handleSaveSections(updatedSections);
          }}
        />
      </div>
    </div>
  );
}

// Simple Section Editor Component
function SectionEditor({ section, onSave, onClose }: any) {
  const [formData, setFormData] = useState<any>(section || { type: 'text-block', visible: true, order: 0, content: {} });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            {section ? 'Edit Section' : 'Add New Section'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Section Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value, content: {} })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              >
                <option value="hero">Hero</option>
                <option value="text-block">Text Block</option>
                <option value="mission">Mission</option>
                <option value="features-grid">Features Grid</option>
                <option value="how-it-works">How It Works</option>
                <option value="cta-section">CTA Section</option>
                <option value="trust-section">Trust Section</option>
                <option value="featured-cars">Featured Cars</option>
                <option value="all-cars">All Cars</option>
                <option value="company-story">Company Story</option>
                <option value="video-section">Video Section</option>
                <option value="certificates-section">Certificates Section</option>
                <option value="contact-form">Contact Form</option>
                <option value="contact-info">Contact Info</option>
              </select>
            </div>

            {/* Dynamic fields based on section type */}
            {formData.type === 'hero' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Title</label>
                  <input
                    type="text"
                    value={formData.content?.title || ''}
                    onChange={(e) => setFormData({ ...formData, content: { ...formData.content, title: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Subtitle</label>
                  <textarea
                    value={formData.content?.subtitle || ''}
                    onChange={(e) => setFormData({ ...formData, content: { ...formData.content, subtitle: e.target.value } })}
                    rows={3}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>
              </>
            )}

            {formData.type === 'text-block' && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Text</label>
                <textarea
                  value={formData.content?.text || ''}
                  onChange={(e) => setFormData({ ...formData, content: { ...formData.content, text: e.target.value } })}
                  rows={5}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                checked={formData.visible !== false}
                onChange={(e) => setFormData({ ...formData, visible: e.target.checked })}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label className="ml-2 text-sm font-semibold text-gray-900">Visible</label>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition"
              >
                {section ? 'Update' : 'Add'} Section
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
