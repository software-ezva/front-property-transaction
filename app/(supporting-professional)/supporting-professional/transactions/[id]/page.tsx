import type { Metadata } from "next";
import SupportingProfessionalTransactionDetailsClient from "./SupportingProfessionalTransactionDetailsClient";

export const metadata: Metadata = {
  title: "Transaction Details - PropManager",
  description: "View details of the real estate transaction.",
};

interface PageProps {
  params: {
    id: string;
  };
}

export default function SupportingProfessionalTransactionDetailsPage({
  params,
}: PageProps) {
  return <SupportingProfessionalTransactionDetailsClient id={params.id} />;
}
