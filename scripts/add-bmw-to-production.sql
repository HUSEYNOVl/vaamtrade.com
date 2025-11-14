-- SQL script to add BMW X5 to PRODUCTION database (Supabase)
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql

-- First, check if car already exists and delete it
DELETE FROM "Car" 
WHERE make = 'BMW' 
  AND model LIKE '%X5%' 
  AND year = 2022;

-- Insert the BMW X5 with images and featured status
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
  gen_random_uuid()::text,
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
  '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop"]',
  true,
  NOW(),
  NOW()
);

-- Verify the car was added
SELECT 
  id, 
  make, 
  model, 
  year, 
  price, 
  currency, 
  featured,
  json_array_length(images::json) as image_count
FROM "Car" 
WHERE make = 'BMW' 
  AND model LIKE '%X5%' 
  AND year = 2022
ORDER BY "createdAt" DESC 
LIMIT 1;

