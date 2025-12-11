import type { Metadata } from "next";
import TransactionDetailsClient from "./TransactionDetailsClient";

export const metadata: Metadata = {
  title: "Transaction Details - PropManager Agent",
  description: "View and manage transaction details.",
};

interface TransactionDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function TransactionDetailsPage({
  params,
}: TransactionDetailsPageProps) {
  const awaitedParams = await params;
  return <TransactionDetailsClient transactionId={awaitedParams.id} />;
}
