import ServerPageRenderer from '@/components/ServerPageRenderer';
import ContactForm from '@/components/ContactForm';
import SocialLinks from '@/components/SocialLinks';
import { contactInfo } from '@/config/contact';
import { getTranslations } from 'next-intl/server';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Contact' });
  
  // Check if CMS page exists
  let cmsPageExists = false;
  try {
    const { prisma } = await import('@/lib/prisma');
    const page = await prisma.page.findUnique({
      where: { slug: 'contact' },
    });
    cmsPageExists = page !== null && page.status === 'published';
  } catch (error) {
    console.error('Error checking CMS page:', error);
    cmsPageExists = false;
  }

  // Render page from CMS if it exists
  if (cmsPageExists) {
    return <ServerPageRenderer slug="contact" locale={locale} />;
  }

  // Fallback to original hard-coded contact page
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            {t('title')}
          </h1>
          <p className="text-xl text-gray-600">{t('getInTouch')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('getInTouch')}</h2>
            <p className="text-gray-700 mb-8 leading-relaxed">
              {t('description')}
            </p>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4 text-gray-900">{t('contactUsVia')}</h3>
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

            <div className="bg-red-50 rounded-xl p-6 border border-red-100">
              <h3 className="font-semibold mb-2 text-gray-900">{t('businessHours')}</h3>
              <p className="text-gray-700">{contactInfo.businessHours}</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-6 text-gray-900">{t('sendMessage')}</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}
