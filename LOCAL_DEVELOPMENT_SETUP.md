# Local Development Setup

## Current Configuration

**For Local Development:**
- Database: SQLite (file: `./prisma/dev.db`)
- Schema: `prisma/schema.prisma` (SQLite compatible)
- Environment: `.env` file with SQLite connection

**For Production (Vercel):**
- Database: PostgreSQL (Supabase)
- Schema: `prisma/schema.postgresql.prisma` (PostgreSQL version)
- Environment: Vercel Environment Variables

## How It Works

1. **Local Development**: Uses SQLite for easy development
2. **Production**: Uses PostgreSQL on Supabase via Vercel

## Switching Between Databases

### To Use PostgreSQL Locally:
1. Update `.env`:
   ```env
   DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.lnoyexylifrtdvvjedmf.supabase.co:5432/postgres"
   ```
2. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Add `@db.Text` to large text fields
4. Run: `npx prisma generate && npx prisma db push`

### To Use SQLite Locally (Current):
1. `.env` already has: `DATABASE_URL="file:./prisma/dev.db"`
2. Schema is already set to SQLite
3. Just run: `npm run dev`

## Important Notes

- **Never commit `.env` file** - it contains sensitive data
- **For Vercel**: Make sure `DATABASE_URL` is set in Environment Variables
- **Schema differences**: PostgreSQL uses `@db.Text`, SQLite doesn't support it

## Current Status

✅ Local development: SQLite (working)
✅ Production: PostgreSQL (configured in Vercel)
✅ Schema: Compatible with both (with minor adjustments)

