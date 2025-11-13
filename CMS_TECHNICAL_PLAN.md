# VAAM Motors - Full CMS Technical Plan

## 🎯 Project Overview
Transform VAAM Motors website into a fully dynamic, customizable CMS where every element can be edited from the admin panel without coding.

---

## 📊 Database Schema

### New Tables to Create:

#### 1. `Settings` (Global Website Settings)
```prisma
model Settings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String   @db.Text
  type      String   // 'text', 'color', 'image', 'number', 'boolean'
  category  String   // 'design', 'branding', 'contact', 'header', 'footer'
  locale    String?  // For multi-language settings
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### 2. `Pages` (Dynamic Pages)
```prisma
model Page {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  status      String   // 'draft', 'published'
  seoTitle    String?
  seoDesc     String?
  seoKeywords String?
  sections    Json     // Array of section configurations
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 3. `PageSections` (Reusable Sections)
```prisma
model PageSection {
  id          String   @id @default(cuid())
  pageId      String?
  type        String   // 'text', 'image', 'video', 'carousel', 'faq', etc.
  content     Json     // Section-specific content
  order       Int      @default(0)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  page        Page?    @relation(fields: [pageId], references: [id], onDelete: Cascade)
}
```

#### 4. `Media` (Media Manager)
```prisma
model Media {
  id          String   @id @default(cuid())
  filename    String
  originalName String
  path        String
  url         String
  mimeType    String
  size        Int
  folder      String?  // For organization
  alt         String?
  caption     String?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 5. `Translations` (Multi-language Content)
```prisma
model Translation {
  id        String   @id @default(cuid())
  key       String
  locale    String
  value     String   @db.Text
  namespace String?  // 'common', 'home', 'about', etc.
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([key, locale, namespace])
}
```

#### 6. `Certificates` (Certificates Management)
```prisma
model Certificate {
  id          String   @id @default(cuid())
  title       String
  description String?
  imageUrl    String
  order       Int      @default(0)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 7. `Videos` (Video Management)
```prisma
model Video {
  id          String   @id @default(cuid())
  title       String
  description String?
  thumbnailUrl String?
  videoUrl    String   // YouTube URL or uploaded video path
  type        String   // 'youtube', 'uploaded', 'vimeo'
  order       Int      @default(0)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 8. `Testimonials` (Testimonials Section)
```prisma
model Testimonial {
  id          String   @id @default(cuid())
  name        String
  role        String?
  company     String?
  content     String   @db.Text
  imageUrl    String?
  rating      Int?     // 1-5
  visible     Boolean  @default(true)
  order       Int      @default(0)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

#### 9. `FAQs` (FAQ Section)
```prisma
model FAQ {
  id          String   @id @default(cuid())
  question    String
  answer      String   @db.Text
  category    String?
  order       Int      @default(0)
  visible     Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}
```

---

## 🏗️ Architecture Overview

### Frontend Structure:
```
app/
├── [locale]/
│   ├── page.tsx (Homepage - dynamic sections)
│   ├── [slug]/page.tsx (Dynamic pages)
│   └── ...
├── admin/
│   ├── cms/
│   │   ├── pages/ (Page builder)
│   │   ├── settings/ (Global settings)
│   │   ├── media/ (Media manager)
│   │   ├── translations/ (Language management)
│   │   └── sections/ (Section templates)
│   └── ...
└── api/
    ├── cms/
    │   ├── pages/
    │   ├── settings/
    │   ├── media/
    │   └── translations/
    └── ...
```

### Component Structure:
```
components/
├── cms/
│   ├── PageBuilder.tsx
│   ├── SectionRenderer.tsx
│   ├── SectionEditor.tsx
│   └── sections/ (All section types)
├── admin/
│   ├── CMSDashboard.tsx
│   ├── PageBuilder.tsx
│   ├── SettingsPanel.tsx
│   ├── MediaManager.tsx
│   └── TranslationManager.tsx
└── ...
```

---

## 🎨 Section Types

### 1. Text Block
- Rich text editor (WYSIWYG)
- Text alignment
- Font size, color, weight
- Background color/image

### 2. Image Block
- Single image
- Image with caption
- Image gallery
- Lightbox support

### 3. Video Block
- YouTube embed
- Uploaded video
- Video with description

### 4. Car Listing Block
- Filter by featured
- Filter by make/model
- Grid/List view toggle

### 5. Certificates Gallery
- Grid layout
- Lightbox on click
- Drag to reorder

### 6. FAQ Section
- Accordion style
- Searchable
- Categorizable

### 7. Testimonials
- Carousel/Slider
- Star ratings
- Author info

### 8. Contact Form
- Customizable fields
- Email notifications
- Success message

### 9. Custom HTML
- Code editor
- Preview mode

---

## 🔧 API Endpoints

### Settings API:
- `GET /api/cms/settings` - Get all settings
- `GET /api/cms/settings/[key]` - Get specific setting
- `PUT /api/cms/settings/[key]` - Update setting
- `POST /api/cms/settings/bulk` - Update multiple settings

### Pages API:
- `GET /api/cms/pages` - List all pages
- `GET /api/cms/pages/[id]` - Get page details
- `POST /api/cms/pages` - Create page
- `PUT /api/cms/pages/[id]` - Update page
- `DELETE /api/cms/pages/[id]` - Delete page
- `PUT /api/cms/pages/[id]/sections/reorder` - Reorder sections

### Media API:
- `GET /api/cms/media` - List media (with pagination, filters)
- `POST /api/cms/media` - Upload media
- `DELETE /api/cms/media/[id]` - Delete media
- `PUT /api/cms/media/[id]` - Update media metadata

### Translations API:
- `GET /api/cms/translations` - Get translations
- `POST /api/cms/translations` - Create/Update translation
- `DELETE /api/cms/translations/[id]` - Delete translation

---

## 🎨 Theme Customizer Features

### Color System:
- Primary color picker
- Secondary color picker
- Background colors
- Text colors
- Link colors
- Button colors
- Live preview

### Typography:
- Font family selector (Google Fonts integration)
- Font size presets
- Line height
- Letter spacing

### Layout:
- Container width
- Border radius
- Spacing presets
- Shadow presets

---

## 📱 Responsive Control

### Breakpoints:
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: 1024px - 1440px
- Ultra-wide: > 1440px

### Admin Features:
- Device preview toggle
- Per-breakpoint styling
- Responsive image sizes

---

## 🚀 Implementation Phases

### Phase 1: Foundation (Current)
- ✅ Database schema design
- ✅ Basic admin structure
- ✅ Media upload system

### Phase 2: Core CMS (Next)
- Settings management
- Page builder foundation
- Section system
- Media manager

### Phase 3: Advanced Features
- Theme customizer
- Translation manager
- Advanced sections (FAQ, Testimonials)
- SEO management

### Phase 4: Polish & Optimization
- Performance optimization
- Caching strategy
- CDN integration
- SEO enhancements

---

## 🛠️ Technology Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (Prisma) - Easy to migrate to PostgreSQL
- **Styling**: Tailwind CSS
- **Rich Text**: TipTap or React Quill
- **Drag & Drop**: @dnd-kit
- **Image Upload**: Next.js API Routes
- **State Management**: React Context + Zustand (for admin)
- **Form Handling**: React Hook Form
- **Validation**: Zod

---

## 📋 Component List

### Admin Components:
1. CMSDashboard
2. PageBuilder
3. SectionEditor
4. SettingsPanel
5. ThemeCustomizer
6. MediaManager
7. TranslationManager
8. CertificateManager
9. VideoManager
10. TestimonialManager
11. FAQManager

### Frontend Components:
1. DynamicPageRenderer
2. SectionRenderer (renders all section types)
3. CMSImage (optimized image component)
4. CMSVideo
5. CMSText
6. CMSCarousel
7. CMSFAQ
8. CMSTestimonial

---

## 🔐 Security Considerations

- Admin authentication (already implemented)
- File upload validation
- XSS prevention in HTML sections
- CSRF protection
- Rate limiting on API routes
- Image optimization and validation

---

## 📈 Performance Strategy

- Image optimization (Next.js Image)
- Static generation where possible
- ISR (Incremental Static Regeneration)
- API response caching
- CDN for media files
- Lazy loading for sections
- Code splitting

---

## ✅ Next Steps

1. Update Prisma schema with new models
2. Create migration
3. Build Settings API
4. Build Settings Admin UI
5. Build Page Builder foundation
6. Implement section system
7. Add media manager
8. Add theme customizer
9. Add translation manager
10. Polish and optimize

---

This plan provides a complete roadmap for building a full-featured CMS system. We'll implement it incrementally, starting with the foundation and building up to advanced features.

