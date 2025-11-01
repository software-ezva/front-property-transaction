import type { Metadata } from "next";
import SupportingProfessionalTransactionsClient from "./SupportingProfessionalTransactionsClient";

export const metadata: Metadata = {
  title: "Transactions - PropManager",
  description: "View and monitor real estate transactions you're involved in.",
};

export default function SupportingProfessionalTransactionsPage() {
  return <SupportingProfessionalTransactionsClient />;
}
