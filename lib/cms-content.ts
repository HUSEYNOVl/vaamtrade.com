import { prisma } from './prisma';

/**
 * Central CMS content fetcher
 * All frontend pages should use this to get CMS content
 */

export async function getPageContent(slug: string) {
  try {
    const page = await prisma.page.findUnique({
      where: { slug },
    });
    return page;
  } catch (error) {
    console.error(`Error fetching page content for ${slug}:`, error);
    return null;
  }
}

export async function getSettings(category?: string) {
  try {
    const where: any = {};
    if (category) where.category = category;

    const settings = await prisma.setting.findMany({
      where,
      orderBy: { category: 'asc' },
    });

    // Convert to key-value object
    const settingsObj: Record<string, any> = {};
    settings.forEach((setting) => {
      let value = setting.value;
      if (setting.type === 'json' || setting.type === 'boolean' || setting.type === 'number') {
        try {
          value = JSON.parse(setting.value);
        } catch {
          // Keep as string
        }
      }
      settingsObj[setting.key] = value;
    });

    return settingsObj;
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {};
  }
}

export async function getTranslation(key: string, locale: string, namespace: string = 'common') {
  try {
    const translation = await prisma.translation.findUnique({
      where: {
        key_locale_namespace: {
          key,
          locale,
          namespace,
        },
      },
    });
    return translation?.value || null;
  } catch (error) {
    console.error(`Error fetching translation for ${key}:`, error);
    return null;
  }
}

export async function getTranslations(locale: string, namespace?: string) {
  try {
    const where: any = { locale };
    if (namespace) where.namespace = namespace;

    const translations = await prisma.translation.findMany({
      where,
    });

    const translationsObj: Record<string, string> = {};
    translations.forEach((t) => {
      translationsObj[t.key] = t.value;
    });

    return translationsObj;
  } catch (error) {
    console.error(`Error fetching translations for ${locale}:`, error);
    return {};
  }
}

export async function getCertificates() {
  try {
    return await prisma.certificate.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return [];
  }
}

export async function getVideos() {
  try {
    return await prisma.video.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching videos:', error);
    return [];
  }
}

export async function getTestimonials() {
  try {
    return await prisma.testimonial.findMany({
      where: { visible: true },
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }
}

export async function getFAQs(category?: string) {
  try {
    const where: any = { visible: true };
    if (category) where.category = category;

    return await prisma.fAQ.findMany({
      where,
      orderBy: { order: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return [];
  }
}

