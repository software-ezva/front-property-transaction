import type { Metadata } from "next"
import ClientSearchClient from "./ClientSearchClient"

export const metadata: Metadata = {
  title: "Search Properties - PropManager",
  description: "Find your perfect home with advanced search filters.",
}

export default function ClientSearchPage() {
  return <ClientSearchClient />
}
