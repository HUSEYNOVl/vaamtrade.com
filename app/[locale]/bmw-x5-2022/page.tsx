import SocialLinks from '@/components/SocialLinks';
import ContactForm from '@/components/ContactForm';
import ImageCarousel from '@/components/ImageCarousel';
import { prisma } from '@/lib/prisma';
import { parseImages } from '@/lib/utils';

export default async function BMWX5Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const carInfo = "BMW X5 xDrive 30Li 2022 - ¥422,000";

  // Fetch BMW X5 from database
  let images: string[] = [];
  try {
    const car = await prisma.car.findFirst({
      where: {
        make: 'BMW',
        model: { contains: 'X5' },
        year: 2022,
      },
    });
    
    if (car) {
      images = parseImages(car.images as any);
      images = images.filter((img: string) => {
        if (!img || typeof img !== 'string') return false;
        if (img.startsWith('file://')) return false;
        return img.startsWith('/') || img.startsWith('http://') || img.startsWith('https://');
      });
    }
  } catch (error) {
    console.error('Error fetching car images:', error);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            BMW X5 2022
          </h1>
          <p className="text-2xl text-gray-600 mb-2">xDrive 30Li 尊享型 M运动套装</p>
          <div className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent">
            ¥422,000
          </div>
          <p className="text-gray-500 mt-2">(No shipping included)</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Images */}
          <div className="space-y-6">
            {images.length > 0 ? (
              <ImageCarousel images={images} alt="BMW X5 2022" />
            ) : (
              <div className="bg-gray-100 rounded-xl p-12 text-center border-2 border-dashed border-gray-300">
                <svg className="mx-auto h-24 w-24 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-gray-600">Images will be added here</p>
              </div>
            )}
          </div>

          {/* Right Column - Details */}
          <div className="space-y-6">
            {/* Car Details */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">🚘 Car Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-semibold text-gray-900">BMW X5 xDrive 30Li</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Trim:</span>
                  <span className="font-semibold text-gray-900">尊享型 M Sport Package</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Year:</span>
                  <span className="font-semibold text-gray-900">2022 (June)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Engine:</span>
                  <span className="font-semibold text-gray-900">2.0T Turbo</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Transmission:</span>
                  <span className="font-semibold text-gray-900">Automatic</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Drive Type:</span>
                  <span className="font-semibold text-gray-900">xDrive — All-Wheel Drive (AWD)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Emission Standard:</span>
                  <span className="font-semibold text-gray-900">国六B</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">VIN:</span>
                  <span className="font-semibold text-gray-900">LBV****5184</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Listing ID:</span>
                  <span className="font-semibold text-gray-900">158059069</span>
                </div>
              </div>
            </div>

            {/* Mileage */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">📏 Mileage</h2>
              <p className="text-3xl font-bold text-gray-900">43,200 km</p>
              <p className="text-gray-600 mt-1">(4.32万公里)</p>
            </div>

            {/* Color */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">🎨 Color</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Exterior:</span>
                  <span className="font-semibold text-gray-900">Black</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Interior:</span>
                  <span className="font-semibold text-gray-900">Black Premium Leather</span>
                </div>
              </div>
            </div>

            {/* Vehicle Condition */}
            <div className="bg-green-50 p-6 rounded-xl border border-green-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">🛠️ Vehicle Condition</h2>
              <div className="bg-white p-4 rounded-lg mb-4">
                <p className="text-lg font-semibold text-green-700 mb-2">Guazi Official Inspection Result: Excellent (优秀)</p>
                <div className="space-y-2 text-gray-700">
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">❌</span>
                    <span>No Major Accident</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">❌</span>
                    <span>No Fire Damage</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">❌</span>
                    <span>No Water Damage</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-red-500 mr-2">❌</span>
                    <span>No Structural Damage</span>
                  </div>
                </div>
              </div>
              <div className="bg-white p-4 rounded-lg">
                <h3 className="font-semibold mb-2 text-gray-900">🔧 Insurance Repair Record</h3>
                <div className="space-y-1 text-gray-700">
                  <p>• Total repairs: 3 times</p>
                  <p>• Critical components replaced: 2</p>
                  <p>• Maximum total claim: ¥20,000</p>
                </div>
                <p className="text-sm text-gray-600 mt-2 italic">
                  (Still considered excellent condition because repairs are small, not structural.)
                </p>
              </div>
            </div>

            {/* Configuration Highlights */}
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">⭐ Configuration Highlights</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Exterior</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>20-inch alloy wheels</li>
                    <li>BMW Laser Headlights</li>
                    <li>M Sport body styling</li>
                    <li>Panoramic Roof</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Interior</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Premium black leather interior</li>
                    <li>Multi-zone automatic climate control</li>
                    <li>Ambient lighting</li>
                    <li>Heated seats</li>
                    <li>Digital Instrument Cluster + iDrive Screen</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Safety</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>12 Safety Features</li>
                    <li>Lane assist</li>
                    <li>Blind-spot monitoring</li>
                    <li>Parking sensors + Reverse camera</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2 text-gray-900">Comfort</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Spacious extended wheelbase (Li version)</li>
                    <li>Very comfortable back seats</li>
                    <li>Smooth suspension</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-300 shadow-lg">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">💰 Price</h2>
              <div className="space-y-2">
                <p className="text-3xl font-bold text-red-700">¥422,000 RMB</p>
                <p className="text-gray-600">Selling Price in China</p>
                <p className="text-sm text-gray-500 line-through">Original new price: ¥691,200</p>
                <p className="text-sm font-semibold text-red-700 mt-2">
                  This is one of the lowest-priced 2022 BMW X5 30Li M Sport currently available.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Contact Us</h2>
            <SocialLinks carInfo={carInfo} />
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">Send Inquiry</h2>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

