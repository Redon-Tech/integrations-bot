'use client'

import { useState } from 'react'
import {
  LayoutDashboard,
  Zap,
  Link2,
  Settings,
  Bell,
  ShoppingBag,
  LogOut,
  HelpCircle,
} from 'lucide-react'
import { ServerSelector } from './server-selector'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '#', active: true },
  { icon: Zap, label: 'Events', href: '#', active: false, badge: '12' },
  { icon: Link2, label: 'Integrations', href: '#', active: false },
  { icon: Bell, label: 'Notifications', href: '#', active: false },
  { icon: ShoppingBag, label: 'Products', href: '#', active: false },
  { icon: Settings, label: 'Settings', href: '#', active: false },
]

export function DashboardSidebar({ className }: { className?: string }) {
  const [activeItem, setActiveItem] = useState('Dashboard')

  return (
    <aside
      className={
        className ||
        'fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-ctp-surface1 bg-ctp-mantle'
      }
    >
      {/* Server selector */}
      <div className="px-3 pb-2 py-5">
        <ServerSelector />
      </div>

      <Separator className="bg-ctp-surface1" />

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3">
        <div className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-wider text-ctp-overlay0">
          Menu
        </div>
        <ul className="flex flex-col gap-0.5">
          {navItems.map(item => {
            const isActive = activeItem === item.label
            return (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => setActiveItem(item.label)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-ctp-surface0 text-ctp-blue'
                      : 'text-ctp-subtext0 hover:bg-ctp-surface0/50 hover:text-ctp-text'
                  }`}
                >
                  <item.icon className={`h-[18px] w-[18px] ${isActive ? 'text-ctp-blue' : ''}`} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="h-5 min-w-5 justify-center border-0 bg-ctp-blue/15 px-1.5 text-[11px] font-semibold text-ctp-blue"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>

      <Separator className="bg-ctp-surface1" />

      {/* Bottom section */}
      <div className="flex flex-col gap-1 px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-ctp-subtext0 transition-colors hover:bg-ctp-surface0/50 hover:text-ctp-text"
        >
          <HelpCircle className="h-[18px] w-[18px]" />
          <span>Help & Support</span>
        </button>
      </div>

      <Separator className="bg-ctp-surface1" />

      {/* User */}
      <div className="flex items-center gap-3 px-5 py-4">
        <Avatar className="h-8 w-8 border border-ctp-surface1">
          <AvatarFallback className="bg-ctp-mauve text-xs font-bold text-ctp-crust">
            JD
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ctp-text">Jordan#4291</p>
          <p className="text-[11px] text-ctp-overlay1">Premium Plan</p>
        </div>
        <button
          type="button"
          className="rounded-md p-1.5 text-ctp-overlay1 transition-colors hover:bg-ctp-surface0 hover:text-ctp-red"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  )
}
