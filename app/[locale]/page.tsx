import { prisma } from '@/lib/prisma';
import { parseImages } from '@/lib/utils';
import { Car } from '@/types/car';
import ServerPageRenderer from '@/components/ServerPageRenderer';
import TrustSection from '@/components/TrustSection';
import CompanyStory from '@/components/CompanyStory';
import VideoSection from '@/components/VideoSection';
import CertificatesSection from '@/components/CertificatesSection';
import HomePageClient from '@/components/HomePageClient';
import ScrollReveal from '@/components/ScrollReveal';
import AnimatedHero from '@/components/AnimatedHero';

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

  const carsWithParsedImages = allCars.map((car) => {
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
    return <ServerPageRenderer slug="home" locale={locale} cars={carsWithParsedImages} />;
  }

  const featuredCars = carsWithParsedImages.filter((car) => car.featured);

  return (
    <div className="min-h-screen bg-[#080808]">
      {/* ── Animated Hero ── */}
      <AnimatedHero />

      {/* ── Stats Bar ── */}
      <ScrollReveal>
        <section className="py-12 border-y border-white/5" style={{ background: 'rgba(15,15,15,0.95)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '500+', label: 'Cars Exported', icon: '🚗' },
                { value: '50+', label: 'Countries Reached', icon: '🌍' },
                { value: '10+', label: 'Years Experience', icon: '⭐' },
                { value: '99%', label: 'Client Satisfaction', icon: '🏆' },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  className="text-center reveal"
                  style={{ transitionDelay: `${i * 0.12}s` }}
                >
                  <div className="text-3xl mb-2">{stat.icon}</div>
                  <div className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </ScrollReveal>

      {/* ── Trust Section ── */}
      <div className="bg-[#0a0a0a]">
        <TrustSection />
      </div>

      {/* ── Featured Cars ── */}
      {featuredCars.length > 0 && (
        <section id="featured" className="py-24" style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0f0f0f 100%)' }}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollReveal>
              <div className="text-center mb-16">
                <span className="inline-block text-red-500 text-sm font-bold tracking-[0.3em] uppercase mb-3">
                  Premium Selection
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                  Featured Vehicles
                </h2>
                <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
                <p className="text-gray-400 mt-6 text-lg max-w-xl mx-auto">
                  Handpicked premium vehicles from our exclusive collection
                </p>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredCars.map((car, i) => (
                <div
                  key={car.id}
                  className="reveal"
                  style={{ transitionDelay: `${i * 0.1}s` }}
                >
                  <HomePageClient car={car} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Company Story ── */}
      <div className="bg-[#080808]">
        <CompanyStory />
      </div>

      {/* ── How It Works ── */}
      <section className="py-24" style={{ background: 'linear-gradient(180deg, #0c0c0c 0%, #111 100%)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-red-500 text-sm font-bold tracking-[0.3em] uppercase mb-3">
                Simple Process
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                How It Works
              </h2>
              <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
              <p className="text-gray-400 mt-6 text-lg max-w-xl mx-auto">
                Get your dream car delivered worldwide in 4 simple steps
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01',
                title: 'Browse & Select',
                desc: 'Explore our curated inventory and choose your perfect vehicle',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
              },
              {
                step: '02',
                title: 'Inspection Report',
                desc: 'We conduct thorough inspection and send you a detailed report',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
              {
                step: '03',
                title: 'Secure Payment',
                desc: 'Complete payment through our fully secure payment system',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                ),
              },
              {
                step: '04',
                title: 'Global Delivery',
                desc: 'We handle all shipping, customs, and delivery to your door',
                icon: (
                  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                ),
              },
            ].map((item, i) => (
              <div
                key={item.step}
                className="reveal reveal-scale group"
                style={{ transitionDelay: `${i * 0.12}s` }}
              >
                <div
                  className="shimmer-card card-3d h-full rounded-2xl p-8 border border-white/5 hover:border-red-600/40 transition-all duration-500"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div className="text-red-500 text-xs font-black tracking-widest mb-4 opacity-60">{item.step}</div>
                  <div className="w-14 h-14 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center text-red-500 mb-5 group-hover:bg-red-600/20 group-hover:border-red-600/40 group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Video Section ── */}
      <div className="bg-[#080808]">
        <VideoSection />
      </div>

      {/* ── Certificates ── */}
      <div className="bg-[#0a0a0a]">
        <CertificatesSection />
      </div>

      {/* ── All Cars ── */}
      <section id="cars" className="py-24" style={{ background: '#0c0c0c' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="inline-block text-red-500 text-sm font-bold tracking-[0.3em] uppercase mb-3">
                Full Inventory
              </span>
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Browse All Cars
              </h2>
              <div className="w-20 h-1 bg-red-600 mx-auto rounded-full" />
              <p className="text-gray-400 mt-6 text-lg max-w-xl mx-auto">
                Our complete collection of premium vehicles available for export
              </p>
            </div>
          </ScrollReveal>
          <HomePageClient cars={carsWithParsedImages} />
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="relative py-28 overflow-hidden">
        <div
          className="absolute inset-0 animate-gradient"
          style={{
            background: 'linear-gradient(135deg, #7f1d1d 0%, #dc2626 40%, #b91c1c 70%, #7f1d1d 100%)',
            backgroundSize: '300% 300%',
          }}
        />
        <div className="absolute inset-0 bg-black/20" />
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-black/30 blur-3xl" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
              Ready to Find Your
              <br />
              <span className="text-white/90">Perfect Car?</span>
            </h2>
            <p className="text-xl text-red-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              Contact our experts today and we&apos;ll help you source, inspect, and deliver the exact vehicle you need — anywhere in the world.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="btn-glow bg-white text-red-700 hover:bg-gray-50 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl"
              >
                Contact Us Now
              </a>
              <a
                href="https://wa.me/1234567890"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-glow bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-xl font-bold text-lg shadow-2xl"
              >
                💬 WhatsApp Us
              </a>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
