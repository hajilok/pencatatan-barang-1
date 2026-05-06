import { z } from "zod"

export const createBarangSchema = z.object({
  nama: z.string().min(1, "Nama wajib diisi"),
  kategori: z.string().min(1, "Kategori wajib dipilih"),
  stok: z.number().int().min(0, "Stok tidak boleh negatif"),
  satuan: z.string().min(1, "Satuan wajib diisi"),
  harga: z.number().int().min(0, "Harga tidak boleh negatif"),
  deskripsi: z.string().optional().default(""),
  lokasi: z.string().min(1, "Lokasi wajib diisi"),
  tanggalMasuk: z.string().optional(),
})

export const updateBarangSchema = createBarangSchema.partial()

export const barangQuerySchema = z.object({
  search: z.string().optional(),
  kategori: z.string().optional(),
  status: z.string().optional(),
  sortBy: z.enum(["kode", "nama", "stok", "kategori", "tanggalMasuk"]).optional().default("nama"),
  sortDir: z.enum(["asc", "desc"]).optional().default("asc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(50),
})

export type CreateBarangInput = z.infer<typeof createBarangSchema>
export type UpdateBarangInput = z.infer<typeof updateBarangSchema>
export type BarangQuery = z.infer<typeof barangQuerySchema>
