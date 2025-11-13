'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Setting {
  key: string;
  value: any;
  type: string;
  category: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, Setting>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'branding' | 'design' | 'contact' | 'footer'>('branding');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/cms/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: any, type: string, category: string) => {
    setSaving(true);
    setMessage('');

    try {
      const response = await fetch(`/api/cms/settings/${key}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value, type, category }),
      });

      if (response.ok) {
        const updated = await response.json();
        setSettings((prev) => ({ ...prev, [key]: updated }));
        setMessage('Settings saved successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to save setting');
      }
    } catch (error) {
      console.error('Error updating setting:', error);
      setMessage('Error saving setting');
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (key: string, value: any, type: string, category: string) => {
    setSettings((prev) => ({
      ...prev,
      [key]: { ...prev[key], value, type, category },
    }));
    updateSetting(key, value, type, category);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 font-semibold">Loading settings...</div>
      </div>
    );
  }

  // Initialize default settings
  const defaultSettings = {
    'site.name': { key: 'site.name', value: settings['site.name']?.value || 'VAAM Motors', type: 'text', category: 'branding' },
    'site.logo': { key: 'site.logo', value: settings['site.logo']?.value || '', type: 'image', category: 'branding' },
    'site.favicon': { key: 'site.favicon', value: settings['site.favicon']?.value || '', type: 'image', category: 'branding' },
    'site.primaryColor': { key: 'site.primaryColor', value: settings['site.primaryColor']?.value || '#dc2626', type: 'color', category: 'design' },
    'site.secondaryColor': { key: 'site.secondaryColor', value: settings['site.secondaryColor']?.value || '#991b1b', type: 'color', category: 'design' },
    'site.fontFamily': { key: 'site.fontFamily', value: settings['site.fontFamily']?.value || 'Inter', type: 'text', category: 'design' },
    'site.borderRadius': { key: 'site.borderRadius', value: settings['site.borderRadius']?.value || '8', type: 'number', category: 'design' },
    'contact.phone': { key: 'contact.phone', value: settings['contact.phone']?.value || '', type: 'text', category: 'contact' },
    'contact.email': { key: 'contact.email', value: settings['contact.email']?.value || '', type: 'text', category: 'contact' },
    'contact.whatsapp': { key: 'contact.whatsapp', value: settings['contact.whatsapp']?.value || '', type: 'text', category: 'contact' },
    'contact.address': { key: 'contact.address', value: settings['contact.address']?.value || '', type: 'text', category: 'contact' },
    'contact.mapEmbed': { key: 'contact.mapEmbed', value: settings['contact.mapEmbed']?.value || '', type: 'text', category: 'contact' },
    'footer.text': { key: 'footer.text', value: settings['footer.text']?.value || '', type: 'text', category: 'footer' },
    'floating.whatsapp': { key: 'floating.whatsapp', value: settings['floating.whatsapp']?.value !== false, type: 'boolean', category: 'design' },
    'floating.call': { key: 'floating.call', value: settings['floating.call']?.value !== false, type: 'boolean', category: 'design' },
  };

  const allSettings = { ...defaultSettings, ...settings };

  const tabs = [
    { id: 'branding' as const, label: 'Branding', icon: '🎨' },
    { id: 'design' as const, label: 'Design', icon: '🎨' },
    { id: 'contact' as const, label: 'Contact', icon: '📞' },
    { id: 'footer' as const, label: 'Footer', icon: '📄' },
  ];

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/cms" className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-block">
          ← Back to CMS
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Global Settings</h1>
        <p className="text-gray-600 mt-2">Manage website appearance, branding, and contact information</p>
      </div>

      {message && (
        <div className={`mb-6 p-4 rounded-lg ${message.includes('success') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {message}
        </div>
      )}

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 font-semibold transition ${
                activeTab === tab.id
                  ? 'border-b-2 border-red-600 text-red-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        {/* Branding Tab */}
        {activeTab === 'branding' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Branding</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Website Name</label>
                <input
                  type="text"
                  value={allSettings['site.name']?.value || ''}
                  onChange={(e) => handleChange('site.name', e.target.value, 'text', 'branding')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Logo URL</label>
                <input
                  type="url"
                  value={allSettings['site.logo']?.value || ''}
                  onChange={(e) => handleChange('site.logo', e.target.value, 'image', 'branding')}
                  placeholder="/uploads/logo.png"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Favicon URL</label>
                <input
                  type="url"
                  value={allSettings['site.favicon']?.value || ''}
                  onChange={(e) => handleChange('site.favicon', e.target.value, 'image', 'branding')}
                  placeholder="/uploads/favicon.ico"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Design Tab */}
        {activeTab === 'design' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Design & Colors</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={allSettings['site.primaryColor']?.value || '#dc2626'}
                    onChange={(e) => handleChange('site.primaryColor', e.target.value, 'color', 'design')}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={allSettings['site.primaryColor']?.value || '#dc2626'}
                    onChange={(e) => handleChange('site.primaryColor', e.target.value, 'color', 'design')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Secondary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={allSettings['site.secondaryColor']?.value || '#991b1b'}
                    onChange={(e) => handleChange('site.secondaryColor', e.target.value, 'color', 'design')}
                    className="w-16 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={allSettings['site.secondaryColor']?.value || '#991b1b'}
                    onChange={(e) => handleChange('site.secondaryColor', e.target.value, 'color', 'design')}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Font Family</label>
                <select
                  value={allSettings['site.fontFamily']?.value || 'Inter'}
                  onChange={(e) => handleChange('site.fontFamily', e.target.value, 'text', 'design')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Montserrat">Montserrat</option>
                  <option value="Playfair Display">Playfair Display</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Border Radius (px)</label>
                <input
                  type="number"
                  min="0"
                  max="50"
                  value={allSettings['site.borderRadius']?.value || '8'}
                  onChange={(e) => handleChange('site.borderRadius', e.target.value, 'number', 'design')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-900">Floating Buttons</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={allSettings['floating.whatsapp']?.value !== false}
                      onChange={(e) => handleChange('floating.whatsapp', e.target.checked, 'boolean', 'design')}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-900">Show Floating WhatsApp Button</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={allSettings['floating.call']?.value !== false}
                      onChange={(e) => handleChange('floating.call', e.target.checked, 'boolean', 'design')}
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                    />
                    <span className="ml-2 text-sm font-semibold text-gray-900">Show Floating Call Button</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Contact Tab */}
        {activeTab === 'contact' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Phone Number</label>
                <input
                  type="tel"
                  value={allSettings['contact.phone']?.value || ''}
                  onChange={(e) => handleChange('contact.phone', e.target.value, 'text', 'contact')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Email</label>
                <input
                  type="email"
                  value={allSettings['contact.email']?.value || ''}
                  onChange={(e) => handleChange('contact.email', e.target.value, 'text', 'contact')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="contact@vaammotors.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">WhatsApp</label>
                <input
                  type="tel"
                  value={allSettings['contact.whatsapp']?.value || ''}
                  onChange={(e) => handleChange('contact.whatsapp', e.target.value, 'text', 'contact')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="+1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Address</label>
                <input
                  type="text"
                  value={allSettings['contact.address']?.value || ''}
                  onChange={(e) => handleChange('contact.address', e.target.value, 'text', 'contact')}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="Company address"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-gray-900">Map Embed Code</label>
                <textarea
                  value={allSettings['contact.mapEmbed']?.value || ''}
                  onChange={(e) => handleChange('contact.mapEmbed', e.target.value, 'text', 'contact')}
                  rows={4}
                  placeholder="Paste Google Maps embed iframe code here"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Footer Tab */}
        {activeTab === 'footer' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Footer Content</h2>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Footer Text</label>
              <textarea
                value={allSettings['footer.text']?.value || ''}
                onChange={(e) => handleChange('footer.text', e.target.value, 'text', 'footer')}
                rows={5}
                placeholder="Footer copyright text or description"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
