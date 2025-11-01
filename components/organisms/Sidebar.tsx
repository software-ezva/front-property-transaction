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
import { hr } from "date-fns/locale";

interface SidebarProps {
  isCollapsed?: boolean;
  profile: string;
}

const Sidebar = ({ isCollapsed, profile }: SidebarProps) => {
  const agentNavigation = [
    { href: "/agent/dashboard", icon: Home, label: "Dashboard" },
    { href: "/agent/properties", icon: Building2, label: "Properties" },
    {
      href: "/agent/transactions",
      icon: BriefcaseBusiness,
      label: "Transactions",
    },
    {
      href: "/agent/workflow-templates",
      icon: Workflow,
      label: "Workflow Templates",
    },
    { href: "/agent/document-templates", icon: FileText, label: "Documents" },
    { href: "/agent/clients", icon: Users, label: "Clients" },
  ];

  const clientNavigation = [
    { href: "/client/dashboard", icon: Home, label: "Dashboard" },
    { href: "/client/transactions", icon: FileText, label: "My Transactions" },
    { href: "/client/agents", icon: Users, label: "My Agents" },
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

  const navigationConfig: Record<string, typeof agentNavigation> = {
    "real estate agent": agentNavigation,
    client: clientNavigation,
    broker: brokerNavigation,
    "supporting professional": supportingProfessionalNavigation,
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
