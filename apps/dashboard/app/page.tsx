import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { MobileHeader } from "@/components/dashboard/mobile-header"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { RevenueChart } from "@/components/dashboard/revenue-chart"
import { RecentEvents } from "@/components/dashboard/recent-events"
import { PlatformIntegrations } from "@/components/dashboard/platform-integrations"
import { TopProducts } from "@/components/dashboard/top-products"
import { ChannelConfig } from "@/components/dashboard/channel-config"

export default function Page() {
  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <div className="hidden lg:block">
        <DashboardSidebar />
      </div>

      {/* Mobile header */}
      <MobileHeader />

      {/* Main content */}
      <main className="lg:pl-64">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <DashboardHeader />

          {/* Stats */}
          <div className="mt-6">
            <StatsCards />
          </div>

          {/* Revenue chart + Recent events */}
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
            <div className="xl:col-span-3">
              <RevenueChart />
            </div>
            <div className="xl:col-span-2">
              <RecentEvents />
            </div>
          </div>

          {/* Platform integrations + Top products + Channel config */}
          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div>
              <PlatformIntegrations />
            </div>
            <div>
              <TopProducts />
            </div>
            <div>
              <ChannelConfig />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
