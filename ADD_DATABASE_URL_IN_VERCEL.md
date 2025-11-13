# 📝 How to Add DATABASE_URL in Vercel Environment Variables

## You're in the Right Place! ✅

You're looking at the **Environment Variables** page in Vercel. Here's what to do:

## Option 1: Add Supabase Connection String (If You Have It)

1. **Click "+ Add More"** button

2. **In the "Key" field**, type:
   ```
   DATABASE_URL
   ```

3. **In the "Value" field**, paste your connection string:
   ```
   postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.lnoyexylifrtdvvjedmf.supabase.co:5432/postgres
   ```
   ⚠️ **Important**: Replace `YOUR_ACTUAL_PASSWORD` with your real Supabase password!

4. **Select environments**: Check all boxes (Production, Preview, Development)

5. **Click "Save"** or the checkmark

6. **Redeploy** your project (Vercel will do this automatically or you can trigger it manually)

---

## Option 2: Use Vercel Postgres (Easier - Recommended)

Instead of adding it manually, let Vercel do it automatically:

1. **Click "Storage" tab** (in the top menu of your project)

2. **Click "Create Database"**

3. **Select "Postgres"**

4. **Click "Create"**

5. **Done!** Vercel automatically:
   - Creates the database
   - Adds `DATABASE_URL` to Environment Variables
   - Everything is ready!

6. **Redeploy** your project

---

## After Adding DATABASE_URL

Once `DATABASE_URL` is added (either way):

1. **Redeploy** your project:
   - Go to "Deployments" tab
   - Click the three dots (⋯) on latest deployment
   - Click "Redeploy"

2. **Create database tables**:
   - In Vercel Dashboard → Your Project → Deployments → Latest → Terminal
   - Run: `npx prisma db push`

---

## Which Should You Choose?

- **Option 1 (Supabase)**: If you already set up Supabase and have the connection string
- **Option 2 (Vercel Postgres)**: If you want the easiest setup (recommended!)

---

**Both work! Choose whichever is easier for you!** 🎯

