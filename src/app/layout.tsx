import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AppSidebar } from "@/components/app-sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Inventaris - Pencatatan Barang",
  description: "Aplikasi pencatatan dan manajemen inventaris barang",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id" className="light">
      <body className={`${inter.className} antialiased`}>
        <div className="min-h-screen">
          <AppSidebar />
          <main className="lg:pl-64 pt-14 lg:pt-0">
            <div className="container mx-auto p-4 md:p-6 lg:p-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
