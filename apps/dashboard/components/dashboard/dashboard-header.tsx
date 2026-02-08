"use client"

import { Bell, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export function DashboardHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-ctp-text">Dashboard</h2>
        <p className="mt-0.5 text-sm text-ctp-subtext0">
          Overview of your ecommerce integrations and events
        </p>
      </div>
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ctp-overlay0" />
          <input
            type="text"
            placeholder="Search events..."
            className="h-9 w-56 rounded-lg border border-ctp-surface1 bg-ctp-mantle pl-9 pr-3 text-sm text-ctp-text placeholder:text-ctp-overlay0 focus:border-ctp-blue focus:outline-none focus:ring-1 focus:ring-ctp-blue"
          />
        </div>
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-ctp-surface1 bg-ctp-mantle text-ctp-subtext0 transition-colors hover:bg-ctp-surface0 hover:text-ctp-text"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-1 -top-1 h-4 min-w-4 justify-center border-0 bg-ctp-red px-1 text-[10px] font-bold text-ctp-crust">
            3
          </Badge>
        </button>
      </div>
    </div>
  )
}
