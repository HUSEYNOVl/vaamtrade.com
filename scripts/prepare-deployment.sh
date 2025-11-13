#!/bin/bash

# Script to prepare for Vercel deployment
# This switches the schema from SQLite to PostgreSQL

echo "🚀 Preparing for Vercel Deployment..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Backup current schema
echo "📦 Backing up current schema..."
cp prisma/schema.prisma prisma/schema.sqlite.backup

# Copy PostgreSQL schema
echo "🔄 Switching to PostgreSQL schema..."
cp prisma/schema.postgresql.prisma prisma/schema.prisma

# Generate Prisma client
echo "⚙️  Generating Prisma Client for PostgreSQL..."
npx prisma generate

echo ""
echo "✅ Schema updated to PostgreSQL!"
echo ""
echo "Next steps:"
echo "1. Commit and push changes:"
echo "   git add prisma/schema.prisma"
echo "   git commit -m 'Update schema for PostgreSQL deployment'"
echo "   git push origin main"
echo ""
echo "2. Vercel will automatically deploy"
echo ""
echo "3. After deployment, create tables:"
echo "   - Go to Vercel Dashboard → Deployments → Latest → Terminal"
echo "   - Run: npx prisma db push"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

