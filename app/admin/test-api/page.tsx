'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [uploadResult, setUploadResult] = useState<any>(null);
  const [carResult, setCarResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const testUpload = async () => {
    setTesting(true);
    setUploadResult(null);
    
    // Create a simple test image (1x1 pixel PNG)
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'red';
      ctx.fillRect(0, 0, 1, 1);
    }
    
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setUploadResult({ error: 'Failed to create test image' });
        setTesting(false);
        return;
      }

      const file = new File([blob], 'test.png', { type: 'image/png' });
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        const text = await response.text();
        let data;
        try {
          data = JSON.parse(text);
        } catch (e) {
          data = { error: 'Invalid JSON', raw: text };
        }

        setUploadResult({
          status: response.status,
          ok: response.ok,
          data,
        });
      } catch (error: any) {
        setUploadResult({
          error: error?.message || 'Network error',
        });
      } finally {
        setTesting(false);
      }
    }, 'image/png');
  };

  const testCarCreation = async () => {
    setTesting(true);
    setCarResult(null);

    const testCar = {
      make: 'Test',
      model: 'Car',
      year: 2024,
      price: 10000,
      currency: 'USD',
      condition: 'New',
      images: [],
    };

    try {
      const response = await fetch('/api/cars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testCar),
      });

      const text = await response.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch (e) {
        data = { error: 'Invalid JSON', raw: text };
      }

      setCarResult({
        status: response.status,
        ok: response.ok,
        data,
      });
    } catch (error: any) {
      setCarResult({
        error: error?.message || 'Network error',
      });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">API Test Page</h1>
      
      <div className="space-y-6">
        {/* Upload Test */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Test Image Upload</h2>
          <button
            onClick={testUpload}
            disabled={testing}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Upload API'}
          </button>
          {uploadResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded border">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(uploadResult, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Car Creation Test */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Test Car Creation</h2>
          <button
            onClick={testCarCreation}
            disabled={testing}
            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
          >
            {testing ? 'Testing...' : 'Test Car Creation API'}
          </button>
          {carResult && (
            <div className="mt-4 p-4 bg-gray-50 rounded border">
              <pre className="text-sm overflow-auto">
                {JSON.stringify(carResult, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

