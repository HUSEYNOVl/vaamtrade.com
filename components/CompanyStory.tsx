'use client';

export default function CompanyStory() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              About VAAM Motors
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p className="text-lg">
                VAAM Motors is a licensed import-export company specializing in quality new and second-hand vehicles. With years of experience in the international automotive market, we have built a reputation for reliability, transparency, and exceptional customer service.
              </p>
              <p>
                Our mission is to make premium car ownership accessible to customers worldwide. We source vehicles from trusted suppliers, conduct thorough inspections, and ensure safe delivery to any destination.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                  <div className="text-3xl font-bold text-red-600">10+</div>
                  <div className="text-sm text-gray-600">Years Experience</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                  <div className="text-3xl font-bold text-red-600">50+</div>
                  <div className="text-sm text-gray-600">Countries Served</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                  <div className="text-3xl font-bold text-red-600">1000+</div>
                  <div className="text-sm text-gray-600">Cars Delivered</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border-l-4 border-red-600">
                  <div className="text-3xl font-bold text-red-600">24/7</div>
                  <div className="text-sm text-gray-600">Support</div>
                </div>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-br from-red-50 to-gray-100 rounded-2xl p-8 h-full flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🚗</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Our Services</h3>
                <ul className="text-left space-y-2 text-gray-700 mt-4">
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✓</span>
                    New and used car sales
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✓</span>
                    Worldwide shipping and delivery
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✓</span>
                    Vehicle inspection and verification
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✓</span>
                    Documentation and customs clearance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-red-600">✓</span>
                    Multi-language customer support
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

