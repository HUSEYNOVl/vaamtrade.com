// Direct database insertion script
// This bypasses the API and adds directly to production database

import { PrismaClient } from '@prisma/client';

// Production Supabase connection string
// Update the password if it's different
const PRODUCTION_DB_URL = process.env.PRODUCTION_DB_URL || 
  'postgresql://postgres:Serxanm7711!@db.lnoyexylifrtdvvjedmf.supabase.co:5432/postgres';

async function addBMWDirectly() {
  console.log('🔧 Connecting directly to production database...\n');

  // Create Prisma client with production database URL
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: PRODUCTION_DB_URL,
      },
    },
  });

  try {
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to production database!\n');

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
      images: JSON.stringify([]), // Empty images array
    };

    // Check if similar car exists
    const existing = await prisma.car.findFirst({
      where: {
        make: 'BMW',
        model: { contains: 'X5' },
        year: 2022,
      },
    });

    if (existing) {
      console.log('⚠️  Similar car found:');
      console.log(`   ID: ${existing.id}`);
      console.log(`   Model: ${existing.make} ${existing.model}`);
      console.log('\n🔄 Creating new entry anyway...\n');
    }

    const car = await prisma.car.create({
      data: carData,
    });

    console.log('✅ BMW X5 added to PRODUCTION database!');
    console.log(`\n📋 Car Details:`);
    console.log(`   ID: ${car.id}`);
    console.log(`   Make: ${car.make}`);
    console.log(`   Model: ${car.model}`);
    console.log(`   Year: ${car.year}`);
    console.log(`   Price: ¥${car.price.toLocaleString()} ${car.currency}`);
    console.log(`   Featured: ${car.featured ? 'Yes ✅' : 'No'}`);
    console.log(`\n🌐 View on website: https://vaamtrade.com/cars/${car.id}`);
    console.log(`\n💡 Note: Images can be added later when admin panel is working`);

  } catch (error: any) {
    console.error('❌ Error:', error.message);
    
    if (error.message.includes('authentication')) {
      console.error('\n💡 Database password might be incorrect.');
      console.error('   Please check your Supabase password and update PRODUCTION_DB_URL');
    } else if (error.message.includes('P1001')) {
      console.error('\n💡 Cannot connect to database.');
      console.error('   Check if:');
      console.error('   1. Database is accessible');
      console.error('   2. Connection string is correct');
      console.error('   3. IP is whitelisted in Supabase');
    } else {
      console.error('\n💡 Full error:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

addBMWDirectly();

