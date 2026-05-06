# Pencatatan Barang

Aplikasi pencatatan dan manajemen inventaris barang berbasis web.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS v4, shadcn/ui, SWR
- **Backend**: Next.js Route Handlers
- **Database**: PostgreSQL + Prisma ORM
- **Validation**: Zod

## Prasyarat

- Node.js 18+
- PostgreSQL (running di port default 5432)
- npm

## Setup Development

```bash
# 1. Clone repo
git clone https://github.com/imamsianakit/pencatatan-barang.git
cd pencatatan-barang

# 2. Install dependencies & generate Prisma client
npm install

# 3. Setup database
# Buat database PostgreSQL:
#   createdb pencatatan_barang
# Atau via psql:
#   CREATE DATABASE pencatatan_barang;

# 4. Copy dan sesuaikan .env
# cp .env.example .env   (jika ada)
# Default: postgresql://postgres:postgres@localhost:5432/pencatatan_barang

# 5. Jalankan migrasi database
npx prisma migrate dev --name init

# 6. Seed data awal
npm run db:seed

# 7. Jalankan development server
npm run dev
```

Buka http://localhost:3000

## Scripts

| Script | Deskripsi |
|---|---|
| `npm run dev` | Jalankan development server |
| `npm run build` | Build production |
| `npm run lint` | Jalankan linter |
| `npm run db:migrate` | Jalankan Prisma migrate |
| `npm run db:seed` | Seed database dengan data contoh |
| `npm run db:setup` | Migrate + seed sekaligus |

## API Endpoints

| Method | Path | Deskripsi |
|---|---|---|
| GET | `/api/barang` | List barang (search, filter, sort) |
| POST | `/api/barang` | Tambah barang |
| GET | `/api/barang/[id]` | Detail barang |
| PATCH | `/api/barang/[id]` | Update barang |
| DELETE | `/api/barang/[id]` | Hapus barang |
| GET | `/api/kategori` | Daftar kategori |
| GET | `/api/aktivitas` | Aktivitas terbaru |
| GET | `/api/dashboard` | Ringkasan dashboard |

## Struktur Project

```
src/
├── app/
│   ├── api/           # Route handlers (backend)
│   │   ├── barang/
│   │   ├── kategori/
│   │   ├── aktivitas/
│   │   └── dashboard/
│   ├── barang/        # Halaman Data Barang & Detail
│   └── page.tsx       # Dashboard
├── components/        # UI components (shadcn/ui)
├── hooks/             # SWR data hooks
├── lib/               # Database client, validasi
└── data/              # Type definitions
prisma/
├── schema.prisma      # Database schema
├── seed.ts            # Seed script
└── migrations/        # Migration files
```
