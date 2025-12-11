import type { Metadata } from "next"
import AgentDashboard from "./AgentDashboard"

export const metadata: Metadata = {
  title: "Agent Dashboard - PropManager",
  description: "Manage your real estate business, properties, and clients.",
}

export default function AgentDashboardPage() {
  return <AgentDashboard />
}
