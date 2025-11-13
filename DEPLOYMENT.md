# How to Deploy and Connect Your Domain

This guide will help you deploy your VAAM Car Sale website and connect your custom domain.

## Option 1: Deploy to Vercel (Recommended - Easiest)

Vercel is the best platform for Next.js applications. It's free and very easy to use.

### Step 1: Prepare Your Code

1. Make sure all your code is committed to Git:
```bash
git add .
git commit -m "Ready for deployment"
```

2. Push to GitHub (if not already):
```bash
git remote add origin https://github.com/yourusername/vaam-car-sale.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign up/login
2. Click "Add New Project"
3. Import your GitHub repository
4. Vercel will auto-detect Next.js settings
5. Add Environment Variables:
   - `DATABASE_URL` - For production, use a PostgreSQL database (see below)
   - `ADMIN_PASSWORD` - Your admin panel password
6. Click "Deploy"

### Step 3: Connect Your Domain

1. In Vercel dashboard, go to your project → Settings → Domains
2. Enter your domain (e.g., `vaamcarsale.com` or `www.vaamcarsale.com`)
3. Vercel will show you DNS records to add

### Step 4: Configure DNS

Go to your domain registrar (where you bought the domain) and add these DNS records:

**For Root Domain (vaamcarsale.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For WWW (www.vaamcarsale.com):**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

**Or use Vercel's nameservers (easier):**
```
Nameserver 1: ns1.vercel-dns.com
Nameserver 2: ns2.vercel-dns.com
```

Wait 24-48 hours for DNS to propagate.

---

## Option 2: Deploy to Other Platforms

### Railway

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub
3. Add PostgreSQL database
4. Set environment variables
5. Add custom domain in project settings

### Render

1. Go to [render.com](https://render.com)
2. Create new Web Service
3. Connect GitHub repository
4. Add PostgreSQL database
5. Configure custom domain

### DigitalOcean App Platform

1. Go to [digitalocean.com](https://digitalocean.com)
2. Create App → GitHub repository
3. Add PostgreSQL database
4. Configure custom domain

---

## Database Setup for Production

For production, you need a PostgreSQL database (not SQLite).

### Option A: Vercel Postgres (Easiest with Vercel)

1. In Vercel dashboard → Storage → Create Database
2. Choose "Postgres"
3. Copy the connection string
4. Add to Environment Variables as `DATABASE_URL`

### Option B: Supabase (Free PostgreSQL)

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings → Database
4. Copy the connection string
5. Format: `postgresql://user:password@host:5432/database`

### Option C: Railway/Neon/Render PostgreSQL

All these platforms offer free PostgreSQL databases.

### Update Prisma Schema

1. Open `prisma/schema.prisma`
2. Change:
```prisma
datasource db {
  provider = "postgresql"  // Change from "sqlite"
  url      = env("DATABASE_URL")
}
```

3. Run:
```bash
npx prisma generate
npx prisma db push
```

---

## Environment Variables for Production

Create these in your hosting platform:

```
DATABASE_URL=postgresql://user:password@host:5432/database
ADMIN_PASSWORD=your-secure-password-here
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

---

## Step-by-Step: Complete Deployment

### 1. Prepare Database

```bash
# Update schema.prisma to use postgresql
# Then generate Prisma client
npx prisma generate
```

### 2. Build Locally (Test)

```bash
npm run build
npm start
```

### 3. Deploy to Vercel

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow prompts:
   - Link to existing project or create new
   - Add environment variables
   - Deploy

### 4. Add Domain

1. In Vercel dashboard → Domains
2. Add your domain
3. Follow DNS instructions

### 5. Update DNS Records

At your domain registrar (GoDaddy, Namecheap, etc.):

**If using A Record:**
- Type: A
- Name: @
- Value: 76.76.21.21
- TTL: 3600

**If using CNAME for www:**
- Type: CNAME
- Name: www
- Value: cname.vercel-dns.com
- TTL: 3600

**Or use Vercel Nameservers:**
- Replace your domain's nameservers with:
  - ns1.vercel-dns.com
  - ns2.vercel-dns.com

### 6. Wait for DNS Propagation

- Usually takes 1-24 hours
- Check status at: [whatsmydns.net](https://www.whatsmydns.net)

### 7. SSL Certificate

Vercel automatically provides free SSL certificates (HTTPS) for your domain!

---

## Quick Checklist

- [ ] Code pushed to GitHub
- [ ] Database created (PostgreSQL)
- [ ] Environment variables set
- [ ] Deployed to hosting platform
- [ ] Domain added in hosting dashboard
- [ ] DNS records updated at registrar
- [ ] SSL certificate active (automatic on Vercel)
- [ ] Test website on your domain

---

## Troubleshooting

### Domain Not Working?

1. Check DNS propagation: [whatsmydns.net](https://www.whatsmydns.net)
2. Verify DNS records are correct
3. Wait 24-48 hours for full propagation
4. Check Vercel dashboard for domain status

### Database Connection Issues?

1. Verify `DATABASE_URL` is correct
2. Check database is accessible (not blocked by firewall)
3. Ensure Prisma schema uses `postgresql` provider

### Build Errors?

1. Run `npm run build` locally to see errors
2. Check all environment variables are set
3. Ensure Prisma client is generated: `npx prisma generate`

---

## Need Help?

- Vercel Docs: [vercel.com/docs](https://vercel.com/docs)
- Next.js Deployment: [nextjs.org/docs/deployment](https://nextjs.org/docs/deployment)
- Domain DNS Help: Contact your domain registrar

---

## Cost Estimate

- **Vercel**: Free tier (perfect for most sites)
- **Domain**: $10-15/year
- **Database**: Free (Supabase/Railway) or $5-10/month
- **Total**: ~$10-25/year for a small business site

---

Your website will be live at: `https://yourdomain.com` 🚀

