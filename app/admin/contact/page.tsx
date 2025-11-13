'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ContactSettingsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    instagramUrl: '',
    wechatId: '',
    whatsappNumber: '',
    businessHours: '',
    email: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current contact info
    fetch('/api/contact-info')
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setFormData(data);
        }
      })
      .catch(() => {
        // If API doesn't exist, load from config file (we'll create the API)
        console.log('Contact info API not available');
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/contact-info', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Contact information updated successfully!');
        setTimeout(() => {
          router.push('/admin');
        }, 2000);
      } else {
        setMessage('Failed to update contact information. Please check the server logs.');
      }
    } catch (error) {
      console.error('Error updating contact info:', error);
      setMessage('Failed to update contact information.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => router.push('/admin')}
            className="text-red-600 hover:text-red-700 font-bold mb-4"
          >
            ← Back to Admin
          </button>
          <h1 className="text-3xl font-bold text-black">Contact Information Settings</h1>
          <p className="text-gray-600 mt-2">Update your company's contact information</p>
        </div>

        {message && (
          <div
            className={`p-4 rounded-md mb-6 ${
              message.includes('successfully')
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              Instagram URL
            </label>
            <input
              type="text"
              value={formData.instagramUrl}
              onChange={(e) =>
                setFormData({ ...formData, instagramUrl: e.target.value })
              }
              placeholder="https://instagram.com/yourcompany or @yourcompany"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter full URL (https://instagram.com/...) or username (@username)
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              WeChat ID
            </label>
            <input
              type="text"
              value={formData.wechatId}
              onChange={(e) =>
                setFormData({ ...formData, wechatId: e.target.value })
              }
              placeholder="your-wechat-id"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              WhatsApp Number
            </label>
            <input
              type="text"
              value={formData.whatsappNumber}
              onChange={(e) =>
                setFormData({ ...formData, whatsappNumber: e.target.value })
              }
              placeholder="1234567890 (include country code)"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., 1234567890 for US)
            </p>
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              Business Hours
            </label>
            <input
              type="text"
              value={formData.businessHours}
              onChange={(e) =>
                setFormData({ ...formData, businessHours: e.target.value })
              }
              placeholder="Monday - Friday: 9:00 AM - 6:00 PM"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div>
            <label className="block text-sm font-bold mb-2 text-black">
              Email (for contact form)
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="contact@vaamcarsale.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md text-black"
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 font-bold"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/admin')}
              className="px-6 py-2 bg-gray-200 text-black rounded-md hover:bg-gray-300 font-bold"
            >
              Cancel
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> If the API is not available, you can manually edit the contact
            information in <code className="bg-yellow-100 px-1 rounded">config/contact.ts</code>
          </p>
        </div>
      </div>
    </div>
  );
}

