"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useBarangList, createBarang, updateBarang, deleteBarang } from "@/hooks/use-barang"
import { Barang } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Eye,
  PackageOpen,
  Filter,
  ArrowUpDown,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { FormBarangData, FormBarang } from "./form-barang"

const statusVariant: Record<Barang["status"], "success" | "warning" | "destructive"> = {
  Tersedia: "success",
  Menipis: "warning",
  Habis: "destructive",
}

const kategoriList = ["Elektronik", "ATK", "Furnitur"]
const statusList: Barang["status"][] = ["Tersedia", "Menipis", "Habis"]

function BarangContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState("")
  const [filterKategori, setFilterKategori] = useState<string>("")
  const [filterStatus, setFilterStatus] = useState<string>("")
  const [sortField, setSortField] = useState<string>("nama")
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc")

  const [dialogOpen, setDialogOpen] = useState(searchParams.get("tambah") === "true")
  const [editItem, setEditItem] = useState<Barang | undefined>(undefined)
  const [deleteConfirm, setDeleteConfirm] = useState<Barang | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const query = useMemo(() => ({
    search: search || undefined,
    kategori: filterKategori || undefined,
    status: filterStatus || undefined,
    sortBy: sortField,
    sortDir: sortDir,
  }), [search, filterKategori, filterStatus, sortField, sortDir])

  const { barang, isLoading, isError } = useBarangList(query)

  const toggleSort = useCallback(
    (field: string) => {
      if (sortField === field) {
        setSortDir((d) => (d === "asc" ? "desc" : "asc"))
      } else {
        setSortField(field)
        setSortDir("asc")
      }
    },
    [sortField]
  )

  const handleSave = useCallback(
    async (data: FormBarangData) => {
      setActionLoading(true)
      try {
        if (editItem) {
          await updateBarang(editItem.id, data)
        } else {
          await createBarang(data)
        }
        setEditItem(undefined)
        setDialogOpen(false)
        router.replace("/barang")
      } catch {
        alert("Gagal menyimpan data. Silakan coba lagi.")
      } finally {
        setActionLoading(false)
      }
    },
    [editItem, router]
  )

  const handleDelete = useCallback(
    async (item: Barang) => {
      setActionLoading(true)
      try {
        await deleteBarang(item.id)
        setDeleteConfirm(null)
      } catch {
        alert("Gagal menghapus barang. Silakan coba lagi.")
      } finally {
        setActionLoading(false)
      }
    },
    []
  )

  const openEdit = (item: Barang) => {
    setEditItem(item)
    setDialogOpen(true)
  }

  const openAdd = () => {
    setEditItem(undefined)
    setDialogOpen(true)
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-xl font-bold">Gagal Memuat Data</h1>
        <p className="text-muted-foreground text-sm mb-4">
          Terjadi kesalahan saat mengambil data barang.
        </p>
        <Button onClick={() => window.location.reload()}>Coba Lagi</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Data Barang</h1>
          <p className="text-muted-foreground text-sm">
            Kelola data inventaris barang
          </p>
        </div>
        <Button onClick={openAdd} disabled={actionLoading}>
          <Plus className="h-4 w-4" />
          Tambah Barang
        </Button>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Cari nama, kode, kategori, atau lokasi..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={filterKategori || "semua"} onValueChange={(v) => setFilterKategori(v === "semua" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-40">
            <Filter className="h-4 w-4" />
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Kategori</SelectItem>
            {kategoriList.map((k) => (
              <SelectItem key={k} value={k}>{k}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus || "semua"} onValueChange={(v) => setFilterStatus(v === "semua" ? "" : v)}>
          <SelectTrigger className="w-full sm:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Status</SelectItem>
            {statusList.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer select-none w-24"
                onClick={() => toggleSort("kode")}
              >
                <div className="flex items-center gap-1">
                  Kode
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer select-none"
                onClick={() => toggleSort("nama")}
              >
                <div className="flex items-center gap-1">
                  Nama Barang
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="hidden md:table-cell">Kategori</TableHead>
              <TableHead
                className="cursor-pointer select-none text-right"
                onClick={() => toggleSort("stok")}
              >
                <div className="flex items-center justify-end gap-1">
                  Stok
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Satuan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-4 w-16" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                  <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-20" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-4 w-8 ml-auto" /></TableCell>
                  <TableCell className="hidden lg:table-cell"><Skeleton className="h-4 w-12" /></TableCell>
                  <TableCell className="text-center"><Skeleton className="h-5 w-16 mx-auto rounded-full" /></TableCell>
                  <TableCell className="text-right"><Skeleton className="h-8 w-24 ml-auto" /></TableCell>
                </TableRow>
              ))
            ) : barang.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <PackageOpen className="h-10 w-10 mb-2" />
                    <p className="font-medium">Tidak ada data barang</p>
                    <p className="text-sm">
                      {search || filterKategori || filterStatus
                        ? "Coba ubah filter pencarian"
                        : "Klik \"Tambah Barang\" untuk menambahkan"}
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              barang.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs">{item.kode}</TableCell>
                  <TableCell className="font-medium">{item.nama}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {item.kategori}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={item.stok <= 3 ? "font-semibold text-destructive" : ""}>
                      {item.stok}
                    </span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-muted-foreground">
                    {item.satuan}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusVariant[item.status]}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" asChild aria-label={`Lihat detail ${item.nama}`}>
                        <Link href={`/barang/${item.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => openEdit(item)} aria-label={`Edit ${item.nama}`}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setDeleteConfirm(item)}
                        aria-label={`Hapus ${item.nama}`}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <FormBarang
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false)
          setEditItem(undefined)
          router.replace("/barang")
        }}
        initial={editItem}
        onSave={handleSave}
      />

      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Hapus Barang</DialogTitle>
            <DialogDescription>
              Yakin ingin menghapus <strong>{deleteConfirm?.nama}</strong>? Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteConfirm(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              disabled={actionLoading}
            >
              {actionLoading ? "Menghapus..." : "Hapus"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default function BarangPage() {
  return (
    <Suspense>
      <BarangContent />
    </Suspense>
  )
}
