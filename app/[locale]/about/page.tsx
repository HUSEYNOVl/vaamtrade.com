import ServerPageRenderer from '@/components/ServerPageRenderer';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });
  
  // Check if CMS page exists
  let cmsPageExists = false;
  try {
    const { prisma } = await import('@/lib/prisma');
    const page = await prisma.page.findUnique({
      where: { slug: 'about' },
    });
    cmsPageExists = page !== null && page.status === 'published';
  } catch (error) {
    console.error('Error checking CMS page:', error);
    cmsPageExists = false;
  }

  // Render page from CMS if it exists
  if (cmsPageExists) {
    return <ServerPageRenderer slug="about" locale={locale} />;
  }

  // Fallback to original hard-coded about page
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            {t('title')}
          </h1>

          <div className="prose prose-lg max-w-none">
            <p className="text-xl text-gray-700 mb-8 leading-relaxed">
              {t('intro')}
            </p>

            <div className="bg-red-50 rounded-xl p-6 mb-8 border-l-4 border-red-600">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900">{t('ourMission')}</h2>
              <p className="text-gray-700 leading-relaxed">
                {t('missionText')}
              </p>
            </div>

            <h2 className="text-3xl font-semibold mt-10 mb-6 text-gray-900">{t('whyChooseUs')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="text-2xl mb-2">🌍</div>
                <h3 className="font-semibold mb-2 text-gray-900">{t('feature1')}</h3>
                <p className="text-gray-600 text-sm">{t('feature1Desc')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="text-2xl mb-2">✅</div>
                <h3 className="font-semibold mb-2 text-gray-900">{t('feature2')}</h3>
                <p className="text-gray-600 text-sm">{t('feature2Desc')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="text-2xl mb-2">💰</div>
                <h3 className="font-semibold mb-2 text-gray-900">{t('feature3')}</h3>
                <p className="text-gray-600 text-sm">{t('feature3Desc')}</p>
              </div>
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <div className="text-2xl mb-2">💬</div>
                <h3 className="font-semibold mb-2 text-gray-900">{t('feature4')}</h3>
                <p className="text-gray-600 text-sm">{t('feature4Desc')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
