import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { updateBarangSchema } from "@/lib/validations"
import { ZodError } from "zod"

function getStatus(stok: number): string {
  if (stok === 0) return "Habis"
  if (stok <= 3) return "Menipis"
  return "Tersedia"
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const barang = await db.barang.findUnique({
      where: { id },
      include: { aktivitas: { orderBy: { tanggal: "desc" }, take: 10 } },
    })

    if (!barang) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 })
    }

    return NextResponse.json(barang)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const parsed = updateBarangSchema.parse(body)

    const existing = await db.barang.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 })
    }

    const updateData: Record<string, unknown> = { ...parsed }
    if (parsed.stok !== undefined) {
      updateData.status = getStatus(parsed.stok)
    }

    const barang = await db.barang.update({
      where: { id },
      data: updateData,
    })

    const perubahan: string[] = []
    if (parsed.nama && parsed.nama !== existing.nama) perubahan.push(`nama dari "${existing.nama}" ke "${parsed.nama}"`)
    if (parsed.stok !== undefined && parsed.stok !== existing.stok) {
      const aksi = parsed.stok > existing.stok ? "Barang Masuk" : "Barang Keluar"
      const selisih = Math.abs(parsed.stok - existing.stok)
      await db.aktivitas.create({
        data: {
          barangId: id,
          barangNama: barang.nama,
          aksi,
          jumlah: selisih,
          keterangan: `Stok berubah dari ${existing.stok} ke ${parsed.stok}`,
        },
      })
    }

    if (perubahan.length > 0) {
      await db.aktivitas.create({
        data: {
          barangId: id,
          barangNama: barang.nama,
          aksi: "Penyesuaian",
          jumlah: 0,
          keterangan: `Data diperbarui: ${perubahan.join(", ")}`,
        },
      })
    }

    return NextResponse.json(barang)
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.issues }, { status: 400 })
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.barang.findUnique({ where: { id } })

    if (!existing) {
      return NextResponse.json({ error: "Barang tidak ditemukan" }, { status: 404 })
    }

    await db.aktivitas.create({
      data: {
        barangId: null,
        barangNama: existing.nama,
        aksi: "Barang Dihapus",
        jumlah: existing.stok,
        keterangan: `Barang "${existing.nama}" (${existing.kode}) dihapus dari inventaris`,
      },
    })

    await db.barang.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
