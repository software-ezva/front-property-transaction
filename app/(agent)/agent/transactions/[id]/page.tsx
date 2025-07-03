import type { Metadata } from "next"
import TransactionDetailsClient from "./TransactionDetailsClient"

export const metadata: Metadata = {
  title: "Transaction Details - PropManager Agent",
  description: "View and manage transaction details.",
}

interface TransactionDetailsPageProps {
  params: {
    id: string
  }
}

export default function TransactionDetailsPage({ params }: TransactionDetailsPageProps) {
  return <TransactionDetailsClient transactionId={params.id} />
}
