import type { Metadata } from "next"
import AgentTransactionsClient from "./AgentTransactionsClient"

export const metadata: Metadata = {
  title: "Transactions - PropManager Agent",
  description: "Manage and monitor all your real estate transactions.",
}

export default function AgentTransactionsPage() {
  return <AgentTransactionsClient />
}
