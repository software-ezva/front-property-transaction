"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { LucideIcon } from "lucide-react"

interface NavigationItemProps {
  href: string
  icon: LucideIcon
  label: string
  isCollapsed?: boolean
}

const NavigationItem = ({ href, icon: Icon, label, isCollapsed }: NavigationItemProps) => {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors",
        isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent",
        isCollapsed ? "justify-center" : "justify-start",
      )}
    >
      <Icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
      {!isCollapsed && <span>{label}</span>}
    </Link>
  )
}

export default NavigationItem
