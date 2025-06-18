"use client"

import { Home, Building2, FileText, Users, Settings, BarChart3 } from "lucide-react"
import NavigationItem from "../molecules/NavigationItem"

interface SidebarProps {
  isCollapsed?: boolean
  userRole: "agent" | "client"
}

const Sidebar = ({ isCollapsed, userRole }: SidebarProps) => {
  const agentNavigation = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/properties", icon: Building2, label: "Properties" },
    { href: "/transactions", icon: FileText, label: "Transactions" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/analytics", icon: BarChart3, label: "Analytics" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  const clientNavigation = [
    { href: "/dashboard", icon: Home, label: "Dashboard" },
    { href: "/properties", icon: Building2, label: "Properties" },
    { href: "/transactions", icon: FileText, label: "My Transactions" },
    { href: "/settings", icon: Settings, label: "Settings" },
  ]

  const navigation = userRole === "agent" ? agentNavigation : clientNavigation

  return (
    <aside className={`bg-card border-r border-border transition-all duration-300 ${isCollapsed ? "w-16" : "w-64"}`}>
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
  )
}

export default Sidebar
