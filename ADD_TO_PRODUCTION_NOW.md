# 🚨 URGENT: Add BMW X5 to Production Database

The car is in your **local database** but NOT in **production (vaamtrade.com)**.

## Quick Fix: Use Supabase SQL Editor

### Step 1: Go to Supabase
1. Visit: https://supabase.com/dashboard
2. Login to your account
3. Select your project (the one with `lnoyexylifrtdvvjedmf` in the URL)

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"**

### Step 3: Copy and Paste This SQL

```sql
-- Delete any existing BMW X5 2022
DELETE FROM "Car" 
WHERE make = 'BMW' 
  AND model LIKE '%X5%' 
  AND year = 2022;

-- Insert the BMW X5 with images and featured status
INSERT INTO "Car" (
  id, make, model, year, price, currency, mileage, condition, 
  transmission, "fuelType", color, description, images, featured,
  "createdAt", "updatedAt"
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

📏 Mileage: 43,200 km (4.32万公里)

🎨 Color: Black Exterior, Black Premium Leather Interior

🛠️ Vehicle Condition: Excellent (优秀)
• ❌ No Major Accident
• ❌ No Fire Damage
• ❌ No Water Damage
• ❌ No Structural Damage

🔧 Insurance Repair Record
• Total repairs: 3 times
• Critical components replaced: 2
• Maximum total claim: ¥20,000

⭐ Configuration Highlights
Exterior: 20-inch alloy wheels, BMW Laser Headlights, M Sport body styling, Panoramic Roof
Interior: Premium black leather, Multi-zone climate control, Ambient lighting, Heated seats, Digital Instrument Cluster
Safety: 12 Safety Features, Lane assist, Blind-spot monitoring, Parking sensors + Reverse camera
Comfort: Spacious extended wheelbase (Li version), Very comfortable back seats, Smooth suspension

💰 Selling Price: ¥422,000 RMB (Original: ¥691,200)
This is one of the lowest-priced 2022 BMW X5 30Li M Sport currently available.',
  '["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&h=600&fit=crop","https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&h=600&fit=crop"]',
  true,
  NOW(),
  NOW()
);
```

### Step 4: Run the Query
1. Click **"Run"** button (or press `Ctrl+Enter`)
2. You should see the car details returned

### Step 5: Verify
Visit https://vaamtrade.com and the BMW X5 should now appear!

---

## Alternative: If you have the correct database password

If you can provide the correct Supabase database password, I can run a script to add it automatically.

The connection string format is:
```
postgresql://postgres:[PASSWORD]@db.lnoyexylifrtdvvjedmf.supabase.co:5432/postgres
```

---

**Note:** The full SQL script is saved in `scripts/add-bmw-to-production.sql`

