"use client"

import { useState, useEffect } from "react"
import { Barang } from "@/data/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

const kategoriList = ["Elektronik", "ATK", "Furnitur"]

export type FormBarangData = {
  nama: string
  kategori: string
  stok: number
  satuan: string
  harga: number
  deskripsi: string
  lokasi: string
  tanggalMasuk: string
  status?: Barang["status"]
}

export function FormBarang({
  open,
  onClose,
  initial,
  onSave,
}: {
  open: boolean
  onClose: () => void
  initial?: Barang
  onSave: (data: FormBarangData) => void
}) {
  const [nama, setNama] = useState(initial?.nama ?? "")
  const [kategori, setKategori] = useState(initial?.kategori ?? "")
  const [stok, setStok] = useState(initial?.stok ?? 0)
  const [satuan, setSatuan] = useState(initial?.satuan ?? "")
  const [harga, setHarga] = useState(initial?.harga ?? 0)
  const [deskripsi, setDeskripsi] = useState(initial?.deskripsi ?? "")
  const [lokasi, setLokasi] = useState(initial?.lokasi ?? "")
  const [tanggalMasuk, setTanggalMasuk] = useState(initial?.tanggalMasuk ?? "")
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      setNama(initial?.nama ?? "")
      setKategori(initial?.kategori ?? "")
      setStok(initial?.stok ?? 0)
      setSatuan(initial?.satuan ?? "")
      setHarga(initial?.harga ?? 0)
      setDeskripsi(initial?.deskripsi ?? "")
      setLokasi(initial?.lokasi ?? "")
      setTanggalMasuk(initial?.tanggalMasuk ?? "")
      setErrors({})
    }
  }, [open, initial])

  const validate = (): boolean => {
    const e: Record<string, string> = {}
    if (!nama.trim()) e.nama = "Nama wajib diisi"
    if (!kategori) e.kategori = "Kategori wajib dipilih"
    if (stok < 0) e.stok = "Stok tidak boleh negatif"
    if (!satuan.trim()) e.satuan = "Satuan wajib diisi"
    if (harga < 0) e.harga = "Harga tidak boleh negatif"
    if (!lokasi.trim()) e.lokasi = "Lokasi wajib diisi"
    if (!tanggalMasuk) e.tanggalMasuk = "Tanggal wajib diisi"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onSave({ nama: nama.trim(), kategori, stok, satuan, harga, deskripsi, lokasi, tanggalMasuk })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit Barang" : "Tambah Barang"}</DialogTitle>
          <DialogDescription>
            {initial ? "Perbarui informasi barang" : "Isi data barang baru"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nama">Nama Barang *</Label>
            <Input
              id="nama"
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama barang"
            />
            {errors.nama && <p className="text-xs text-destructive">{errors.nama}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="kategori">Kategori *</Label>
              <Select value={kategori} onValueChange={setKategori}>
                <SelectTrigger id="kategori">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriList.map((k) => (
                    <SelectItem key={k} value={k}>{k}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.kategori && <p className="text-xs text-destructive">{errors.kategori}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="satuan">Satuan *</Label>
              <Input
                id="satuan"
                value={satuan}
                onChange={(e) => setSatuan(e.target.value)}
                placeholder="Unit / Pcs / Rim"
              />
              {errors.satuan && <p className="text-xs text-destructive">{errors.satuan}</p>}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stok">Stok *</Label>
              <Input
                id="stok"
                type="number"
                min={0}
                value={stok}
                onChange={(e) => setStok(Number(e.target.value))}
              />
              {errors.stok && <p className="text-xs text-destructive">{errors.stok}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="harga">Harga Satuan *</Label>
              <Input
                id="harga"
                type="number"
                min={0}
                value={harga}
                onChange={(e) => setHarga(Number(e.target.value))}
              />
              {errors.harga && <p className="text-xs text-destructive">{errors.harga}</p>}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lokasi">Lokasi *</Label>
            <Input
              id="lokasi"
              value={lokasi}
              onChange={(e) => setLokasi(e.target.value)}
              placeholder="Gudang A - Rak 1"
            />
            {errors.lokasi && <p className="text-xs text-destructive">{errors.lokasi}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="tanggalMasuk">Tanggal Masuk *</Label>
            <Input
              id="tanggalMasuk"
              type="date"
              value={tanggalMasuk}
              onChange={(e) => setTanggalMasuk(e.target.value)}
            />
            {errors.tanggalMasuk && <p className="text-xs text-destructive">{errors.tanggalMasuk}</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="deskripsi">Deskripsi</Label>
            <Textarea
              id="deskripsi"
              value={deskripsi}
              onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Deskripsi barang (opsional)"
              rows={2}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {initial ? "Simpan Perubahan" : "Simpan Barang"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
