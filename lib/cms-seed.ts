import { prisma } from './prisma';

/**
 * Seed the database with default pages for Home, About, Contact
 * This should be run once to initialize the CMS with existing pages
 */
export async function seedDefaultPages() {
  try {
    // Home Page
    const homePage = await prisma.page.upsert({
      where: { slug: 'home' },
      update: {},
      create: {
        slug: 'home',
        title: 'Home',
        status: 'published',
        seoTitle: 'VAAM Motors - Premium Cars Worldwide',
        seoDesc: 'VAAM Motors - Licensed import-export company offering quality new and second-hand cars with worldwide delivery',
        seoKeywords: 'cars, vehicles, import, export, luxury cars, second hand cars',
        sections: JSON.stringify([
          {
            type: 'hero',
            id: 'hero-1',
            visible: true,
            order: 0,
            content: {
              title: 'Trusted Global Luxury Car Exporter',
              subtitle: 'VAAM Motors delivers premium vehicles worldwide. Licensed import-export company with years of experience in international automotive trading.',
              primaryCTA: { text: 'View Available Cars', link: '#cars' },
              secondaryCTA: { text: 'Request a Car', link: '/contact' },
            },
          },
          {
            type: 'trust-section',
            id: 'trust-1',
            visible: true,
            order: 1,
            content: {},
          },
          {
            type: 'featured-cars',
            id: 'featured-1',
            visible: true,
            order: 2,
            content: {
              title: 'Featured Vehicles',
              subtitle: 'Handpicked premium vehicles from our collection',
            },
          },
          {
            type: 'company-story',
            id: 'story-1',
            visible: true,
            order: 3,
            content: {},
          },
          {
            type: 'video-section',
            id: 'video-1',
            visible: true,
            order: 4,
            content: {},
          },
          {
            type: 'certificates-section',
            id: 'certs-1',
            visible: true,
            order: 5,
            content: {},
          },
          {
            type: 'how-it-works',
            id: 'how-1',
            visible: true,
            order: 6,
            content: {
              title: 'How It Works',
              subtitle: 'Simple steps to get your dream car delivered worldwide',
              steps: [
                { step: '1', title: 'Browse & Select', desc: 'Explore our inventory and choose your perfect vehicle' },
                { step: '2', title: 'Inspection & Verification', desc: 'We conduct thorough inspection and provide detailed reports' },
                { step: '3', title: 'Secure Payment', desc: 'Complete payment through our secure payment system' },
                { step: '4', title: 'Worldwide Delivery', desc: 'We handle shipping and delivery to your location' },
              ],
            },
          },
          {
            type: 'all-cars',
            id: 'cars-1',
            visible: true,
            order: 7,
            content: {
              title: 'Complete Inventory',
              subtitle: 'Browse our full collection of premium vehicles',
            },
          },
          {
            type: 'cta-section',
            id: 'cta-1',
            visible: true,
            order: 8,
            content: {
              title: 'Ready to Find Your Perfect Car?',
              subtitle: 'Contact us today and let our experts help you find the perfect vehicle for your needs.',
              primaryCTA: { text: 'Contact Us Now', link: '/contact' },
              secondaryCTA: { text: 'WhatsApp Us', link: 'https://wa.me/1234567890', external: true },
            },
          },
        ]),
        order: 0,
      },
    });

    // About Page
    const aboutPage = await prisma.page.upsert({
      where: { slug: 'about' },
      update: {},
      create: {
        slug: 'about',
        title: 'About Us',
        status: 'published',
        seoTitle: 'About VAAM Motors - Our Story',
        seoDesc: 'Learn about VAAM Motors, a trusted global car exporter with years of experience',
        seoKeywords: 'about, company, story, VAAM Motors',
        sections: JSON.stringify([
          {
            type: 'hero',
            id: 'about-hero-1',
            visible: true,
            order: 0,
            content: {
              title: 'About VAAM Motors',
              subtitle: 'Your trusted partner in global automotive trading',
            },
          },
          {
            type: 'text-block',
            id: 'about-text-1',
            visible: true,
            order: 1,
            content: {
              text: 'VAAM Motors is a licensed import-export company specializing in premium new and second-hand vehicles. With years of experience in international automotive trading, we deliver quality cars worldwide with professional service and reliable shipping.',
            },
          },
          {
            type: 'mission',
            id: 'about-mission-1',
            visible: true,
            order: 2,
            content: {
              title: 'Our Mission',
              text: 'To provide customers worldwide with access to premium vehicles at competitive prices, backed by professional service, thorough inspection, and secure worldwide delivery.',
            },
          },
          {
            type: 'features-grid',
            id: 'about-features-1',
            visible: true,
            order: 3,
            content: {
              title: 'Why Choose Us',
              features: [
                { icon: '🌍', title: 'Worldwide Delivery', desc: 'We ship vehicles to customers around the globe' },
                { icon: '✅', title: 'Quality Guaranteed', desc: 'Every vehicle undergoes thorough inspection' },
                { icon: '💰', title: 'Competitive Prices', desc: 'Best prices for premium vehicles' },
                { icon: '💬', title: '24/7 Support', desc: 'Our team is always ready to help' },
              ],
            },
          },
        ]),
        order: 1,
      },
    });

    // Contact Page
    const contactPage = await prisma.page.upsert({
      where: { slug: 'contact' },
      update: {},
      create: {
        slug: 'contact',
        title: 'Contact Us',
        status: 'published',
        seoTitle: 'Contact VAAM Motors - Get in Touch',
        seoDesc: 'Contact VAAM Motors for inquiries about our vehicles and services',
        seoKeywords: 'contact, inquiry, support, VAAM Motors',
        sections: JSON.stringify([
          {
            type: 'hero',
            id: 'contact-hero-1',
            visible: true,
            order: 0,
            content: {
              title: 'Contact Us',
              subtitle: 'Get in touch with our team',
            },
          },
          {
            type: 'contact-form',
            id: 'contact-form-1',
            visible: true,
            order: 1,
            content: {},
          },
          {
            type: 'contact-info',
            id: 'contact-info-1',
            visible: true,
            order: 2,
            content: {},
          },
        ]),
        order: 2,
      },
    });

    console.log('✅ Default pages seeded successfully');
    return { homePage, aboutPage, contactPage };
  } catch (error) {
    console.error('Error seeding default pages:', error);
    throw error;
  }
}

