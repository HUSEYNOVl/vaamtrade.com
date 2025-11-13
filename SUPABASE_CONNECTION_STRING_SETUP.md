# ✅ Supabase Connection String Setup

## Your Connection String

You found it! Here's what you need to do:

### Step 1: Replace [YOUR_PASSWORD]

Your connection string is:
```
postgresql://postgres:[YOUR_PASSWORD]@db.lnoyexylifrtdvvjedmf.supabase.co:5432/postgres
```

**Replace `[YOUR_PASSWORD]` with the actual password you created when setting up your Supabase project.**

**Example:**
If your password is `MySecurePass123`, your connection string should be:
```
postgresql://postgres:MySecurePass123@db.lnoyexylifrtdvvjedmf.supabase.co:5432/postgres
```

### Step 2: Add to Environment Variables

#### For Local Development (.env file):

1. Open your `.env` file in the project root
2. Add or update the `DATABASE_URL` line:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_ACTUAL_PASSWORD@db.lnoyexylifrtdvvjedmf.supabase.co:5432/postgres"
   ```
   (Replace `YOUR_ACTUAL_PASSWORD` with your real password)

#### For Vercel (Production):

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click on your project
3. Go to **Settings → Environment Variables**
4. Add:
   - **Name**: `DATABASE_URL`
   - **Value**: Your connection string (with actual password)
   - **Environment**: Select all (Production, Preview, Development)
5. Click **"Save"**

### Step 3: Update Prisma Schema

✅ **Already done!** I've updated your `prisma/schema.prisma` to use PostgreSQL.

### Step 4: Generate Prisma Client & Push Schema

Run these commands:

```bash
npx prisma generate
npx prisma db push
```

This will:
- Generate the Prisma client for PostgreSQL
- Create all your database tables in Supabase

### Step 5: Verify in Supabase

1. Go to your Supabase dashboard
2. Click **"Table Editor"** (in the left sidebar)
3. You should see all your tables:
   - `Car`
   - `Setting`
   - `Page`
   - `Media`
   - `Translation`
   - `Certificate`
   - `Video`
   - `Testimonial`
   - `FAQ`

### Step 6: Test Locally

```bash
npm run dev
```

Visit http://localhost:3000 and make sure everything works!

---

## 🎯 Next Steps for Vercel Deployment

1. **Push changes to GitHub:**
   ```bash
   git add .
   git commit -m "Update to PostgreSQL for Supabase"
   git push origin main
   ```

2. **Add DATABASE_URL to Vercel:**
   - Vercel Dashboard → Your Project → Settings → Environment Variables
   - Add `DATABASE_URL` with your connection string

3. **Redeploy:**
   - Vercel will automatically redeploy when you push
   - Or manually trigger a redeploy in Vercel dashboard

---

## 🔒 Security Note

**Never commit your `.env` file to GitHub!** It contains your database password.

Make sure `.env` is in your `.gitignore` file (it should be already).

---

## ✅ Checklist

- [ ] Replaced `[YOUR_PASSWORD]` in connection string
- [ ] Added `DATABASE_URL` to `.env` file
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Verified tables in Supabase Table Editor
- [ ] Tested locally with `npm run dev`
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Pushed changes to GitHub
- [ ] Verified Vercel deployment works

---

**You're all set! 🎉**

