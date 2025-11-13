'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import TrustSection from './TrustSection';
import CompanyStory from './CompanyStory';
import VideoSection from './VideoSection';
import CertificatesSection from './CertificatesSection';
import HomePageClient from './HomePageClient';
import ContactForm from './ContactForm';
import SocialLinks from './SocialLinks';
import { contactInfo } from '@/config/contact';

interface Section {
  type: string;
  id: string;
  visible: boolean;
  order: number;
  content: any;
}

interface PageRendererProps {
  slug: string;
  locale?: string;
}

export default function PageRenderer({ slug, locale = 'en' }: PageRendererProps) {
  const [page, setPage] = useState<any>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    try {
      const response = await fetch(`/api/cms/pages?slug=${slug}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          const pageData = data[0];
          setPage(pageData);
          
          // Parse sections
          let parsedSections: Section[] = [];
          try {
            parsedSections = typeof pageData.sections === 'string' 
              ? JSON.parse(pageData.sections) 
              : pageData.sections || [];
          } catch {
            parsedSections = [];
          }
          
          // Filter visible sections and sort by order
          const visibleSections = parsedSections
            .filter((s: Section) => s.visible !== false)
            .sort((a: Section, b: Section) => a.order - b.order);
          
          setSections(visibleSections);
        }
      }
    } catch (error) {
      console.error('Error fetching page:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderSection = (section: Section) => {
    switch (section.type) {
      case 'hero':
        return (
          <section key={section.id} className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 md:py-32 overflow-hidden">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-4xl mx-auto">
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                  {section.content?.title || 'Welcome'}
                </h1>
                {section.content?.subtitle && (
                  <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
                    {section.content.subtitle}
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  {section.content?.primaryCTA && (
                    <a
                      href={section.content.primaryCTA.link}
                      className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      {section.content.primaryCTA.text}
                    </a>
                  )}
                  {section.content?.secondaryCTA && (
                    <a
                      href={section.content.secondaryCTA.link}
                      target={section.content.secondaryCTA.external ? '_blank' : undefined}
                      rel={section.content.secondaryCTA.external ? 'noopener noreferrer' : undefined}
                      className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                    >
                      {section.content.secondaryCTA.text}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </section>
        );

      case 'trust-section':
        return <TrustSection key={section.id} />;

      case 'featured-cars':
        return (
          <section key={section.id} id="featured" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Featured Vehicles'}
                </h2>
                {section.content?.subtitle && (
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {section.content.subtitle}
                  </p>
                )}
              </div>
              <div id="featured-cars-container"></div>
            </div>
          </section>
        );

      case 'company-story':
        return <CompanyStory key={section.id} />;

      case 'video-section':
        return <VideoSection key={section.id} />;

      case 'certificates-section':
        return <CertificatesSection key={section.id} />;

      case 'how-it-works':
        return (
          <section key={section.id} className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'How It Works'}
                </h2>
                {section.content?.subtitle && (
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {section.content.subtitle}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {section.content?.steps?.map((step: any) => (
                  <div key={step.step} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all text-center">
                    <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                      {step.step}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'all-cars':
        return (
          <section key={section.id} id="cars" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                  {section.content?.title || 'Complete Inventory'}
                </h2>
                {section.content?.subtitle && (
                  <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    {section.content.subtitle}
                  </p>
                )}
              </div>
              <div id="all-cars-container"></div>
            </div>
          </section>
        );

      case 'cta-section':
        return (
          <section key={section.id} className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {section.content?.title || 'Ready to Find Your Perfect Car?'}
              </h2>
              {section.content?.subtitle && (
                <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                  {section.content.subtitle}
                </p>
              )}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {section.content?.primaryCTA && (
                  <a
                    href={section.content.primaryCTA.link}
                    className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  >
                    {section.content.primaryCTA.text}
                  </a>
                )}
                {section.content?.secondaryCTA && (
                  <a
                    href={section.content.secondaryCTA.link}
                    target={section.content.secondaryCTA.external ? '_blank' : undefined}
                    rel={section.content.secondaryCTA.external ? 'noopener noreferrer' : undefined}
                    className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
                  >
                    {section.content.secondaryCTA.text}
                  </a>
                )}
              </div>
            </div>
          </section>
        );

      case 'text-block':
        return (
          <section key={section.id} className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-xl text-gray-700 leading-relaxed">
                  {section.content?.text || ''}
                </p>
              </div>
            </div>
          </section>
        );

      case 'mission':
        return (
          <section key={section.id} className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-red-50 rounded-xl p-6 mb-8 border-l-4 border-red-600">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">
                  {section.content?.title || 'Our Mission'}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {section.content?.text || ''}
                </p>
              </div>
            </div>
          </section>
        );

      case 'features-grid':
        return (
          <section key={section.id} className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-semibold mt-10 mb-6 text-gray-900 text-center">
                {section.content?.title || 'Why Choose Us'}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.content?.features?.map((feature: any, idx: number) => (
                  <div key={idx} className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                    <div className="text-2xl mb-2">{feature.icon}</div>
                    <h3 className="font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600 text-sm">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        );

      case 'contact-form':
        return (
          <section key={section.id} className="py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-6 text-gray-900">Send Message</h2>
                <ContactForm />
              </div>
            </div>
          </section>
        );

      case 'contact-info':
        return (
          <section key={section.id} className="py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-2xl font-semibold mb-4 text-gray-900">Get in Touch</h2>
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Contact Us Via</h3>
                  <div className="space-y-3">
                    <SocialLinks />
                    {contactInfo.email && (
                      <p className="text-gray-700">
                        📧 <a href={`mailto:${contactInfo.email}`} className="text-red-600 hover:underline">{contactInfo.email}</a>
                      </p>
                    )}
                    {contactInfo.whatsappNumber && (
                      <p className="text-gray-700">
                        📱 WhatsApp: <a href={`https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-red-600 hover:underline">{contactInfo.whatsappNumber}</a>
                      </p>
                    )}
                  </div>
                </div>
                {contactInfo.businessHours && (
                  <div className="bg-red-50 rounded-xl p-6 border border-red-100">
                    <h3 className="font-semibold mb-2 text-gray-900">Business Hours</h3>
                    <p className="text-gray-700">{contactInfo.businessHours}</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Page not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {sections.map((section) => renderSection(section))}
    </div>
  );
}

