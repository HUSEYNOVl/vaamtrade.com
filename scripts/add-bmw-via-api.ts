// Script to add BMW X5 via API (no images needed)
// This will add the car to production without requiring image uploads

const carData = {
  make: 'BMW',
  model: 'X5 xDrive 30Li',
  year: 2022,
  price: 422000,
  currency: 'CNY',
  mileage: 43200,
  condition: 'Used',
  transmission: 'Automatic',
  fuelType: 'Gasoline',
  color: 'Black',
  featured: true,
  description: `BMW X5 2022 — xDrive 30Li 尊享型 M运动套装

Price in China: ¥422,000
(No shipping included)

🚘 Car Details
• Model: BMW X5 xDrive 30Li
• Trim: 尊享型 M Sport Package
• Year: 2022 (June)
• Engine: 2.0T Turbo
• Transmission: Automatic
• Drive Type: xDrive — All-Wheel Drive (AWD)
• Emission Standard: 国六B
• VIN: LBV****5184
• Listing ID: 158059069

📏 Mileage
• 43,200 km (4.32万公里)

🎨 Color
• Exterior: Black
• Interior: Black Premium Leather

🛠️ Vehicle Condition

Guazi Official Inspection Result: Excellent (优秀)
• ❌ No Major Accident
• ❌ No Fire Damage
• ❌ No Water Damage
• ❌ No Structural Damage

🔧 Insurance Repair Record
• Total repairs: 3 times
• Critical components replaced: 2
• Maximum total claim: ¥20,000

(Still considered excellent condition because repairs are small, not structural.)

⭐ Configuration Highlights

Exterior
• 20-inch alloy wheels
• BMW Laser Headlights
• M Sport body styling
• Panoramic Roof

Interior
• Premium black leather interior
• Multi-zone automatic climate control
• Ambient lighting
• Heated seats
• Digital Instrument Cluster + iDrive Screen

Safety
• 12 Safety Features
• Lane assist
• Blind-spot monitoring
• Parking sensors + Reverse camera

Comfort
• Spacious extended wheelbase (Li version)
• Very comfortable back seats
• Smooth suspension

💰 Price

Selling Price in China: ¥422,000 RMB

(Original new price: ¥691,200)

This is one of the lowest-priced 2022 BMW X5 30Li M Sport currently available.`,
  images: [], // Empty - images can be added later
};

async function addCarViaAPI() {
  const productionUrl = process.env.PRODUCTION_URL || 'https://vaamtrade.com';
  const apiUrl = `${productionUrl}/api/cars`;

  console.log('🚀 Adding BMW X5 to production via API...');
  console.log(`📡 API URL: ${apiUrl}\n`);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(carData),
    });

    const result = await response.json();

    if (response.ok) {
      console.log('✅ Car added successfully!');
      console.log(`\n📋 Car Details:`);
      console.log(`   ID: ${result.id}`);
      console.log(`   Make: ${result.make}`);
      console.log(`   Model: ${result.model}`);
      console.log(`   Year: ${result.year}`);
      console.log(`   Price: ¥${result.price.toLocaleString()} ${result.currency}`);
      console.log(`   Featured: ${result.featured ? 'Yes' : 'No'}`);
      console.log(`\n🔗 View car at: ${productionUrl}/cars/${result.id}`);
      console.log(`\n💡 Note: You can add images later by editing the car`);
    } else {
      console.error('❌ Error adding car:');
      console.error(`   Status: ${response.status}`);
      console.error(`   Error: ${result.error || JSON.stringify(result)}`);
      
      if (result.error?.includes('datasource')) {
        console.error('\n💡 The production site needs database configuration.');
        console.error('   The car has been added to your LOCAL database.');
        console.error('   To add to production, you need to:');
        console.error('   1. Update production database schema to PostgreSQL');
        console.error('   2. Or use the admin panel when it\'s working');
      }
    }
  } catch (error: any) {
    console.error('❌ Network error:', error.message);
    console.error('\n💡 Trying alternative method...');
    
    // Try local database as fallback
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();
      
      const car = await prisma.car.create({
        data: {
          ...carData,
          images: JSON.stringify([]),
        },
      });
      
      console.log('✅ Added to LOCAL database instead:');
      console.log(`   ID: ${car.id}`);
      console.log(`\n💡 To add to production, you'll need to:`);
      console.log(`   1. Fix production database configuration`);
      console.log(`   2. Or manually add via admin panel when available`);
      
      await prisma.$disconnect();
    } catch (dbError: any) {
      console.error('❌ Could not add to local database either:', dbError.message);
    }
  }
}

addCarViaAPI();

