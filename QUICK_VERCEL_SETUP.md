# ⚡ Quick Vercel Setup (5 Minutes)

## The Simplest Way to Deploy

### Step 1: Push to GitHub (2 minutes)

```bash
git add .
git commit -m "Ready for Vercel"
git push origin main
```

### Step 2: Deploy to Vercel (1 minute)

1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click **"Add New Project"**
3. Import your GitHub repo
4. Click **"Deploy"** (wait 2-3 minutes)

### Step 3: Add Database (1 minute)

1. In Vercel Dashboard → Your Project
2. Click **"Storage"** tab
3. Click **"Create Database"**
4. Select **"Postgres"**
5. Click **"Create"**

**Done!** Vercel automatically adds `DATABASE_URL` to your environment variables.

### Step 4: Create Tables (1 minute)

In Vercel Dashboard → Your Project → **Deployments** → Latest deployment → **Terminal/Shell**:

```bash
npx prisma db push
```

**OR** run locally (if you have the connection string):

```bash
# Get connection string from Vercel → Storage → Postgres → Connection String
# Add to .env file, then:
npx prisma generate
npx prisma db push
```

---

## ✅ That's It!

Your website is now live with a database! 🎉

**Total time: ~5 minutes**

---

## 🔄 Next Deployment

After this, every time you push to GitHub:
- Vercel automatically redeploys
- Database is already connected
- Everything works automatically!

---

**This is the easiest way - no Supabase, no passwords, no complications!**

