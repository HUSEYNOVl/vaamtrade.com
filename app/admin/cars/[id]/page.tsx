'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

export default function EditCarPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState({
    make: '',
    model: '',
    year: new Date().getFullYear(),
    price: '',
    currency: 'USD',
    mileage: '',
    condition: 'Used',
    transmission: '',
    fuelType: '',
    color: '',
    description: '',
    images: [] as string[],
    featured: false,
  });
  const [submitError, setSubmitError] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCar();
  }, [id]);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file (jpg, png, etc.)');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size must be less than 10MB');
      return;
    }

    setUploading(true);
    setUploadError('');
    setUploadSuccess(false);

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      });

      if (response.ok) {
        let data;
        try {
          const text = await response.text();
          data = JSON.parse(text);
        } catch (parseError) {
          setUploadError('Server returned invalid response. Please try again.');
          return;
        }
        
        if (!data.url) {
          setUploadError('Upload succeeded but no URL returned. Please try again.');
          return;
        }

        // Use the component's formData state, not the FormData object
        setFormData((prevFormData) => {
          const currentImages = Array.isArray(prevFormData.images) ? prevFormData.images : [];
          return {
            ...prevFormData,
            images: [...currentImages, data.url],
          };
        });
        setUploadSuccess(true);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setTimeout(() => setUploadSuccess(false), 3000);
      } else {
        let errorMessage = 'Failed to upload image. Please try again.';
        try {
          const text = await response.text();
          const errorData = JSON.parse(text);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status}). Please try again.`;
        }
        setUploadError(errorMessage);
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      setUploadError(error?.message || 'Network error. Please check your connection and try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Get current image count from state
    const currentImageCount = Array.isArray(formData.images) ? formData.images.length : 0;
    const remainingSlots = 10 - currentImageCount;
    
    if (remainingSlots <= 0) {
      setUploadError('Maximum 10 images allowed per car. Please remove some images first.');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      return;
    }

    // Process up to remaining slots
    const filesToUpload = Array.from(files).slice(0, remainingSlots);
    
    if (files.length > remainingSlots) {
      setUploadError(`You can only upload ${remainingSlots} more image(s). Only the first ${remainingSlots} will be uploaded.`);
    }

    // Collect all uploaded URLs
    const uploadedUrls: string[] = [];
    setUploading(true);
    setUploadError('');

    // Upload files sequentially
    for (let i = 0; i < filesToUpload.length; i++) {
      const file = filesToUpload[i];
      
      // Validate file
      if (!file.type.startsWith('image/')) {
        setUploadError(`File ${i + 1} is not an image. Skipping...`);
        continue;
      }

      if (file.size > 10 * 1024 * 1024) {
        setUploadError(`File ${i + 1} is too large (max 10MB). Skipping...`);
        continue;
      }

      try {
        const uploadFormData = new FormData();
        uploadFormData.append('file', file);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        });

        if (response.ok) {
          const text = await response.text();
          const data = JSON.parse(text);
          if (data.url) {
            uploadedUrls.push(data.url);
          }
        }
      } catch (error) {
        console.error(`Error uploading file ${i + 1}:`, error);
      }
    }

    // Update state with all uploaded images at once
    if (uploadedUrls.length > 0) {
      setFormData((prevFormData) => {
        const currentImages = Array.isArray(prevFormData.images) ? prevFormData.images : [];
        return {
          ...prevFormData,
          images: [...currentImages, ...uploadedUrls],
        };
      });
      setUploadSuccess(true);
      setTimeout(() => setUploadSuccess(false), 3000);
    }

    setUploading(false);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const fetchCar = async () => {
    try {
      const response = await fetch(`/api/cars/${id}`);
      if (response.ok) {
        const car = await response.json();
        let images: string[] = [];
        if (car.images) {
          if (Array.isArray(car.images)) {
            images = car.images;
          } else if (typeof car.images === 'string') {
            try {
              images = JSON.parse(car.images);
            } catch {
              images = [];
            }
          }
        }
        
        setFormData({
          make: car.make,
          model: car.model,
          year: car.year,
          price: car.price.toString(),
          currency: car.currency,
          mileage: car.mileage?.toString() || '',
          condition: car.condition,
          transmission: car.transmission || '',
          fuelType: car.fuelType || '',
          color: car.color || '',
          description: car.description || '',
          images: images,
          featured: car.featured,
        });
      }
    } catch (error) {
      console.error('Error fetching car:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');
    setIsSubmitting(true);

    try {
      // Get current form values
      const makeValue = formData.make?.trim() || '';
      const modelValue = formData.model?.trim() || '';
      const yearValue = formData.year;
      const priceValue = formData.price;

      // Validate required fields with better error messages
      if (!makeValue) {
        setSubmitError('Make is required');
        setIsSubmitting(false);
        return;
      }
      if (!modelValue) {
        setSubmitError('Model is required');
        setIsSubmitting(false);
        return;
      }
      if (!yearValue || yearValue < 1900 || yearValue > new Date().getFullYear() + 1) {
        setSubmitError('Please enter a valid year');
        setIsSubmitting(false);
        return;
      }
      if (!priceValue || parseFloat(priceValue.toString()) <= 0) {
        setSubmitError('Price must be greater than 0');
        setIsSubmitting(false);
        return;
      }

      // Ensure images is an array and filter out empty values
      const images = Array.isArray(formData.images) 
        ? formData.images.filter((img) => img && typeof img === 'string' && img.trim().length > 0)
        : [];

      const carData = {
        make: makeValue,
        model: modelValue,
        year: parseInt(yearValue.toString()),
        price: parseFloat(priceValue.toString()),
        currency: formData.currency || 'USD',
        mileage: formData.mileage ? parseInt(formData.mileage.toString()) : null,
        condition: formData.condition || 'Used',
        transmission: formData.transmission || null,
        fuelType: formData.fuelType || null,
        color: formData.color || null,
        description: formData.description || null,
        images: images,
        featured: Boolean(formData.featured),
      };

      console.log('Updating car data:', { ...carData, images: `${images.length} images` });

      const response = await fetch(`/api/cars/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(carData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Car updated successfully:', result.id);
        // Redirect after a brief delay to ensure data is saved
        setTimeout(() => {
          router.push('/admin/cars');
          router.refresh(); // Force refresh to show updated car
        }, 500);
      } else {
        let errorMessage = 'Failed to update car. Please check all required fields.';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status}). Please try again.`;
        }
        setSubmitError(errorMessage);
      }
    } catch (error: any) {
      console.error('Error updating car:', error);
      setSubmitError(error?.message || 'Failed to update car. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addImageUrl = () => {
    const url = imageUrl.trim();
    if (url) {
      if (url.startsWith('file://')) {
        setUploadError('Cannot use local file paths. Please upload the image file instead.');
        return;
      }
      
      let finalUrl = url;
      if (!url.startsWith('/') && !url.startsWith('http://') && !url.startsWith('https://')) {
        finalUrl = `https://${url}`;
      }
      
      const currentImages = Array.isArray(formData.images) ? formData.images : [];
      setFormData({
        ...formData,
        images: [...currentImages, finalUrl],
      });
      setImageUrl('');
    }
  };

  const removeImage = (index: number) => {
    const currentImages = Array.isArray(formData.images) ? formData.images : [];
    setFormData({
      ...formData,
      images: currentImages.filter((_, i) => i !== index),
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-600 font-semibold">Loading car details...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <Link href="/admin/cars" className="text-red-600 hover:text-red-700 font-semibold mb-4 inline-block">
          ← Back to Cars
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Edit Car</h1>
        <p className="text-gray-600 mt-2">Update the details of this car</p>
      </div>

      {submitError && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">✗ {submitError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Make <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.make}
                  onChange={(e) => setFormData({ ...formData, make: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Toyota"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Model <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Camry"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Year <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) || new Date().getFullYear() })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Condition <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Price <span className="text-red-600">*</span>
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Currency <span className="text-red-600">*</span>
                </label>
                <select
                  value={formData.currency}
                  onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CNY">CNY (¥)</option>
                  <option value="RUB">RUB (₽)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Mileage</label>
                <input
                  type="number"
                  min="0"
                  value={formData.mileage}
                  onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., 50000"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Transmission</label>
                <select
                  value={formData.transmission}
                  onChange={(e) => setFormData({ ...formData, transmission: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">Select...</option>
                  <option value="Automatic">Automatic</option>
                  <option value="Manual">Manual</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Fuel Type</label>
                <select
                  value={formData.fuelType}
                  onChange={(e) => setFormData({ ...formData, fuelType: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="">Select...</option>
                  <option value="Gasoline">Gasoline</option>
                  <option value="Diesel">Diesel</option>
                  <option value="Electric">Electric</option>
                  <option value="Hybrid">Hybrid</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-900">Color</label>
                <input
                  type="text"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                  placeholder="e.g., Black"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-2 text-gray-900">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={5}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
              placeholder="Enter a detailed description of the car..."
            />
          </div>

          {/* Images */}
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">Images</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload up to 10 images per car. You can select multiple images at once or upload them one by one.
            </p>
            
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Upload Image Files (Up to 10 images total)
              </label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                disabled={uploading}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 disabled:opacity-50"
              />
              <p className="text-xs text-gray-500 mt-1">
                You can select multiple images at once (up to 10 total per car)
              </p>
              {uploading && (
                <p className="text-sm text-blue-600 mt-2 font-medium">⏳ Uploading image...</p>
              )}
              {uploadSuccess && (
                <p className="text-sm text-green-600 mt-2 font-medium">✓ Image uploaded successfully!</p>
              )}
              {uploadError && (
                <p className="text-sm text-red-600 mt-2 font-medium">✗ {uploadError}</p>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-semibold mb-2 text-gray-900">
                Or Add Image URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent text-gray-900"
                />
                <button
                  type="button"
                  onClick={addImageUrl}
                  className="bg-gray-600 text-white px-6 py-2.5 rounded-lg hover:bg-gray-700 transition font-semibold"
                >
                  Add URL
                </button>
              </div>
            </div>

            {Array.isArray(formData.images) && formData.images.length > 0 && (
              <div className="mt-4">
                <label className="block text-sm font-semibold mb-2 text-gray-900">
                  Uploaded Images ({formData.images.length})
                </label>
                <div className="flex flex-wrap gap-3">
                  {formData.images.map((img, index) => (
                    <div key={index} className="relative group">
                      <img 
                        src={img} 
                        alt={`Image ${index + 1}`} 
                        className="h-24 w-24 object-cover rounded-lg border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold opacity-0 group-hover:opacity-100 transition"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Featured */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
              className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
            />
            <label htmlFor="featured" className="ml-2 text-sm font-semibold text-gray-900">
              Mark as Featured Car
            </label>
          </div>
        </div>

        {/* Form Actions */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-4">
          <Link
            href="/admin/cars"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-semibold transition"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed font-semibold transition"
          >
            {isSubmitting ? 'Updating...' : 'Update Car'}
          </button>
        </div>
      </form>
    </div>
  );
}
