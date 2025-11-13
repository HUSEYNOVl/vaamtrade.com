import { prisma } from '@/lib/prisma';
import { parseImages } from '@/lib/utils';
import { Car } from '@/types/car';
import ServerPageRenderer from '@/components/ServerPageRenderer';
import TrustSection from '@/components/TrustSection';
import CompanyStory from '@/components/CompanyStory';
import VideoSection from '@/components/VideoSection';
import CertificatesSection from '@/components/CertificatesSection';
import HomePageClient from '@/components/HomePageClient';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  // Fetch cars
  let allCars: any[] = [];
  try {
    allCars = await prisma.car.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching cars:', error);
    allCars = [];
  }

  const carsWithParsedImages = allCars.map((car) => {
    let images = parseImages(car.images as any);
    images = images.filter((img: string) => {
      if (!img || typeof img !== 'string') return false;
      if (img.startsWith('file://')) return false;
      return img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://');
    });
    return {
      ...car,
      images,
    };
  }) as Car[];

  // Check if CMS page exists
  let cmsPageExists = false;
  try {
    const page = await prisma.page.findUnique({
      where: { slug: 'home' },
    });
    cmsPageExists = page !== null && page.status === 'published';
  } catch (error) {
    console.error('Error checking CMS page:', error);
    cmsPageExists = false;
  }

  // Render page from CMS if it exists
  if (cmsPageExists) {
    return <ServerPageRenderer slug="home" locale={locale} cars={carsWithParsedImages} />;
  }

  // Fallback to original hard-coded homepage
  const featuredCars = carsWithParsedImages.filter(car => car.featured);
  const regularCars = carsWithParsedImages.filter(car => !car.featured);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - Luxury & Premium */}
      <section className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Trusted Global Luxury Car Exporter
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-2xl mx-auto leading-relaxed">
              VAAM Motors delivers premium vehicles worldwide. Licensed import-export company with years of experience in international automotive trading.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#cars"
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                View Available Cars
              </a>
              <a
                href="/contact"
                className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
              >
                Request a Car
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <TrustSection />

      {/* Featured Cars Section */}
      {featuredCars.length > 0 && (
        <section id="featured" className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Featured Vehicles
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Handpicked premium vehicles from our collection
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car) => (
                <HomePageClient key={car.id} car={car} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Company Story */}
      <CompanyStory />

      {/* Video Section */}
      <VideoSection />

      {/* Certificates Section */}
      <CertificatesSection />

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get your dream car delivered worldwide
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: '1', title: 'Browse & Select', desc: 'Explore our inventory and choose your perfect vehicle' },
              { step: '2', title: 'Inspection & Verification', desc: 'We conduct thorough inspection and provide detailed reports' },
              { step: '3', title: 'Secure Payment', desc: 'Complete payment through our secure payment system' },
              { step: '4', title: 'Worldwide Delivery', desc: 'We handle shipping and delivery to your location' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all text-center">
                <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* All Cars Section with Filters */}
      <section id="cars" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Complete Inventory
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Browse our full collection of premium vehicles
            </p>
          </div>
          <HomePageClient cars={carsWithParsedImages} />
        </div>
      </section>

      {/* Contact CTA Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Find Your Perfect Car?
          </h2>
          <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
            Contact us today and let our experts help you find the perfect vehicle for your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-red-600 hover:bg-gray-100 px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              Contact Us Now
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-xl hover:shadow-2xl transition-all transform hover:scale-105"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
