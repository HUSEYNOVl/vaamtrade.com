#!/bin/bash

# Git Repository Setup Script for VAAM Motors
# This script initializes git and prepares for GitHub

echo "🚀 Setting up Git repository for VAAM Motors..."

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install git first."
    exit 1
fi

# Initialize git repository
if [ -d ".git" ]; then
    echo "⚠️  Git repository already initialized."
else
    echo "📦 Initializing git repository..."
    git init
    echo "✅ Git repository initialized"
fi

# Check .gitignore
if [ -f ".gitignore" ]; then
    echo "✅ .gitignore file found"
else
    echo "❌ .gitignore file not found!"
    exit 1
fi

# Show what will be committed (respecting .gitignore)
echo ""
echo "📊 Files that will be committed (excluding .gitignore patterns):"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
git add --dry-run . 2>/dev/null | head -20 || echo "Run 'git add .' to see files"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Calculate size of files that will be committed
echo ""
echo "📏 Calculating repository size..."
SIZE=$(git add --dry-run . 2>/dev/null | wc -l)
echo "   Files to commit: ~$SIZE files"

# Check for large files
echo ""
echo "🔍 Checking for large files (>10MB)..."
find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.next/*" -not -path "./.git/*" 2>/dev/null | while read file; do
    SIZE=$(du -h "$file" | cut -f1)
    echo "   ⚠️  Large file found: $file ($SIZE)"
done

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "   1. Review files: git status"
echo "   2. Add files: git add ."
echo "   3. Commit: git commit -m 'Initial commit: VAAM Motors CMS website'"
echo "   4. Create GitHub repo and push: git remote add origin <URL> && git push -u origin main"
echo ""

