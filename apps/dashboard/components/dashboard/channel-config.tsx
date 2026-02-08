"use client"

import { Hash, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const channels = [
  {
    name: "#sales-alerts",
    events: ["purchase"],
    platforms: ["Shopify", "Stripe", "WooCommerce"],
    messageCount: 1247,
    status: "active",
  },
  {
    name: "#subscriptions",
    events: ["subscription"],
    platforms: ["Stripe"],
    messageCount: 312,
    status: "active",
  },
  {
    name: "#refunds",
    events: ["refund"],
    platforms: ["Shopify", "Stripe"],
    messageCount: 45,
    status: "active",
  },
  {
    name: "#abandoned-carts",
    events: ["checkout_abandoned"],
    platforms: ["WooCommerce", "Shopify"],
    messageCount: 189,
    status: "paused",
  },
]

const eventBadgeColors: Record<string, { bg: string; text: string }> = {
  purchase: { bg: "bg-ctp-green/15", text: "text-ctp-green" },
  refund: { bg: "bg-ctp-red/15", text: "text-ctp-red" },
  subscription: { bg: "bg-ctp-blue/15", text: "text-ctp-blue" },
  checkout_abandoned: { bg: "bg-ctp-yellow/15", text: "text-ctp-yellow" },
}

export function ChannelConfig() {
  return (
    <div className="rounded-xl border border-ctp-surface1 bg-ctp-surface0">
      <div className="flex items-center justify-between border-b border-ctp-surface1 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-ctp-text">Discord Channels</h3>
          <p className="mt-0.5 text-sm text-ctp-subtext0">Event routing configuration</p>
        </div>
        <button
          type="button"
          className="rounded-lg bg-ctp-blue/10 px-3 py-1.5 text-xs font-semibold text-ctp-blue transition-colors hover:bg-ctp-blue/20"
        >
          Configure
        </button>
      </div>
      <div className="flex flex-col">
        {channels.map((channel, i) => (
          <button
            key={channel.name}
            type="button"
            className={`flex items-center gap-4 px-5 py-3.5 text-left transition-colors hover:bg-ctp-surface1/50 ${
              i < channels.length - 1 ? "border-b border-ctp-surface1/50" : ""
            }`}
          >
            <Hash className="h-4 w-4 shrink-0 text-ctp-overlay1" />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-ctp-text">{channel.name}</p>
                {channel.status === "paused" && (
                  <Badge className="border-0 bg-ctp-yellow/15 px-1.5 py-0 text-[10px] font-semibold text-ctp-yellow">
                    Paused
                  </Badge>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5">
                {channel.events.map((event) => {
                  const colors = eventBadgeColors[event]
                  return (
                    <Badge
                      key={event}
                      className={`border-0 ${colors.bg} ${colors.text} px-1.5 py-0 text-[10px] font-medium`}
                    >
                      {event.replace("_", " ")}
                    </Badge>
                  )
                })}
                <span className="text-[11px] text-ctp-overlay0">
                  {channel.messageCount.toLocaleString()} messages
                </span>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 shrink-0 text-ctp-overlay0" />
          </button>
        ))}
      </div>
    </div>
  )
}
