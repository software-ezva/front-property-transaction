import type { Metadata } from "next";
import SupportingProfessionalDashboard from "./SupportingProfessionalDashboard";

export const metadata: Metadata = {
  title: "Dashboard - PropManager",
  description: "Manage your professional services and collaborations.",
};

export default function SupportingProfessionalDashboardPage() {
  return <SupportingProfessionalDashboard />;
}
