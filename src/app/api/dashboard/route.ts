import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const [totalBarang, stokMenipis, stokHabis, kategoriCount] = await Promise.all([
      db.barang.count(),
      db.barang.count({ where: { status: "Menipis" } }),
      db.barang.count({ where: { status: "Habis" } }),
      db.barang.groupBy({ by: ["kategori"] }).then((r: Array<{ kategori: string }>) => r.length),
    ])

    type BarangSummary = { kategori: string; stok: number; harga: number }

    const barangList: BarangSummary[] = await db.barang.findMany({
      select: { kategori: true, stok: true, harga: true },
    })

    const nilaiInventaris = barangList.reduce((sum: number, b) => sum + b.harga * b.stok, 0)

    const stokPerKategori = barangList.reduce(
      (acc: Record<string, { jenis: number; stok: number }>, b) => {
        if (!acc[b.kategori]) {
          acc[b.kategori] = { jenis: 0, stok: 0 }
        }
        acc[b.kategori].jenis += 1
        acc[b.kategori].stok += b.stok
        return acc
      },
      {}
    )

    const aktivitasTerbaru = await db.aktivitas.findMany({
      orderBy: { tanggal: "desc" },
      take: 5,
    })

    return NextResponse.json({
      totalBarang,
      stokMenipis,
      stokHabis,
      kategoriCount,
      nilaiInventaris,
      stokPerKategori,
      aktivitasTerbaru,
    })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
