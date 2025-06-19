import type { Metadata } from "next"
import ClientTransactionsClient from "./ClientTransactionsClient"

export const metadata: Metadata = {
  title: "My Transactions - PropManager",
  description: "Track the progress of your real estate transactions.",
}

export default function ClientTransactionsPage() {
  return <ClientTransactionsClient />
}
