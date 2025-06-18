import type React from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "PropManager - Real Estate Management Platform",
  description:
    "The comprehensive platform for real estate agents and clients. Manage properties, transactions, and business relationships efficiently.",
  keywords: ["real estate", "property management", "transactions", "agents", "clients"],
  authors: [{ name: "PropManager Team" }]}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  )
}
