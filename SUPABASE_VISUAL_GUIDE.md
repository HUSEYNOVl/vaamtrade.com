# 🎯 Visual Guide: Finding Supabase Connection String

## Exact Steps with Descriptions

### 1️⃣ After Logging In

You should see:
- **Top**: Your organization name and projects
- **Left Sidebar**: Menu with icons
- **Main Area**: Project overview or dashboard

### 2️⃣ Click on Your Project

- Find your project name (e.g., "vaam-motors")
- **Click on it** to open the project

### 3️⃣ Look at the Left Sidebar

You'll see icons/links like:

```
┌──────────────────────┐
│ 🏠 Home              │
│ 📊 Table Editor      │
│ 🔍 SQL Editor        │
│ 🔐 Authentication    │
│ 📡 API               │
│                      │
│ ⚙️ Settings          │  ← This is at the BOTTOM
└──────────────────────┘
```

**Click "Settings"** (⚙️ gear icon) - it's usually at the **bottom** of the sidebar

### 4️⃣ In Settings, Click "Database"

After clicking Settings, you'll see a new menu appear:

```
Settings
├── General
├── API
├── Database  ← CLICK THIS!
├── Auth
├── Storage
└── ...
```

**Click "Database"**

### 5️⃣ Scroll Down to "Connection string"

On the Database page, scroll down past:
- Connection pooling info
- Database URL
- etc.

Look for a section titled **"Connection string"**

### 6️⃣ You'll See Tabs

In the Connection string section, there are tabs at the top:

```
[URI] [JDBC] [Golang] [Python] [Node] [etc.]
```

**"URI" should be selected** (highlighted/active)

### 7️⃣ The Connection String

Below the tabs, you'll see a text box or code block with:

```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xxxxx.pooler.supabase.com:6543/postgres
```

### 8️⃣ Copy It

- Click the **"Copy" button** (📋 icon) next to the connection string
- Or select all the text and copy it (Cmd+C / Ctrl+C)

---

## 🔑 Important: Password Replacement

The connection string will have `[YOUR-PASSWORD]` in it. You MUST replace this with your actual database password!

**Example:**
- **Before**: `postgresql://postgres.abc123:[YOUR-PASSWORD]@...`
- **After**: `postgresql://postgres.abc123:MyActualPassword123@...`

---

## 📱 Mobile View

If you're on mobile or the layout looks different:

1. Look for a **hamburger menu** (☰) - click it to see the sidebar
2. Find "Settings" → "Database"
3. Scroll to "Connection string"
4. Copy the URI connection string

---

## 🎯 Quick Navigation Path

```
Supabase Dashboard
  → Click Your Project
    → Click Settings (⚙️ bottom left)
      → Click Database (in submenu)
        → Scroll to "Connection string"
          → Click "URI" tab (if not selected)
            → Copy the connection string
              → Replace [YOUR-PASSWORD] with your password
```

---

**Once you have it, share it here and I'll help you configure everything!**

