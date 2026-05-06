import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const kategori = await db.kategori.findMany({
      orderBy: { nama: "asc" },
    })
    return NextResponse.json(kategori)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
