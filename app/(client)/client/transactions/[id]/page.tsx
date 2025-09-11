import type { Metadata } from "next";
import ClientTransactionDetailsClient from "./ClientTransactionDetailsClient";

export const metadata: Metadata = {
  title: "Transaction Details - PropManager Client",
  description: "View your transaction details and progress.",
};

interface ClientTransactionDetailsPageProps {
  params: {
    id: string;
  };
}

export default async function ClientTransactionDetailsPage({
  params,
}: ClientTransactionDetailsPageProps) {
  const awaitedParams = await params;
  return <ClientTransactionDetailsClient transactionId={awaitedParams.id} />;
}
