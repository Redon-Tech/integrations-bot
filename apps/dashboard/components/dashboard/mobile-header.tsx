"use client"

import { useState } from "react"
import { Menu, X, ShoppingBag } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DashboardSidebar } from "./sidebar"

export function MobileHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b border-ctp-surface1 bg-ctp-mantle px-4 lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-ctp-subtext0 transition-colors hover:bg-ctp-surface0 hover:text-ctp-text"
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-64 border-ctp-surface1 bg-ctp-mantle p-0"
        >
          <DashboardSidebar className="flex h-full w-full flex-col bg-ctp-mantle" />
        </SheetContent>
      </Sheet>
      <div className="flex items-center gap-2">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-ctp-blue">
          <ShoppingBag className="h-4 w-4 text-ctp-crust" />
        </div>
        <span className="text-sm font-bold text-ctp-text">CartBot</span>
      </div>
    </header>
  )
}
