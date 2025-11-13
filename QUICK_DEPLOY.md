# Quick Deploy Guide - Connect Your Domain

## Fastest Way: Vercel (5 minutes)

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/vaam-car-sale.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) → Sign up/Login
2. Click "Add New Project"
3. Import your GitHub repo
4. Click "Deploy" (settings are auto-detected)

### 3. Add Your Domain
1. In Vercel → Your Project → Settings → Domains
2. Enter your domain: `yourdomain.com`
3. Copy the DNS records shown

### 4. Update DNS at Your Registrar
Go to where you bought your domain (GoDaddy, Namecheap, etc.):

**Add these DNS records:**

For root domain:
```
Type: A
Name: @
Value: 76.76.21.21
```

For www:
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**OR** use Vercel nameservers (easier):
```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### 5. Set Environment Variables
In Vercel → Settings → Environment Variables, add:

```
DATABASE_URL=your-postgres-connection-string
ADMIN_PASSWORD=your-secure-password
```

### 6. Setup Database (Free Options)

**Option A: Vercel Postgres**
- Vercel Dashboard → Storage → Create Database → Postgres
- Copy connection string to `DATABASE_URL`

**Option B: Supabase (Free)**
- Go to [supabase.com](https://supabase.com)
- Create project → Settings → Database
- Copy connection string

**Option C: Railway (Free)**
- Go to [railway.app](https://railway.app)
- Create PostgreSQL database
- Copy connection string

### 7. Update Database Schema
```bash
# Change schema.prisma to use postgresql (see DEPLOYMENT.md)
npx prisma generate
npx prisma db push
```

### 8. Wait for DNS (1-24 hours)
Your site will be live at: `https://yourdomain.com`

---

## That's It! 🎉

Your website will automatically have:
- ✅ Free SSL certificate (HTTPS)
- ✅ Global CDN (fast loading)
- ✅ Automatic deployments
- ✅ Custom domain support

---

## Need Help?

See `DEPLOYMENT.md` for detailed instructions.

