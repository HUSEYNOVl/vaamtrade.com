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
      <div className="min-h-screen flex flex-col bg-[#080808]">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <FloatingContactIcons />

        <footer style={{ background: '#050505', borderTop: '1px solid rgba(255,255,255,0.06)' }} className="text-white py-16 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
              {/* Brand */}
              <div>
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-900/40">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
                    </svg>
                  </div>
                  <span className="text-xl font-black text-white">VAAM <span className="text-red-500">Motors</span></span>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed">
                  Licensed import-export company delivering premium vehicles to customers worldwide since 2014.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-5">Quick Links</h3>
                <ul className="space-y-3 text-sm">
                  {[
                    { href: '/' as const, label: t('home') },
                    { href: '/about' as const, label: t('about') },
                    { href: '/contact' as const, label: t('contact') },
                  ].map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-gray-500 hover:text-white transition-colors animated-underline"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-5">Contact</h3>
                <ul className="space-y-3 text-sm">
                  {contactInfo.email && (
                    <li>
                      <a
                        href={`mailto:${contactInfo.email}`}
                        className="text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <span>📧</span> {contactInfo.email}
                      </a>
                    </li>
                  )}
                  {contactInfo.whatsappNumber && (
                    <li>
                      <a
                        href={`https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition-colors flex items-center gap-2"
                      >
                        <span>📱</span> {contactInfo.whatsappNumber}
                      </a>
                    </li>
                  )}
                  {contactInfo.businessHours && (
                    <li className="text-gray-600 flex items-center gap-2">
                      <span>🕐</span> {contactInfo.businessHours}
                    </li>
                  )}
                </ul>
              </div>

              {/* Admin */}
              <div>
                <h3 className="text-sm font-bold text-white tracking-widest uppercase mb-5">Portal</h3>
                <a
                  href="/admin"
                  className="inline-flex items-center gap-2 text-gray-500 hover:text-white text-sm transition-colors group"
                >
                  Admin Panel
                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                </a>
              </div>
            </div>

            <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
              <p>&copy; {new Date().getFullYear()} VAAM Motors. All rights reserved.</p>
              <p className="text-xs">Premium Global Car Export</p>
            </div>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
