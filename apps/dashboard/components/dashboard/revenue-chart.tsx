"use client"

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const data = [
  { date: "Jan 1", revenue: 2400, orders: 120 },
  { date: "Jan 5", revenue: 3100, orders: 142 },
  { date: "Jan 9", revenue: 2800, orders: 131 },
  { date: "Jan 13", revenue: 4200, orders: 198 },
  { date: "Jan 17", revenue: 3800, orders: 176 },
  { date: "Jan 21", revenue: 5100, orders: 234 },
  { date: "Jan 25", revenue: 4600, orders: 208 },
  { date: "Jan 29", revenue: 6200, orders: 287 },
  { date: "Feb 2", revenue: 5800, orders: 265 },
  { date: "Feb 6", revenue: 7100, orders: 312 },
  { date: "Feb 10", revenue: 6400, orders: 294 },
  { date: "Feb 14", revenue: 7800, orders: 341 },
  { date: "Feb 18", revenue: 6900, orders: 308 },
  { date: "Feb 22", revenue: 8200, orders: 376 },
  { date: "Feb 26", revenue: 7400, orders: 339 },
]

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-ctp-surface1 bg-ctp-surface0 p-3 shadow-xl">
        <p className="mb-1.5 text-xs font-medium text-ctp-subtext0">{label}</p>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-ctp-blue" />
            <span className="text-sm font-semibold text-ctp-text">
              ${payload[0].value.toLocaleString()}
            </span>
          </div>
          {payload[1] && (
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-ctp-mauve" />
              <span className="text-sm text-ctp-subtext0">
                {payload[1].value} orders
              </span>
            </div>
          )}
        </div>
      </div>
    )
  }
  return null
}

export function RevenueChart() {
  return (
    <div className="rounded-xl border border-ctp-surface1 bg-ctp-surface0 p-5">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-ctp-text">Revenue Overview</h3>
          <p className="mt-0.5 text-sm text-ctp-subtext0">Track your earnings across all platforms</p>
        </div>
        <Select defaultValue="30d">
          <SelectTrigger className="h-8 w-28 border-ctp-surface1 bg-ctp-mantle text-xs text-ctp-subtext1 focus:ring-ctp-blue">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="border-ctp-surface1 bg-ctp-surface0">
            <SelectItem value="7d" className="text-ctp-text focus:bg-ctp-surface1 focus:text-ctp-text">7 days</SelectItem>
            <SelectItem value="30d" className="text-ctp-text focus:bg-ctp-surface1 focus:text-ctp-text">30 days</SelectItem>
            <SelectItem value="90d" className="text-ctp-text focus:bg-ctp-surface1 focus:text-ctp-text">90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(217, 92%, 76%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(217, 92%, 76%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordersGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(267, 84%, 81%)" stopOpacity={0.2} />
                <stop offset="100%" stopColor="hsl(267, 84%, 81%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="hsl(232, 14%, 31%)"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(228, 11%, 47%)" }}
              dy={8}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(228, 11%, 47%)" }}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="hsl(217, 92%, 76%)"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
            <Area
              type="monotone"
              dataKey="orders"
              stroke="hsl(267, 84%, 81%)"
              strokeWidth={2}
              fill="url(#ordersGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-3 flex items-center justify-center gap-6">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-ctp-blue" />
          <span className="text-xs text-ctp-subtext0">Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-ctp-mauve" />
          <span className="text-xs text-ctp-subtext0">Orders</span>
        </div>
      </div>
    </div>
  )
}
