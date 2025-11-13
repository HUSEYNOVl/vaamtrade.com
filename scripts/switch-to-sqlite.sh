#!/bin/bash

# Script to switch back to SQLite for local development

echo "🔄 Switching to SQLite for local development..."

# Restore SQLite schema
if [ -f "prisma/schema.sqlite.backup" ]; then
    cp prisma/schema.sqlite.backup prisma/schema.prisma
    echo "✅ Restored SQLite schema from backup"
else
    echo "⚠️  No backup found. Creating SQLite schema..."
    # Remove @db.Text annotations and change provider
    sed -i '' 's/provider = "postgresql"/provider = "sqlite"/' prisma/schema.prisma
    sed -i '' 's/@db\.Text//g' prisma/schema.prisma
    echo "✅ Updated schema to SQLite"
fi

# Generate Prisma client
echo "⚙️  Generating Prisma Client for SQLite..."
npx prisma generate

echo ""
echo "✅ Switched to SQLite for local development!"
echo "   Run: npm run dev"

