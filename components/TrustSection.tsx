'use client';

interface TrustCardProps {
  icon: string;
  title: string;
  description: string;
}

function TrustCard({ icon, title, description }: TrustCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-red-200">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );
}

export default function TrustSection() {
  const trustPoints = [
    {
      icon: '✅',
      title: 'Licensed Import-Export Company',
      description: 'Fully licensed and certified for international car trading',
    },
    {
      icon: '🚚',
      title: 'Fast Shipping Worldwide',
      description: 'Reliable shipping to any country with tracking',
    },
    {
      icon: '🔍',
      title: 'Professional Car Inspection',
      description: 'All vehicles thoroughly inspected before delivery',
    },
    {
      icon: '🔒',
      title: 'Secure Payment',
      description: 'Multiple secure payment options available',
    },
    {
      icon: '📦',
      title: 'Delivery Guarantee',
      description: 'Guaranteed safe delivery or your money back',
    },
    {
      icon: '💬',
      title: '24/7 Customer Support',
      description: 'Round-the-clock support in multiple languages',
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Why Customers Trust VAAM Motors
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We are committed to providing the best car buying experience worldwide
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trustPoints.map((point, index) => (
            <TrustCard key={index} {...point} />
          ))}
        </div>
      </div>
    </section>
  );
}

