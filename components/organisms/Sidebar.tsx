"use client";

import {
  Home,
  Building2,
  FileText,
  Users,
  BriefcaseBusiness,
  Workflow,
  Settings,
} from "lucide-react";
import NavigationItem from "../molecules/NavigationItem";

interface SidebarProps {
  isCollapsed?: boolean;
  profile: string;
}

const Sidebar = ({ isCollapsed, profile }: SidebarProps) => {
  const transactionCoordinatorAgentNavigation = [
    {
      href: "/transaction-coordinator/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/transaction-coordinator/properties",
      icon: Building2,
      label: "Properties",
    },
    {
      href: "/transaction-coordinator/transactions",
      icon: BriefcaseBusiness,
      label: "Transactions",
    },
    {
      href: "/transaction-coordinator/workflow-templates",
      icon: Workflow,
      label: "Workflow Templates",
    },
    {
      href: "/transaction-coordinator/document-templates",
      icon: FileText,
      label: "Documents",
    },
    //{ href: "/transaction-coordinator/clients", icon: Users, label: "Clients" },
  ];

  const clientNavigation = [
    //{ href: "/client/dashboard", icon: Home, label: "Dashboard" },
    { href: "/client/transactions", icon: FileText, label: "My Transactions" },
    //{ href: "/client/agents", icon: Users, label: "My Agents" },
  ];

  const brokerNavigation = [
    { href: "/broker/dashboard", icon: Home, label: "Dashboard" },
    { href: "/broker/my-brokerage", icon: Building2, label: "My Brokerage" },
  ];
  const supportingProfessionalNavigation = [
    {
      href: "/supporting-professional/dashboard",
      icon: Home,
      label: "Dashboard",
    },
    {
      href: "/supporting-professional/brokerages",
      icon: Building2,
      label: "Brokerages",
    },
    {
      href: "/supporting-professional/transactions",
      icon: BriefcaseBusiness,
      label: "Transactions",
    },
  ];
  const realEstateAgentNavigation = [
    //{ href: "/real-estate-agent/dashboard", icon: Home, label: "Dashboard" },
    {
      href: "/real-estate-agent/transactions",
      icon: BriefcaseBusiness,
      label: "My Transactions",
    },
  ];

  const navigationConfig: Record<
    string,
    typeof transactionCoordinatorAgentNavigation
  > = {
    "transaction coordinator agent": transactionCoordinatorAgentNavigation,
    client: clientNavigation,
    broker: brokerNavigation,
    "supporting professional": supportingProfessionalNavigation,
    "real estate agent": realEstateAgentNavigation,
  };

  const navigation = navigationConfig[profile] || clientNavigation;

  return (
    <aside
      className={`bg-card border-r border-border transition-all duration-300 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <div className="p-4">
        <nav className="space-y-2">
          {navigation.map((item) => (
            <NavigationItem
              key={item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
              isCollapsed={isCollapsed}
            />
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default Sidebar;
