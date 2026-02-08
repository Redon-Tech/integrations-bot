"use client"

import {
  DollarSign,
  ShoppingCart,
  TrendingUp,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"

const stats = [
  {
    label: "Total Revenue",
    value: "$48,293.40",
    change: "+12.5%",
    trend: "up" as const,
    icon: DollarSign,
    color: "text-ctp-green",
    bgColor: "bg-ctp-green/10",
  },
  {
    label: "Total Orders",
    value: "1,847",
    change: "+8.2%",
    trend: "up" as const,
    icon: ShoppingCart,
    color: "text-ctp-blue",
    bgColor: "bg-ctp-blue/10",
  },
  {
    label: "Avg. Order Value",
    value: "$26.14",
    change: "-2.4%",
    trend: "down" as const,
    icon: TrendingUp,
    color: "text-ctp-peach",
    bgColor: "bg-ctp-peach/10",
  },
  {
    label: "Active Customers",
    value: "3,291",
    change: "+18.7%",
    trend: "up" as const,
    icon: Users,
    color: "text-ctp-mauve",
    bgColor: "bg-ctp-mauve/10",
  },
]

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-ctp-surface1 bg-ctp-surface0 p-5"
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-ctp-subtext0">{stat.label}</p>
            <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-[18px] w-[18px] ${stat.color}`} />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-2xl font-bold tracking-tight text-ctp-text">{stat.value}</p>
            <div className="mt-1.5 flex items-center gap-1.5">
              {stat.trend === "up" ? (
                <div className="flex items-center gap-0.5 text-ctp-green">
                  <ArrowUpRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              ) : (
                <div className="flex items-center gap-0.5 text-ctp-red">
                  <ArrowDownRight className="h-3.5 w-3.5" />
                  <span className="text-xs font-semibold">{stat.change}</span>
                </div>
              )}
              <span className="text-xs text-ctp-overlay0">vs last month</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
