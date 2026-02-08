"use client"

import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"

type EventType = "purchase" | "refund" | "subscription" | "checkout_abandoned"

const eventConfig: Record<EventType, { label: string; color: string; bg: string }> = {
  purchase: { label: "Purchase", color: "text-ctp-green", bg: "bg-ctp-green/15" },
  refund: { label: "Refund", color: "text-ctp-red", bg: "bg-ctp-red/15" },
  subscription: { label: "Subscription", color: "text-ctp-blue", bg: "bg-ctp-blue/15" },
  checkout_abandoned: { label: "Abandoned", color: "text-ctp-yellow", bg: "bg-ctp-yellow/15" },
}

const platformColors: Record<string, string> = {
  Shopify: "text-ctp-green",
  Stripe: "text-ctp-mauve",
  WooCommerce: "text-ctp-peach",
  Gumroad: "text-ctp-pink",
  LemonSqueezy: "text-ctp-yellow",
}

const events = [
  {
    id: "1",
    type: "purchase" as EventType,
    customer: "Sarah M.",
    product: "Pro Membership",
    amount: "$49.99",
    platform: "Stripe",
    channel: "#sales-alerts",
    time: "2 min ago",
  },
  {
    id: "2",
    type: "subscription" as EventType,
    customer: "James K.",
    product: "Annual Plan",
    amount: "$199.00",
    platform: "Stripe",
    channel: "#subscriptions",
    time: "8 min ago",
  },
  {
    id: "3",
    type: "purchase" as EventType,
    customer: "Emily R.",
    product: "Vintage Tee - Black",
    amount: "$34.50",
    platform: "Shopify",
    channel: "#sales-alerts",
    time: "15 min ago",
  },
  {
    id: "4",
    type: "refund" as EventType,
    customer: "Mike T.",
    product: "Hoodie XL",
    amount: "-$59.99",
    platform: "Shopify",
    channel: "#refunds",
    time: "22 min ago",
  },
  {
    id: "5",
    type: "purchase" as EventType,
    customer: "Lisa W.",
    product: "Digital Course Bundle",
    amount: "$129.00",
    platform: "Gumroad",
    channel: "#sales-alerts",
    time: "34 min ago",
  },
  {
    id: "6",
    type: "checkout_abandoned" as EventType,
    customer: "Alex P.",
    product: "Sneakers Limited Ed.",
    amount: "$189.99",
    platform: "WooCommerce",
    channel: "#abandoned-carts",
    time: "41 min ago",
  },
  {
    id: "7",
    type: "purchase" as EventType,
    customer: "Nina C.",
    product: "E-book: React Mastery",
    amount: "$24.99",
    platform: "LemonSqueezy",
    channel: "#sales-alerts",
    time: "1 hr ago",
  },
  {
    id: "8",
    type: "subscription" as EventType,
    customer: "David H.",
    product: "Team Plan",
    amount: "$79.00",
    platform: "Stripe",
    channel: "#subscriptions",
    time: "1 hr ago",
  },
]

export function RecentEvents() {
  return (
    <div className="flex flex-col rounded-xl border border-ctp-surface1 bg-ctp-surface0">
      <div className="flex items-center justify-between border-b border-ctp-surface1 px-5 py-4">
        <div>
          <h3 className="text-base font-semibold text-ctp-text">Recent Events</h3>
          <p className="mt-0.5 text-sm text-ctp-subtext0">Live purchase events from all platforms</p>
        </div>
        <div className="flex h-2 w-2 items-center">
          <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-ctp-green opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-ctp-green" />
        </div>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="flex flex-col">
          {events.map((event, i) => {
            const config = eventConfig[event.type]
            return (
              <div
                key={event.id}
                className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-ctp-surface1/50 ${
                  i < events.length - 1 ? "border-b border-ctp-surface1/50" : ""
                }`}
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-ctp-text">
                      {event.customer}
                    </p>
                    <Badge
                      className={`border-0 ${config.bg} ${config.color} px-1.5 py-0 text-[10px] font-semibold`}
                    >
                      {config.label}
                    </Badge>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-ctp-subtext0">
                    {event.product}
                    <span className="mx-1.5 text-ctp-surface2">{"/"}</span>
                    <span className={platformColors[event.platform]}>{event.platform}</span>
                    <span className="mx-1.5 text-ctp-surface2">{"/"}</span>
                    <span className="text-ctp-overlay0">{event.channel}</span>
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className={`text-sm font-semibold ${
                    event.type === "refund" ? "text-ctp-red" : "text-ctp-text"
                  }`}>
                    {event.amount}
                  </p>
                  <p className="text-[11px] text-ctp-overlay0">{event.time}</p>
                </div>
              </div>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  )
}
