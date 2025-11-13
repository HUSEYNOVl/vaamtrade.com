# 🛠️ Manual Supabase Connection String Setup

If you can't find the connection string in Supabase UI, here's how to get it manually:

## Step 1: Get Your Project Information

### Option A: From Project Settings → General

1. Go to **Settings → General**
2. Look for:
   - **Reference ID** (looks like: `abcdefghijklmnop`)
   - **Region** (e.g., `us-east-1`, `eu-west-1`, `eu-central-1`)

### Option B: From the URL

Look at your browser's address bar when you're in your project:
```
https://supabase.com/dashboard/project/[PROJECT-REF]/settings/database
```

The `[PROJECT-REF]` part is your project reference ID.

## Step 2: Get Your Database Password

This is the password you created when setting up the project. If you forgot it:
- Go to **Settings → Database**
- Look for "Reset database password" or similar option

## Step 3: Construct the Connection String

### For Connection Pooler (Recommended for Vercel):

```
postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres
```

**Example:**
```
postgresql://postgres.abcdefghijklmnop:MyPassword123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

### For Direct Connection:

```
postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
```

**Example:**
```
postgresql://postgres:MyPassword123@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## 🎯 Quick Guide: What to Replace

1. **`[PROJECT-REF]`** → Your project reference ID (from Settings → General or URL)
2. **`[YOUR-PASSWORD]`** → Your database password
3. **`[REGION]`** → Your region (from Settings → General)

---

## 📋 Common Regions

- `us-east-1` - US East (North Virginia)
- `us-west-1` - US West (North California)
- `eu-west-1` - EU West (Ireland)
- `eu-central-1` - EU Central (Frankfurt)
- `ap-southeast-1` - Asia Pacific (Singapore)
- `ap-northeast-1` - Asia Pacific (Tokyo)

---

## ✅ Test Your Connection String

Once you have it, we can test it locally before deploying to Vercel.

---

## 🆘 Still Stuck?

**Tell me:**
1. What sections you see in **Settings → Database**
2. What you see in **Settings → General** (especially Reference ID and Region)
3. Your project URL (the part after `/project/`)

And I'll help you construct it!

