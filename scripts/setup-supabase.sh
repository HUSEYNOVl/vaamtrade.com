#!/bin/bash

# Supabase Setup Script for VAAM Motors
# This script helps you set up Supabase for your project

echo "🚀 Supabase Setup for VAAM Motors"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Creating from .env.example..."
    if [ -f ".env.example" ]; then
        cp .env.example .env
        echo "✅ Created .env file"
    else
        echo "❌ .env.example not found. Please create .env manually."
        exit 1
    fi
fi

echo "📋 Step-by-Step Instructions:"
echo ""
echo "1. Go to https://supabase.com/dashboard"
echo "2. Click 'New Project'"
echo "3. Fill in:"
echo "   - Name: vaam-motors (or your choice)"
echo "   - Password: Create a strong password (SAVE IT!)"
echo "   - Region: Choose closest to you"
echo "   - Plan: Free"
echo "4. Wait 2-3 minutes for project creation"
echo ""
echo "5. Get Connection String:"
echo "   - Go to Settings → Database"
echo "   - Scroll to 'Connection string'"
echo "   - Copy the 'URI' connection string"
echo "   - Replace [YOUR-PASSWORD] with your actual password"
echo ""
echo "6. Update .env file:"
echo "   - Add: DATABASE_URL=\"your-connection-string-here\""
echo ""
echo "7. Run these commands:"
echo "   npx prisma generate"
echo "   npx prisma db push"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL" .env; then
    DB_URL=$(grep "DATABASE_URL" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
    if [[ $DB_URL == *"supabase"* ]]; then
        echo "✅ DATABASE_URL found in .env (looks like Supabase)"
        echo ""
        read -p "Do you want to update Prisma schema to PostgreSQL and run migrations? (y/n) " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            echo ""
            echo "📝 Updating Prisma schema..."
            # Backup current schema
            cp prisma/schema.prisma prisma/schema.sqlite.backup
            # Update schema
            sed -i '' 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
            sed -i '' 's|url      = env("DATABASE_URL")|url      = env("DATABASE_URL")|' prisma/schema.prisma
            echo "✅ Schema updated"
            
            echo ""
            echo "🔧 Generating Prisma Client..."
            npx prisma generate
            
            echo ""
            echo "📦 Pushing schema to database..."
            npx prisma db push
            
            echo ""
            echo "✅ Setup complete!"
            echo ""
            echo "Next steps:"
            echo "1. Verify tables in Supabase Dashboard → Table Editor"
            echo "2. Add DATABASE_URL to Vercel environment variables"
            echo "3. Deploy to Vercel"
        fi
    else
        echo "⚠️  DATABASE_URL found but doesn't look like Supabase"
        echo "   Current value starts with: ${DB_URL:0:20}..."
    fi
else
    echo "⚠️  DATABASE_URL not found in .env"
    echo "   Please add it manually:"
    echo "   DATABASE_URL=\"postgresql://postgres:PASSWORD@db.xxxxx.supabase.co:5432/postgres\""
fi

echo ""
echo "📚 For detailed instructions, see SUPABASE_SETUP.md"

