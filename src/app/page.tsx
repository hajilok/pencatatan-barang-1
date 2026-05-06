"use client"

import { useDashboard } from "@/hooks/use-barang"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Package,
  AlertTriangle,
  XCircle,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka)
}

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  if (days === 0) return "Hari ini"
  if (days === 1) return "Kemarin"
  if (days < 7) return `${days} hari lalu`
  if (days < 30) return `${Math.floor(days / 7)} minggu lalu`
  return `${Math.floor(days / 30)} bulan lalu`
}

const aksiIcons: Record<string, typeof ArrowUpRight> = {
  "Barang Masuk": ArrowDownRight,
  "Barang Baru": Plus,
  "Barang Keluar": ArrowUpRight,
  "Penyesuaian": TrendingUp,
}

const aksiColors: Record<string, string> = {
  "Barang Masuk": "text-emerald-600",
  "Barang Baru": "text-blue-600",
  "Barang Keluar": "text-amber-600",
  "Penyesuaian": "text-purple-600",
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useDashboard()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64 mt-1" />
          </div>
          <Skeleton className="h-9 w-36" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-2"><Skeleton className="h-4 w-24" /></CardHeader>
              <CardContent><Skeleton className="h-8 w-16" /></CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold">Gagal Memuat Dashboard</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Terjadi kesalahan saat mengambil data.
        </p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    )
  }

  const ringkasanCards = [
    { key: "total", label: "Total Barang", icon: Package, color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-950", value: data.totalBarang },
    { key: "menipis", label: "Stok Menipis", icon: AlertTriangle, color: "text-amber-600", bg: "bg-amber-50 dark:bg-amber-950", value: data.stokMenipis },
    { key: "habis", label: "Stok Habis", icon: XCircle, color: "text-red-600", bg: "bg-red-50 dark:bg-red-950", value: data.stokHabis },
    { key: "kategori", label: "Kategori", icon: Layers, color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-950", value: data.kategoriCount },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Ringkasan inventaris barang
          </p>
        </div>
        <Link href="/barang?tambah=true">
          <Button size="sm">
            <Plus className="h-4 w-4" />
            Tambah Barang
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {ringkasanCards.map((card) => (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium">{card.label}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Stok per Kategori</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(data.stokPerKategori).map(([kat, info]) => {
                const allStok = Object.values(data.stokPerKategori).reduce((s, v) => s + v.stok, 0)
                const width = allStok > 0 ? Math.round((info.stok / allStok) * 100) : 0
                return (
                  <div key={kat} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{kat}</span>
                      <span className="text-muted-foreground">
                        {info.jenis} jenis · {info.stok} unit
                      </span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-muted">
                      <div
                        className="h-2 rounded-full bg-primary transition-all"
                        style={{ width: `${Math.min(width, 100)}%` }}
                      />
                    </div>
                  </div>
                )
              })}
              {Object.keys(data.stokPerKategori).length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada data kategori
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Nilai Inventaris</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-3xl font-bold">{formatRupiah(data.nilaiInventaris)}</span>
              <span className="text-sm text-muted-foreground">total nilai stok</span>
            </div>
            <Separator className="my-4" />
            <div className="space-y-3">
              <h4 className="text-sm font-medium">Aktivitas Terakhir</h4>
              {data.aktivitasTerbaru.map((aktivitas) => {
                const Icon = aksiIcons[aktivitas.aksi] ?? TrendingUp
                return (
                  <div key={aktivitas.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`p-1.5 rounded-md bg-muted ${aksiColors[aktivitas.aksi]}`}>
                        <Icon className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <p className="font-medium">{aktivitas.barangNama}</p>
                        <p className="text-xs text-muted-foreground">
                          {aktivitas.aksi} · {aktivitas.jumlah} {aktivitas.aksi.includes("Keluar") ? "keluar" : "masuk"}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline" className="text-xs">
                        {relativeTime(aktivitas.tanggal)}
                      </Badge>
                    </div>
                  </div>
                )
              })}
              {data.aktivitasTerbaru.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Belum ada aktivitas
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
