# Supabase Setup Guide for VAAM Motors

## Step-by-Step Instructions

### Step 1: Create a New Project in Supabase

1. **Go to your Supabase Dashboard**
   - Visit [supabase.com/dashboard](https://supabase.com/dashboard)
   - You should see your projects (or empty if first time)

2. **Click "New Project"**
   - Click the green "New Project" button (top right)

3. **Fill in Project Details:**
   - **Name**: `vaam-motors` (or any name you like)
   - **Database Password**: Create a strong password (SAVE THIS - you'll need it!)
   - **Region**: Choose closest to your users (e.g., "US East (North Virginia)")
   - **Pricing Plan**: Select "Free" (good for starting)

4. **Click "Create new project"**
   - Wait 2-3 minutes for Supabase to set up your database

### Step 2: Get Your Database Connection String

1. **Go to Project Settings**
   - In your project dashboard, click the ⚙️ **Settings** icon (bottom left sidebar)
   - Or click on your project name → Settings

2. **Go to Database Settings**
   - Click **"Database"** in the left sidebar (under Project Settings)

3. **Find Connection String**
   - Scroll down to **"Connection string"** section
   - You'll see different connection strings
   - **Copy the "URI" connection string** (it looks like: `postgresql://postgres:[YOUR-PASSWORD]@db.xxxxx.supabase.co:5432/postgres`)

4. **Replace Password in Connection String**
   - The connection string has `[YOUR-PASSWORD]` placeholder
   - Replace it with the password you created in Step 1
   - Example: `postgresql://postgres:MyPassword123@db.abcdefgh.supabase.co:5432/postgres`

### Step 3: Update Prisma Schema for PostgreSQL

1. **Open `prisma/schema.prisma`**

2. **Change the datasource:**
   ```prisma
   datasource db {
     provider = "postgresql"  // Change from "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

3. **Update String fields to Text (optional but recommended for PostgreSQL):**
   - PostgreSQL handles large text better than SQLite
   - Fields like `description`, `content`, `sections` can stay as `String` (Prisma will use `text` type)

### Step 4: Set Up Environment Variables

#### For Local Development:

1. **Update your `.env` file:**
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.xxxxx.supabase.co:5432/postgres"
   ```

#### For Vercel:

1. **Go to Vercel Dashboard**
   - Visit [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click on your project

2. **Go to Settings → Environment Variables**

3. **Add Environment Variable:**
   - **Name**: `DATABASE_URL`
   - **Value**: Your Supabase connection string (from Step 2)
   - **Environment**: Select all (Production, Preview, Development)
   - Click **"Save"**

### Step 5: Generate Prisma Client and Run Migrations

1. **Generate Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Push Schema to Database:**
   ```bash
   npx prisma db push
   ```
   - This will create all tables in your Supabase database

3. **Verify in Supabase:**
   - Go to Supabase Dashboard → Table Editor
   - You should see all your tables: `Car`, `Page`, `Setting`, `Media`, etc.

### Step 6: Seed Default Data (Optional)

1. **Seed default CMS pages:**
   ```bash
   npm run seed:pages
   ```
   - Or use the admin panel after deployment

### Step 7: Deploy to Vercel

1. **Push your changes to GitHub:**
   ```bash
   git add .
   git commit -m "Update Prisma schema for PostgreSQL"
   git push origin main
   ```

2. **Vercel will automatically deploy**
   - The build should now succeed!

## 🔍 Troubleshooting

### Connection String Issues

**Problem**: Connection refused or authentication failed
- **Solution**: Make sure you replaced `[YOUR-PASSWORD]` with your actual password
- Check that the connection string doesn't have extra spaces

### Prisma Migration Issues

**Problem**: `Error: P1001: Can't reach database server`
- **Solution**: 
  - Check your internet connection
  - Verify the connection string is correct
  - Make sure Supabase project is fully created (wait a few minutes)

### Table Already Exists

**Problem**: `Error: Table already exists`
- **Solution**: 
  - Use `npx prisma migrate dev` instead of `npx prisma db push`
  - Or reset database in Supabase Dashboard → Settings → Database → Reset

## 📋 Quick Checklist

- [ ] Created Supabase project
- [ ] Got connection string from Supabase
- [ ] Updated `prisma/schema.prisma` to use `postgresql`
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Verified tables in Supabase Table Editor
- [ ] Pushed changes to GitHub
- [ ] Deployed to Vercel

## 🎯 Next Steps After Setup

1. **Test locally:**
   ```bash
   npm run dev
   ```
   - Visit http://localhost:3000
   - Check admin panel works

2. **Deploy to Vercel:**
   - Push to GitHub
   - Vercel will auto-deploy
   - Check deployment logs

3. **Seed default pages:**
   - Visit your deployed site → `/admin/cms/pages`
   - Click "Seed Default Pages"

## 💡 Tips

- **Keep your password safe**: Store it in a password manager
- **Use connection pooling**: For production, Supabase provides a connection pooler URL (better for serverless)
- **Monitor usage**: Check Supabase dashboard for database usage and limits
- **Backup**: Supabase free tier includes automatic backups

---

**Need Help?** Check Supabase docs: https://supabase.com/docs

