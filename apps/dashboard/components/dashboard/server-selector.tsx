"use client"

import { useState } from "react"
import { ChevronDown, Plus, Check } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const servers = [
  { id: "1", name: "Acme Store", icon: "A", memberCount: 1243, color: "bg-ctp-blue" },
  { id: "2", name: "Gaming Merch", icon: "G", memberCount: 856, color: "bg-ctp-mauve" },
  { id: "3", name: "Tech Shop", icon: "T", memberCount: 2104, color: "bg-ctp-green" },
  { id: "4", name: "Fashion Hub", icon: "F", memberCount: 534, color: "bg-ctp-peach" },
]

export function ServerSelector() {
  const [selected, setSelected] = useState(servers[0])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="flex w-full items-center gap-3 rounded-lg bg-ctp-surface0 px-3 py-2.5 text-left transition-colors hover:bg-ctp-surface1"
          type="button"
        >
          <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${selected.color} text-sm font-bold text-ctp-crust`}>
            {selected.icon}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-ctp-text">{selected.name}</p>
            <p className="text-xs text-ctp-subtext0">{selected.memberCount.toLocaleString()} members</p>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-ctp-overlay1" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 border-ctp-surface1 bg-ctp-surface0"
        align="start"
        sideOffset={8}
      >
        {servers.map((server) => (
          <DropdownMenuItem
            key={server.id}
            onClick={() => setSelected(server)}
            className="flex items-center gap-3 rounded-md px-3 py-2.5 text-ctp-text focus:bg-ctp-surface1 focus:text-ctp-text"
          >
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${server.color} text-sm font-bold text-ctp-crust`}>
              {server.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{server.name}</p>
              <p className="text-xs text-ctp-subtext0">{server.memberCount.toLocaleString()} members</p>
            </div>
            {selected.id === server.id && (
              <Check className="h-4 w-4 shrink-0 text-ctp-green" />
            )}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator className="bg-ctp-surface1" />
        <DropdownMenuItem className="flex items-center gap-3 rounded-md px-3 py-2.5 text-ctp-subtext0 focus:bg-ctp-surface1 focus:text-ctp-text">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-dashed border-ctp-overlay0">
            <Plus className="h-4 w-4" />
          </div>
          <p className="text-sm font-medium">Add Server</p>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
