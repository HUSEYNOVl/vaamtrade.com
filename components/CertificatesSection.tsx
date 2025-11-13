'use client';

import { useState } from 'react';
import Image from 'next/image';

interface Certificate {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

interface CertificatesSectionProps {
  certificates?: Certificate[];
}

export default function CertificatesSection({ certificates = [] }: CertificatesSectionProps) {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  // Default certificates if none provided
  const defaultCerts: Certificate[] = certificates.length > 0 ? certificates : [
    {
      id: '1',
      title: 'Company Registration Certificate',
      description: 'Official business registration document',
      imageUrl: '/images/placeholder-cert.jpg',
    },
    {
      id: '2',
      title: 'Import/Export License',
      description: 'Licensed for international vehicle trading',
      imageUrl: '/images/placeholder-cert.jpg',
    },
    {
      id: '3',
      title: 'Tax Documents',
      description: 'Tax compliance and registration',
      imageUrl: '/images/placeholder-cert.jpg',
    },
    {
      id: '4',
      title: 'Trade Permit',
      description: 'Authorized trade permit for vehicle sales',
      imageUrl: '/images/placeholder-cert.jpg',
    },
  ];

  return (
    <>
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Our Certifications & Legal Documents
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              VAAM Motors is fully licensed and certified for international vehicle trading
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {defaultCerts.map((cert) => (
              <div
                key={cert.id}
                onClick={() => setSelectedCert(cert)}
                className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer border border-gray-100 hover:border-red-200 group"
              >
                <div className="relative h-48 w-full bg-gray-100 rounded-lg mb-4 overflow-hidden">
                  <Image
                    src={cert.imageUrl}
                    alt={cert.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                    <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{cert.title}</h3>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedCert(null)}
        >
          <div className="bg-white rounded-xl max-w-4xl w-full p-6 relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedCert(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 text-2xl"
            >
              ×
            </button>
            <div className="relative h-96 w-full bg-gray-100 rounded-lg mb-4">
              <Image
                src={selectedCert.imageUrl}
                alt={selectedCert.title}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedCert.title}</h3>
            <p className="text-gray-600">{selectedCert.description}</p>
          </div>
        </div>
      )}
    </>
  );
}

