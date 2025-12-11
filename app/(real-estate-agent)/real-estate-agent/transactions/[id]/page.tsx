import type { Metadata } from "next";
import RealEstateAgentTransactionDetailsClient from "./RealEstateAgentTransactionDetailsClient";

export const metadata: Metadata = {
  title: "Transaction Details - PropManager",
  description: "View detailed information about this transaction.",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default async function RealEstateAgentTransactionDetailsPage({
  params,
}: PageProps) {
  const awaitedParams = await params;
  return <RealEstateAgentTransactionDetailsClient id={awaitedParams.id} />;
}
