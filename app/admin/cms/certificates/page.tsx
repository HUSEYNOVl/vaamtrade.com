'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Certificate {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string;
  order: number;
  visible: boolean;
}

export default function CertificatesPage() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Certificate | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch('/api/cms/certificates');
      if (response.ok) {
        const data = await response.json();
        setCertificates(data);
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this certificate?')) return;

    try {
      const response = await fetch(`/api/cms/certificates/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCertificates();
      }
    } catch (error) {
      console.error('Error deleting certificate:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      title: formData.get('title'),
      description: formData.get('description'),
      imageUrl: formData.get('imageUrl'),
      order: parseInt(formData.get('order') as string) || 0,
      visible: formData.get('visible') === 'on',
    };

    try {
      const url = editing ? `/api/cms/certificates/${editing.id}` : '/api/cms/certificates';
      const method = editing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        fetchCertificates();
        setShowForm(false);
        setEditing(null);
        (e.target as HTMLFormElement).reset();
      }
    } catch (error) {
      console.error('Error saving certificate:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 font-semibold">Loading certificates...</div>
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
          <h1 className="text-3xl font-bold text-gray-900">Certificates</h1>
          <p className="text-gray-600 mt-2">Manage company certificates and legal documents</p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setShowForm(true);
          }}
          className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition"
        >
          + Add Certificate
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            {editing ? 'Edit Certificate' : 'Add New Certificate'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Title</label>
              <input
                type="text"
                name="title"
                defaultValue={editing?.title || ''}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Description</label>
              <textarea
                name="description"
                defaultValue={editing?.description || ''}
                rows={3}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-900">Image URL</label>
              <input
                type="url"
                name="imageUrl"
                defaultValue={editing?.imageUrl || ''}
                required
                placeholder="/uploads/certificate.jpg"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Order</label>
                <input
                  type="number"
                  name="order"
                  defaultValue={editing?.order || 0}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                />
              </div>
              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  name="visible"
                  defaultChecked={editing?.visible !== false}
                  className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                />
                <label className="ml-2 text-sm font-semibold text-gray-900">Visible</label>
              </div>
            </div>
            <div className="flex gap-4">
              <button
                type="submit"
                className="bg-red-600 text-white px-6 py-2.5 rounded-lg hover:bg-red-700 font-semibold transition"
              >
                {editing ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditing(null);
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg hover:bg-gray-300 font-semibold transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {certificates.map((cert) => (
          <div key={cert.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="relative h-48">
              <Image
                src={cert.imageUrl}
                alt={cert.title}
                fill
                className="object-cover"
                unoptimized={cert.imageUrl.startsWith('/uploads/')}
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-gray-900 mb-1">{cert.title}</h3>
              {cert.description && <p className="text-sm text-gray-600 mb-2">{cert.description}</p>}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => {
                    setEditing(cert);
                    setShowForm(true);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cert.id)}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-2 rounded-lg text-sm font-semibold transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {certificates.length === 0 && (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No certificates yet. Add your first certificate above.</p>
        </div>
      )}
    </div>
  );
}

