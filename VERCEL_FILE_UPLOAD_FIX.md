# 🔧 Vercel File Upload Fix

## Problem
Vercel has a **read-only filesystem**, which means you cannot write files to the server's file system in production. This causes 500 errors when trying to upload images.

## Solutions

### Option 1: Use Vercel Blob (Recommended)
Vercel Blob is the easiest solution for file uploads on Vercel.

1. **Install Vercel Blob:**
   ```bash
   npm install @vercel/blob
   ```

2. **Get your Blob Store Token:**
   - Go to Vercel Dashboard → Your Project → Settings → Blob
   - Create a new Blob Store
   - Copy the `BLOB_READ_WRITE_TOKEN`

3. **Add to Environment Variables:**
   - In Vercel Dashboard → Settings → Environment Variables
   - Add: `BLOB_READ_WRITE_TOKEN` = (your token)

4. **Update Upload API:**
   See `app/api/upload/route.ts` for implementation

### Option 2: Use Cloudinary (Free Tier Available)
Cloudinary offers a free tier with 25GB storage.

1. **Sign up:** https://cloudinary.com
2. **Get API credentials**
3. **Install:** `npm install cloudinary`
4. **Update upload API to use Cloudinary**

### Option 3: Use AWS S3
For production-grade storage.

1. **Create S3 bucket**
2. **Install:** `npm install @aws-sdk/client-s3`
3. **Configure credentials**
4. **Update upload API**

### Option 4: Use Base64 Encoding (Temporary Solution)
Store images as base64 strings in the database (not recommended for production).

---

## Current Status
The upload API now detects Vercel and returns a helpful error message. For local development, file uploads work normally.

## Next Steps
1. Choose a cloud storage solution (Vercel Blob recommended)
2. Update the upload API to use the chosen service
3. Update the frontend to handle the new upload flow

---

**Note:** Local development will continue to work with file system uploads. Only production (Vercel) needs cloud storage.

