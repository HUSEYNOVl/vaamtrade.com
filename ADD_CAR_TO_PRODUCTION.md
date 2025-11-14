# How to Add BMW X5 to vaamtrade.com (Production)

## Option 1: Via Production Admin Panel (Easiest) ⭐

1. **Go to vaamtrade.com admin panel**
   - Visit: `https://vaamtrade.com/admin`
   - Login with your admin password

2. **Add the car**
   - Click "Add New Car" button
   - Fill in the BMW X5 details (or copy from the script below)
   - Upload images
   - Click "Create Car"

## Option 2: Using the Script (For Production Database)

If you have access to the production database connection string:

1. **Set production DATABASE_URL**
   ```bash
   export DATABASE_URL="your-production-database-url"
   ```

2. **Run the script**
   ```bash
   npx tsx scripts/add-bmw-x5-production.ts
   ```

3. **Or add to Vercel environment and run via Vercel CLI**
   ```bash
   vercel env pull .env.local
   npx tsx scripts/add-bmw-x5-production.ts
   ```

## Option 3: Via API (If Production Site is Live)

If vaamtrade.com is deployed and accessible:

```bash
curl -X POST https://vaamtrade.com/api/cars \
  -H "Content-Type: application/json" \
  -d '{
    "make": "BMW",
    "model": "X5 xDrive 30Li",
    "year": 2022,
    "price": 422000,
    "currency": "CNY",
    "mileage": 43200,
    "condition": "Used",
    "transmission": "Automatic",
    "fuelType": "Gasoline",
    "color": "Black",
    "featured": true,
    "description": "BMW X5 2022 — xDrive 30Li 尊享型 M运动套装...",
    "images": []
  }'
```

## Car Details for Manual Entry

**Basic Information:**
- Make: BMW
- Model: X5 xDrive 30Li
- Year: 2022
- Condition: Used
- Price: 422000
- Currency: CNY

**Specifications:**
- Mileage: 43200 km
- Transmission: Automatic
- Fuel Type: Gasoline
- Color: Black

**Description:**
```
BMW X5 2022 — xDrive 30Li 尊享型 M运动套装

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

This is one of the lowest-priced 2022 BMW X5 30Li M Sport currently available.
```

**Featured:** ✅ Yes (check the box)

## Notes

- The car has been added to your **local database** already
- To add to **production (vaamtrade.com)**, use one of the methods above
- Images need to be uploaded separately through the admin panel
- Make sure production database is using PostgreSQL (not SQLite)

