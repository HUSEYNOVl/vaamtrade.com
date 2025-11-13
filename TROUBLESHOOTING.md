# 🔧 Troubleshooting Guide - Car Creation & Image Upload

## If You See "Failed to create car" or Can't Upload Images

### Step 1: Check Browser Console

1. Open your browser's Developer Tools:
   - **Chrome/Edge**: Press `F12` or `Ctrl+Shift+I` (Windows) / `Cmd+Option+I` (Mac)
   - **Firefox**: Press `F12` or `Ctrl+Shift+K` (Windows) / `Cmd+Option+K` (Mac)
   - **Safari**: Press `Cmd+Option+I` (Mac)

2. Go to the **Console** tab

3. Try to create a car or upload an image

4. Look for any **red error messages** and share them

### Step 2: Test API Endpoints

I've created a test page for you:

1. Go to: `/admin/test-api`
2. Click "Test Upload API" - This tests image upload
3. Click "Test Car Creation API" - This tests car creation
4. Check the results and share any errors

### Step 3: Common Issues & Fixes

#### Issue: "Failed to create car"

**Possible Causes:**
1. **Database not connected** - Check if `DATABASE_URL` is set in `.env`
2. **Invalid data types** - Make sure price and year are numbers
3. **Missing required fields** - Make sure Make, Model, Year, Price are filled

**Fix:**
- Check the error message in the red box - it will tell you what's wrong
- Make sure all required fields (marked with *) are filled
- Make sure price is a number (e.g., `10000` not `"10000"`)

#### Issue: "Can't upload pictures"

**Possible Causes:**
1. **File too large** - Max 10MB per file
2. **Wrong file type** - Only images allowed (jpg, png, etc.)
3. **Permission error** - Can't write to uploads folder
4. **Network error** - Check your internet connection

**Fix:**
- Try a smaller image (under 10MB)
- Make sure it's an image file (jpg, png, gif, webp)
- Check browser console for specific error
- Try uploading one image at a time first

### Step 4: Check Server Logs

If you're running locally, check your terminal where `npm run dev` is running.

Look for:
- `Error creating car:` - Shows database errors
- `Error uploading file:` - Shows upload errors
- `Prisma client not initialized` - Database connection issue

### Step 5: Verify Database

Run this command to check database:
```bash
npx prisma db push
```

If you see errors, your database might not be set up correctly.

### Step 6: Quick Diagnostic Checklist

- [ ] Database exists: `prisma/dev.db` file exists
- [ ] Environment variables set: Check `.env` file
- [ ] Uploads folder exists: `public/uploads/` folder exists
- [ ] Browser console shows no errors
- [ ] All required fields filled in form
- [ ] Price is a valid number (e.g., 10000)
- [ ] Year is a valid number (e.g., 2024)

### Step 7: Get Help

If still having issues, please share:
1. **Exact error message** from the red error box
2. **Browser console errors** (from Step 1)
3. **Test API results** (from Step 2)
4. **Server terminal output** (if running locally)

---

## Quick Fixes

### Reset Form
- Refresh the page (`F5`)
- Clear browser cache if needed

### Test with Simple Data
Try creating a car with minimal data:
- Make: `Test`
- Model: `Car`
- Year: `2024`
- Price: `10000`
- Condition: `New`
- No images first

If this works, the issue is with specific data you're entering.

### Check File Permissions
If uploads fail, make sure the `public/uploads/` folder is writable:
```bash
chmod 755 public/uploads
```

---

**The error messages now show detailed information to help identify the exact issue!**

