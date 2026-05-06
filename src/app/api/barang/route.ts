import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { createBarangSchema, barangQuerySchema } from "@/lib/validations"
import { ZodError } from "zod"

function getStatus(stok: number): string {
  if (stok === 0) return "Habis"
  if (stok <= 3) return "Menipis"
  return "Tersedia"
}

function generateKode(lastKode: string | null): string {
  if (!lastKode) return "BRG-001"
  const match = lastKode.match(/BRG-(\d+)/)
  if (!match) return "BRG-001"
  return `BRG-${String(parseInt(match[1]) + 1).padStart(3, "0")}`
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const query = barangQuerySchema.parse(Object.fromEntries(searchParams))

    const where: Record<string, unknown> = {}

    if (query.search) {
      where.OR = [
        { nama: { contains: query.search, mode: "insensitive" } },
        { kode: { contains: query.search, mode: "insensitive" } },
        { kategori: { contains: query.search, mode: "insensitive" } },
        { lokasi: { contains: query.search, mode: "insensitive" } },
      ]
    }

    if (query.kategori) {
      where.kategori = query.kategori
    }

    if (query.status) {
      where.status = query.status
    }

    const [data, total] = await Promise.all([
      db.barang.findMany({
        where,
        orderBy: { [query.sortBy]: query.sortDir },
        skip: (query.page - 1) * query.limit,
        take: query.limit,
      }),
      db.barang.count({ where }),
    ])

    return NextResponse.json({
      data,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createBarangSchema.parse(body)

    const lastBarang = await db.barang.findFirst({
      orderBy: { kode: "desc" },
      select: { kode: true },
    })

    const kode = generateKode(lastBarang?.kode ?? null)
    const status = getStatus(parsed.stok)

    const barang = await db.barang.create({
      data: {
        kode,
        nama: parsed.nama,
        kategori: parsed.kategori,
        stok: parsed.stok,
        satuan: parsed.satuan,
        harga: parsed.harga,
        deskripsi: parsed.deskripsi ?? "",
        status,
        lokasi: parsed.lokasi,
        tanggalMasuk: parsed.tanggalMasuk ? new Date(parsed.tanggalMasuk) : new Date(),
        aktivitas: {
          create: {
            barangNama: parsed.nama,
            aksi: "Barang Baru",
            jumlah: parsed.stok,
            keterangan: `Barang baru ditambahkan: ${parsed.nama}`,
          },
        },
      },
      include: { aktivitas: true },
    })

    return NextResponse.json(barang, { status: 201 })
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
