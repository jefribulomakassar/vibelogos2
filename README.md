# VibeLogos

Premium logo marketplace. Built with Next.js 14 + Turso + Google Drive API.

## Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Database | Turso (LibSQL / SQLite edge) |
| Storage | Google Drive (Service Account) |
| Deploy | Vercel |

## Struktur Folder

```
vibelogos/
├── app/
│   ├── api/
│   │   ├── logos/route.ts       → GET semua logo (dengan filter)
│   │   ├── logo/[slug]/route.ts → GET logo by slug
│   │   └── seed/route.ts        → POST seed data dari JSON
│   ├── logo/[slug]/page.tsx     → Detail logo page
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                 → Home page
├── components/
│   ├── Header.tsx / .module.css
│   ├── Hero.tsx / .module.css
│   ├── CategoryFilter.tsx / .module.css
│   ├── LogoGrid.tsx / .module.css
│   ├── LogoCard.tsx / .module.css
│   └── LogoDetailClient.tsx / .module.css
├── lib/
│   ├── db.ts        → Turso client singleton
│   ├── drive.ts     → Google Drive helper (thumbnail URL, list files)
│   ├── logos.ts     → Query functions ke Turso
│   └── slug.ts      → Slug generator
├── types/
│   └── logo.ts      → TypeScript types + parser
├── scripts/
│   ├── excel-to-json.js  → Konversi Excel ke logos.json
│   └── seed.js           → Upload logos.json ke DB via API
├── data/            → (gitignored) logos.json hasil konversi Excel
├── .env.example
├── vercel.json
└── package.json
```

## Setup

### 1. Clone & install

```bash
git clone https://github.com/jefribulomakassar/vibelogos.git
cd vibelogos
npm install
```

### 2. Env variables

Copy `.env.example` ke `.env.local`:

```bash
cp .env.example .env.local
```

Isi semua nilai:

```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token

GOOGLE_SERVICE_ACCOUNT_EMAIL=your@project.iam.gserviceaccount.com
GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GOOGLE_DRIVE_FOLDER_ID=folder-id-logos
GOOGLE_DRIVE_MOCKUPS_FOLDER_ID=folder-id-mockups

SEED_SECRET=random-secret-string-buat-proteksi-seed-api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Google Drive Service Account

1. Buka Google Cloud Console → IAM & Admin → Service Accounts
2. Buat service account baru
3. Download JSON key
4. Copy `client_email` ke `GOOGLE_SERVICE_ACCOUNT_EMAIL`
5. Copy `private_key` ke `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`
6. **Share folder Drive** ke email service account (viewer access)

### 4. Seed data dari Excel

```bash
# Konversi Excel ke JSON dulu
# Install xlsx untuk script ini
npm install xlsx --save-dev
node scripts/excel-to-json.js path/to/logos.xlsx

# Jalankan dev server
npm run dev

# Di terminal lain, seed ke DB
SEED_SECRET=your-secret NEXT_PUBLIC_APP_URL=http://localhost:3000 node scripts/seed.js
```

### 5. Google Drive File IDs

Untuk setiap logo, tambahkan `logo_file_id` di `data/logos.json` dengan Drive file ID-nya.  
Cara ambil file ID: buka file di Drive → URL format: `drive.google.com/file/d/{FILE_ID}/view`

### 6. Deploy ke Vercel

```bash
vercel --prod
```

Tambahkan semua env variables di Vercel Dashboard → Settings → Environment Variables.

## Skema Turso

```sql
CREATE TABLE logos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  keywords TEXT NOT NULL DEFAULT '[]',
  price REAL NOT NULL DEFAULT 0,
  main_category TEXT NOT NULL DEFAULT '',
  secondary_categories TEXT NOT NULL DEFAULT '[]',
  logo_file_id TEXT NOT NULL DEFAULT '',
  logo_url TEXT NOT NULL DEFAULT '',
  mockups TEXT NOT NULL DEFAULT '[]',
  logoground_url TEXT NOT NULL DEFAULT '',
  account TEXT NOT NULL DEFAULT '',
  published TEXT DEFAULT NULL,
  created_at TEXT NOT NULL DEFAULT datetime('now')
);
```
