-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "Barang" (
    "id" TEXT NOT NULL,
    "kode" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "kategori" TEXT NOT NULL,
    "stok" INTEGER NOT NULL DEFAULT 0,
    "satuan" TEXT NOT NULL,
    "harga" INTEGER NOT NULL DEFAULT 0,
    "deskripsi" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'Tersedia',
    "lokasi" TEXT NOT NULL,
    "tanggalMasuk" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "tanggalUpdate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Barang_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Kategori" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "jumlahBarang" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "Kategori_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Aktivitas" (
    "id" TEXT NOT NULL,
    "barangId" TEXT,
    "barangNama" TEXT NOT NULL,
    "aksi" TEXT NOT NULL,
    "jumlah" INTEGER NOT NULL,
    "tanggal" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "keterangan" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "Aktivitas_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Barang_kode_key" ON "Barang"("kode");

-- CreateIndex
CREATE UNIQUE INDEX "Kategori_nama_key" ON "Kategori"("nama");

-- AddForeignKey
ALTER TABLE "Aktivitas" ADD CONSTRAINT "Aktivitas_barangId_fkey" FOREIGN KEY ("barangId") REFERENCES "Barang"("id") ON DELETE SET NULL ON UPDATE CASCADE;

