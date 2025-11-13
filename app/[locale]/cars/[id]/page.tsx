import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { parseImages, formatPrice } from '@/lib/utils';
import SocialLinks from '@/components/SocialLinks';
import ContactForm from '@/components/ContactForm';
import ImageCarousel from '@/components/ImageCarousel';
import { getTranslations } from 'next-intl/server';

export default async function CarDetailPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations({ locale, namespace: 'CarDetail' });

  const car = await prisma.car.findUnique({
    where: { id: id },
  });

  if (!car) {
    notFound();
  }

  let images: string[] = [];
  try {
    if (typeof car.images === 'string') {
      images = JSON.parse(car.images);
    } else if (Array.isArray(car.images)) {
      images = car.images;
    }
    // Filter out invalid URLs (like file://)
    images = images.filter((img: string) => {
      return img && typeof img === 'string' && !img.startsWith('file://');
    });
  } catch (error) {
    console.error('Error parsing images:', error);
    images = [];
  }
  
  const carInfo = `${car.make} ${car.model} ${car.year} - ${formatPrice(car.price, car.currency)}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Images */}
          <div>
            <ImageCarousel images={images} alt={`${car.make} ${car.model}`} />
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl font-bold mb-2 text-gray-900">
              {car.make} {car.model}
            </h1>
            <p className="text-2xl text-gray-600 mb-4">{car.year}</p>
            <div className="text-3xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-6">
              {formatPrice(car.price, car.currency)}
            </div>

            <div className="bg-gray-50 p-6 rounded-xl mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('specifications')}</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">{t('condition')}:</span>
                  <span className="ml-2 font-semibold text-gray-900">{car.condition}</span>
                </div>
                {car.mileage && (
                  <div>
                    <span className="text-gray-600">{t('mileage')}:</span>
                    <span className="ml-2 font-semibold text-gray-900">
                      {car.mileage.toLocaleString()} {t('miles')}
                    </span>
                  </div>
                )}
                {car.transmission && (
                  <div>
                    <span className="text-gray-600">{t('transmission')}:</span>
                    <span className="ml-2 font-semibold text-gray-900">{car.transmission}</span>
                  </div>
                )}
                {car.fuelType && (
                  <div>
                    <span className="text-gray-600">{t('fuelType')}:</span>
                    <span className="ml-2 font-semibold text-gray-900">{car.fuelType}</span>
                  </div>
                )}
                {car.color && (
                  <div>
                    <span className="text-gray-600">{t('color')}:</span>
                    <span className="ml-2 font-semibold text-gray-900">{car.color}</span>
                  </div>
                )}
              </div>
            </div>

            {car.description && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-2 text-gray-900">{t('description')}</h2>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{car.description}</p>
              </div>
            )}

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('contactUs')}</h2>
              <SocialLinks carInfo={carInfo} />
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-4 text-gray-900">{t('sendInquiry')}</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
