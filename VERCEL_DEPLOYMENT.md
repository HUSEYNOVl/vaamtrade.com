# Vercel Deployment Guide for VAAM Motors

## ✅ Build Status
The build is now working! The TypeScript error has been fixed.

## 🚀 Deployment Steps

### 1. Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your GitHub repository: `HUSEYNOVl/vaamtrade.com`
4. Vercel will auto-detect Next.js

### 2. Environment Variables

Add these environment variables in Vercel dashboard:

```
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
RESEND_API_KEY=your-resend-api-key
```

**Important for Vercel:**
- SQLite (`file:./dev.db`) won't work on Vercel (it's serverless)
- You need to use a cloud database like:
  - **PostgreSQL** (recommended): Use Vercel Postgres, Supabase, or Neon
  - **PlanetScale** (MySQL)
  - **MongoDB Atlas**

### 3. Database Setup for Vercel

#### Option A: Vercel Postgres (Easiest)

1. In Vercel dashboard, go to your project
2. Click "Storage" → "Create Database" → "Postgres"
3. Copy the connection string
4. Update `DATABASE_URL` in environment variables
5. Update `prisma/schema.prisma` to use PostgreSQL:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

6. Run migrations:
```bash
npx prisma migrate dev
```

#### Option B: Supabase (Free tier available)

1. Create account at [supabase.com](https://supabase.com)
2. Create a new project
3. Get connection string from Settings → Database
4. Update `DATABASE_URL` in Vercel
5. Update Prisma schema to PostgreSQL (same as above)

### 4. Build Settings

Vercel should auto-detect:
- **Framework Preset**: Next.js
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

### 5. Deploy

1. Click "Deploy"
2. Wait for build to complete
3. Your site will be live at `your-project.vercel.app`

## 🔧 Post-Deployment Setup

### 1. Initialize Database

After first deployment, you need to run migrations:

```bash
# Via Vercel CLI
vercel env pull .env.local
npx prisma migrate deploy

# Or use Vercel's built-in terminal
# Go to project → Settings → Functions → Terminal
```

### 2. Seed Default Pages

Visit your admin panel and click "Seed Default Pages" or run:

```bash
curl -X POST https://your-domain.vercel.app/api/cms/seed
```

### 3. Set Up Custom Domain (Optional)

1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions

## ⚠️ Important Notes

### SQLite Won't Work on Vercel

Vercel is serverless - filesystem is read-only. You **must** use a cloud database:
- ✅ PostgreSQL (Vercel Postgres, Supabase, Neon)
- ✅ MySQL (PlanetScale)
- ✅ MongoDB (MongoDB Atlas)
- ❌ SQLite (won't work)

### File Uploads

For file uploads (`public/uploads/`), consider:
- **Vercel Blob Storage** (recommended)
- **AWS S3**
- **Cloudinary**
- **Uploadthing**

The current file upload system writes to filesystem, which won't persist on Vercel.

### Environment Variables

Make sure all sensitive variables are set in Vercel dashboard, not in code.

## 🐛 Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all TypeScript errors are fixed
- Verify environment variables are set

### Database Connection Errors
- Verify `DATABASE_URL` is correct
- Check database is accessible from Vercel's IPs
- Ensure Prisma schema matches database type

### 404 Errors
- Check Next.js routing configuration
- Verify middleware is set up correctly
- Check locale routing

## 📚 Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma with Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)

---

**Next Steps:**
1. Set up cloud database (PostgreSQL recommended)
2. Update Prisma schema for PostgreSQL
3. Deploy to Vercel
4. Configure environment variables
5. Run database migrations
6. Seed default CMS pages

