import type { Metadata } from "next";
import RealEstateAgentTransactionsClient from "./RealEstateAgentTransactionsClient";

export const metadata: Metadata = {
  title: "Agent Transactions - PropManager",
  description: "View and monitor your real estate transactions.",
};

export default function RealEstateAgentTransactionsPage() {
  return <RealEstateAgentTransactionsClient />;
}
