# VAAM Motors - Global Car Export Platform

A modern, full-featured CMS-powered website for VAAM Motors, a trusted global luxury car exporter.

## 🚀 Features

- **Full Custom CMS**: Edit every part of the website from the admin panel
- **Page Builder**: Drag & drop page builder with multiple section types
- **Multi-Language Support**: English, Chinese (中文), Russian, Arabic
- **Car Inventory Management**: Advanced car listing system with multi-image upload
- **Global Settings**: Customize colors, fonts, branding, and contact information
- **Media Manager**: Professional media management with bulk upload
- **Responsive Design**: Perfect display on all devices

## 📋 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite with Prisma ORM
- **Internationalization**: next-intl
- **Email**: Resend

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd "World second hand car"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Seed default CMS pages** (optional)
   ```bash
   npm run seed:pages
   # Or use the admin panel: /admin/cms/pages → "Seed Default Pages"
   ```

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Open your browser**
   - Website: http://localhost:3000
   - Admin Panel: http://localhost:3000/admin

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── [locale]/          # Multi-language routes
│   ├── admin/             # Admin panel
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
├── prisma/               # Database schema
├── public/               # Static assets
└── scripts/              # Utility scripts
```

## 🔐 Admin Access

Access the admin panel at `/admin`. The admin panel includes:

- **CMS Dashboard**: Manage all content
- **Global Settings**: Website customization
- **Page Builder**: Create and edit pages
- **Media Manager**: Upload and organize media
- **Car Management**: Add and manage car listings
- **Translations**: Multi-language content management

## 🌍 Multi-Language Support

The website supports 4 languages:
- English (en)
- Chinese (中文) - zh
- Russian (ru)
- Arabic (ar)

All content can be translated through the CMS admin panel.

## 📝 Environment Variables

Required environment variables (see `.env.example`):

```env
DATABASE_URL="file:./dev.db"
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
RESEND_API_KEY="your-resend-api-key"
```

## 🚢 Deployment

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📚 Documentation

- `CMS_TECHNICAL_PLAN.md` - CMS architecture
- `CMS_IMPLEMENTATION_STATUS.md` - Implementation status
- `HOW_TO_ADD_CARS.md` - Car management guide
- `GIT_SETUP.md` - Git repository setup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

[Your License Here]

## 👥 Contact

VAAM Motors
- Email: [Your Email]
- Website: [Your Website]

---

Built with ❤️ for VAAM Motors
