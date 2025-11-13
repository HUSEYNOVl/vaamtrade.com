'use client';

import { useState, useEffect } from 'react';

interface Section {
  id: string;
  type: string;
  visible: boolean;
  content: any;
  order: number;
}

interface PageBuilderProps {
  pageId: string;
  initialSections?: Section[];
  onSave?: (sections: Section[]) => void;
}

export default function PageBuilder({ pageId, initialSections = [], onSave }: PageBuilderProps) {
  const [sections, setSections] = useState<Section[]>(initialSections);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    setSections(initialSections);
  }, [initialSections]);

  const moveSection = (fromIndex: number, toIndex: number) => {
    const items = Array.from(sections);
    const [reorderedItem] = items.splice(fromIndex, 1);
    items.splice(toIndex, 0, reorderedItem);

    // Update order
    const updated = items.map((item, index) => ({
      ...item,
      order: index,
    }));

    setSections(updated);
    saveSections(updated);
  };

  const saveSections = async (sectionsToSave: Section[]) => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/cms/pages/${pageId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sections: JSON.stringify(sectionsToSave),
        }),
      });

      if (response.ok) {
        setMessage('Sections saved successfully!');
        setTimeout(() => setMessage(''), 3000);
        if (onSave) onSave(sectionsToSave);
      } else {
        setMessage('Failed to save sections');
      }
    } catch (error) {
      console.error('Error saving sections:', error);
      setMessage('Error saving sections');
    } finally {
      setSaving(false);
    }
  };

  const addSection = (type: string) => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      type,
      visible: true,
      content: getDefaultContent(type),
      order: sections.length,
    };

    const updated = [...sections, newSection];
    setSections(updated);
    saveSections(updated);
  };

  const deleteSection = (id: string) => {
    const updated = sections.filter((s) => s.id !== id);
    setSections(updated);
    saveSections(updated);
  };

  const toggleVisibility = (id: string) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s
    );
    setSections(updated);
    saveSections(updated);
  };

  const updateSection = (id: string, content: any) => {
    const updated = sections.map((s) =>
      s.id === id ? { ...s, content } : s
    );
    setSections(updated);
    saveSections(updated);
  };

  const getDefaultContent = (type: string): any => {
    const defaults: Record<string, any> = {
      hero: {
        title: 'Welcome to VAAM Motors',
        subtitle: 'Your trusted global car exporter',
        imageUrl: '',
        primaryCTA: { text: 'View Cars', link: '/cars' },
        secondaryCTA: { text: 'Contact Us', link: '/contact' },
      },
      'text-block': {
        title: 'Section Title',
        text: 'Section content goes here...',
      },
      'image-text-block': {
        title: 'Section Title',
        text: 'Section content goes here...',
        imageUrl: '',
        imagePosition: 'left',
      },
      'featured-cars': {
        title: 'Featured Vehicles',
        viewAllLink: '/cars',
        viewAllText: 'View All Cars',
      },
      'all-cars': {
        title: 'All Vehicles',
      },
      'trust-section': {
        title: 'Why Customers Trust Us',
        cards: [
          { icon: '✅', title: 'Licensed', description: 'Fully licensed import-export company' },
          { icon: '🚚', title: 'Fast Shipping', description: 'Worldwide delivery available' },
          { icon: '🔒', title: 'Secure Payment', description: 'Safe and secure transactions' },
        ],
      },
      'contact-form-section': {
        title: 'Get In Touch',
      },
      'contact-info-section': {
        title: 'Contact Information',
      },
      'faq-section': {
        title: 'Frequently Asked Questions',
      },
      'testimonials-section': {
        title: 'What Our Customers Say',
      },
      'certificates-section': {
        title: 'Our Certificates',
      },
      'video-section': {
        title: 'Introduction Video',
      },
      'company-story': {
        title: 'Our Story',
        text: 'Company story goes here...',
        imageUrl: '',
      },
    };

    return defaults[type] || {};
  };

  const sectionTypes = [
    { type: 'hero', label: 'Hero Section', icon: '🎯' },
    { type: 'text-block', label: 'Text Block', icon: '📝' },
    { type: 'image-text-block', label: 'Image + Text', icon: '🖼️' },
    { type: 'featured-cars', label: 'Featured Cars', icon: '⭐' },
    { type: 'all-cars', label: 'All Cars', icon: '🚗' },
    { type: 'trust-section', label: 'Trust Section', icon: '✅' },
    { type: 'contact-form-section', label: 'Contact Form', icon: '📧' },
    { type: 'contact-info-section', label: 'Contact Info', icon: '📞' },
    { type: 'faq-section', label: 'FAQ Section', icon: '❓' },
    { type: 'testimonials-section', label: 'Testimonials', icon: '💬' },
    { type: 'certificates-section', label: 'Certificates', icon: '📜' },
    { type: 'video-section', label: 'Video Section', icon: '🎥' },
    { type: 'company-story', label: 'Company Story', icon: '📖' },
  ];

  return (
    <div className="space-y-6">
      {message && (
        <div className={`p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Add Section Buttons */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Add Section</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
          {sectionTypes.map(({ type, label, icon }) => (
            <button
              key={type}
              onClick={() => addSection(type)}
              className="flex flex-col items-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-sm"
            >
              <span className="text-2xl mb-1">{icon}</span>
              <span className="text-xs font-semibold text-gray-900 text-center">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sections List */}
      <div className="space-y-4">
        {sections
          .sort((a, b) => a.order - b.order)
          .map((section, index) => (
            <div
              key={section.id}
              className={`bg-white rounded-lg shadow-sm border-2 border-gray-200 ${
                !section.visible ? 'opacity-50' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-1">
                      {index > 0 && (
                        <button
                          onClick={() => moveSection(index, index - 1)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                          title="Move up"
                        >
                          ↑
                        </button>
                      )}
                      {index < sections.length - 1 && (
                        <button
                          onClick={() => moveSection(index, index + 1)}
                          className="text-gray-400 hover:text-gray-600 text-sm"
                          title="Move down"
                        >
                          ↓
                        </button>
                      )}
                    </div>
                    <span className="text-lg font-bold text-gray-900">
                      {sectionTypes.find((st) => st.type === section.type)?.icon}{' '}
                      {sectionTypes.find((st) => st.type === section.type)?.label}
                    </span>
                    {!section.visible && (
                      <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded">Hidden</span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => toggleVisibility(section.id)}
                      className={`px-3 py-1 rounded text-sm font-semibold ${
                        section.visible
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {section.visible ? 'Hide' : 'Show'}
                    </button>
                    <button
                      onClick={() => setSelectedSection(selectedSection === section.id ? null : section.id)}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded text-sm font-semibold"
                    >
                      {selectedSection === section.id ? 'Close' : 'Edit'}
                    </button>
                    <button
                      onClick={() => deleteSection(section.id)}
                      className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {selectedSection === section.id && (
                  <SectionEditor
                    section={section}
                    onUpdate={(content) => updateSection(section.id, content)}
                  />
                )}
              </div>
            </div>
          ))}
      </div>

      {sections.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 font-semibold">No sections yet. Add a section to get started!</p>
        </div>
      )}
    </div>
  );
}

function SectionEditor({ section, onUpdate }: { section: Section; onUpdate: (content: any) => void }) {
  const [content, setContent] = useState(section.content);

  useEffect(() => {
    setContent(section.content);
  }, [section.content]);

  const handleChange = (field: string, value: any) => {
    const updated = { ...content, [field]: value };
    setContent(updated);
    onUpdate(updated);
  };

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <h4 className="font-bold text-gray-900 mb-4">Edit Section Content</h4>
      <div className="space-y-4">
        {section.type === 'hero' && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">Subtitle</label>
              <input
                type="text"
                value={content.subtitle || ''}
                onChange={(e) => handleChange('subtitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">Image URL</label>
              <input
                type="url"
                value={content.imageUrl || ''}
                onChange={(e) => handleChange('imageUrl', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              />
            </div>
          </>
        )}

        {(section.type === 'text-block' || section.type === 'image-text-block') && (
          <>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">Title</label>
              <input
                type="text"
                value={content.title || ''}
                onChange={(e) => handleChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1 text-gray-900">Text</label>
              <textarea
                value={content.text || ''}
                onChange={(e) => handleChange('text', e.target.value)}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
              />
            </div>
            {section.type === 'image-text-block' && (
              <>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">Image URL</label>
                  <input
                    type="url"
                    value={content.imageUrl || ''}
                    onChange={(e) => handleChange('imageUrl', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1 text-gray-900">Image Position</label>
                  <select
                    value={content.imagePosition || 'left'}
                    onChange={(e) => handleChange('imagePosition', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-gray-900"
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </div>
              </>
            )}
          </>
        )}

        {/* Add more section type editors as needed */}
      </div>
    </div>
  );
}

