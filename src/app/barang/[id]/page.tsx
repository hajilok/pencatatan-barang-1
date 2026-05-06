"use client"

import { use, useState } from "react"
import { useRouter } from "next/navigation"
import { useBarangDetail, updateBarang, deleteBarang } from "@/hooks/use-barang"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Barang } from "@/data/types"
import {
  FormBarang,
} from "../form-barang"
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Package,
  MapPin,
  Calendar,
  Tag,
  Hash,
  Banknote,
  AlertTriangle,
} from "lucide-react"

const statusVariant: Record<Barang["status"], "success" | "warning" | "destructive"> = {
  Tersedia: "success",
  Menipis: "warning",
  Habis: "destructive",
}

function formatRupiah(angka: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(angka)
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export default function BarangDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = use(params)
  const router = useRouter()
  const { barang, isLoading, isError, error } = useBarangDetail(id)
  const [editOpen, setEditOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-9 rounded-md" />
          <div>
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-20 mt-1" />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
            <CardContent className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full" />
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader><Skeleton className="h-5 w-24" /></CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (isError || !barang) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        {error ? (
          <>
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <h1 className="text-xl font-bold">Gagal Memuat Data</h1>
          </>
        ) : (
          <>
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h1 className="text-xl font-bold">Barang Tidak Ditemukan</h1>
          </>
        )}
        <p className="text-muted-foreground text-sm mb-4">
          {error ? "Terjadi kesalahan saat mengambil data." : "Barang dengan ID tersebut tidak tersedia."}
        </p>
        <Button onClick={() => router.push("/barang")}>
          <ArrowLeft className="h-4 w-4" />
          Kembali ke Data Barang
        </Button>
      </div>
    )
  }

  const handleEdit = async (data: Parameters<typeof updateBarang>[1]) => {
    setActionLoading(true)
    try {
      await updateBarang(barang.id, data)
      setEditOpen(false)
    } catch {
      alert("Gagal mengupdate barang. Silakan coba lagi.")
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await deleteBarang(barang.id)
      router.push("/barang")
    } catch {
      alert("Gagal menghapus barang. Silakan coba lagi.")
    } finally {
      setActionLoading(false)
    }
  }

  const totalNilai = barang.harga * barang.stok

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold tracking-tight">{barang.nama}</h1>
          <p className="text-sm text-muted-foreground font-mono">{barang.kode}</p>
        </div>
        <Badge variant={statusVariant[barang.status]} className="text-sm px-3 py-1">
          {barang.status}
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Informasi Barang</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Kode</p>
                  <p className="font-mono text-sm">{barang.kode}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Kategori</p>
                  <p>{barang.kategori}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Stok</p>
                  <p className={barang.stok <= 3 ? "font-semibold text-destructive" : ""}>
                    {barang.stok} {barang.satuan}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Banknote className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Harga Satuan</p>
                  <p>{formatRupiah(barang.harga)} / {barang.satuan}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Lokasi</p>
                  <p>{barang.lokasi}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground">Tanggal Masuk</p>
                  <p>{formatDate(barang.tanggalMasuk)}</p>
                </div>
              </div>
            </div>

            {barang.deskripsi && (
              <>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Deskripsi</p>
                  <p className="text-sm">{barang.deskripsi}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ringkasan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground">Total Nilai Stok</p>
              <p className="text-2xl font-bold">{formatRupiah(totalNilai)}</p>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <Badge variant={statusVariant[barang.status]} className="mt-1">
                {barang.status}
              </Badge>
            </div>
            <Separator />
            <div>
              <p className="text-xs text-muted-foreground">Terakhir Diperbarui</p>
              <p className="text-sm">{formatDate(barang.tanggalUpdate)}</p>
            </div>
            <Separator />
            <div className="flex flex-col gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setEditOpen(true)} disabled={actionLoading}>
                <Pencil className="h-4 w-4" />
                Edit Barang
              </Button>
              <Button variant="destructive" size="sm" onClick={handleDelete} disabled={actionLoading}>
                <Trash2 className="h-4 w-4" />
                Hapus Barang
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <FormBarang
        open={editOpen}
        onClose={() => setEditOpen(false)}
        initial={barang}
        onSave={handleEdit}
      />
    </div>
  )
}
