"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  LayoutDashboard,
  Package,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  {
    title: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Data Barang",
    href: "/barang",
    icon: Package,
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  function isActive(href: string) {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  const links = (
    <nav className="flex flex-col gap-1 px-3 py-4">
      {navItems.map((item) => {
        const active = isActive(item.href)
        return (
        <Link key={item.href} href={item.href} onClick={() => setMobileOpen(false)}>
          <Button
            variant={active ? "secondary" : "ghost"}
            className={cn(
              "w-full justify-start gap-3",
              active && "bg-secondary font-medium"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.title}
          </Button>
          </Link>
        )
      })}
    </nav>
  )

  return (
    <>
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center gap-3 border-b bg-background px-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <div className="flex items-center gap-2 font-semibold">
          <Package className="h-5 w-5 text-primary" />
          <span>Inventaris</span>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/40"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div
        className={cn(
          "lg:hidden fixed top-0 left-0 z-30 h-full w-64 bg-sidebar border-r transition-transform duration-200 pt-14",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <ScrollArea className="h-full">{links}</ScrollArea>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed top-0 left-0 z-30 h-full w-64 flex-col border-r bg-sidebar">
        <div className="flex h-14 items-center gap-2 border-b px-6 font-semibold">
          <Package className="h-5 w-5 text-primary" />
          <span>Inventaris</span>
        </div>
        <ScrollArea className="flex-1">{links}</ScrollArea>
      </aside>
    </>
  )
}
