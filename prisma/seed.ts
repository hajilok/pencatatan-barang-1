import { db } from "../src/lib/db"

function getStatus(stok: number): string {
  if (stok === 0) return "Habis"
  if (stok <= 3) return "Menipis"
  return "Tersedia"
}

async function main() {
  console.log("Seeding database...")

  await db.aktivitas.deleteMany()
  await db.barang.deleteMany()
  await db.kategori.deleteMany()

  const kategoriList = ["Elektronik", "ATK", "Furnitur"]
  for (const nama of kategoriList) {
    await db.kategori.create({ data: { nama, jumlahBarang: 0 } })
  }

  const barangSeed = [
    { nama: "Laptop ASUS ROG", kategori: "Elektronik", stok: 15, satuan: "Unit", harga: 12000000, deskripsi: "Laptop gaming ASUS ROG Strix G15 dengan RAM 16GB dan SSD 512GB", lokasi: "Gudang A - Rak 1", tanggal: "2026-01-15" },
    { nama: "Mouse Logitech G Pro", kategori: "Elektronik", stok: 3, satuan: "Unit", harga: 850000, deskripsi: "Mouse gaming wireless Logitech G Pro X Superlight", lokasi: "Gudang A - Rak 2", tanggal: "2026-02-20" },
    { nama: "Kertas A4 80gsm", kategori: "ATK", stok: 500, satuan: "Rim", harga: 45000, deskripsi: "Kertas HVS A4 80gsm merk PaperOne", lokasi: "Gudang B - Rak 3", tanggal: "2026-03-01" },
    { nama: "Tinta Printer HP", kategori: "ATK", stok: 0, satuan: "Botol", harga: 120000, deskripsi: "Tinta printer HP GT51 original black", lokasi: "Gudang B - Rak 4", tanggal: "2026-01-10" },
    { nama: "Meja Kantor", kategori: "Furnitur", stok: 8, satuan: "Unit", harga: 1500000, deskripsi: "Meja kantor minimalis ukuran 120x60 cm", lokasi: "Gudang C - Area 1", tanggal: "2026-02-05" },
    { nama: "Kursi Ergonomis", kategori: "Furnitur", stok: 2, satuan: "Unit", harga: 2500000, deskripsi: "Kursi kantor ergonomis dengan lumbar support", lokasi: "Gudang C - Area 2", tanggal: "2026-02-10" },
    { nama: "Pulpen Pilot", kategori: "ATK", stok: 200, satuan: "Pcs", harga: 5000, deskripsi: "Pulpen Pilot Balliner hitam 0.5mm", lokasi: "Gudang B - Rak 1", tanggal: "2026-03-15" },
    { nama: "Monitor Dell 24\"", kategori: "Elektronik", stok: 10, satuan: "Unit", harga: 3500000, deskripsi: "Monitor Dell P2422H 24 inch Full HD IPS", lokasi: "Gudang A - Rak 3", tanggal: "2026-01-20" },
    { nama: "Kabel LAN Cat6", kategori: "Elektronik", stok: 1, satuan: "Roll", harga: 750000, deskripsi: "Kabel LAN UTP Cat6 305m merk Belden", lokasi: "Gudang A - Rak 5", tanggal: "2026-02-28" },
    { nama: "Sticky Notes", kategori: "ATK", stok: 50, satuan: "Pack", harga: 15000, deskripsi: "Sticky notes 3x3 inch warna-warni", lokasi: "Gudang B - Rak 2", tanggal: "2026-04-01" },
    { nama: "Lemari Arsip", kategori: "Furnitur", stok: 0, satuan: "Unit", harga: 3200000, deskripsi: "Lemari arsip besi 4 laci", lokasi: "Gudang C - Area 3", tanggal: "2026-01-05" },
    { nama: "Keyboard Mechanical", kategori: "Elektronik", stok: 12, satuan: "Unit", harga: 950000, deskripsi: "Keyboard mechanical Keychron K2 brown switch", lokasi: "Gudang A - Rak 4", tanggal: "2026-03-10" },
    { nama: "Buku Catatan A5", kategori: "ATK", stok: 75, satuan: "Pcs", harga: 25000, deskripsi: "Buku catatan A5 hardcover 100 lembar", lokasi: "Gudang B - Rak 2", tanggal: "2026-03-20" },
    { nama: "Printer HP LaserJet", kategori: "Elektronik", stok: 4, satuan: "Unit", harga: 4500000, deskripsi: "Printer HP LaserJet Pro M404dn", lokasi: "Gudang A - Rak 6", tanggal: "2026-02-15" },
    { nama: "Rak Gudang", kategori: "Furnitur", stok: 6, satuan: "Unit", harga: 1800000, deskripsi: "Rak gudang baja ringan 4 tingkat", lokasi: "Gudang C - Area 4", tanggal: "2026-01-25" },
  ]

  for (let i = 0; i < barangSeed.length; i++) {
    const b = barangSeed[i]
    const kode = `BRG-${String(i + 1).padStart(3, "0")}`
    const status = getStatus(b.stok)

    await db.barang.create({
      data: {
        kode,
        nama: b.nama,
        kategori: b.kategori,
        stok: b.stok,
        satuan: b.satuan,
        harga: b.harga,
        deskripsi: b.deskripsi,
        status,
        lokasi: b.lokasi,
        tanggalMasuk: new Date(b.tanggal),
        aktivitas: {
          create: {
            barangNama: b.nama,
            aksi: "Barang Baru",
            jumlah: b.stok,
            keterangan: `Seed data: ${b.nama}`,
          },
        },
      },
    })
  }

  for (const kat of kategoriList) {
    const count = barangSeed.filter((b) => b.kategori === kat).length
    await db.kategori.update({ where: { nama: kat }, data: { jumlahBarang: count } })
  }

  console.log("Seed selesai!")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await db.$disconnect()
  })
