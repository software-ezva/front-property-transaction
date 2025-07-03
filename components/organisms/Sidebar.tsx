"use client";

import {
  Home,
  Building2,
  FileText,
  Users,
  Settings,
  BarChart3,
} from "lucide-react";
import NavigationItem from "../molecules/NavigationItem";

interface SidebarProps {
  isCollapsed?: boolean;
  profile: string;
}

const Sidebar = ({ isCollapsed, profile }: SidebarProps) => {
  const agentNavigation = [
    { href: "/agent/dashboard", icon: Home, label: "Dashboard" },
    { href: "/agent/properties", icon: Building2, label: "Properties" },
    { href: "/agent/transactions", icon: FileText, label: "Transactions" },
    { href: "/agent/clients", icon: Users, label: "Clients" },
    { href: "/agent/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/agent/settings", icon: Settings, label: "Settings" },
  ];

  const clientNavigation = [
    { href: "/client/dashboard", icon: Home, label: "Dashboard" },
    { href: "/client/properties", icon: Building2, label: "Properties" },
    { href: "/client/transactions", icon: FileText, label: "My Transactions" },
    { href: "/client/settings", icon: Settings, label: "Settings" },
  ];

  const navigationConfig: Record<string, typeof agentNavigation> = {
    "real estate agent": agentNavigation,
    client: clientNavigation,
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
