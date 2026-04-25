import { prisma } from '@/lib/prisma';
import { parseImages } from '@/lib/utils';
import { Car } from '@/types/car';
import ServerPageRenderer from '@/components/ServerPageRenderer';
import HomePageClient from '@/components/HomePageClient';
import AnimatedHero from '@/components/AnimatedHero';
import StatsStrip from '@/components/StatsStrip';
import HowItWorks from '@/components/HowItWorks';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let allCars: any[] = [];
  try {
    allCars = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } });
  } catch {
    allCars = [];
  }

  const cars = allCars.map((car) => {
    let images = parseImages(car.images as any);
    images = images.filter((img: string) => {
      if (!img || typeof img !== 'string') return false;
      if (img.startsWith('file://')) return false;
      return img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://');
    });
    return { ...car, images };
  }) as Car[];

  let cmsPageExists = false;
  try {
    const page = await prisma.page.findUnique({ where: { slug: 'home' } });
    cmsPageExists = page !== null && page.status === 'published';
  } catch {
    cmsPageExists = false;
  }

  if (cmsPageExists) {
    return <ServerPageRenderer slug="home" locale={locale} cars={cars} />;
  }

  const featuredCars = cars.filter((c) => c.featured);

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Hero */}
      <AnimatedHero />

      {/* Stats strip */}
      <StatsStrip />

      {/* Featured */}
      {featuredCars.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex items-center justify-between mb-7">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Featured</p>
              <h2 className="text-2xl font-extrabold text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
                Handpicked Vehicles
              </h2>
            </div>
            <a href="#inventory" className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>View all →</a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredCars.slice(0, 3).map((car) => <HomePageClient key={car.id} car={car} />)}
          </div>
        </section>
      )}

      {/* How it works */}
      <HowItWorks />

      {/* Full inventory */}
      <section id="inventory" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--accent)' }}>Inventory</p>
          <h2 className="text-2xl font-extrabold text-[var(--text)]" style={{ fontFamily: 'Syne, sans-serif' }}>
            Browse All Vehicles
          </h2>
        </div>
        <HomePageClient cars={cars} />
      </section>

      {/* CTA banner */}
      <section className="border-t border-[var(--border)]" style={{ background: 'var(--accent)' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14 text-center text-white">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3" style={{ fontFamily: 'Syne, sans-serif' }}>
            Can&apos;t find what you&apos;re looking for?
          </h2>
          <p className="text-red-100 mb-7 max-w-lg mx-auto">
            We source vehicles to order. Tell us exactly what you want and we&apos;ll find it.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="/contact"
              className="btn bg-white font-bold px-8 py-3 rounded-xl"
              style={{ color: 'var(--accent)' }}
            >
              Request a Vehicle
            </a>
            <a
              href="https://wa.me/1234567890"
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-3 rounded-xl"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
