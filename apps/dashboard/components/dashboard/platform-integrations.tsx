"use client"

import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { ExternalLink } from "lucide-react"

const platforms = [
  {
    name: "Shopify",
    description: "Storefront & POS orders",
    connected: true,
    events: 842,
    revenue: "$24,580",
    color: "bg-ctp-green",
    textColor: "text-ctp-green",
    letter: "S",
  },
  {
    name: "Stripe",
    description: "Payments & subscriptions",
    connected: true,
    events: 1204,
    revenue: "$18,420",
    color: "bg-ctp-mauve",
    textColor: "text-ctp-mauve",
    letter: "S",
  },
  {
    name: "WooCommerce",
    description: "WordPress store events",
    connected: true,
    events: 316,
    revenue: "$3,850",
    color: "bg-ctp-peach",
    textColor: "text-ctp-peach",
    letter: "W",
  },
  {
    name: "Gumroad",
    description: "Digital product sales",
    connected: false,
    events: 0,
    revenue: "$0",
    color: "bg-ctp-pink",
    textColor: "text-ctp-pink",
    letter: "G",
  },
  {
    name: "LemonSqueezy",
    description: "SaaS & digital goods",
    connected: true,
    events: 189,
    revenue: "$1,443",
    color: "bg-ctp-yellow",
    textColor: "text-ctp-yellow",
    letter: "L",
  },
]

export function PlatformIntegrations() {
  return (
    <div className="rounded-xl border border-ctp-surface1 bg-ctp-surface0">
      <div className="flex items-center justify-between border-b border-ctp-surface1 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-ctp-text">Platform Integrations</h3>
          <p className="mt-0.5 text-sm text-ctp-subtext0">Connected ecommerce platforms</p>
        </div>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-lg bg-ctp-blue/10 px-3 py-1.5 text-xs font-semibold text-ctp-blue transition-colors hover:bg-ctp-blue/20"
        >
          <ExternalLink className="h-3 w-3" />
          Manage
        </button>
      </div>
      <div className="flex flex-col">
        {platforms.map((platform, i) => (
          <div
            key={platform.name}
            className={`flex items-center gap-4 px-5 py-4 ${
              i < platforms.length - 1 ? "border-b border-ctp-surface1/50" : ""
            }`}
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${platform.color} text-sm font-bold text-ctp-crust`}>
              {platform.letter}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-ctp-text">{platform.name}</p>
                {platform.connected ? (
                  <Badge className="border-0 bg-ctp-green/15 px-1.5 py-0 text-[10px] font-semibold text-ctp-green">
                    Active
                  </Badge>
                ) : (
                  <Badge className="border-0 bg-ctp-surface1 px-1.5 py-0 text-[10px] font-semibold text-ctp-overlay0">
                    Inactive
                  </Badge>
                )}
              </div>
              <p className="mt-0.5 text-xs text-ctp-subtext0">{platform.description}</p>
              {platform.connected && (
                <div className="mt-1.5 flex items-center gap-3">
                  <span className="text-[11px] text-ctp-overlay1">
                    {platform.events.toLocaleString()} events
                  </span>
                  <span className="text-[11px] text-ctp-overlay0">|</span>
                  <span className={`text-[11px] font-medium ${platform.textColor}`}>
                    {platform.revenue}
                  </span>
                </div>
              )}
            </div>
            <Switch
              defaultChecked={platform.connected}
              className="data-[state=checked]:bg-ctp-green"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
