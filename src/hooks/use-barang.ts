import useSWR, { mutate } from "swr"
import { Barang, Aktivitas } from "@/data/types"

const fetcher = (url: string) => fetch(url).then((res) => {
  if (!res.ok) throw new Error("Fetch error")
  return res.json()
})

interface BarangListResponse {
  data: Barang[]
  total: number
  page: number
  limit: number
  totalPages: number
}

interface BarangQuery {
  search?: string
  kategori?: string
  status?: string
  sortBy?: string
  sortDir?: string
  page?: number
  limit?: number
}

interface DashboardData {
  totalBarang: number
  stokMenipis: number
  stokHabis: number
  kategoriCount: number
  nilaiInventaris: number
  stokPerKategori: Record<string, { jenis: number; stok: number }>
  aktivitasTerbaru: Aktivitas[]
}

function buildQuery(params: BarangQuery): string {
  const search = new URLSearchParams()
  if (params.search) search.set("search", params.search)
  if (params.kategori) search.set("kategori", params.kategori)
  if (params.status) search.set("status", params.status)
  if (params.sortBy) search.set("sortBy", params.sortBy)
  if (params.sortDir) search.set("sortDir", params.sortDir)
  if (params.page) search.set("page", String(params.page))
  if (params.limit) search.set("limit", String(params.limit))
  const qs = search.toString()
  return qs ? `?${qs}` : ""
}

export function useBarangList(query: BarangQuery = {}) {
  const qs = buildQuery(query)
  const { data, error, isLoading } = useSWR<BarangListResponse>(
    `/api/barang${qs}`,
    fetcher
  )

  return {
    barang: data?.data ?? [],
    total: data?.total ?? 0,
    page: data?.page ?? 1,
    totalPages: data?.totalPages ?? 1,
    isLoading,
    isError: !!error,
  }
}

export function useBarangDetail(id: string | undefined) {
  const { data, error, isLoading } = useSWR<Barang & { aktivitas: Aktivitas[] }>(
    id ? `/api/barang/${id}` : null,
    fetcher
  )

  return {
    barang: data ?? null,
    isLoading,
    isError: !!error,
    error,
  }
}

export function useDashboard() {
  const { data, error, isLoading } = useSWR<DashboardData>(
    "/api/dashboard",
    fetcher
  )

  return {
    data: data ?? null,
    isLoading,
    isError: !!error,
  }
}

export function useKategori() {
  const { data, error, isLoading } = useSWR<{ id: string; nama: string; jumlahBarang: number }[]>(
    "/api/kategori",
    fetcher
  )

  return {
    kategori: data ?? [],
    isLoading,
    isError: !!error,
  }
}

export function useAktivitas() {
  const { data, error, isLoading } = useSWR<Aktivitas[]>(
    "/api/aktivitas",
    fetcher
  )

  return {
    aktivitas: data ?? [],
    isLoading,
    isError: !!error,
  }
}

export async function createBarang(
  input: Omit<Barang, "id" | "kode" | "tanggalUpdate" | "status">
) {
  const res = await fetch("/api/barang", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Gagal membuat barang")
  }
  mutate((key) => typeof key === "string" && key.startsWith("/api/barang"))
  mutate((key) => typeof key === "string" && key.startsWith("/api/dashboard"))
  return res.json()
}

export async function updateBarang(
  id: string,
  input: Partial<Omit<Barang, "id" | "kode" | "tanggalUpdate">>
) {
  const res = await fetch(`/api/barang/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Gagal mengupdate barang")
  }
  mutate((key) => typeof key === "string" && key.startsWith("/api/barang"))
  mutate((key) => typeof key === "string" && key.startsWith("/api/dashboard"))
  return res.json()
}

export async function deleteBarang(id: string) {
  const res = await fetch(`/api/barang/${id}`, {
    method: "DELETE",
  })
  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || "Gagal menghapus barang")
  }
  mutate((key) => typeof key === "string" && key.startsWith("/api/barang"))
  mutate((key) => typeof key === "string" && key.startsWith("/api/dashboard"))
  return res.json()
}
