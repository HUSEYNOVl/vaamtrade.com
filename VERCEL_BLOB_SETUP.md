# 🚀 Vercel Blob Setup Guide

## Step 1: Install Package (Already Done ✅)
```bash
npm install @vercel/blob
```

## Step 2: Create Blob Store in Vercel

1. **Go to Vercel Dashboard:**
   - Visit: https://vercel.com/dashboard
   - Select your project: `vaamtrade.com`

2. **Navigate to Blob Storage:**
   - Click on your project
   - Go to **Settings** tab
   - Click on **Blob** in the left sidebar

3. **Create Blob Store:**
   - Click **"Create Blob Store"** or **"Add"**
   - Give it a name (e.g., `vaam-motors-uploads`)
   - Click **"Create"**

4. **Copy the Token:**
   - After creating, you'll see a token
   - It looks like: `vercel_blob_rw_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
   - **Copy this token** (you'll need it in the next step)

## Step 3: Add Environment Variable

1. **In Vercel Dashboard:**
   - Still in **Settings** → **Environment Variables**
   - Click **"Add New"**

2. **Add the Variable:**
   - **Name:** `BLOB_READ_WRITE_TOKEN`
   - **Value:** Paste the token you copied
   - **Environment:** Select all (Production, Preview, Development)
   - Click **"Save"**

3. **Redeploy:**
   - After adding the variable, Vercel will automatically redeploy
   - Or manually trigger a redeploy from the **Deployments** tab

## Step 4: Verify Setup

1. **Check Environment Variables:**
   - Go to Settings → Environment Variables
   - You should see `BLOB_READ_WRITE_TOKEN` listed

2. **Test Upload:**
   - Go to your admin panel: `/admin/cars/new`
   - Try uploading an image
   - It should now work! ✅

## How It Works

- **Local Development:** Uses file system (`public/uploads/`) if no Blob token
- **Production (Vercel):** Automatically uses Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set
- **Images are stored in the cloud** and accessible via public URLs

## Troubleshooting

### Error: "BLOB_READ_WRITE_TOKEN is not configured"
- Make sure you added the environment variable in Vercel
- Make sure you selected all environments (Production, Preview, Development)
- Redeploy after adding the variable

### Images not showing
- Check that the Blob store is created
- Verify the token is correct
- Check Vercel logs for errors

### Still getting 500 errors
- Check Vercel deployment logs
- Make sure `@vercel/blob` package is installed
- Verify the token has read/write permissions

## Cost

- **Free Tier:** 1 GB storage, 1 GB bandwidth/month
- **Pro Tier:** $0.15/GB storage, $0.40/GB bandwidth
- Perfect for car images! 🚗

---

**Need Help?** Check Vercel Blob docs: https://vercel.com/docs/storage/vercel-blob

