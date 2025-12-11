import type { Metadata } from "next"
import AgentPropertiesClient from "./AgentPropertiesClient"

export const metadata: Metadata = {
  title: "Properties - PropManager Agent",
  description: "Manage your property portfolio and listings.",
}

export default function AgentPropertiesPage() {
  return <AgentPropertiesClient />
}
