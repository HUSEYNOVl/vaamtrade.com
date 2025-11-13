# Git Repository Setup Guide

## Problem
Your repository is 500+ MB because large files are being tracked by git.

## Solution

### Step 1: Remove Large Files from Git Tracking

If you haven't committed yet, just make sure `.gitignore` is correct (it already is).

If you've already committed large files, run these commands:

```bash
# Remove node_modules from git tracking (if tracked)
git rm -r --cached node_modules 2>/dev/null || true

# Remove .next build folder from git tracking (if tracked)
git rm -r --cached .next 2>/dev/null || true

# Remove database files from git tracking (if tracked)
git rm --cached prisma/*.db 2>/dev/null || true
git rm --cached prisma/*.db-journal 2>/dev/null || true

# Remove uploaded images from git tracking (if tracked)
git rm -r --cached public/uploads/* 2>/dev/null || true
```

### Step 2: Verify .gitignore

The `.gitignore` file should already exclude:
- `/node_modules` (477MB)
- `/.next/` (98MB)
- `/prisma/*.db` (database files)
- `/public/uploads/*` (uploaded images)
- `.env` (environment variables)

### Step 3: Check Repository Size

```bash
# Check what's actually tracked by git
git ls-files | xargs du -ch | tail -1

# Should be much smaller now (probably < 10MB)
```

### Step 4: Initial Commit (if not done yet)

```bash
# Add all files (respecting .gitignore)
git add .

# Commit
git commit -m "Initial commit: VAAM Motors CMS website"

# Check size before pushing
git count-objects -vH
```

### Step 5: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository (don't initialize with README)
3. Copy the repository URL

### Step 6: Push to GitHub

```bash
# Add remote (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## What Should NOT Be Committed

✅ **Already in .gitignore:**
- `node_modules/` - Dependencies (install with `npm install`)
- `.next/` - Build folder (generated on build)
- `prisma/*.db` - Database files (create locally)
- `public/uploads/*` - User-uploaded images
- `.env` - Environment variables (create `.env.example` instead)

## What SHOULD Be Committed

✅ **Should be committed:**
- Source code (`app/`, `components/`, `lib/`, etc.)
- Configuration files (`package.json`, `tsconfig.json`, `tailwind.config.ts`)
- Prisma schema (`prisma/schema.prisma`)
- Documentation (`.md` files)
- `.gitignore`

## Optional: Create .env.example

Create a template for environment variables:

```bash
cp .env .env.example
# Then edit .env.example to remove sensitive values
```

## Repository Size After Cleanup

After removing large files, your repository should be:
- **Source code**: ~2-5 MB
- **Total**: < 10 MB (much better for GitHub!)

## If You Already Pushed Large Files

If you already pushed to GitHub with large files:

```bash
# Remove from git history (use with caution!)
git filter-branch --force --index-filter \
  "git rm -rf --cached --ignore-unmatch node_modules .next prisma/*.db public/uploads" \
  --prune-empty --tag-name-filter cat -- --all

# Force push (WARNING: This rewrites history)
git push origin --force --all
```

**Note:** Only do this if you're the only one working on the repository!

