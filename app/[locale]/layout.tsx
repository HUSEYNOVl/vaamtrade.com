import { NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import Navigation from '@/components/Navigation';
import FloatingContactIcons from '@/components/FloatingContactIcons';
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
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">{children}</main>
        <FloatingContactIcons />
            <footer className="bg-gray-900 text-white py-12 mt-auto">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">VAAM Motors</h3>
                    <p className="text-gray-400 text-sm mb-4">
                      Licensed import-export company offering premium cars worldwide.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                      <li><Link href="/" className="text-gray-400 hover:text-white transition">{t('home')}</Link></li>
                      <li><Link href="/about" className="text-gray-400 hover:text-white transition">{t('about')}</Link></li>
                      <li><Link href="/contact" className="text-gray-400 hover:text-white transition">{t('contact')}</Link></li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Contact</h3>
                    <ul className="space-y-2 text-sm text-gray-400">
                      {contactInfo.email && (
                        <li>
                          <a href={`mailto:${contactInfo.email}`} className="hover:text-white transition">
                            📧 {contactInfo.email}
                          </a>
                        </li>
                      )}
                      {contactInfo.whatsappNumber && (
                        <li>
                          <a href={`https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-white transition">
                            📱 WhatsApp: {contactInfo.whatsappNumber}
                          </a>
                        </li>
                      )}
                      {contactInfo.businessHours && (
                        <li className="text-gray-400">
                          🕐 {contactInfo.businessHours}
                        </li>
                      )}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Admin</h3>
                    <a href="/admin" className="text-gray-400 hover:text-white text-sm transition">
                      Admin Panel →
                    </a>
                  </div>
                </div>
                <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                  <p>&copy; {new Date().getFullYear()} VAAM Motors. All rights reserved.</p>
                </div>
              </div>
            </footer>
      </div>
    </NextIntlClientProvider>
  );
}

