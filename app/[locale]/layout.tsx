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

        <footer className="bg-white border-t border-[var(--border)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-black" style={{ background: 'var(--accent)' }}>V</div>
                  <span className="font-extrabold text-lg" style={{ fontFamily: 'Syne, sans-serif', color: 'var(--text)' }}>
                    VAAM <span style={{ color: 'var(--accent)' }}>Motors</span>
                  </span>
                </div>
                <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--text-muted)' }}>
                  Licensed import-export company delivering premium vehicles to customers in 50+ countries since 2014.
                </p>
              </div>

              {/* Links */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text)' }}>Navigate</h4>
                <ul className="space-y-2.5 text-sm">
                  {[
                    { href: '/' as const, label: t('home') },
                    { href: '/about' as const, label: t('about') },
                    { href: '/contact' as const, label: t('contact') },
                  ].map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="transition-colors hover:text-[var(--accent)]" style={{ color: 'var(--text-muted)' }}>{l.label}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: 'var(--text)' }}>Contact</h4>
                <ul className="space-y-2.5 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {contactInfo.email && (
                    <li><a href={`mailto:${contactInfo.email}`} className="hover:text-[var(--accent)] transition-colors">📧 {contactInfo.email}</a></li>
                  )}
                  {contactInfo.whatsappNumber && (
                    <li>
                      <a href={`https://wa.me/${contactInfo.whatsappNumber.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent)] transition-colors">
                        📱 {contactInfo.whatsappNumber}
                      </a>
                    </li>
                  )}
                  {contactInfo.businessHours && <li>🕐 {contactInfo.businessHours}</li>}
                </ul>
              </div>
            </div>

            <div className="border-t border-[var(--border)] pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <p>&copy; {new Date().getFullYear()} VAAM Motors. All rights reserved.</p>
              <a href="/admin" className="hover:text-[var(--accent)] transition-colors">Admin Panel →</a>
            </div>
          </div>
        </footer>
      </div>
    </NextIntlClientProvider>
  );
}
