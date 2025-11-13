# 📍 Where to Find Supabase Connection String - Step by Step

## Visual Guide: Finding the Connection String

### Step 1: Open Your Project
1. After logging into Supabase, you'll see your **Dashboard**
2. Click on your project name (the one you just created, e.g., "vaam-motors")
3. You'll see the project overview page

### Step 2: Go to Settings
Look at the **left sidebar** (the menu on the left side of the screen):

```
┌─────────────────────────┐
│  🏠 Home                │
│  📊 Table Editor        │
│  🔍 SQL Editor          │
│  🔐 Authentication      │
│  📡 API                 │
│  ⚙️ Settings  ← CLICK HERE!
└─────────────────────────┘
```

**Click on "Settings"** (the gear icon ⚙️ at the bottom of the sidebar)

### Step 3: Click "Database"
In the Settings page, you'll see a menu on the left:

```
Settings
├── General
├── API
├── Database  ← CLICK HERE!
├── Auth
├── Storage
└── ...
```

**Click on "Database"** in this submenu

### Step 4: Find "Connection string" Section
Scroll down on the Database settings page. You'll see several sections:

```
Database Settings
├── Connection pooling
├── Connection string  ← LOOK FOR THIS SECTION!
├── Connection parameters
└── ...
```

### Step 5: Find "URI" Tab
In the "Connection string" section, you'll see **tabs** or **buttons**:

```
Connection string
┌─────────────────────────────────────────┐
│ [URI] [JDBC] [Golang] [Python] [Node]  │
│                                         │
│ postgresql://postgres.[REF]:[PASSWORD] │
│ @aws-0-[REGION].pooler.supabase.com:   │
│ 6543/postgres                           │
│                                         │
│ [📋 Copy] button                       │
└─────────────────────────────────────────┘
```

**The "URI" tab should be selected by default** (it's usually the first one)

### Step 6: Copy the Connection String
1. You'll see a long string that starts with `postgresql://`
2. Click the **"Copy" button** (📋 icon) next to it
3. The connection string will be copied to your clipboard

---

## 🎯 What the Connection String Looks Like

It will look something like this:

```
postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**OR** (direct connection):

```
postgresql://postgres:[YOUR-PASSWORD]@db.abcdefghijklmnop.supabase.co:5432/postgres
```

---

## ⚠️ Important: Replace [YOUR-PASSWORD]

The connection string will have `[YOUR-PASSWORD]` in it. You need to:

1. **Replace `[YOUR-PASSWORD]`** with the actual password you created when setting up the project
2. For example, if your password is `MySecurePass123`, the connection string should be:
   ```
   postgresql://postgres.abcdefghijklmnop:MySecurePass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```

---

## 🔍 Alternative: If You Can't Find It

### Method 1: Direct Link
1. The URL in your browser should look like:
   ```
   https://supabase.com/dashboard/project/[YOUR-PROJECT-ID]/settings/database
   ```
2. Or manually navigate: **Settings → Database**

### Method 2: Project Settings
1. Click on your project name (top left)
2. Click "Project Settings" (if you see it)
3. Then click "Database"

### Method 3: API Settings
Sometimes the connection string is also in:
- **Settings → API → Database URL**

---

## 📸 What You're Looking For

The connection string section will show:

```
┌─────────────────────────────────────────────────────────────┐
│ Connection string                                            │
│                                                              │
│ Use this connection string to connect to your database      │
│                                                              │
│ [URI] [JDBC] [Golang] [Python] [Node] [etc.]                │
│                                                              │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-...   │ │
│ └─────────────────────────────────────────────────────────┘ │
│                                                              │
│ [📋 Copy] [Show password]                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Quick Checklist

- [ ] I'm in my Supabase project dashboard
- [ ] I clicked "Settings" (⚙️ icon) in the left sidebar
- [ ] I clicked "Database" in the Settings submenu
- [ ] I scrolled down to "Connection string" section
- [ ] I see the "URI" tab (should be selected)
- [ ] I see a string starting with `postgresql://`
- [ ] I clicked the "Copy" button
- [ ] I replaced `[YOUR-PASSWORD]` with my actual password

---

## 🆘 Still Can't Find It?

If you're still having trouble:

1. **Take a screenshot** of your Supabase dashboard and I can help you locate it
2. **Tell me what you see** - describe what's on your screen
3. **Check the URL** - it should contain `/settings/database` when you're in the right place

---

**Once you have the connection string, paste it here and I'll help you set everything up!**

