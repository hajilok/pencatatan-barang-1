import { NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET() {
  try {
    const aktivitas = await db.aktivitas.findMany({
      orderBy: { tanggal: "desc" },
      take: 20,
    })
    return NextResponse.json(aktivitas)
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
