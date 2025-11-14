-- SQL script to add BMW X5 directly to production database
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

INSERT INTO "Car" (
  id,
  make,
  model,
  year,
  price,
  currency,
  mileage,
  condition,
  transmission,
  "fuelType",
  color,
  description,
  images,
  featured,
  "createdAt",
  "updatedAt"
) VALUES (
  gen_random_uuid()::text,  -- Generate unique ID
  'BMW',
  'X5 xDrive 30Li',
  2022,
  422000,
  'CNY',
  43200,
  'Used',
  'Automatic',
  'Gasoline',
  'Black',
  'BMW X5 2022 — xDrive 30Li 尊享型 M运动套装

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

This is one of the lowest-priced 2022 BMW X5 30Li M Sport currently available.',
  '[]',  -- Empty images array (JSON)
  true,  -- Featured
  NOW(),
  NOW()
);

-- Verify the car was added
SELECT id, make, model, year, price, currency, featured 
FROM "Car" 
WHERE make = 'BMW' AND model = 'X5 xDrive 30Li' AND year = 2022
ORDER BY "createdAt" DESC 
LIMIT 1;

