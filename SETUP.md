# Setup Instructions

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Set `ADMIN_PASSWORD` to your desired admin password
   - Set `NEXT_PUBLIC_ADMIN_PASSWORD` to the same password (for client-side verification)

3. **Initialize the database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   - Visit `http://localhost:3000`
   - The site will automatically redirect to `/en` (English)

## Admin Panel Access

1. Navigate to `/admin`
2. Enter your admin password (set in `.env` file)
3. Default password is `admin123` if not set

## Adding Your First Car

1. Log in to the admin panel
2. Click "Add New Car"
3. Fill in the car details:
   - Make (e.g., Toyota)
   - Model (e.g., Camry)
   - Year
   - Price
   - Currency (USD, EUR, GBP, CNY, RUB)
   - Condition (New or Used)
   - Other optional details
4. Add images by entering image URLs (one at a time)
5. Click "Create Car"

## Customizing Social Media Links

Edit `components/SocialLinks.tsx` to update:
- Instagram URL
- WeChat ID  
- WhatsApp number

## Changing Languages

The website supports 4 languages:
- English (`/en`)
- Chinese (`/zh`)
- Russian (`/ru`)
- Arabic (`/ar`)

Users can switch languages using the language switcher in the navigation bar.

## File Structure Overview

- `app/[locale]/` - All public pages (home, cars, about, contact)
- `app/admin/` - Admin panel for managing cars
- `app/api/` - API routes for cars and contact form
- `components/` - Reusable React components
- `messages/` - Translation files for all languages
- `prisma/` - Database schema

## Troubleshooting

### Database Issues
If you get database errors:
```bash
npx prisma generate
npx prisma db push
```

### Port Already in Use
If port 3000 is busy:
```bash
npm run dev -- -p 3001
```

### Admin Login Not Working
- Check that `ADMIN_PASSWORD` and `NEXT_PUBLIC_ADMIN_PASSWORD` are set in `.env`
- Make sure the values match exactly
- Restart the development server after changing `.env`

