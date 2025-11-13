'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MediaItem {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  mimeType: string;
  size: number;
  folder: string | null;
  alt: string | null;
  caption: string | null;
  createdAt: string;
}

export default function MediaManagerPage() {
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<string>('');
  const [folders, setFolders] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchMedia();
  }, [selectedFolder]);

  const fetchMedia = async () => {
    try {
      const url = selectedFolder
        ? `/api/cms/media?folder=${encodeURIComponent(selectedFolder)}`
        : '/api/cms/media';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setMedia(data.media || []);
        // Extract unique folders
        const uniqueFolders = Array.from(new Set(data.media?.map((m: MediaItem) => m.folder).filter(Boolean) || [])) as string[];
        setFolders(uniqueFolders);
      }
    } catch (error) {
      console.error('Error fetching media:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    const uploadedFiles: MediaItem[] = [];
    const errors: string[] = [];

    // Upload files sequentially for better progress tracking
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      try {
        // Validate file type
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          errors.push(`${file.name}: Invalid file type. Only images and videos are allowed.`);
          continue;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
          errors.push(`${file.name}: File too large (max 10MB)`);
          continue;
        }

        const formData = new FormData();
        formData.append('file', file);
        if (selectedFolder) {
          formData.append('folder', selectedFolder);
        }

        const response = await fetch('/api/cms/media', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const mediaItem = await response.json();
          uploadedFiles.push(mediaItem);
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
          errors.push(`${file.name}: ${errorData.error || 'Upload failed'}`);
        }
      } catch (error: any) {
        console.error('Error uploading file:', error);
        errors.push(`${file.name}: ${error?.message || 'Network error'}`);
      }
    }

    setUploading(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Show success/error messages
    if (uploadedFiles.length > 0) {
      alert(`Successfully uploaded ${uploadedFiles.length} file(s)!`);
    }
    if (errors.length > 0) {
      alert(`Errors:\n${errors.join('\n')}`);
    }

    fetchMedia();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this media file? This action cannot be undone.')) return;

    try {
      const response = await fetch(`/api/cms/media/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMedia();
        alert('Media file deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Delete failed' }));
        alert(`Failed to delete: ${errorData.error || 'Unknown error'}`);
      }
    } catch (error: any) {
      console.error('Error deleting media:', error);
      alert(`Error: ${error?.message || 'Failed to delete media file'}`);
    }
  };

  const copyUrl = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      alert('✓ URL copied to clipboard!');
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('✓ URL copied to clipboard!');
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mb-4"></div>
        <div className="text-gray-600 font-semibold">Loading media...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/cms" className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-block">
          ← Back to CMS
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Media Manager</h1>
        <p className="text-gray-600 mt-2">Upload and manage images, videos, and other media files</p>
      </div>

      {/* Upload Section */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Upload Media</h2>
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2 text-gray-900">Folder (optional)</label>
            <input
              type="text"
              value={selectedFolder}
              onChange={(e) => setSelectedFolder(e.target.value)}
              placeholder="e.g., certificates, cars, banners"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-semibold mb-2 text-gray-900">Select Files</label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleUpload}
              disabled={uploading}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 disabled:opacity-50"
            />
          </div>
        </div>
        {uploading && (
          <div className="mt-2">
            <p className="text-sm text-blue-600 font-medium">⏳ Uploading files... Please wait.</p>
            <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
              <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: '60%' }}></div>
            </div>
          </div>
        )}
      </div>

      {/* Folder Filter */}
      {folders.length > 0 && (
        <div className="mb-6 flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedFolder('')}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              !selectedFolder
                ? 'bg-red-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All
          </button>
          {folders.map((folder) => (
            <button
              key={folder}
              onClick={() => setSelectedFolder(folder)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedFolder === folder
                  ? 'bg-red-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {folder}
            </button>
          ))}
        </div>
      )}

      {/* Media Grid */}
      {media.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">No media files found. Upload some files to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {media.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition"
            >
              {item.mimeType.startsWith('image/') ? (
                <div className="relative aspect-square">
                  <Image
                    src={item.url}
                    alt={item.alt || item.originalName}
                    fill
                    className="object-cover"
                    unoptimized={item.url.startsWith('/uploads/')}
                  />
                </div>
              ) : (
                <div className="aspect-square bg-gray-100 flex items-center justify-center">
                  <span className="text-4xl">🎥</span>
                </div>
              )}
              <div className="p-3">
                <p className="text-xs text-gray-600 truncate mb-1" title={item.originalName}>
                  {item.originalName}
                </p>
                <p className="text-xs text-gray-400 mb-2">{formatFileSize(item.size)}</p>
                <div className="flex gap-1">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="flex-1 text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded transition"
                  >
                    Copy URL
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-xs bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

