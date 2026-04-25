import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import FloatingContactIcons from '@/components/FloatingContactIcons';
import GlobalScrollReveal from '@/components/GlobalScrollReveal';
import { contactInfo } from '@/config/contact';
import { Link } from '@/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  const messages = await getMessages();
  const t = await getTranslations({ locale, namespace: 'Navigation' });

  return (
    <NextIntlClientProvider messages={messages}>
      <GlobalScrollReveal />
      <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
        <Navigation />
        <main className="flex-grow">{children}</main>
        <FloatingContactIcons />

        <footer className="relative overflow-hidden" style={{ background: '#080807' }}>
          {/* Subtle top glow */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, rgba(200,50,26,0.4), transparent)' }} />

          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.025]" style={{ backgroundImage: 'radial-gradient(circle, #c8321a 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

          {/* Glow orb */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-64 pointer-events-none" style={{ background: 'radial-gradient(ellipse, rgba(200,50,26,0.07) 0%, transparent 70%)', filter: 'blur(20px)' }} />

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Main grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-10 py-16 border-b border-white/5">
              {/* Brand — wide col */}
              <div className="md:col-span-5">
                <div className="flex items-center gap-2.5 mb-5">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-black" style={{ background: 'var(--accent)', boxShadow: '0 4px 16px rgba(200,50,26,0.4)' }}>V</div>
                  <span className="font-extrabold text-xl text-white" style={{ fontFamily: 'Syne, sans-serif' }}>
                    VAAM <span style={{ color: 'var(--accent)' }}>Motors</span>
                  </span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed max-w-xs mb-6">
                  Licensed import-export company delivering premium vehicles to customers in 50+ countries since 2014.
                </p>
                {/* Trust badges */}
                <div className="flex flex-wrap gap-2">
                  {['🛡 Licensed Exporter', '✅ Certified Inspection', '🌍 50+ Countries'].map((b) => (
                    <span key={b} className="text-xs px-3 py-1.5 rounded-full font-medium text-gray-400" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {b}
                    </span>
                  ))}
                </div>
              </div>

              {/* Navigate */}
              <div className="md:col-span-2 md:col-start-7">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-white">Navigate</h4>
                <ul className="space-y-3">
                  {[
                    { href: '/' as const, label: t('home') },
                    { href: '/about' as const, label: t('about') },
                    { href: '/contact' as const, label: t('contact') },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link
                        href={l.href}
                        className="text-sm text-gray-500 transition-all duration-200 hover:text-white hover:pl-1 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-3 overflow-hidden transition-all duration-200 text-[var(--accent)]">→</span>
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div className="md:col-span-3 md:col-start-10">
                <h4 className="text-xs font-bold uppercase tracking-[0.2em] mb-5 text-white">Contact</h4>
                <ul className="space-y-3">
                  {contactInfo.email && (
                    <li>
                      <a href={`mailto:${contactInfo.email}`} className="flex items-center gap-3 text-sm text-gray-500 hover:text-white transition-colors group">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors" style={{ background: 'rgba(255,255,255,0.05)' }}>✉</span>
                        <span className="truncate">{contactInfo.email}</span>
                      </a>
                    </li>
                  )}
                  {contactInfo.whatsappNumber && (
                    <li>
                      <a href={`https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sm text-gray-500 hover:text-white transition-colors">
                        <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(37,211,102,0.1)' }}>📱</span>
                        {contactInfo.whatsappNumber}
                      </a>
                    </li>
                  )}
                  {contactInfo.businessHours && (
                    <li className="flex items-center gap-3 text-sm text-gray-600">
                      <span className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>🕐</span>
                      {contactInfo.businessHours}
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
              <p className="text-xs text-gray-600">
                &copy; {new Date().getFullYear()} VAAM Motors. All rights reserved.
              </p>
              <div className="flex items-center gap-5">
                <span className="text-xs text-gray-700">Global Auto Export</span>
                <a href="/admin" className="text-xs text-gray-600 hover:text-[var(--accent)] transition-colors">
                  Admin →
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
