import ServerPageRenderer from '@/components/ServerPageRenderer';
import ContactPageClient from '@/components/ContactPageClient';
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

  return <ContactPageClient />;
}
