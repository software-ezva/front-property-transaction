import type { Metadata } from "next"
import CreateTransactionClient from "./CreateTransactionClient"

export const metadata: Metadata = {
  title: "Create Transaction - PropManager Agent",
  description: "Create a new real estate transaction.",
}

export default function CreateTransactionPage() {
  return <CreateTransactionClient />
}
