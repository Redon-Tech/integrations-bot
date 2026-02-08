"use client"

const products = [
  {
    name: "Pro Membership",
    platform: "Stripe",
    sales: 342,
    revenue: "$17,058",
    progress: 95,
    hslColor: "217 92% 76%",
    platformColor: "text-ctp-mauve",
  },
  {
    name: "Vintage Tee Collection",
    platform: "Shopify",
    sales: 218,
    revenue: "$7,630",
    progress: 72,
    hslColor: "115 54% 76%",
    platformColor: "text-ctp-green",
  },
  {
    name: "Digital Course Bundle",
    platform: "Gumroad",
    sales: 156,
    revenue: "$20,124",
    progress: 65,
    hslColor: "267 84% 81%",
    platformColor: "text-ctp-pink",
  },
  {
    name: "Annual Plan",
    platform: "Stripe",
    sales: 98,
    revenue: "$19,502",
    progress: 58,
    hslColor: "23 92% 75%",
    platformColor: "text-ctp-mauve",
  },
  {
    name: "React Mastery E-book",
    platform: "LemonSqueezy",
    sales: 87,
    revenue: "$2,175",
    progress: 42,
    hslColor: "41 86% 83%",
    platformColor: "text-ctp-yellow",
  },
]

export function TopProducts() {
  return (
    <div className="rounded-xl border border-ctp-surface1 bg-ctp-surface0">
      <div className="border-b border-ctp-surface1 px-5 py-4">
        <h3 className="text-base font-semibold text-ctp-text">Top Products</h3>
        <p className="mt-0.5 text-sm text-ctp-subtext0">Best sellers across all platforms</p>
      </div>
      <div className="flex flex-col">
        {products.map((product, i) => (
          <div
            key={product.name}
            className={`flex items-center gap-4 px-5 py-3.5 ${
              i < products.length - 1 ? "border-b border-ctp-surface1/50" : ""
            }`}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-ctp-mantle text-sm font-bold text-ctp-overlay1">
              {i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-sm font-medium text-ctp-text">{product.name}</p>
                <p className="shrink-0 pl-2 text-sm font-semibold text-ctp-text">{product.revenue}</p>
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className={`text-[11px] ${product.platformColor}`}>{product.platform}</span>
                <span className="text-[11px] text-ctp-overlay0">{product.sales} sales</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ctp-mantle">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${product.progress}%`,
                    backgroundColor: `hsl(${product.hslColor})`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
