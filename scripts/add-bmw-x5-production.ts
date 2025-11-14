import { PrismaClient } from '@prisma/client';

// This script can be used to add the BMW X5 to production database
// Usage: 
// 1. Set DATABASE_URL environment variable to production database
// 2. Run: npx tsx scripts/add-bmw-x5-production.ts

const prisma = new PrismaClient();

async function addBMWX5ToProduction() {
  try {
    // Check if we're using production database
    const dbUrl = process.env.DATABASE_URL || '';
    const isProduction = dbUrl.includes('supabase') || dbUrl.includes('vercel') || dbUrl.includes('postgresql://');
    
    console.log(`🌐 Database: ${isProduction ? 'Production' : 'Local'}`);
    console.log(`📊 Connecting to database...\n`);

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
      images: JSON.stringify([]), // Images can be added later through admin panel
    };

    // Check if car already exists (by make, model, year, and similar price)
    const existingCar = await prisma.car.findFirst({
      where: {
        make: 'BMW',
        model: { contains: 'X5' },
        year: 2022,
        price: { gte: 400000, lte: 450000 },
      },
    });

    if (existingCar) {
      console.log('⚠️  Similar car already exists:');
      console.log(`   ID: ${existingCar.id}`);
      console.log(`   Model: ${existingCar.make} ${existingCar.model}`);
      console.log(`   Price: ${existingCar.price} ${existingCar.currency}\n`);
      console.log('❓ Do you want to add another one? (This script will create a new entry)');
    }

    const car = await prisma.car.create({
      data: carData,
    });

    console.log('✅ BMW X5 added successfully!');
    console.log(`\n📋 Car Details:`);
    console.log(`   ID: ${car.id}`);
    console.log(`   Make: ${car.make}`);
    console.log(`   Model: ${car.model}`);
    console.log(`   Year: ${car.year}`);
    console.log(`   Price: ¥${car.price.toLocaleString()} ${car.currency}`);
    console.log(`   Featured: ${car.featured ? 'Yes' : 'No'}`);
    console.log(`\n🔗 Edit car at: /admin/cars/${car.id}`);
    console.log(`\n💡 Note: Add images through the admin panel`);
  } catch (error: any) {
    console.error('❌ Error adding car:', error.message);
    if (error.code === 'P1001') {
      console.error('\n💡 Database connection error. Make sure:');
      console.error('   1. DATABASE_URL is set correctly');
      console.error('   2. Database is accessible');
      console.error('   3. Prisma schema matches database type');
    }
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addBMWX5ToProduction();

