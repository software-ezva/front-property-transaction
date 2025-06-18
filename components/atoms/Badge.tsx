import type React from "react"
import { cn } from "@/lib/utils"

interface BadgeProps {
  children: React.ReactNode
  variant?: "default" | "success" | "warning" | "error"
  className?: string
}

const Badge = ({ children, variant = "default", className }: BadgeProps) => {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-accent text-accent-foreground",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-destructive text-destructive-foreground",
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

export default Badge
