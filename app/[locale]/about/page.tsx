import ServerPageRenderer from '@/components/ServerPageRenderer';
import { getTranslations } from 'next-intl/server';
import AboutPageClient from '@/components/AboutPageClient';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  let cmsPageExists = false;
  try {
    const { prisma } = await import('@/lib/prisma');
    const page = await prisma.page.findUnique({ where: { slug: 'about' } });
    cmsPageExists = page !== null && page.status === 'published';
  } catch {
    cmsPageExists = false;
  }

  if (cmsPageExists) {
    return <ServerPageRenderer slug="about" locale={locale} />;
  }

  return <AboutPageClient />;
}
