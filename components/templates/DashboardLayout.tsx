"use client"

import type React from "react"

import { useState } from "react"
import Header from "../organisms/Header"
import Sidebar from "../organisms/Sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    role: "agent" | "client"
    avatar?: string
  }
}

const DashboardLayout = ({ children, user }: DashboardLayoutProps) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="min-h-screen bg-background">
      <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)} user={user} />

      <div className="flex">
        <Sidebar isCollapsed={sidebarCollapsed} userRole={user?.role || "client"} />

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}

export default DashboardLayout
