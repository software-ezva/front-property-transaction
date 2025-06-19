import type { Metadata } from "next"
import ClientDashboard from "./ClientDashboard"

export const metadata: Metadata = {
  title: "My Dashboard - PropManager",
  description: "Track your property search and transactions.",
}

export default function ClientDashboardPage() {
  return <ClientDashboard />
}
