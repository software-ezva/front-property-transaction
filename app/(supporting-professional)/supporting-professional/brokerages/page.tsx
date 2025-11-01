import type { Metadata } from "next";
import SupportingProfessionalBrokeragesClient from "./SupportingProfessionalBrokeragesClient";

export const metadata: Metadata = {
  title: "My Brokerages - PropManager",
  description: "Manage the brokerages you're associated with.",
};

export default function SupportingProfessionalBrokeragesPage() {
  return <SupportingProfessionalBrokeragesClient />;
}
