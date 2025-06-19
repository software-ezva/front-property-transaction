import type { Metadata } from "next"
import RoleSelectionClient from "./RoleSelectionClient"

export const metadata: Metadata = {
  title: "Choose Your Role - PropManager",
  description: "Select whether you're a real estate agent or client to get started with PropManager.",
}

export default function RoleSelectionPage() {
  return <RoleSelectionClient />
}
